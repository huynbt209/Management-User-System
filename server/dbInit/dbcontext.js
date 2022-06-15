const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const argon2 = require('argon2');
const dbContext = {};
const user = require("../models/user");
const role = require("../models/role");

dbContext.mongoose = mongoose;

dbContext.User = user;
dbContext.Role = role;

dbContext.connectMongo = async () => {
    try {
      await mongoose.connect(`${process.env.MONGO}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  };

dbContext.initializeRole = async () => {
    try {
        const {User, Role} = dbContext;
        let admin, newbie;
        let countRole = await Role.estimatedDocumentCount();
        if (countRole === 0) {
            admin = await new Role({
                name: "ADMIN"
            });
            newbie = await new Role({
                name: "USER"
            });
            await admin.save();
            await newbie.save();
        }

        let countUser = await User.estimatedDocumentCount();
        let newAdmin;
        if (countUser === 0) {
            let hashPassword = await argon2.hash("admin");
            let roleAdmin = await Role.findOne({name: "ADMIN"});
            newAdmin = new User({
                email: "admin@gmail.com",
                password: hashPassword,
                fullname: "Admin",
                roleId: roleAdmin._id
            })
            await newAdmin.save();
        }
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}


module.exports = dbContext;