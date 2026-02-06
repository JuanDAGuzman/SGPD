const Notification = require('../models/Notification');

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtener todas las notificaciones
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado leído/no leído
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [info, success, warning, error]
 *         description: Filtrar por tipo
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 */
exports.getAll = async (req, res) => {
  try {
    const { read, type } = req.query;
    const where = {};

    if (read !== undefined) {
      where.read = read === 'true';
    }

    if (type) {
      where.type = type;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Obtener una notificación por ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la notificación
 *       404:
 *         description: Notificación no encontrada
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Crear una nueva notificación
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [info, success, warning, error]
 *               urgent:
 *                 type: boolean
 *               link:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 */
exports.create = async (req, res) => {
  try {
    const { title, message, type, urgent, link, userId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Título y mensaje son requeridos' });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      urgent: urgent || false,
      link: link || null,
      userId: userId || null,
    });

    res.status(201).json({
      message: 'Notificación creada exitosamente',
      notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Actualizar una notificación
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *               read:
 *                 type: boolean
 *               urgent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, read, urgent } = req.body;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (message !== undefined) updateData.message = message;
    if (type !== undefined) updateData.type = type;
    if (read !== undefined) updateData.read = read;
    if (urgent !== undefined) updateData.urgent = urgent;

    await notification.update(updateData);

    res.json({
      message: 'Notificación actualizada exitosamente',
      notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/notifications/{id}/mark-as-read:
 *   put:
 *     summary: Marcar notificación como leída
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    await notification.update({ read: true });

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Eliminar una notificación
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    await notification.destroy();

    res.json({ message: 'Notificación eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
