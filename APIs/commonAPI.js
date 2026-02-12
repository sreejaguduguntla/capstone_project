import exp from "express"
import bcrypt from 'bcryptjs'
import {authenticate, register} from '../services/authService.js' 
import { UserTypeModel } from "../models/userModel.js"
export const commonRoute = exp.Router()

//login
commonRoute.post('/login', async(req, res)=>{
  //get user cred object
    let userCred = req.body
    //call authenticate 
    let {token, user} = await authenticate(userCred)
    //save token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });
    res.status(200).json({message: "Login Successfull", payload: user})
})
//logout

//change password
commonRoute.put('/change-password', async(req, res)=>{
    // accept either `currentPass` or `currentPassword` (same for new)
    let { email } = req.body
    let currentPass = req.body.currentPassword
    let newPass = req.body.newPassword

    if(!email || !currentPass || !newPass){
      return res.status(400).json({message: "email, current password and new password are required"})
    }

    let user = await UserTypeModel.findOne({ email })
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    // check the current password is correct (compare plaintext -> stored hash)
    let isMatch = await bcrypt.compare(currentPass, user.password)
    if(!isMatch){
      return res.status(401).json({message: "Invalid current password"})
    }

    // hash the new password before saving
    let hashedNew = await bcrypt.hash(newPass, 10)
    let passwordChange = await UserTypeModel.findByIdAndUpdate(user.id, {
      $set: { password: hashedNew }
    }, { new: true })

    //send res
    res.status(200).json({ message: "Password updated", payload: passwordChange })
})