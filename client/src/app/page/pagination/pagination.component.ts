import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() totalItems: number;

  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  constructor() { }

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pageCount = Math.min(this.totalPages, 5); // Maximum number of pages to show
    const startPage = Math.max(1, this.currentPage - Math.floor(pageCount / 2));
    const endPage = Math.min(startPage + pageCount - 1, this.totalPages);

    return Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);
  }
}
