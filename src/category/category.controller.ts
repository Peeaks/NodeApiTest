import * as express from 'express'
import Category from './category.interface'
import Controller from '../interfaces/controller.interface';
import categoryModel from './category.model'
import validationMiddleware from '../middleware/validation.middleware'
import CreateCategoryDto from './category.dto'
import NotFoundException from '../exceptions/notFoundException'

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
    this.router.post(this.path, validationMiddleware(CreateCategoryDto), this.createCategory)
    this.router.delete(`${this.path}/:id`, this.deleteCategory)
  }

  getAllCategorys = (req: express.Request, res: express.Response) => {
    this.category.find().then((categorys) => {
      res.send(categorys)
    })
  }

  getCategory = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    this.category.findById(id).then((category) => {
      if (category) {
        res.send(category)
      } else {
        next(new NotFoundException(id))
      }
    })
  }

  createCategory = (req: express.Request, res: express.Response) => {
    const categoryData: Category = req.body;
    const createdCategory = new this.category(categoryData)
    createdCategory.save().then((savedCategory) => {
      res.send(savedCategory)
    })
  }

  deleteCategory = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    this.category.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        res.send(200)
      } else {
        next(new NotFoundException(id))
      }
    })
  }
}

export default CategoryController
