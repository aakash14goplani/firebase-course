import { auth } from './init';

export function getUsersCredentialMiddleware(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  const jwt = req.headers.authorization;
  if (jwt) {
    auth.verifyIdToken(jwt)
      .then((jwtPayload) => {
        req.uid = jwtPayload.uid;
        req.admin = jwtPayload.admin;
        next();
      })
      .catch((error) => {
        console.error('Error occured while verifying JWT:', error);
        next();
      });
  } else {
    next();
  }
}
