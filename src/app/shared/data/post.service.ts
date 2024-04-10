import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Post } from '../interfaces';
import { environment } from '../../../environments/environment';

export interface PostsResponseInterface {
  posts: Post[],
  count: number
}

interface PostResponseInterface {
  post: Post
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsUrl = `${environment.baseApiUrl}/posts`
  http = inject(HttpClient);

  getAll(path: string, skip: number): Observable<PostsResponseInterface>{
    return this.http.get<PostsResponseInterface>(`${this.postsUrl}/${path}`, {
      params: {
        skip,
        limit: 8
      }
    });
  }

  create(body: Post['body']) {
      return this.http.post<PostResponseInterface>(this.postsUrl, { post: { body } });
  }

  remove(postId: Post['_id']){
      return this.http.delete<{removed: Post}>(`${this.postsUrl}/${postId}`);
  }

  toggleLike(like: boolean, postId: Post['_id']): Observable<Post>{
    return like ? this.like(postId) : this.unlike(postId)
  }

  like(postId: string):Observable<Post>{
      return this.http.post<PostResponseInterface>(`${this.postsUrl}/${postId}/like`, {})
        .pipe(map(({post}) => post ));
  }

  unlike(postId: string):Observable<Post>{
      return this.http.delete<PostResponseInterface>(`${this.postsUrl}/${postId}/like`)
      .pipe(map(({post}) => post ))
  }

}
