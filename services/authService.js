import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs'; //for hashing -> irreversible
import { UserTypeModel } from "../models/userModel.js"

//register function
export const register = async(userObj)=>{
  //create document
  const userDoc = new UserTypeModel(userObj);
  //validate for empty passwords
  await userDoc.validate();  //it is a mongoDB document
  //hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10)
  //save
  const created = await userDoc.save()
  //convert document to object to remove the password
  const newUserObj = created.toObject()
  //remove password
  delete newUserObj.password
  //return user obj without password
  return newUserObj
};

//authenticate function
export const authenticate = async({email, password})=>{
  //check user with email and role
  const user = await UserTypeModel.findOne({email});
  if(!user){
    const err = new Error('Invalid email');
    err.status = 401
    throw err //Only routes can send the responses 
  }
  //if user valid but blocked by admin

  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    const err = new Error('Invalid password');
    err.status = 401
    throw err
  }
  //check isActive state
  if(!user.isActive){
    const err = new Error('Your account blocked. Plz contact admin');
    err.status = 403 //user there but blocked
    throw err
  }
  //generate token
  const token = jwt.sign({userId: user._id, role: user.role, email: user.email}, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const userObj = user.toObject()
  delete userObj.password
  return userObj 
  
}