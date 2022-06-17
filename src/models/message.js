const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "Users" }
  },
  {
    timestamps: true,
  })

module.exports = mongoose.model('Messages', MessageSchema)