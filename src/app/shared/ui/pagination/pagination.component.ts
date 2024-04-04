import { CommonModule } from '@angular/common';
import { Component, Signal, computed, input, output } from '@angular/core';

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
     @if (showPagination()) {
      <ul class="pagination">
        @for (page of pages(); track $index) {
          <li  >
            <button 
              class="control-btn" 
              (click)="onClick($index)" 
              [ngClass]="{'active': skip() === $index * limit()}">
              {{page}}
            </button> 
          </li>
        }
      </ul>
  }
  `,
  styles: ``
})
export class PaginationComponent {
  total = input.required<number>()
  skip = input.required<number>();
  limit = input(8)
  skipChange = output<number>()

  totalPages = computed(() => Math.ceil(this.total() / this.limit()))
  curentPage = computed(() => this.skip() / this.limit() + 1)
  pages = computed(() => [...Array(this.totalPages()).keys()].map((p) => p + 1))
  
  showPagination = computed(() => this.total() > this.limit());

  onClick(i: number){
    this.skipChange.emit(i * this.limit());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
