
/**
 *  session Response
**/

const sessionRes = (sms,err,redirect,req,res) => {

    req.session.message = sms;
    req.session.err = err;
    res.redirect(redirect);

}

export default sessionRes;

