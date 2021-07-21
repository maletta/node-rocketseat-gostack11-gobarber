import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import routes from './routes';
import './database';
import RabbitmqServer from './lib/RabbitmqServer';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    // create sentry integrations
    Sentry.init({
      dsn: sentryConfig.dsn,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app: this.server }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(Sentry.Handlers.tracingHandler());

    this.middlewares();
    this.routes();

    // create Rabbitmq Queues
    this.assertDefaultRabbitmqQueues();

    // create sentry erros handles
    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());

    // Optional fallthrough error handler
    this.server.use(function onError(err, req, res, next) {
      // The error id is attached to `res.sentry` to be returned
      // and optionally displayed to the user for support.
      res.statusCode = 500;
      res.end(`${res.sentry}\n`);
    });
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
