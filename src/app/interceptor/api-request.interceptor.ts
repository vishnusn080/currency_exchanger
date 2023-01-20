import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
const { KEY } = environment;

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const customRequest = request.clone({
      params: request.params.append('apikey', KEY),
    });
    return next.handle(customRequest);
  }
}
