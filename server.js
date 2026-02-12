import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv' 
import { userRoute } from './APIs/userAPI.js'
import { authorRoute } from './APIs/authorAPI.js'
import { adminRoute } from './APIs/adminAPI.js'
import { commonRoute } from './APIs/commonAPI.js'
import cookieParser from 'cookie-parser'
config() // process .env

const app = exp() 
//add both parser middleware
app.use(exp.json()) //
//add cookie-parser middle ware
app.use(cookieParser())
//connect apis
app.use('/user-api', userRoute)
app.use('/author-api', authorRoute)
app.use('/admin-api', adminRoute)
app.use('/common-api', commonRoute)


//connect to database
const connectDB =  async ()=>{
  try{
    await connect(process.env.DB_URL)
    console.log('DB connected Successfully')
    //start http server
    app.listen(process.env.PORT, ()=>console.log("Server started"))
  }catch(err){
    console.log("Error in connecting DB")
  }
}

connectDB()

//removing the tokens from the cookies is logout
//logout from admin, user, author
app.post('/logout', (req, res)=>{
  //clear the cookie named 'token'
  res.clearCookie('token', {
    //these must match original settings
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });
  res.status(200).json({message: "Logged out successfully"})
})

//middle ware for route not finding or invalid path
app.use((req, res, next)=>{
  res.json({message: `${req.url} is Invalid path`});
})


//error handling middle ware
app.use((err, req, res, next)=>{
  //To treat it as a middle ware we write next => to make it directly throw errors
  console.log("err: ",err)
  res.json({message:"Error", reason: err.message})
})


