import express from 'express';
import path from 'path';
import routes from './routes';
import './database';
import RabbitmqServer from './lib/RabbitmqServer';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.assertDefaultRabbitmqQueues();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  async assertDefaultRabbitmqQueues() {
    const rabbit = new RabbitmqServer();
    await rabbit.start();
    const queuesToAssert = Object.keys(rabbit.QUEUES);
    await queuesToAssert.map(async (queue) => {
      return rabbit.assertQueue(queue);
    });
  }
}

export default new App().server;
