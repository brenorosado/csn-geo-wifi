import { ChangeDetectorRef, Component } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { fetchSystemType } from "../../../../core/services/fetchMeasures";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'radio-types-list-page',
    standalone: true,
    templateUrl: './radioTypesList.page.html',
    styleUrl: './radioTypesList.page.css',
    imports: [
        DataGridComponent,
        RouterLink,
        RouterLinkActive
    ]
})
export class RadioTypesListPage {
    constructor(
        public cdr: ChangeDetectorRef,
    ) {}
    
    systemTypes: any[] = [];
    fetchData: undefined | Function = undefined;

    columns: Column[] = [
        { title: "ID", dataProp: "idsystemtype" },
        { title: "Descrição", dataProp: "description" },
    ]

    async ngOnInit() {
        await this.getSystemTypes();
        this.fetchData = this.getSystemTypes;
        this.cdr.detectChanges();
    }

    getSystemTypes = async () => {
        const fetchedSystemTypes = await fetchSystemType.list();
        this.systemTypes = fetchedSystemTypes;
    }

    getTableSystemTypes = async (params: any) => {
        const { page, pageSize } = params;
        
        const newTableData = this.systemTypes.slice(
            page * pageSize,
            (page + 1) * pageSize
        );

        return {
            content: newTableData,
            totalPages: Math.ceil(this.systemTypes.length / pageSize)
        };
    }
}