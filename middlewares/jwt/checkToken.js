const moment = require("moment");
const jwt = require("jsonwebtoken")



const checkToken = (req, res, next) => {
  if (!req.headers["user-token"]) {
    return res.json({ message: "es necesario un token" });
  }

  const userToken = req.headers["user-token"];
  let payload = {};
  try {
    payload = jwt.decode(userToken, "secret Key");
    res.json({payload})
  } catch (error) {
    console.log(error);
    return res.json({ message: "token incorrecto" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.json({ message: "token expirado" });
  }

  req.userId = payload.userId;
  req.user = payload.user
  req.password = payload.password

  next();
};

function decodeToken(req, res) {
  /*const token = req.headers["user-token"]
  const decoded = jwt.decode(token, { complete: true });
  const header = decoded.header
  console.log(JSON.stringify(req.header))
  res.json(JSON.stringify(req.header))*/
  

  const userToken = req.headers["user-token"];
  let payload = {};
  try {
    payload = jwt.decode(userToken, "secret Key");
    res.json({payload})
  } catch (error) {
    console.log(error);
    return res.json({ message: "token incorrecto" });
  }

}

module.exports = {
  checkToken: checkToken,
};
