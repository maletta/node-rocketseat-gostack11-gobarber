import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt_br from 'date-fns/locale/pt-BR';
import Sequelize from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

// import Mail from '../../lib/Mail';
import RabbitmqServer from '../../lib/RabbitmqServer';

class AppointmentController {
  async createQueue(req, res) {
    const { queue } = req.body;
    const uri = 'amqp://admin:admin@virtualhost:5672';
    const rabbit = new RabbitmqServer(uri);
    await rabbit.start();
    const assetqueue = await rabbit.assertQueue(queue);
    console.log('assert ', assetqueue);

    res.json({ ok: true });
  }

  async publishInQueue(req, res) {
    const { queue, message } = req.body;
    const uri = 'amqp://admin:admin@virtualhost:5672';
    const rabbit = new RabbitmqServer(uri);
    await rabbit.start();
    const messageStringfy = JSON.stringify(message);
    const publish = await rabbit.publishInQueue(queue, messageStringfy);
    console.log('publish ', publish);
    res.json({ ok: true });
  }
}

export default new AppointmentController();
