import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionControler from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/sessions', SessionControler.store);
routes.post('/users', UserController.store);
routes.get('/users', UserController.showAll);

routes.use(AuthMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/files', uploads.single('file'), FileController.store);

export default routes;
