//file include
import User from "../models/userScheme.js";
import { hash } from "../utlity/hash.js";
import sessionRes from "../utlity/sessionRes.js";
import bcrypt from "bcryptjs";
import { jwtToken } from "../utlity/jwt.js";
import { createActiveMail } from "../utlity/createActiveMail.js";
import { createForgetPasswordMail } from "../utlity/createForgetPasswordMail.js";
import jwt from "jsonwebtoken";
import { removeGalleryPhoto, removePhoto } from "../utlity/removePhoto.js";

/**
 *  @desc user dashboard
 *  @name get
 *  @access
 **/
const dashboard = (req, res) => {
  res.render("index");
};

/**
 *  @desc user register
 *  @name post
 *  @access
 **/
const userRegister = (req, res) => {
  res.render("register");
};

/**
 *  @desc user login
 *  @name get
 *  @access
 **/
const userLogin = (req, res) => {
  res.render("login");
};

/**
 *  @desc get user data form register
 *  @name POST
 *  @access
 **/
const getUserRegister = async (req, res) => {
  // get register data
  const { name, email, password } = req.body;

  //err handling
  try {
    //is empty
    if (!name || !email || !password) {
      sessionRes("", "All Fields are required...!", "/register", req, res);
    } else {
      if (email) {
        //email check
        const isEmail = await User.find().where("email").equals(email);

        // is email exists
        if (isEmail.length > 0) {
          sessionRes("", "Email already Taken", "/register", req, res);
        } else {
          //set data store
          await User.create({ name, email, password: hash(password) });

          //active link token
          const token = jwtToken({ email: email }, 1000 * 60 * 60 * 12);
          const activeLink = `${process.env.WEB_URL}:${process.env.PORT}/active/${token}`;
          const user = {
            name: name,
            activeLink: activeLink,
          };

          //verification mail
          createActiveMail(email, user);
          //response
          sessionRes(
            "Create success 😊. your verification mail sent",
            "",
            "/login",
            req,
            res
          );
        }
      }
    }
  } catch (error) {
    sessionRes("", "Unknown Error..!", "/register", req, res);
  }
};

/**
 *  @desc get user login
 *  @name post
 *  @access
 **/
const getUserLogin = async (req, res) => {
  //get form data
  const { email, password } = req.body;

  // error handling
  try {
    //checked
    if (!email && !password) {
      sessionRes("", "All Fields are required...!", "/login", req, res);
    }

    //is email
    if (email) {
      const isEmail = await User.find().where("email").equals(email);
      //email check
      if (isEmail[0]) {
        const pass = bcrypt.compareSync(password, isEmail[0].password);

        //pass check
        if (pass) {
          if (isEmail[0].isActive == true) {
            //jwt
            const token = jwtToken({ id: isEmail[0]._id });
            //user data
            let user = await User.findById(isEmail[0]._id).select("-password");;
            //res
            res.cookie("authToken", token);
            req.session.user = user;
            sessionRes("Login Success 😊", "", "/", req, res);
          } else {
            req.session.resentMail = isEmail[0]._id;
            sessionRes(`Please Verify you Account`, "", "/login", req, res);
          }
        } else {
          sessionRes("", "Wrong Password..!", "/login", req, res);
        }
      } else {
        sessionRes("", "Invalid Email..!", "/login", req, res);
      }
    }
  } catch (error) {
    sessionRes("", `Unknown Error..!  ${error.message}`, "/login", req, res);
  }
};

/**
 *  @desc user logout
 *  @name get
 *  @access
 **/
const UserLogout = (req, res) => {
  res.clearCookie("authToken");
  delete req.session.user;
  sessionRes("Logout success", "", "/login", req, res);
};
/**
 *  @desc user account activision
 *  @name get
 *  @access
 **/
const userAccountActivision = async (req, res) => {
  const { token } = req.params;

  try {
    const activeToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!activeToken) {
      sessionRes("", "Invalid Active link", "/login", req, res);
    } else {
     
      const activeUser = await User.find().where("email").equals(activeToken.email);
     
      if (activeUser[0].isActive) {
        sessionRes("your account already active. 😊", "", "/login", req, res);
      } else {
        await User.findByIdAndUpdate(activeUser[0]._id, {
          isActive: true,
        });
        sessionRes(
          "your account Activision successfully. 😊",
          "",
          "/login",
          req,
          res
        );
      }
    }
  } catch (err) {
    sessionRes("", "Invalid Active link", "/login", req, res);
  }
};
/**
 *  @desc user Resent Mail sent
 *  @name get
 *  @access
 **/
