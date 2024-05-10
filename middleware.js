// Middleware pour le multilinguisme
const multilingual = (req, res, next) => {
    const lang = req.url.split('/')[1];
    if (lang === 'fr') {
        res.locals.lang = require('./locales/fr.json'); // Répertoire avec le fichier de traduction fr.json
    } else {
        res.locals.lang = require('./locales/en.json'); // Répertoire avec le fichier de traduction en.json
    }
    next();
};

// Middleware de session
const session_lib = require('express-session');
const session = session_lib({
    secret: 'secret-key', // Changez cette clé pour un secret fort
    resave: false,
    saveUninitialized: true
});

module.exports = { multilingual, session };
