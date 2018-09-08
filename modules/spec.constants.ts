require('dotenv').config();

process.env.DATASOURCE_INTEG = 'mongodb://temp:temppass1@ds019946.mlab.com:19946/arg-sandbox';
export const SpecConstants = {
    
    DATASOURCE_INTEG: process.env.DATASOURCE_INTEG,
    DEFAULT_CONTENT: '; charset=utf-8'
};