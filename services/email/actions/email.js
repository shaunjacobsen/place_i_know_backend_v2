const { emailClient } = require('./../sparkpost/config');

module.exports = {
  sendForgotPasswordEmail: data => {
    return new Promise((resolve, reject) => {
      emailClient.transmissions
        .send({
          recipients: [
            {
              address: { email: data.user.email, name: data.user.first_name },
              metadata: { user_id: data.user.profile_id },
            },
          ],
          content: {
            template_id: 'user---forgot-password',
          },
          substitution_data: {
            reset_token: data.subs.reset_token,
            reset_id: data.subs.reset_id,
            first_name: data.user.first_name,
          },
        })
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  },
};
