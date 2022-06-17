const express = require("express");
const chatRouter = express.Router();
const dbContext = require("../dbInit/dbcontext");
const { Room, Message, User } = dbContext;
const passport = require("passport");

chatRouter.use(passport.authenticate("jwt", { session: false }));

chatRouter.get(
  "/chat/:id",
  async (req, res) => {
    const room = await Room.findOne({
      _id: req.params.id,
    }).populate([
      { path: "users" },
      { path: "messages", populate: { path: "sender" } },
    ]);
    if (room) {
      res.status(200).json({
        data: room,
      });
    }
  }
);

chatRouter.post("/message", async (req, res) => {
  const { content, senderId, roomId } = req.body;
  const newMessage = new Message({
    content: content,
    sender: senderId,
  });
  await newMessage.save();

  const chatroom = await Room.findById(roomId);
  const updateMessage = [...chatroom.messages, newMessage];
  chatroom.messages = updateMessage;
  await chatroom.save();
  res.status(201).json({
    data: newMessage,
  });
});

chatRouter.post("/create", async (req, res, next) => {
    const {title} = req.body;
    if (!title)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Title Room!" },
    });
  try {
    const newRoom = new Room({
      users: [req.user._id],
      title: title,
    });
    await newRoom.save();
    res.status(201).json({
      status: 201,
      messages: {
        mesBody: "Room created successfully",
        roomId: newRoom._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

chatRouter.get('/room-joined', async (req, res) => {
    const userId = req.user._id;
    const roomJoin = await Room.find({users: userId});
    const response = await Promise.all(
        roomJoin.map(async (room) => {
            const { _id, title} = room;
            return {_id, title}
        })
    );
    res.render('../views/chat/room-joined', {
        rooms: response
    })
})

chatRouter.get('/', async (req, res) => {
    const allRoom = await Room.find({});
    const response = await Promise.all(
        allRoom.map(async (room) => {
            const {_id, title} = room;
            return {_id, title}
        }))
    res.render('../views/chat/index', {
        rooms: response
    });
})

module.exports = chatRouter;
