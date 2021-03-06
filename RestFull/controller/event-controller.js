const User = require('../models/user');
const Event = require('../models/event');
const UserjoinEvent = require('../models/userjoinevent');

exports.getEventsById = (req,res) => {
    getEventsById(req.body.id)
        .then(events => {
            if(events.length === 0){
                res.status(400).json({'msg': "Can not find any Events!"});
            }
            res.status(200).json(events);
        });
}

exports.getEvent = (req,res) =>{
    getEvent(req.body.id)
        .then(event => {
            console.log(event);
            res.status(200).json(event)});
}

exports.createEventById = (req,res) =>{
    /*createEvent(req.body)
        .then(us => res.status(200).send(us))
        .catch(err => res.status(400).send(err.message));*/
    const newEvent = new Event(req.body); 
    console.log(req.body.adminId+' launched an event');
    newEvent.save((err,event) => {
        if(err){
            return res.status(400).json({'msg': err.message});
        }
        const join = new UserjoinEvent({userId: newEvent.adminId, eventId: event._id});
        join.save((err,join) => {
            const us = getEventsById(newEvent.adminId)
                .then(events => {
                    return res.status(200).json(events);
                });
        });
    })   
}

exports.userJoin = (req,res) =>{
     const newJoin = UserjoinEvent(req.body);
     console.log('Join:')
     console.log(req.body);
     newJoin.save((err,join) => {

            res.status(200).json(join);
     });
}

exports.getJoinedUser = (req,res) =>{
    console.log("ss");
    getJoinedUser(req.body.eventId)
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(400).json({'msg':err.message}));
}

exports.notificate = (req,res) =>{
    createNotification(req.body)
    .then(notificates => {
        res.status(200).json(notificates);
    }).catch(err => console.log(err));
}

exports.getNotifactions = (req,res) => {
    console.log(req.body);
    getNotifactionsFromUser(req.body.userId)
        .then(notifications => {
            console.log(notifications);
            res.status(200).json(notifications);
        })
        .catch(err => {
            console.log('Error');
        });
}

exports.removeNotification = (req,res) => {
    User.findByIdAndUpdate({_id: req.body.userId},{
       $pull: {
           notifications: req.body.eventId
       } 
    },{new: true}).then(result => res.status(200).json(result));
}

exports.getParticipants = (req,res) => {
    UserjoinEvent.find({eventId: req.body.eventId})
        .select({userId: 1,_id: 0})
        .then(users => res.status(200).json(users));
};
async function getNotifactionsFromUser(id){
    const notifications = await User
        .findById(id)
        .select({notifications:1, _id: 0});
    return notifications;
}
async function getJoinedUser(event_id){
    const us = await UserjoinEvent
        .find({eventId: event_id})
        .select({userId: 1, _id: 0});
    return us;
}
async function createNotification(body){
    const notificates = await User.findOneAndUpdate({email: body.email},{
        $addToSet: {
            notifications: body.eventId
        }
    },{new: true});
    return notificates;
}
async function getEvent(id){
    const event = await Event.findById(id);
    return event;
}
async function getEventsById(id){
    console.log(id);
    const us = await UserjoinEvent
        .find({userId: id})
        .select({_id: 0,__v: 0,userId:0});
    console.log(us);
    return us;
}