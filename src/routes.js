import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionControler from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import AvailableController from './app/controllers/AvailableController';
import RabbitmqController from './app/controllers/AppointmentControllerRabbitmq';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/sessions', SessionControler.store);
routes.post('/users', UserController.store);
routes.get('/users', UserController.showAll);
routes.get('/debug-sentry', function mainHandler() {
  throw new Error('My first Sentry error!');
});

routes.use(AuthMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.post('/files', uploads.single('file'), FileController.store);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.delete('/appointmentsRabbitmq/:id', RabbitmqController.delete);

routes.get('/schedule', ScheduleController.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/rabbit/publishInQueue', RabbitmqController.publishInQueue);

export default routes;
