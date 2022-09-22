const mongoose = require('mongoose')

const dbConnection = async () => {

    try {
        mongoose.connect(process.env.DB_CNN);
        console.log('DB Online')
    } catch (error) {
        console.error(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }


}

require('dotenv').config({ path: 'ENV_FILENAME' });

module.exports = {
    dbConnection
}

