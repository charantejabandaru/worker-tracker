const logModel = require('../models/log');

module.exports = async (log) => {
    try {
        const result = await logModel.create(log);
        return result;
    } catch (error) {
        return error;
    }
};