const jwt = require("jwt-simple");
const moment = require("moment");

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    createdAt: moment().unix(),
    expiredAt: moment().add(5, "minutes").unix(),
  };
  return jwt.encode(payload, "secret Key");
};

module.exports = {
  generateToken,
};