const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Roles', RoleSchema)
