import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces';
import { environment } from '../../../environments/environment';

export interface PostsResponseInterface {
  posts: Post[],
  count: number
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
      return this.http.post<{post: Post}>(this.postsUrl, { post: { body } });
  }

  remove(postId: Post['_id']){
      return this.http.delete<{removed: Post}>(`${this.postsUrl}/${postId}`);
  }

  toggleLike(post: Post){
    return post.liked ? this.unlike(post._id) : this.like(post._id)
  }

  like(postId: string){
      return this.http.post<{post: Post}>(`${this.postsUrl}/${postId}/like`, {});
  }

  unlike(postId: string){
      return this.http.delete<{post: Post}>(`${this.postsUrl}/${postId}/like`);
  }

}