const resentMail = async (req, res) => {
  const { email } = req.params;

  //set data store
  const reData = await User.find().where("_id").equals(email);
  if (reData[0].isActive == true) {
    sessionRes("your account already active. 😊", "", "/login", req, res);
  } else {
    //active link token
    const token = jwtToken({ email: reData[0].email }, 1000 * 60 * 60 * 12);
    const activeLink = `${process.env.WEB_URL}:${process.env.PORT}/active/${token}`;
    const user = {
      name: reData[0].name,
      activeLink: activeLink,
    };

    const email = reData[0].email;
    //verification mail
    createActiveMail(email, user);
    //response
    sessionRes("ReVerification mail sent", "", "/login", req, res);
  }
};

/**
 *  @desc forget password
 *  @name get
 *  @access
 **/

const forgetPasswordPage = (req, res) => {
  res.render("forgetPassword");
};

/**
 *  @desc forget password
 *  @name post
 *  @access
 **/

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      //response
      sessionRes("", "Email is required..!", "/forgetPassword", req, res);
    } else {
      const checkMail = await User.find().where("email").equals(email);

      if (!checkMail[0]) {
        //response
        sessionRes("", "Email is Wrong..!", "/forgetPassword", req, res);
      } else {
        //active link token
        const token = jwtToken({ id: checkMail[0]._id }, 1000 * 60 * 60 * 12);
        const activeLink = `${process.env.WEB_URL}:${process.env.PORT}/forgetPassword/${token}`;
        const user = {
          name: checkMail[0].name,
          activeLink: activeLink,
        };

        //verification mail
        createForgetPasswordMail(email, user);

        //response
        sessionRes("send mail is done 😊.", "", "/forgetPassword", req, res);
      }
    }
  } catch (err) {
    //response
    sessionRes("", err.message, "/forgetPassword", req, res);
  }

  //res.render();
};

/**
 *  @desc forget password Change page
 *  @name get
 *  @access
 **/

const forgetPasswordChangePage = async (req, res) => {
  const { token } = req.params;

  try {
    if (token) {
      const authToken = jwt.verify(token, process.env.JWT_SECRET);
      if (authToken) {
        const verifyData = await User.findById(authToken.id);
        if (verifyData) {
          res.render("forgetPasswordChange", {
            token: token,
          });
        } else {
          sessionRes("", "Token expired..", "/forgetPassword", req, res);
        }
      } else {
        sessionRes("", "you are not authorized", "/forgetPassword", req, res);
      }
    } else {
      sessionRes("", "you are not authorized", "/forgetPassword", req, res);
    }
  } catch (error) {
    sessionRes("", "you are not authorized", "/forgetPassword", req, res);
  }
};

/**
 *  @desc forget password Change
 *  @name post
 *  @access
 **/
const forgetPasswordChange = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    if (token) {
      const authToken = jwt.verify(token, process.env.JWT_SECRET);
      if (authToken) {
        const verifyData = await User.findById(authToken.id);
        if (verifyData) {
          if (!newPassword || !confirmPassword) {
            sessionRes(
              "",
              "All Fields are required...!",
              `/forgetPassword/${token}`,
              req,
              res
            );
          } else {
            if (newPassword == confirmPassword) {
              await User.findByIdAndUpdate(authToken.id, {
                password: hash(confirmPassword),
              });

              sessionRes(
                "Password Updated successfully.",
                "",
                `/login`,
                req,
                res
              );
            } else {
              sessionRes(
                "",
                "Password Not Match.",
                `/forgetPassword/${token}`,
                req,
                res
              );
            }
          }
        } else {
          sessionRes("", "Token expired..", "/forgetPassword", req, res);
        }
      } else {
        sessionRes("", "you are not authorized", "/forgetPassword", req, res);
      }
    } else {
      sessionRes("", "you are not authorized", "/forgetPassword", req, res);
    }
  } catch (error) {
    sessionRes("", "you are not authorized", "/forgetPassword", req, res);
  }
};

/**
 *  @desc password Change
 *  @name get
 *  @access
 **/
