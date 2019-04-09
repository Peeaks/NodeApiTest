import { NextFunction, Request, Response } from 'express'
import HttpException from '../exceptions/httpException'

function errorMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'Unexpected error happened (Unhandled)'
  res.status(status).send({
    status, message
  })
}

export default errorMiddleware
