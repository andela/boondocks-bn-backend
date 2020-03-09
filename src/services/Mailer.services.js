import ejs from 'ejs';
import sgMail from '@sendgrid/mail';
import config from '../config';
import logger from '../utils/winston';

sgMail.setApiKey(config.SENDGRID_API_KEY);

/**
* Class representing a mailing services.
*/
export default class Mailer {
  /**
   *
   * @param {object} data
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * Create a point.
   * @param {object} mailOptionsObject - contains the details to be sent
   * @return {object} status - it has sent of the sent email
   */
  async sendEmail(mailOptionsObject) {
    let msg;
    ejs.renderFile(`${__dirname}/../../public/templates/emails/${mailOptionsObject.htmlPath}`, mailOptionsObject.data, {}, (err, html) => {
      if (err) {
        logger.error(err);
      } else {
        msg = {
          to: mailOptionsObject.toAddress,
          from: 'no-reply@barefoot.com',
          subject: mailOptionsObject.subject,
          html,
          mail_settings: {
            sandbox_mode: {
              enable: config.env !== 'production',
            },
          }
        };
      }
    });
    const status = await sgMail.send(msg);
    return status;
  }

  /**
   * Sends the reset password email
   * @return {null} nothing.
   */
  async sendResetPassword() {
    await this.sendEmail({
      toAddress: this.data.to,
      subject: 'Reset password',
      data: {
        name: this.data.name,
        message: 'reset your password',
        link: `${this.data.host}/auth/reset-password?token_reset=${this.data.token}`
      },
      htmlPath: 'resetPassword.ejs'
    });
  }

  /**
   * Sends the verification email
   * @return {null} nothing.
   */
  async sendResetSuccess() {
    await this.sendEmail({
      toAddress: this.data.to,
      subject: 'Reset password',
      data: {
        name: this.data.name,
      },
      htmlPath: 'resetPasswordSuccess.ejs'
    });
  }

  /**
   * Sends the verification email
   * @param {string} name - the name of the person.
   * @param {string} hostUrl - the host url
   * @param {string} to - the email sending to
   * @param {string} token - token to verify the email
   * @return {null} nothing.
   */
  async sendVerificationEmail() {
    const {
      to, host, name, token
    } = this.data;
    await this.sendEmail({
      toAddress: to,
      subject: 'Email Verification',
      data: {
        name,
        message: 'token',
        link: `${host}/api/v1/auth/verification?token=${token}`,
        regenerateLink: `${host}/api/v1/auth/reverifyUser?email=${to}`
      },
      htmlPath: 'emailVerification.ejs'
    });
  }

  /**
   * Sends th notification email after creation of trip request
   * @param {string} name - the name of the person.
   * @param {string} to - the email sending to
   * @param {string} token - token to verify the email
   * @return {null} nothing.
   */
  async newTravelNotification() {
    const {
      to, host, name, token
    } = this.data;
    await this.sendEmail({
      toAddress: to,
      subject: 'BareFoot Nomad Trip Request',
      data: {
        name,
        link: `${host}/api/v1/notification/stopNotification?token=${token}`

      },
      htmlPath: 'newTravelNotification.ejs'
    });
  }

  /**
   * Sends th notification email after creation of trip request
   * @param {string} name - the name of the person.
   * @param {string} to - the email sending to
   * @return {null} nothing.
   */
  async lineManagerNotification() {
    const {
      to, name, requestId, username
    } = this.data;
    await this.sendEmail({
      toAddress: to,
      subject: 'BareFoot Nomad Trip Request',
      data: {
        name,
        username,
        link: `${config.FRONTEND_URL}/request/${requestId}`
      },
      htmlPath: 'linemanagerNotification.ejs'
    });
  }
}