const passwordChangePage = (req, res) => {
  res.render("passwordChange");
};
/**
 *  @desc password Change
 *  @name post
 *  @access
 **/
const passwordChange = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    //checked
    if (!oldPassword || !newPassword || !confirmPassword) {
      sessionRes(
        "",
        "All Fields are required...!",
        "/changePassword",
        req,
        res
      );
    } else {
      const userData = await User.findById(req.session.user._id);
      const pass = bcrypt.compareSync(oldPassword, userData.password);

      if (pass) {
        if (newPassword == confirmPassword) {
          await User.findByIdAndUpdate(req.session.user._id, {
            password: hash(confirmPassword),
          });

          sessionRes(
            "Password Updated successfully 😊.",
            "",
            `/changePassword`,
            req,
            res
          );
        } else {
          sessionRes(
            "",
            "Confirm Password Does Not Match.",
            "/changePassword",
            req,
            res
          );
        }
      } else {
        sessionRes(
          "",
          "Old Password Does not match",
          "/changePassword",
          req,
          res
        );
      }
    }
  } catch (error) {}
};
/**
 *  @desc  Profile Edit Page
 *  @name get
 *  @access
 **/

const profileEditPage = (req, res) => {
  res.render("profileEdit");
};

/**
 *  @desc Profile Edit
 *  @name post
 *  @access
 **/

const profileEdit = async (req, res) => {
  const { name, phone, skill, gender, desc } = req.body;

  try {
    if (!name) {
      sessionRes("", "Name is required..!", `/profileEdit`, req, res);
    } else {
      const userId = await User.findByIdAndUpdate(req.session.user._id, {
        name: name,
        phone: phone,
        skill: skill,
        gender: gender,
        desc: desc,
      });
      req.session.user.name = name;
      req.session.user.phone = phone;
      req.session.user.skill = skill;
      req.session.user.gender = gender;
      req.session.user.desc = desc;
      sessionRes("Updated successfully 😊.", "", `/profileEdit`, req, res);
    }
  } catch (error) {
    sessionRes("", error.message, `/profileEdit`, req, res);
  }
};
/**
 *  @desc Profile Photo page
 *  @name get
 *  @access
 **/
const profilePhotoPage = (req, res) => {
  res.render("photo");
};

/**
 *  @desc Profile Photo Update
 *  @name post
 *  @access
 **/
const profilePhoto = async (req, res) => {
  try {
    if (req.file) {
      const userPhoto = await User.findByIdAndUpdate(req.session.user?._id, {
        photo: req.file.filename,
      });
      req.session.user.photo = req.file.filename;
      if (userPhoto?.photo) {
        removePhoto(userPhoto.photo);
      }

      sessionRes("update is done", "", `/profilePhoto`, req, res);
    } else {
      sessionRes("", "Profile Photo is not update", `/profilePhoto`, req, res);
    }
  } catch (error) {
    sessionRes("", error.message, `/profilePhoto`, req, res);
  }
};

/**
 *  @desc User Gallery
 *  @name get
 *  @access
 **/
const galleryPage = (req, res) => {
  res.render("Gallery");
};

/**
 *  @desc Gallery
 *  @name post
 *  @access
 **/
const gallery = async (req, res) => {
  //error handling
  try {
    // store image
    let addImage = [];
    // check files
    if (req.files) {
      //find image
      req.files.forEach((item) => {
        addImage.push(item.filename);
      });
    } else {
      //response
      sessionRes("", "select Image", `/gallery`, req, res);
    }

    if (addImage != "") {
      //update store
      await User.findByIdAndUpdate(req.session.user._id, {
        $push: {
          gallery: {
            $each: [...addImage],
          },
        },
      });
      //session update
      req.session.user.gallery.push(...addImage);
      //response
      sessionRes("update successfully", "", `/gallery`, req, res);
    } else {
      //response
      sessionRes("", "select Image", `/gallery`, req, res);
    }
  } catch (error) {
    sessionRes("", error.message, `/gallery`, req, res);
  }
};
/**
 *  @desc Find gallery index
 *  @name Post
 *  @access
 **/
