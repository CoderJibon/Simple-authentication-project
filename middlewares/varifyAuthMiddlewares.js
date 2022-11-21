import jwt from "jsonwebtoken";
import User from "../models/userScheme.js"

import sessionRes from "../utlity/sessionRes.js";

//auth middlewares
const verifyAuthMiddleWares = async (req,res,next) => {

    const token = req.cookies.authToken;
    
    try {
        if(token){
            const authToken = jwt.verify(token,process.env.JWT_SECRET);
            if(authToken){
                const verifyData =  await User.findById(authToken.id);
                if(verifyData){
                    next();
                }else{
                    delete req.session.user;
                    res.clearCookie("authToken");
                    sessionRes("","user not exist","/login",req,res);
                }
                 
            }else{
                delete req.session.user;
                res.clearCookie("authToken");
                sessionRes("","you are not authorized","/login",req,res);
            }
        }else{
            delete req.session.user;
            res.clearCookie("authToken");
            sessionRes("","you are not authorized","/login",req,res);
        }
        
    } catch (error) {
        delete req.session.user;
        res.clearCookie("authToken");
        sessionRes("","you are not authorized","/login",req,res);
    }
    
}

export default verifyAuthMiddleWares;