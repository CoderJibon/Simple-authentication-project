/**
 *  server path not found 404
 * 
**/
const notFoundPath404 = (req, res, next)=>{
    res.status(404).send("Sorry can't find that!");
}

// export default
export default notFoundPath404;