import jwt from 'jsonwebtoken';
// transforma funções antigas que precisam de um argumento que seja uma função callback
// em funcões assíncronas com asyc/await
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // console.log('token decoded ', decoded);
    req.userId = decoded.id;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
