const {User} = require("../database/database")

const createUser = async (req, res) => {
    try {
      //req.body.password = bcrypt.hashSync(req.body.password, 10);
      await User.create(req.body);
      res.json({ message: "usuario registrado" });
      //console.log(user);
    } catch (error) {
      res.json({ message: error });
      console.log(error);
    }
  };

module.exports = {
    createUser,
}