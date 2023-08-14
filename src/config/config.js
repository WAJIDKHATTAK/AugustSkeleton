const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({path: path.join(__dirname, '../../.env')});

const envVarsSchema = Joi.object()
.keys({
    NODE_ENV : Joi.string().valid('production','development','test')
    .required,
    ROOT_PATH: Joi.string(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB Url'),
    JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(90).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('Days after which refresher Token expires')
})
.unknown();

const {value : envVars , error} = envVarsSchema.prefs({ errors : {label: 'key'} })
.validate(process.env);

if(error) {
    throw new Error(`Config validation error : ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    rootPath: envVars.NODE_ENV,
    port:envVars.NODE_ENV,
    mongoose:{
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
          useCreateIndex : true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        },
    },
    jwt:{
      secret: envVars.JWT_SECRET,
      accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinute: 10,
    }
};