const deleteGalleryImage = async (req, res) => {
  //error handling
  try {
    //check index
    if (req.params.deleteItem) {
      await User.findByIdAndUpdate(req.session.user._id, {
        $pull: {
          gallery: {
            $in: req.params.deleteItem,
          },
        },
      });
      //session update
      const data = req.session.user.gallery.filter(
        (item) => item !== req.params.deleteItem
      );

      req.session.user.gallery = data;

      //store image remove
      removeGalleryPhoto(req.params.deleteItem);

      //response
      sessionRes("Delete successfully", "", `/gallery`, req, res);
    } else {
      //response
      sessionRes("item is not deleted", "", `/gallery`, req, res);
    }
  } catch (error) {
    //response
    sessionRes("", error.message, `/gallery`, req, res);
  }
};

/**
 *  @desc Find Friends
 *  @name get
 *  @access
 **/
const friendsPage = async (req, res) => {
  try {
    const getAllData = await User.find({ _id: { $ne: req.session.user._id } });
    res.render("findFriends", {
      getAll: getAllData,
    });
  } catch (error) {}
};
/**
 *  @desc Follow Friend Request
 *  @name get
 *  @access
 **/

const addFriends = async (req, res) => {
  // friend request id
  const sentFriend = req.params.id;
  //error handling
  try {
    if (sentFriend) {
      //following
      await User.findByIdAndUpdate(req.session.user._id, {
        $push: {
          following: sentFriend,
        },
      });
      //follower
      await User.findByIdAndUpdate(sentFriend, {
        $push: {
          follower: req.session.user._id,
        },
      });
      //session update
      req.session.user.following.push(sentFriend);
      //responsive
      sessionRes("", "", "/friends", req, res);
    } else {
    }
  } catch (error) {}
};
/**
 *  @desc unFriends
 *  @name get
 *  @access
 **/
const unFriends = async (req, res) => {
  // unFriend request id
  const unFriend = req.params.id;
  //error handling
  try {
    if (unFriend) {
      //following
      await User.findByIdAndUpdate(req.session.user._id, {
        $pull: {
          following: unFriend,
        },
      });
      //follower
      await User.findByIdAndUpdate(unFriend, {
        $pull: {
          follower: req.session.user._id,
        },
      });
      //session update
      req.session.user.following = req.session.user.following.filter(
        (item) => item != unFriend
      );
      //responsive
      sessionRes("", "", "/friends", req, res);
    } else {
    }
  } catch (error) {}
};

/**
 *  @desc Find Friends
 *  @name Post
 *  @access
 **/
const friends = async (req, res) => {
  const { search } = req.body;
  try {
    if (!search) {
      //responsive
      sessionRes("", "Write a Search Text..", "/friends", req, res);
    } else {
      const getAllData = await User.find({ _id: { $ne: req.session.user._id } })
        .where("name")
        .in(search);
      res.render("findFriends", {
        getAll: getAllData,
      });
    }
  } catch (error) {}
};
/**
 *  @desc Friend Profile
 *  @name Post
 *  @access
 **/
const friendProfile = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const profile = await User.findById(id);
      if (profile) {
        res.render("friendProfile", {
          profile,
        });
      } else {
        //responsive
        sessionRes("", "Write a Search Text..", "/friends", req, res);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

/**
 *  @desc following
 *  @name get
 *  @access
 **/
const following = async (req,res) => {
  const {id} = req.params;
  try {
    if(id){
      const following = await User.findById(id).populate("following" );
      res.render("following", {
        following : following.following,
      });
    }
  } catch (error) {
    
  }

}
/**
 *  @desc follower
 *  @name get
 *  @access
 **/
const follower = async (req,res) => {
  const {id} = req.params;
  try {
    if(id){
      const follower = await User.findById(id).populate("follower");
      res.render("follower", {
        follower :follower.follower ,
      });
    }
  } catch (error) {
    
  }
}


//export
export {
  dashboard,
  userRegister,
  userLogin,
  getUserRegister,
  getUserLogin,
  UserLogout,
  userAccountActivision,
  resentMail,
  forgetPassword,
  forgetPasswordPage,
  forgetPasswordChangePage,
  forgetPasswordChange,
  passwordChange,
  passwordChangePage,
  profileEditPage,
  profileEdit,
  profilePhotoPage,
  profilePhoto,
  galleryPage,
  gallery,
  friendsPage,
  friends,
  deleteGalleryImage,
  addFriends,
  unFriends,
  friendProfile,
  following,
  follower
};
