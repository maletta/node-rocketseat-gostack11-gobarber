import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt_br from 'date-fns/locale/pt-BR';
import Sequelize from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const quantityPerPage = 20;
    const pageOffset = (page - 1) * quantityPerPage;
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      attributes: ['id', 'date'],
      order: ['date'],
      // offset faz um deslocamento para selecionar um range específico de resultados
      // usado para fazer paginação dos resultados
      // se page igual 1 vai pegar os primeros resultado, quantidade trazida === quantityPerPage
      offset: pageOffset,
      // incluindo alias provider para fazer join com user com a chave provider_id
      // para pegar os dados do provider
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * check if provider_id is a provider
     */
    const provider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!provider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * check if userId is equal provider_id
     */

    if (provider.id === req.userId) {
      return res
        .status(400)
        .json({ error: 'Cant create a appointment to yourself' });
    }
    /**
     * check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * check dates availability, allow create only one appointment
     * per hour
     */

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: { [Sequelize.Op.between]: [hourStart, date] },
      },
    });

    if (checkAvailability) {
      return res
        .status(401)
        .json({ error: 'Appointment date is not available' });
    }

    /**
     * Notify appointment provider
     */

    const user = await User.findByPk(req.userId);
    // tudo que está entre aspas simples o datefns ignora e não usa na formatação
    // ex:  dia  27 de Dezembro, às 22:30h

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt_br,
      }
    );

    try {
      await Notification.create({
        content: `Novo agendamento de ${user.name} para ${formattedDate}`,
        user: req.userId,
      });
    } catch (e) {
      console.log(e);
      return res.json({ error: 'Error on create appointment notification' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    return res.json({ appointment });
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

    const mailMessage = {
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
<<<<<<< HEAD
      text: 'Você tem um novo cancelamento',
=======
      template: 'cancelation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt_br,
        }),
      },
>>>>>>> 62a456097f9c27372f096c90cdbd6271aae3ff32
    };

    await Mail.sendMail(mailMessage);

    return res.json(appointment);
  }
}

export default new AppointmentController();
