import { Injectable, NestInterceptor, ExecutionContext, CallHandler,
  BadRequestException, NotFoundException, InternalServerErrorException, ForbiddenException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle()
      .pipe(
        catchError(error => {

          // https://docs.nestjs.com/exception-filters

          if (error.status == 400 || error.statusCode == 400)
            throw new BadRequestException(null, error.response.message);

          if (error.status == 403 || error.statusCode == 403)
            throw new ForbiddenException(null, error.response.message);

          if (error.status == 404 || error.statusCode == 404)
            throw new NotFoundException(null, error.response.message);

          else
            throw new Error(error);

        })
      );
  }

}
