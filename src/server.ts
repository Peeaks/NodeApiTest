import App from './App'
import 'dotenv/config';
import ProductController from './product/product.controller'
import CategoryController from './category/category.controller'
import AuthenticationController from './authentication/authentication.controller';

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
  PORT,
  JWT_SECRET
} = process.env;

const app = new App(
  [
    new ProductController(),
    new CategoryController(),
    new AuthenticationController(),
  ]
)

app.listen()
