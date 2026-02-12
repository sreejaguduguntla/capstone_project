import exp from 'express'
import {authenticate, register} from "../services/authService.js"
import { UserTypeModel } from '../models/userModel.js';
import { ArticleModel } from '../models/articleModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
export const  authorRoute = exp.Router()

//Create or register user (public)
authorRoute.post('/users', async(req, res)=>{
  // get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({...userObj, role: "AUTHOR"})//know why?
  //don't allow the client side app to assign the route i.e, role
  //Send response
  res.status(201).json({message: "author created", payload: userObj})
})

// Authenticate Author (public)
// authorRoute.post("/login", async(req, res)=>{
// })

//Create Article(protected route)
authorRoute.post('/articles', checkAuthor ,async (req, res)=>{
  //get article from the user
  let article = req.body
  //check for the author
  // let author = await UserTypeModel.findById(article.author)
  // if(!author || author.role !== "AUTHOR"){
  //   res.status(401).json({message: "Invalid Author "})
  // }
  //create the article document 
  let newArticleDoc = new ArticleModel(article)
  //save
  const createdArticleDoc = await newArticleDoc.save()
  //send response
  res.status(201).json({message:"Article published", payload: createdArticleDoc})
})
//Read articles of author (protected route)
authorRoute.get('/articles/:authorId', checkAuthor, async(req, res)=>{
  //get author id
  let aId = req.params.authorId
  //check the author
  // let author = await UserTypeModel.findById(aId)
  // if(!author || author.role !== "AUTHOR"){
  //   res.status(401).json({message: "Invalid Author"})
  // }
  //read articles by this author which are active
  let article = await ArticleModel.find({author: aId, isArticleActive: true}).populate("author", "firstName")
  //send res
  res.status(201).json({message: "Content", payload: article})
})

//Edit Article (protected route)
authorRoute.put('/articles', checkAuthor, async(req, res)=>{
  //get modified article from request
  let {articleId, title, category, content, author} = req.body
  //find article
  let found = await ArticleModel.findOne({_id: articleId, author: author})
  if(!found){
    return res.status(404).json({message: "Article not found"})
  }
  let updatedDoc = await ArticleModel.findByIdAndUpdate(articleId,{
    $set: {title, category, content}
  },{new: true})
  //update the article
  return res.status(200).json({message: "Article updated", payload: updatedDoc})
})

//Delete Article (soft delete) (protected route)
authorRoute.delete('/articles/:id', checkAuthor, async(req, res)=>{
  let aid = req.params.id
  let article = await ArticleModel.findById(aid)
  if(!article){
    res.status(401).json({message: "Article not found"})
  }
  let modifiedArticle = await ArticleModel.findByIdAndUpdate(aid,{
    $set: {isArticleActive: false}
  },{new: true})
  res.status(201).json({message: "Article has been deleted"})
})