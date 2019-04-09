import * as mongoose from 'mongoose'
import Category from './category.interface'

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  owner: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  }
})

const categoryModel = mongoose.model<Category & mongoose.Document>('Category', categorySchema)

export default categoryModel
