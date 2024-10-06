const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log('Connected to db');
    }
    catch(error){
        console.log('Error connecting db: '+error);
    }
}