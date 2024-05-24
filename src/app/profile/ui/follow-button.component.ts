import { NgClass } from "@angular/common";
import { Component, EventEmitter, Input, Output, Signal, computed, input, model, output, signal } from "@angular/core";

@Component({
    selector: 'follow-button',
    standalone: true,
    imports: [NgClass],
    template: `
        <button 
          class="control-btn"
          (click)="this.following.set(!this.following())"
          [ngClass]="{'active': this.following()}">
            {{label()}}
        </button>
    `,
    styles: `
        button {
            width: 100%;
            margin: 0;
        }
    `
})
export class FollowButtonComponent {
    following = model.required<boolean>();
    label = computed(() => this.following() ? 'Unfollow' : 'Follow')
}
