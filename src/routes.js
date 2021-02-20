import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionControler from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/sessions', SessionControler.store);
routes.post('/users', UserController.store);

routes.use(AuthMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', uploads.single('file'), (req, res) => {
  return res.json({ ok: true });
});

export default routes;
