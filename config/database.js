const mongoose = require('mongoose');
const employeeModel = require('../models/employee');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await checkAdminExist();
        console.log('Connected to db');
    }
    catch(error){
        console.log('Error connecting db: '+error);
    }
}

const checkAdminExist = async () => {
    try {
        const admin = await employeeModel.find({ role: 'superAdmin' });
        if (admin.length === 0) {
            const superAdmin = {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: 'Admin',
                mobile: '1234567890',
                role: 'superAdmin',
                specification: 'admin',
                profilePhoto: {
                    imageUrl: 'image.jpg'
                }
            }
            await employeeModel.create(superAdmin);
        }
    }
    catch(error) {
        console.log('Error adding default admin: '+error);
    }
}