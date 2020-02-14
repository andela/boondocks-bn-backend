import config from '../config';
import logger from '../utils/winston';

const accountSid = config.twilioConfig.TWILIO_ACCOUNT_SID;
const authToken = config.twilioConfig.TWILIO_AUTH_TOKEN;
const senderNo = config.twilioConfig.TWILIO_PHONENUMBER;
const client = require('twilio')(accountSid, authToken);


const messenger = async (to, body) => {
  if (config.env === 'production') {
    await client.messages
      .create({
        body,
        from: senderNo,
        to,
      })
      .then(message => logger.info(message.sid));
  }
};

export default messenger;
