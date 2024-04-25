import { NgFor } from "@angular/common";
import { Component, Input, SimpleChange, SimpleChanges } from "@angular/core";
import { PaginationComponent } from "../pagination/pagination.component";

const DEFAULT_PAGE_SIZE = 20;

export type Column = {
    title: string;
    dataProp: string;
    customRender?: (data: any) => string;
}

@Component({
    selector: 'data-grid',
    standalone: true,
    templateUrl: './dataGrid.component.html',
    styleUrl: './dataGrid.component.css',
    imports: [
        NgFor,
        PaginationComponent
    ]
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