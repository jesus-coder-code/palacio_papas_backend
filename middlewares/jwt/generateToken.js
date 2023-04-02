const jwt = require("jwt-simple");
const moment = require("moment");


const generateToken = (User) => {
  const payload = {
    userId: User.id,
    email: User.email,
    user: User.user,
    password: User.password,
    createdAt: moment().unix(),
    expiredAt: moment().add(24, "hours").unix(),
  };
  return jwt.encode(payload, "secretKey");
};

module.exports = {
  generateToken,
};