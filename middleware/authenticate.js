const { User } = require('./../models/user');
const { SessionKey } = require('./../models/sessionKey');

let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  SessionKey.findOne({
    where: {
      token: token
    }
  }).then((result) => {
      if (!result) {
        return Promise.reject();
      }

      User.findById(result.user_id).then((user) => {
        req.userId = user.profile_id;
        req.token = token;
      });
      
      next();
    })
    .catch((err) => {
      res.status(401).send();
    });
};

module.exports = { authenticate };
