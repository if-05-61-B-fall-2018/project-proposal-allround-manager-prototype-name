const express = require('express');
const eventController = require('../controller/event-controller');
const routes = express.Router();

routes.post('/',eventController.getEventsById);

routes.post('/create',eventController.createEventById);

routes.post('/confirm',eventController.userJoin);

routes.post('/joins',eventController.getJoinedUser);

routes.post('/eventById',eventController.getEvent)

routes.post('/notificate',eventController.notificate);

routes.post('/getNotifications',eventController.getNotifactions);

routes.post('/removeNotification',eventController.removeNotification);

routes.post('/getParticipants',eventController.getParticipants)
module.exports = routes;