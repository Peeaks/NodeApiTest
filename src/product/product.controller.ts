import * as express from 'express'
import Product from './product.interface'
import Controller from '../interfaces/controller.interface'
import productModel from './product.model'
import NotFoundException from '../exceptions/notFoundException'
import validationMiddleware from '../middleware/validation.middleware'
import CreateProductDto from './product.dto'
import authMiddleware from '../middleware/auth.middleware'
import RequestWithUser from '../interfaces/requestWithUser.interface'

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

    // Add auth middleware to post/delete
    this.router.post(this.path, authMiddleware, validationMiddleware(CreateProductDto), this.createProduct)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteProduct)
  }

  getAllProducts = async (req: express.Request, res: express.Response) => {
    const products = await this.product.find()
    res.send(products)
  }

  getProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const product = await this.product.findById(id)
    if (product) {
      res.send(product)
    } else {
      next(new NotFoundException(id));
    }
  }

  createProduct = async (req: RequestWithUser, res: express.Response) => {
    const productData: Product = req.body;
    const createdProduct = new this.product({
      ...productData,
      ownerId: req.user._id
    })
    const savedProduct = await createdProduct.save()
    res.send(savedProduct)
  }

  deleteProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id

    const successResponse = await this.product.findByIdAndDelete(id)
      if (successResponse) {
        res.send(200)
      } else {
        next(new NotFoundException(id))
      }
  }
}

export default ProductController
