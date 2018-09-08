require('dotenv').config();
export const AppConstants = {

    DATASOURCE: process.env.DATASOURCE,

    // content types
    MESSAGE_V1: 'application/vnd.message.v1+json',

    // messages
    WELCOME_MESSAGE: 'Hello, you have reached the service',
};