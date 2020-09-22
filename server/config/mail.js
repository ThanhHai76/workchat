// Mail config
const nodemailer = require('nodemailer');
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viet220994@gmail.com',
    pass: 'esigoxtundoyenqj'
  }
});