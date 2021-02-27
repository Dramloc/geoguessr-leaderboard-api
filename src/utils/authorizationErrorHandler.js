import Boom from "@hapi/boom";

/**
 * Forwards `SyntaxError` as a `Boom.badRequest` error (400).
 * @type {import('express').ErrorRequestHandler}
 */
export const authorizationErrorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }
  if (err.name !== "UnauthorizedError") {
    return next(err);
  }
  return next(Boom.unauthorized(err.message));
};
