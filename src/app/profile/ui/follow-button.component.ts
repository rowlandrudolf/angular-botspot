import { NgClass } from "@angular/common";
import { Component, EventEmitter, Input, Output, Signal, computed, input, output, signal } from "@angular/core";

@Component({
    selector: 'follow-button',
    standalone: true,
    imports: [NgClass],
    template: `
        <button 
          class="control-btn"
          (click)="toggleFollow.emit('')"
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
    following = input.required<boolean>();
    toggleFollow = output<string>();
    label = computed(() => this.following() ? 'Unfollow' : 'Follow')
}
