import * as mongoose from 'mongoose'
import Product from './product.interface'

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  owner: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  },
  category: {
    ref: 'Category',
    type: mongoose.Schema.Types.ObjectId
  }
})

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema)

export default productModel
