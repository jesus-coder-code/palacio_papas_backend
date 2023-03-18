const jwt = require("jwt-simple");
const moment = require("moment");

const checkToken = (req, res, next) => {
  if (!req.headers["user-token"]) {
    return res.json({ message: "es necesario un token" });
  }

  const userToken = req.headers["user-token"];
  let payload = {};
  try {
    payload = jwt.decode(userToken, "secret Key");
  } catch (error) {
    console.log(error);
    return res.json({ message: "token incorrecto" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.json({ message: "token expirado" });
  }

  req.userId = payload.userId;

  next();
};

module.exports = {
  checkToken: checkToken,
};
