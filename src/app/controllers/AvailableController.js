import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // horários disponíveis para agendamento
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
    ];

    // irá ficar por exemplo 2021-07-20T11:00:00
    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':');

      // irá ficar por exemplo "2021-07-21T11:00:00.000Z"
      // sem - 03:00:00 aplicado
      const valueInISO = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      // irá ficar por exemplo "2021-07-21T08:00:00-03:00"
      // com - 03:00:00 aplicado
      const formattedValue = format(valueInISO, "yyyy-MM-dd'T'HH:mm:ssxxx");

      // só estão disponíveis os horários após o momento atual [new Date()]
      // verifica se schedule atual (valueInISO) é um horário após horário atual do servidor
      const isAfterCurrentDate = isAfter(valueInISO, new Date());

      // verifica se o valueInISO já está agendado no servidor
      const isAppointmented = !appointments.find((item) => {
        return format(item.date, 'HH:mm') === time;
      });

      return {
        time,
        value: formattedValue,
        valueISO: valueInISO,
        available: isAfterCurrentDate && isAppointmented,
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
