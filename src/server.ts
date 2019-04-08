import App from './App'
import ProductController from './product/product.controller'
import CategoryController from './category/category.controller'
import 'dotenv/config';

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
  PORT
} = process.env;

const app = new App(
  [
    new ProductController(),
    new CategoryController(),
  ]
)

app.listen()
