import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(                                  //posting data to backend from frontend.This method will get name property with string value.
        'https://ng-complete-guide-c56d3.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response'                                   //observe property is used to define how much data we want in response (not extracted response data only)
        }                                                       //1.body - (default) To get extracted data and converted to js object. 2.response - to get all data with headers and all.
      )
      .subscribe({
        next: (responseData) => {
          console.log(responseData);
        },
        error: (e) => {
          this.error.next(e.message);
        }
      });
      
      // .subscribe(
      //   responseData => {
      //     console.log(responseData);
      //   },
      //   error => {
      //     this.error.next(error.message);
      //   }
      // );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');         //for giving multiple query params we can use append method
    searchParams = searchParams.append('custom', 'key');
    return this.http                                               //returning observable to app comp methods (who call this method)
      .get<{ [key: string]: Post }>(                               //get is generic method gives type of data returns in response (getting data from backend and passing to frontend)
        'https://ng-complete-guide-c56d3.firebaseio.com/posts.json',
        {                                                          //this argument is an object. used to configure the request.
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),  //setting the header in key value pair.
          params: searchParams,                                    //setting query params which api supports. we can give them in url also.
          responseType: 'json'                                     //setting type os response body. (as it is json so body is converted into js object)
        }
      )
      .pipe(                                                       //pipe method is used to use obervable operators e.g. map()
        map(responseData => {                                      //responseData is data which we got in response which contains key(javascript object) given by firebase. this key contains actual data(title and content). map operator will apply anonymous function to each data item emitted by observable.
          const postsArray: Post[] = [];                           //declaring array to store posts of type model Post. initialized with [](Empty array).
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });  //pushing data of key(object) in array (title and content) and then id as firebase key which is nullable(optional) but unique
            }
          }
          return postsArray;                                       //returning array of posts from map method as result.
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete('https://ng-complete-guide-c56d3.firebaseio.com/posts.json', {
        observe: 'events',
        responseType: 'text'
      })
      .pipe(
        tap(event => {                                            //tap operator used to execute the code without altering the response
          console.log(event);
          if (event.type === HttpEventType.Sent) {                //HttpEventType is enum
            // ... we can give here "request is sent" for user experience.
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
