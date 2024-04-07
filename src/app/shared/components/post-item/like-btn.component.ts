import { NgClass, NgStyle } from "@angular/common";
import { Component, input, model, output } from "@angular/core";

@Component({
    selector: 'like-btn',
    standalone: true,
    imports: [
        NgClass
    ],
    template: `
    <button 
        class="control-btn"
        (click)="liked.set(!liked())" 
        [ngClass]="{'active': liked() }">
        {{ likesCount() }} 👍 
    </button>
    `,
})
export class LikeBtnComponent {
    liked = model.required<boolean>()
    likesCount = input.required<number>()
}