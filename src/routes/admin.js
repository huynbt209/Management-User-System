const express = require("express");
const dbContext = require("../dbInit/dbcontext");
const {User, Role} = dbContext;
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

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
})


module.exports = router;