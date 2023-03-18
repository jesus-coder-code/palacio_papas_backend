const {User} = require("../database/database")
const bcrypt = require("bcrypt");
const { generateToken } = require("../middlewares/jwt/generateToken");

const createUser = async (req, res) => {
    try {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      await User.create(req.body);
      res.json({ message: "usuario registrado" });
      //console.log(user);
    } catch (error) {
      res.json({ message: error });
      console.log(error);
    }
  };

const loginUser = async (req, res) =>{
    try {
        const user = await User.findOne({where: {user: req.body.user}})

        if (user){
            const password = bcrypt.compareSync(req.body.password, user.password)

            if (password){
                res.json({token: generateToken(user)})
                console.log("usuario logeado")
            } else{
                res.json({message:"contraseña incorrecta"})
            }
        } else{
            res.json({message:"usuario y/o contraseña incorrectos"})
        }

    } catch (error) {
        res.json({message:"ha ocurrido un error"})
        console.log(error)
    }
}


module.exports = {
    createUser,
    loginUser
}

