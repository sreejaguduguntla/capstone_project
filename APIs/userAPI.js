import exp from 'express'
import {authenticate, register} from '../services/authService.js' 
import { ArticleModel } from '../models/articleModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';

export const  userRoute = exp.Router()

//Create or register user 
userRoute.post('/users', async(req, res)=>{
  // get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({...userObj, role: "USER"})//know why?
  //don't allow the client side app to assign the route i.e, role
  //Send response
  res.status(201).json({message: "User created", payload: userObj})

})
//Authenticate User
// userRoute.post("/login", async(req, res)=>{
//   //get user cred object
//   let userCred = req.body
//   //call authenticate 
//   let {token, user} = await authenticate(userCred)
//   //save token as httpOnly cookie
//   res.cookie("token", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false
//   });
//   res.status(200).json({message: "Login Successfull", payload: user})
// }) => we have added this to the common api both user and author

//Read all the articles
userRoute.get('/users', async(req, res)=>{
  let articles = await ArticleModel.find()
  res.status(200).json({message: "Articles", payload: articles})
})

//Add comment to the article
userRoute.put('/comment', async(req, res)=>{
  let articleId = req.body
  let article = await ArticleModel.findById(articleId)

})