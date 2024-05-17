import { ChangeDetectorRef, Component } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { fetchSystemType } from "../../../../core/services/fetchSystemTypes";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

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
        private router: Router
    ) {}
    
    systemTypes: any[] = [];
    fetchData: undefined | Function = undefined;

    columns: Column[] = [
        { title: "ID", dataProp: "idsystemtype" },
        { title: "Descrição", dataProp: "description" },
        { 
            title: "Ações", 
            dataProp: "actions",
            isActions: true,
            onDelete: (data) => console.log("delete data", data),
            onEdit: (data) => this.router.navigate([`/tipos-radio/${data.idsystemtype}`])
        },
    ]

    async ngOnInit() {
        await this.getSystemTypes();
        this.fetchData = this.getTableSystemTypes;
        this.cdr.detectChanges();
    }

    getSystemTypes = async () => {
        // const fetchedSystemTypes = await fetchSystemType.list();
        const fetchedSystemTypes = [
            {
                idsystemtype: 1,
                description: "teste 1",
            },
            {
                idsystemtype: 2,
                description: "teste 2",
            }
        ];
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