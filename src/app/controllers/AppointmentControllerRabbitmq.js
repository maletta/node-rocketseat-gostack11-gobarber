import { isBefore, subHours } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

// import Mail from '../../lib/Mail';
import RabbitmqServer from '../../lib/RabbitmqServer';

class AppointmentController {
  // método para teste de publicação de mensagens
  async publishInQueue(req, res) {
    const message = { name: 'mauricio', age: 12 };
    const rabbit = new RabbitmqServer();
    await rabbit.start();
    const messageToQueue = JSON.stringify(message);
    const published = await rabbit.publishInQueue(
      rabbit.QUEUES.APPOINTMENT_CANCELATION_MAIL,
      messageToQueue
    );

    console.log('punlished ', published);
    res.json({ ok: true });
  }

  async delete(req, res) {
    const limitHoursToCancel = 2; // pode cancelar até duas horas antes do agendamento
    const paramsAppointmentId = parseInt(req.params.id, 10);

    /**
     * Appointment id validation
     */
    if (!paramsAppointmentId) {
      return res.status(400).json({ error: 'Appointment id is invalid' });
    }

    const appointment = await Appointment.findByPk(paramsAppointmentId, {
      include: [
        {
          model: User,
          as: 'provider', // alias definido no model Appointment
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user', // alias definido no model Appointment
          attributes: ['name'],
        },
      ],
    });

    /**
     * Has appointment id in database
     */
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment id not found' });
    }

    /**
     * Appointment id belong to logged user
     */
    if (parseInt(appointment.user_id, 10) !== parseInt(req.userId, 10)) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(appointment.date, limitHoursToCancel); // sutrai limitHoursToCancel horas da data

    /**
     * If the cancelation time limit is exceeded
     */
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: `You can only cancel appointments ${limitHoursToCancel} hours in advance`,
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    // await Mail.sendMail(mailMessage);
    const rabbit = new RabbitmqServer();
    await rabbit.start();
    const messageToQueue = JSON.stringify(appointment);
    await rabbit.publishInQueue(
      rabbit.QUEUES.APPOINTMENT_CANCELATION_MAIL,
      messageToQueue
    );

    return res.json(appointment);
  }
}

export default new AppointmentController();
