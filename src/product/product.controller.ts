import * as express from 'express'
import Product from './product.interface'
import Controller from '../interfaces/controller.interface';
import productModel from './product.model'

class ProductController implements Controller {
  public path = '/product'
  public router = express.Router()
  private product = productModel

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllProducts)
    this.router.get(`${this.path}/:id`, this.getProduct)
    this.router.post(this.path, this.createProduct)
    this.router.delete(`${this.path}/:id`, this.deleteProduct)
  }

  getAllProducts = (req: express.Request, res: express.Response) => {
    this.product.find().then((products) => {
      res.send(products)
    })
  }

  getProduct = (req: express.Request, res: express.Response) => {
    const id = req.params.id
    this.product.findById(id).then((product) => {
      res.send(product)
    })
  }

  createProduct = (req: express.Request, res: express.Response) => {
    const productData: Product = req.body;
    const createdProduct = new this.product(productData)
    createdProduct.save().then((savedProduct) => {
      res.send(savedProduct)
    })
  }

  deleteProduct = (req: express.Request, res: express.Response) => {
    const id = req.params.id
    this.product.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        res.send(200)
      } else {
        res.send(404)
      }
    })
  }
}

export default ProductController
