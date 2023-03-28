const jwt = require("jwt-simple");
const moment = require("moment");


const generateToken = (User) => {
  const payload = {
    userId: User.id,
    user: User.user,
    password: User.password,
    createdAt: moment().unix(),
    expiredAt: moment().add(5, "minutes").unix(),
  };
  return jwt.encode(payload, "secret Key");
};

module.exports = {
  generateToken,
};