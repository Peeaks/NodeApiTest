import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as mongoose from 'mongoose'
import Controller from './interfaces/controller.interface'
import errorMiddleware from './middleware/error.middleware'

class App {
  public app: express.Application

  constructor(controllers: Controller[]) {
    this.app = express()

    this.connectToTheDatabase()
    this.initializeMiddleware()
    this.initializeControllers(controllers)
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`)
    })
  }

  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    mongoose.connect(`mongodb://${MONGO_PATH}`);
  }

  private initializeMiddleware() {
    this.app.use(bodyParser.json())

    // ErrorMiddleware needs to be added at the end of the stack
    this.app.use(errorMiddleware)
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }
}

export default App
