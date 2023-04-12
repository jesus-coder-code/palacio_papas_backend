const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

function requireRole(role) {
    return async (req, res, next) => {
      const usuario = await prisma.user.findMany({
        where: { id: req.session.id },
      });
      if (usuario.role === role) {
        next();
      } else {
        res.status(401).json({message:"No autorizado"});
      }
    };
  }
/*const requireRole = async (req, res, next) =>{
  try{
    const userRole = await prisma.user.findMany({
      where: {
        id: req.session.id
      }
    })
    if(userRole.role === role){
      next()
    } else{
      res.status(401).json({message:"no autorizado"})
    }
  }catch(error){
    res.json({message:error})
  }
}*/

module.exports = {
  requireRole
}
