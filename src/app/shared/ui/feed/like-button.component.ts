import { NgClass, NgStyle } from "@angular/common";
import { Component, input, model, output } from "@angular/core";

@Component({
    selector: 'like-button',
    standalone: true,
    imports: [
        NgClass
    ],
    template: `
    <button 
        class="control-btn"
        (click)="toggle.emit()" 
        [ngClass]="{'active': liked() }">
        {{ likesCount() }} 👍 
    </button>
    `,
    styles: `

    `
})
export class LikeButtonComponent {
    liked = input.required<boolean>()
    likesCount = input.required<number>()
    toggle = output<void>();
}