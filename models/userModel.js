import { Schema, model } from 'mongoose'

//This is for all, user, admin, author

const userSchema = new Schema({
  firstName:{
    type: String,
    required: [true, "First name is mandatory"]
  },
  lastName:{
    type: String,
  },
  email:{
    type: String,
    required: [true, "Email is mandatory"],
    unique: [true, 'Email required must be unique']
  },
  password:{
    type: String,
    required: [true, "Password is required"]
  },
  profileImageUrl:{
    type: String,
  },
  role:{
    type: String,
    enum: ["USER", "AUTHOR", "ADMIN"], // to enter only one of these we use enum
    required: [true, "{Value} is an Invalid role"] //value is taken from the user 
  },
  isActive:{
    type: Boolean,
    default: true // everytime a new user is created it defaultly sets true
  },
},{
  timestamps: true,
  strict: 'throw',
  versionKey: false
})

//Create model
export const UserTypeModel = model('user', userSchema) //They represent class therefore use UpperCamel case