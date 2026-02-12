import { UserTypeModel } from "../models/userModel.js"

export const checkAuthor = async (req, res, next)=>{
  //get author id
  let aId = req.body?.author || req.params?.authorId
  let author = await UserTypeModel.findById(aId)
  //verify author
  if(!author){
    return res.status(401).json({message: "Invalid Author "})
  }
  //if author found but role is diff
  if(author.role !== "AUTHOR"){
    return res.status(403).json({message: "User is not an Author "})
  }
  //if author blocked
  if(!author.isActive){
    return  res.status(403).json({message: "Author account is not active"})
  }
  //forward req to next
  next();
}