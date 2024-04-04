import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Comment } from "@app/shared/interfaces";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";

export interface CommentsResponse {
    comments: Comment[]
}
export interface CommentResponse {
    comment: Comment
}

Injectable({
    providedIn: 'root'
})
export class CommentService {
    private http = inject(HttpClient)
    private commentsUrl = `${environment.baseApiUrl}/posts`
   
    getAll(postId: string) {
        return this.http.get<CommentsResponse>(`${this,this.commentsUrl}/${postId}/comments`)
    }
 
    addComment(postId:string, note: string){
        return this.http.post<CommentResponse>(`${this,this.commentsUrl}/${postId}/comments`, { comment: { note }})      
    }

    removeComment(postId: string, commentId: string){
        return this.http.delete<{removed: Comment}>(`${this,this.commentsUrl}/${postId}/comments/${commentId}`)      
    }

}