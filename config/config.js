/* eslint-disable no-nested-ternary */
const config = {
  development: {
    SQL: {},
    NOSQL: process.env.DEV_CONNECTION_STRING,
  },
  staging: {
    SQL: {},
    NOSQL: process.env.STAGE_CONNECTION_STRING,
  },
  production: {
    SQL: {},
    NOSQL: process.env.PROD_CONNECTION_STRING,
  },
};

const configData =
  process.env.NODE_ENV.trim() === "DEV"
    ? config.development
    : process.env.NODE_ENV.trim() === "STAGE"
    ? config.staging
    : config.production;

module.exports = configData;
