import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if (this.cache.has(url)) {
      console.log('Está no cache', url);
      return of(this.cache.get(url));
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(url, data);
        console.log('Armazenado em cache', url);
      }),
    );
  }
}
