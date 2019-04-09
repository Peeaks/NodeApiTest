import HttpException from './HttpException'

class AuthTokenInvalidException extends HttpException {
  constructor() {
    super(401, 'Invalid authentication token')
  }
}

export default AuthTokenInvalidException
