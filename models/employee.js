const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
        },
        password: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
        },
        role: {
            type: String,
            enum: ['superAdmin', 'siteAdmin', 'technician'],
            required: true
        },
        specification: {
            type: String,
            required: true
        },
        profilePhoto: {
            imageUrl: {
                type: String,
                unique: true
            }
        }
    }
);

const employeeModel = mongoose.model('employees',employeeSchema);

module.exports = employeeModel;