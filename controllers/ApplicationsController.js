/*const Application = require('../models/application');
const appMailer = require('../mailers/appMailer');

// Store new application
exports.store = async (req, res, next) => {
    const application = {
        'name': req.body.name,
        'email': req.body.email.toLowerCase(),
        'message': req.body.message
    };

    await Application.create(application);

    // send notification
    appMailer.applicationNotify({
        email: application.email,
        data: { name: application.name }
    });

    res.redirect('/');
};*/