const express = require("express");
const dbContext = require("../dbInit/dbcontext");
const {User, Role, Room, Message} = dbContext;
const passport = require("passport");

const router = express.Router();
router.use(passport.authenticate("jwt", { session: false }));


router.get('/user',async (req, res) => {
    
    const findRole = await Role.findOne({name: "USER"})
    const allUser = await User.find({roleId: findRole._id})
    const response = await Promise.all(
        allUser.map(async (user) => {
            const {_id, email, fullname, image} = user;
            return {_id, email, fullname, image}
        }
    ));
    res.render('../views/admin/user', {
        users: response
    });
});

router.get('/room', async(req, res) => {
    const allRoom = await Room.find({});

    const response = await Promise.all(
        allRoom.map(async (room) => {
            const {_id, title, users, messages} = room;
            const totalUser = users.length;
            const totalMessage = messages.length;
            return {_id, title, totalUser, totalMessage}
        }))
    res.render('../views/admin/room', {
        rooms: response
    });
})

router.get('/dashboard', async (req, res) => {
    const allUser = await User.find({});
    const allRoom = await Room.find({});
    const allMessage = await Message.find({});
    const totalUser = allUser.length;
    const totalRoom = allRoom.length;
    const totalMessage = allMessage.length;

    res.render('../views/admin/dashboard', {
        totalUser,
        totalRoom,
        totalMessage
    });
})


module.exports = router;