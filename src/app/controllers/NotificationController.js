import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    /**
     * check if user id is a provider
     */
    const checkIsProvider = User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json({ notifications });
  }

  async update(req, res) {
    const notificationId = req.params.id;

    if (!notificationId) {
      res.status(400).json({ error: 'Notification id is required' });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        read: true, // vai atualizar read para true
      },
      {
        new: true, // vai retornar o novo objeto atualizado
      }
    ).catch(() => {
      return null;
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    return res.json(notification);
  }
}

export default new NotificationController();
