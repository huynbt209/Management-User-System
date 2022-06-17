const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ""
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Roles"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    currentRoomId: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatrooms'
    }],
});

UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: { mesBody: "Cannot hash password" }, mesError: true });
    next(error);
  }
});

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}


module.exports = mongoose.model("Users", UserSchema);