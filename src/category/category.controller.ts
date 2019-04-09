import * as express from 'express'
import Category from './category.interface'
import Controller from '../interfaces/controller.interface';
import categoryModel from './category.model'
import validationMiddleware from '../middleware/validation.middleware'
import CreateCategoryDto from './category.dto'
import NotFoundException from '../exceptions/notFoundException'
import authMiddleware from '../middleware/auth.middleware'
import RequestWithUser from '../interfaces/requestWithUser.interface'

class CategoryController implements Controller {
  public path = '/category'
  public router = express.Router()
  private category = categoryModel

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllCategorys)
    this.router.get(`${this.path}/:id`, this.getCategory)

    // Add auth middleware to post/delete
    this.router.post(this.path, authMiddleware, validationMiddleware(CreateCategoryDto), this.createCategory)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteCategory)
  }

  getAllCategorys = async (req: express.Request, res: express.Response) => {
    const products = await this.category.find()
      .populate('owner', '-password')
    res.send(products)
  }

  getCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const category = await this.category.findById(id)
      .populate('owner', '-password')
    if (category) {
      res.send(category)
    } else {
      next(new NotFoundException(id))
    }
  }

  createCategory = async (req: RequestWithUser, res: express.Response) => {
    const categoryData: Category = req.body;
    const createdCategory = new this.category({
      ...categoryData,
      owner: req.user._id
    })
    const savedCategory = await createdCategory.save()
    await savedCategory.populate('owner', '-password').execPopulate()
    res.send(savedCategory)
  }

  deleteCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const successResponse = await this.category.findByIdAndDelete(id)
    if (successResponse) {
      res.send(200)
    } else {
      next(new NotFoundException(id))
    }
  }
}

export default CategoryController
