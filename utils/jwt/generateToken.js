const jwt = require("jwt-simple");
const moment = require("moment");


const generateToken = (User) => {
  const payload = {
    userId: User.id,
    email: User.email,
    username: User.username,
    password: User.password,
    role: User.role,
    createdAt: moment().unix(),
    expiredAt: moment().add(2, "hours").unix(),
  };
  return jwt.encode(payload, "secretKey");
};

module.exports = {
  generateToken,
};