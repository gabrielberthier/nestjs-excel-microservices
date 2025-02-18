import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ContentTypeValidationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    console.log(request.headers['content-type']);

    if (!request.headers['content-type']?.includes('multipart/form-data')) {
      throw new UnsupportedMediaTypeException('Invalid content type');
    }

    return true;
  }
}
