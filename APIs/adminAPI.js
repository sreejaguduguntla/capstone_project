import exp from 'express'
import {UserTypeModel} from "../models/userModel.js"
export const  adminRoute = exp.Router()

// Read all articles (optional)

// Block users
adminRoute.put('/block', async(req, res)=>{
  console.log(req.body)
  let {id} = req.body
  
  let found = await UserTypeModel.findById({_id: id})
  if(!id){
    res.status(404).json({message: "user not found"})
  }
  let userStatus = await UserTypeModel.findByIdAndUpdate(id, {
    $set :{isActive: false}
  }, {new: true})
  return res.status(200).json({message: "User blocked", payload: userStatus})
})
// unblock user roles
adminRoute.put('/unblock', async(req, res)=>{
  console.log(req.body)
  let {id} = req.body
  let found = await UserTypeModel.findById({_id: id})
  if(!id){
    return res.status(404).json({message: "user not found"})
  }
  if(found.isActive){
    return res.status(200).json({message: "User is not blocked"})
  }
  let userStatusBlock = await UserTypeModel.findByIdAndUpdate(id, {
    $set :{isActive: true}
  }, {new: true})
  res.status(200).json({message: "User unblocked", payload: userStatusBlock})
})
