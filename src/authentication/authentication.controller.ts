import * as bcrypt from 'bcrypt'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import Controller from "../interfaces/controller.interface"
import userModel from '../user/user.model'
import CreateUserDto from '../user/user.dto'
import UserAlreadyExistsException from '../exceptions/UserAlreadyExistsException'
import validationMiddleware from '../middleware/validation.middleware'
import LoginDto from './login.dto'
import WrongCredentialsException from '../exceptions/WrongCredentialsException'
import TokenData from '../interfaces/tokenData.interface'
import User from '../user/user.interface'


class AuthenticationController implements Controller {
  public path = '/auth'
  public router = express.Router()
  private user = userModel

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register)
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login)
  }

  private register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = req.body;
    // Make sure email is checked and saved as lowercase
    userData.email = userData.email.toLowerCase()
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserAlreadyExistsException(userData.email))
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await this.user.create({ ...userData, password: hashedPassword})
      user.password = undefined
      const tokenData = this.createToken(user)
      res.setHeader('Set-Cookie', [this.createCookie(tokenData)])
      res.send(user)
    }
  }

  private login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const loginData: LoginDto = req.body
    // Make sure email is checked as lowercase
    loginData.email = loginData.email.toLowerCase()
    const user = await this.user.findOne({ email: loginData.email })
    if (user) {
      const isPasswordMatching = await bcrypt.compare(loginData.password, user.password)
      if (isPasswordMatching) {
        user.password = undefined
        const tokenData = this.createToken(user)
        res.setHeader('Set-Cookie', [this.createCookie(tokenData)])
        res.send(user)
      } else {
        next(new WrongCredentialsException())
      }
    } else {
      next(new WrongCredentialsException())
    }
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age${tokenData.expiresIn}`
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60 // 1 hour
    const secret = process.env.JWT_SECRET
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    }
  }
}

export default AuthenticationController
