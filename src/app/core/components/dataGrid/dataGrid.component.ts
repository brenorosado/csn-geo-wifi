import { NgFor, NgIf } from "@angular/common";
import { Component, Input, SimpleChanges } from "@angular/core";
import { PaginationComponent } from "../pagination/pagination.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    bootstrapTrash,
    bootstrapPencil
} from '@ng-icons/bootstrap-icons';

const DEFAULT_PAGE_SIZE = 20;

export type Column = {
    title: string;
    dataProp: string;
    customRender?: (data: any) => string;
    isActions?: boolean;
    onDelete?: (data: any) => void;
    onEdit?: (data: any) => void;
}

@Component({
    selector: 'data-grid',
    standalone: true,
    templateUrl: './dataGrid.component.html',
    styleUrl: './dataGrid.component.css',
    imports: [
        NgIconComponent,
        NgFor,
        NgIf,
        PaginationComponent
    ],
    viewProviders: [
        provideIcons({
            bootstrapTrash,
            bootstrapPencil
        })
    ],
})
export class DataGridComponent {
    @Input('columns') columns: Column[] = [];
    @Input('fetchData') fetchData: undefined | Function;

    currentPage: number = 0;
    pageSize: number = DEFAULT_PAGE_SIZE;
    totalPages: number = 0;
    data: any[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (!!changes['fetchData']) {
            this.getData();
        }
    }

    getData = async () => {
        if (!!this.fetchData) {
            const { content, totalPages } = await this.fetchData({
                page: this.currentPage,
                pageSize: this.pageSize
            });
            this.data = content;
            this.totalPages = totalPages;
        }
    }

    onPageChange = (newPage: number) => {
        this.currentPage = newPage;
        this.getData();
    }

    onChangePageSize = (event: any) => {
        event.preventDefault();
        const { target: { value } } = event;
        const newPageSize = Number(value?.replace(/[^0-9 ]/g, ""));
        this.pageSize = newPageSize;
        this.getData();
    }
}