const sgMail = require('@sendgrid/mail');
const { CLIENT_ENDPOINT } = require('../src/config/config')
const { sendgridAuth } = require('../src/config/auth-config')
sgMail.setApiKey(sendgridAuth.API_KEY)
const UserUtils = require('../src/utils/user.utils')


describe('UserUtils.sendEmail(mailOptions) function', () => {

  before('Make sure you run the correct command `npm run test-node-env` for these tests to pass`', () => {
    console.log('make sure you run the correct command `npm run test-node-env` for these tests to pass`')
  })

  it('successfully sends an email with correct email format', () => {
    const mailOptions = {
      to: 'example@somefakeemail.com',
      from: 'goatsguide@gmail.com',
      subject: `Your Goat's Guide password reset request`,
      vars: {
        username: 'mockusername',
        token: 'moCKt0ken', // for pug html email template
        client_endpoint: CLIENT_ENDPOINT // for pug html email template
      },
      htmlFile: 'recover-email.pug' // for pug html email template
    }

    return UserUtils.sendEmail(mailOptions)
      .then(res => {
        // sandbox email gets 200, dev/production mode will get you 202
        expect(res[0].statusCode).to.eql(200)
      })
  })

  it('returns an error with incorrect email format', () => {
    const mailOptions = {
      to: 'not an email',
      from: 'goatsguide@gmail.com',
      subject: `Your Goat's Guide password reset request`,
      vars: {
        username: 'mockusername',
        token: 'moCKt0ken', // for pug html email template
        client_endpoint: CLIENT_ENDPOINT // for pug html email template
      },
      htmlFile: 'recover-email.pug' // for pug html email template
    }

    return UserUtils.sendEmail(mailOptions)
      .then(res => {
        expect(res).to.be(null)
      })
      .catch(err => {
        expect(err.sgError.code).to.eql(400)
        expect(err.message).to.eql('There was an error sending your email')
      })
  })
})
