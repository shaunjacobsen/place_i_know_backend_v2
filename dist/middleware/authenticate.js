const models = require('./../models');
const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    models.session_key
        .findOne({
        where: {
            token: token,
        },
    })
        .then(result => {
        if (!result) {
            return Promise.reject();
        }
        return models.user
            .findById(result.user_id, {
            attributes: ['email', 'first_name', 'last_name', 'profile_id', 'role'],
            include: [{
                    model: models.image,
                    attributes: ['secure_url']
                }]
        })
            .then(user => {
            req.user = user;
            req.user._id = user.profile_id;
            req.token = token;
            next();
        });
    })
        .catch(err => {
        res.status(401).send(err);
    });
};
const isAllowed = (role, rolesAllowed) => {
    return rolesAllowed.indexOf(role) > -1;
};
const permit = (...allowed) => {
    return (req, res, next) => {
        if (req.user && isAllowed(req.user.role, allowed)) {
            next();
        }
        else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
};
module.exports = { authenticate, permit };
