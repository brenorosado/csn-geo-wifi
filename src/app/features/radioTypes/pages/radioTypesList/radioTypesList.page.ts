import { ChangeDetectorRef, Component } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { fetchSystemType } from "../../../../core/services/fetchSystemTypes";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ModalComponent } from "../../../../core/components/modal/modal.component";
import { NgIf } from "@angular/common";
import { NgToastModule, NgToastService } from "ng-angular-popup";

@Component({
    selector: 'radio-types-list-page',
    standalone: true,
    templateUrl: './radioTypesList.page.html',
    styleUrl: './radioTypesList.page.css',
    imports: [
        NgIf,
        DataGridComponent,
        RouterLink,
        RouterLinkActive,
        NgToastModule,
        ModalComponent
    ]
})
export class RadioTypesListPage {
    constructor(
        public cdr: ChangeDetectorRef,
        private toast: NgToastService,
        private router: Router
    ) {}
    idToDelete: string | number | undefined = "";
    systemTypes: any[] = [];
    fetchData: undefined | Function = undefined;

    columns: Column[] = [
        { title: "ID", dataProp: "idsystemtype" },
        { title: "Descrição", dataProp: "description" },
        { 
            title: "Ações", 
            dataProp: "actions",
            isActions: true,
            onDelete: (data) => this.idToDelete = data.idsystemtype,
            onEdit: (data) => this.router.navigate([`/tipos-radio/${data.idsystemtype}`])
        },
    ]

    async ngOnInit() {
        await this.getSystemTypes();
        this.fetchData = this.getTableSystemTypes;
        this.cdr.detectChanges();
    }

    onCloseModal = () => this.idToDelete = undefined;

    onConfirmDelete = async () => {
        try {
            const response = await fetchSystemType.deleteById(this.idToDelete as string);

            if ([201, 200].includes(response.status)) {
                const newSystemTypes = [...this.systemTypes];
                const indexToDelete = newSystemTypes.findIndex(
                    (systemType) => systemType.idsystemtype === this.idToDelete
                );
                if (indexToDelete !== -1) {
                    newSystemTypes.splice(indexToDelete, 1);
                    this.systemTypes = newSystemTypes;
                    this.cdr.detectChanges();
                }
            }
        } catch (e) {
            this.toast.error({
                position: "bottomRight",
                detail: "Erro",
                summary: "Ocorreu um erro ao excluir o tipo de rádio.",
                duration: 3000
            });
        } finally {
            this.idToDelete = undefined;
        }
    }

    getSystemTypes = async () => {
        try {
            const fetchedSystemTypes = await fetchSystemType.list();
            this.systemTypes = fetchedSystemTypes;
        } catch (e) {
            this.toast.error({
                position: "bottomRight",
                detail: "Erro",
                summary: "Ocorreu um erro ao buscar os tipos de rádio.",
                duration: 3000
            });
        }
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