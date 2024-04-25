import { Component, Input } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
    bootstrapChevronCompactLeft,
    bootstrapChevronCompactRight
} from '@ng-icons/bootstrap-icons';
@Component({
    selector: "pagination",
    standalone: true,
    imports: [NgIconComponent],
    templateUrl: "./pagination.component.html",
    styleUrl: "./pagination.component.css",
    viewProviders: [
        provideIcons({
            bootstrapChevronCompactLeft,
            bootstrapChevronCompactRight
        })
    ],
})
export class PaginationComponent {
    @Input('currentPage') currentPage: number = 0;
    @Input('totalPages') totalPages: number = 0;
    @Input('onPageChange') onPageChange: (page: number) => void = () => {};

    checkPageChange = (newPage: number) => {
        if (newPage < 0) return;
        if (newPage >= this.totalPages) return;
        
        this.onPageChange(newPage);
    }
}