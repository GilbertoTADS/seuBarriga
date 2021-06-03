const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'Segredo';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, async (payload, done) => {
    try {
      const user = await app.services.users.find({ id: payload.id });
      if (user) done(null, { ...payload });
      else done(null, false);
    } catch (err) {
      done(err, false);
    }
  });

  passport.use(strategy);

  return { authenticate: () => passport.authenticate('jwt', { session: false }) };
};
