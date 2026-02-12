import { Schema, SchemaType, model } from 'mongoose'

//Create User comment Schema
const userCommentSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  comment:{
    type: String,
  }
})

//Create Article Schema
const articleSchema = new Schema({
  author:{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, "Author Id required"]
  },
  articleId:{
    type: Schema.Types.ObjectId,
    ref: 'article',
    required: [true, "articleId is required"]
  },
  title:{
    type: String,
    required: [true, "Title is required"]
  },
  category:{
    type: String,
    required: [true, "category is required"]
  },
  content:{
    type: String,
    required: [true, "Content is required"]
  },
  commentst: [userCommentSchema],
  isArticleActive:{
    type: Boolean,
    default: true
  },
},{
  timestamps: true,
  strict: 'throw',
  versionKey: false
})

//create model
export const ArticleModel = model('article', articleSchema)