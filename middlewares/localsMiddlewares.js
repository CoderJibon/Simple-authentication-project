/**
 * set locals data
 */

export const localsMiddlewares = (req, res, next) => {
  res.locals.message = req.session.message;
  res.locals.err = req.session.err;
  delete req.session.message;
  delete req.session.err;
  res.locals.user = req.session.user;
  res.locals.resentMail = req.session.resentMail;

  next();
};
