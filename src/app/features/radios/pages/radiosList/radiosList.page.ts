import { ChangeDetectorRef, Component } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { ModalComponent } from "../../../../core/components/modal/modal.component";
import { fetchSystems } from "../../../../core/services/fetchSystems";

@Component({
    selector: 'radios-list-page',
    standalone: true,
    templateUrl: './radiosList.page.html',
    styleUrl: './radiosList.page.css',
    imports: [
        NgToastModule,
        DataGridComponent,
        RouterLink,
        RouterLinkActive,
        ModalComponent
    ]
})
export class RadiosListPage {
    idToDelete: string | number | undefined = "";
    systems: any[] = [];
    fetchData: undefined | Function = undefined;
    columns: Column[] = [
        {
            title: "ID",
            dataProp: "idsystem",
        },
        {
            title: "Descrição",
            dataProp: "description",
        },
        {
            title: "Plataforma",
            dataProp: "platform",
        },
        {
            title: "Network ID",
            dataProp: "networkId",
        },
        {
            title: "ipv4address",
            dataProp: "ipv4address",
        },
        {
            title: "Subnet",
            dataProp: "subnet",
        },
        {
            title: "gateway",
            dataProp: "gateway",
        },
        {
            title: "dns",
            dataProp: "dns",
        },
        {
            title: "ipv6address",
            dataProp: "ipv6address",
        },
        {
            title: "idsystemtype_fk",
            dataProp: "idsystemtype_fk",
        },
        {
            title: "Ações",
            dataProp: "actions",
            isActions: true,
            onDelete: (data) => this.idToDelete = data.idsystem,
            onEdit: (data) => this.router.navigate([`/radios/${data.idsystem}`]),
        }
    ];

    constructor(
        public cdr: ChangeDetectorRef,
        private toast: NgToastService,
        private router: Router
    ) {}

    async ngOnInit() {
        await this.getSystems();
        this.fetchData = this.getTableSystems;
        this.cdr.detectChanges();
    }

    onCloseModal = () => this.idToDelete = undefined;

    onConfirmDelete = async () => {
        try {
            const response = await fetchSystems.deleteById(this.idToDelete as string);

            if ([201, 200].includes(response.status)) {
                this.fetchData = undefined;
                this.cdr.detectChanges();
                const newSystems = [...this.systems];
                const indexToDelete = newSystems.findIndex(
                    (systemType) => systemType.idsystemtype === this.idToDelete
                );
                if (indexToDelete !== -1) {
                    newSystems.splice(indexToDelete, 1);
                    this.systems = newSystems;
                }
                this.fetchData = this.getTableSystems;
                this.cdr.detectChanges();
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

    getSystems = async () => {
        try {
            const fetchedSystemTypes = await fetchSystems.list();
            this.systems = fetchedSystemTypes;
        } catch (e) {
            this.toast.error({
                position: "bottomRight",
                detail: "Erro",
                summary: "Ocorreu um erro ao buscar os tipos de rádio.",
                duration: 3000
            });
        }
    }

    getTableSystems = (params: any) => {
        const { page, pageSize } = params;
        
        const newTableData = this.systems.slice(
            page * pageSize,
            (page + 1) * pageSize
        );

        return {
            content: newTableData,
            totalPages: Math.ceil(this.systems.length / pageSize)
        };
    }
}