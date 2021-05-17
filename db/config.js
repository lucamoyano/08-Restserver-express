const mongoose = require('mongoose');

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('successful connection database');
    } catch(error) {
        console.log(error);
        throw new Error('error connecting database');
    }
}

module.exports = {
    dbConnection
}