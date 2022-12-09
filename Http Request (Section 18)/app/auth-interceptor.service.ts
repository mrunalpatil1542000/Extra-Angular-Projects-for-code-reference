import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {   //this method is of HttpInterceptor interface. and this 2 arg are sent by angular.
    //req is object of type HttpRequest which is generic type.
    //code in intercept method will run before request leaves the application. (before request going to backend)
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz')
    });
    return next.handle(modifiedRequest);   //next is object and handle is its method which is mandatory to continue the request.
    //handle returns observable.
  }
}

//The angular interceptor is a medium connecting the backend and front-end applications.
//Whenever a request is made, the interceptors handle it in between.
//E.g. Adding token to every request after creating. instead of manually doing it Interceptor will take care of it.
//for more https://angular.io/api/common/http/HttpInterceptor#description
