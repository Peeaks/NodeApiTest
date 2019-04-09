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

  /**
 * @swagger
 * definition:
 *   product:
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       price:
 *         type: number
 */

  /**
   * @swagger
   * /product:
   *    get:
   *      tags:
   *        - "Products"
   *      description: Returns all products
   *      produces:
   *        - application/json
   *      responses:
   *        200:
   *          description: An array of products
   *          schema:
   *            $ref: '#/definitions/product'
   */
  getAllProducts = async (req: express.Request, res: express.Response) => {
    const products = await this.product.find()
      .populate('owner', '-password').populate('category')
    res.send(products)
  }

  /**
   * @swagger
   * /product/:id:
   *    get:
   *      tags:
   *        - "Products"
   *      description: Returns the product with the specified id
   *      produces:
   *       - application/json
   *      parameters:
   *       - name: id
   *         description: The id of the product
   *         required: true
   *      responses:
   *        200:
   *         description: A single product
   *         schema:
   *          $ref: '#definitions/product'
   *        404:
   *         description: Product with the specified id was not found
   */
  getProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const product = await this.product.findById(id)
      .populate('owner', '-password').populate('category')
    if (product) {
      res.send(product)
    } else {
      next(new NotFoundException(id));
    }
  }

  /**
   * @swagger
   * /product:
   *    post:
   *      tags:
   *        - "Products"
   *      description: Creates a new product
   *      produces:
   *       - application/json
   *      parameters:
   *       - name: Name
   *         description: The products name
   *         required: true
   *       - name: Description
   *         description: Describe the product
   *         required: true
   *       - name: Price
   *         description: The products price
   *         required: true
   *      responses:
   *        200:
   *         description: Succesfully created
   *         schema:
   *          $ref: '#definitions/product'
   */
  createProduct = async (req: RequestWithUser, res: express.Response) => {
    const productData: Product = req.body;
    const createdProduct = new this.product({
      ...productData,
      owner: req.user._id
    })
    const savedProduct = await createdProduct.save()
    await savedProduct.populate('owner', '-password').populate('category').execPopulate()
    res.send(savedProduct)
  }

  /**
   * @swagger
   * /product/:id:
   *    delete:
   *      tags:
   *        - "Products"
   *      description: Deletes the product with the specified id
   *      produces:
   *       - application/json
   *      parameters:
   *       - name: id
   *         description: The id of the product
   *         required: true
   *      responses:
   *        200:
   *         description: Succesfully deleted
   *        404:
   *         description: Product with the specified id was not found
   */
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
