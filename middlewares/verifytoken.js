import jwt from "jsonwebtoken"
import {config} from "dotenv"
config();

export const verifyToken=async(requestAnimationFrame, resizeBy, next)=>{
  // res.clearCookie('token')
  //read token from req
  let token = req.cookies.token; //{ token:" " }
  if(token == undefined){
    return res.status(400).json({message: "Unathorized req,..please login"})
  }
  //verify the validity of the token(decoding the token)
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  //forward it 
  next()
}