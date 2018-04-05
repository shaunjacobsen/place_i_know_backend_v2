const Sequelize = require('sequelize');

const { User } = require('./../models/user');
const { SessionKey } = require('./../models/sessionKey');
const { Image } = require('./../models/image');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  SessionKey.findOne({
    where: {
      token: token
    }
  }).then((result) => {
      if (!result) {
        return Promise.reject();
      }

      User.findById(result.user_id, {
        attributes: ['email', 'first_name', 'last_name', 'profile_id', 'role'],
        include: [{
          model: Image,
          attributes: ['secure_url']
        }]
      }).then((user) => {
        req.user = user;
        req.token = token;

        next();
      });
      
      
    })
    .catch((err) => {
      res.status(401).send();
    });
};

const isAllowed = (role, rolesAllowed) => {
  return rolesAllowed.indexOf(role) > -1;
}

const permit = (...allowed) => {
  return (req, res, next) => {
    if (req.user && isAllowed(req.user.role, allowed)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
   }
}

module.exports = { authenticate, permit };
