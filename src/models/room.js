const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema(
  {
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    title: String,
  },
  {
    timestamps: true,
  })

module.exports = mongoose.model('Chatrooms', RoomSchema)