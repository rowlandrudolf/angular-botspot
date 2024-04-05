import { Component, input } from "@angular/core";

@Component({
    selector: 'spinner',
    standalone: true,
    template: `
    @if(loading() ){
        <div class="spinner-wrap">
            <h3>Loading...</h3>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle class="spin" cx="100" cy="100" fill="none"
                    r="25" stroke-width="5" stroke="#a829c3"
                    stroke-dasharray="90 700"
                    stroke-linecap="round" />
            </svg>
        </div>
    }
    `,
    styles: `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .spinner-wrap {
        width: 300px;
        margin: 0 auto;
        position: relative;

        h3{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-transform: uppercase;
        }
    }
    .spin {
        transform-origin: center;
        animation: spin 2s linear infinite;
    }
    `
})
export class SpinnerComponent {
    loading = input(false);
}