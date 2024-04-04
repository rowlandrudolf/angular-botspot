import { Component, EventEmitter, Output, output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";


@Component({
    selector: 'comment-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    providers: [],
    template: `
        <div class="comment-input">
            <input type="text" [formControl]="commentCtrl" placeholder=""/>
            <button (click)="onClick()"> 📌 leave comment</button>
        </div>
    `,
    styles:`
        :host {
          display: block;   
        }
    `
})

export class CommentForm {
    submit = output<string>();
    commentCtrl = new FormControl();

    onClick(){
        this.submit.emit(this.commentCtrl.value);
        this.commentCtrl.reset()
    }
}