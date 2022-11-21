import sessionRes from "../utlity/sessionRes.js";

//auth middleWare
const authMiddlewares = (req,res,next) => {

    const userAuth = req.cookies.authToken;

    try {
           if(userAuth){
              sessionRes("you are verify user","","/",req,res)
           } else{
              next();
           }
    } catch (error) {
        next();
    }
    

}

export default authMiddlewares;

