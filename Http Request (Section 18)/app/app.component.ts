import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error: any;
  private errorSub: Subscription = new Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(    //fetchPosts() method will return an observable. we are subscribing it in this comp as we want the response data(posts) to assign it to loadedPosts.
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      error => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;

    //This signature of subscribe method is deprecated...
    //For more info https://rxjs.dev/deprecations/subscribe-arguments
    
    // this.postsService.fetchPosts().subscribe(
    //   posts => {
    //     this.isFetching = false;
    //     this.loadedPosts = posts;
    //   },
    //   error => {
    //     this.isFetching = false;
    //     this.error = error.message;
    //     console.log(error);
    //   }
    // );

    
    //New signature of subscribe method
    this.postsService.fetchPosts().subscribe({
        next: (x) => {
          this.isFetching = false;
          this.loadedPosts = x;
        },
        error: (e) => {
          this.isFetching = false;
          this.error = e.message;
          console.log(e);
        }
      });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();       //unsubscribing errorSub subject.
  }
}
