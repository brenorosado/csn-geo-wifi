import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { fetchSystems } from "../../../../core/services/fetchSystems";
import { fetchEquipment } from "../../../../core/services/fetchEquipments";
import { ModalComponent } from "../../../../core/components/modal/modal.component";
import { NgIf } from "@angular/common";

@Component({
    selector: 'equipment-list-page',
    imports: [
        NgToastModule,
        DataGridComponent,
        RouterLink,
        RouterLinkActive,
        ModalComponent,
        NgIf
    ],
    standalone: true,
    templateUrl: './equipmentList.page.html',
    styleUrl: './equipmentList.page.css'
})
export class EquipmentListPage {
    idToDelete: string | number | undefined = "";
    equipments: any[] = [];
    fetchData: undefined | Function = undefined;
    columns: Column[] = [
        {
            title: "ID",
            dataProp: "idequipament"
        },
        {
            title: "Equipamento",
            dataProp: "equipament"
        },
        {
            title: "Sigla",
            dataProp: "sigla"
        },
        {
            title: "Descrição",
            dataProp: "description"
        },
        {
            title: "Ações",
            dataProp: '',
            isActions: true,
            onDelete: (data) => this.idToDelete = data.idequipament,
            onEdit: (data) => this.router.navigate([`/equipamentos/${data.idequipament}`]),
        }
    ]

    constructor(
        public cdr: ChangeDetectorRef,
        private toast: NgToastService,
        private router: Router
    ) {}

    async ngOnInit() {
        await this.getEquipments()
        this.fetchData = this.getTableEquipments;
        this.cdr.detectChanges();
    }

    onCloseModal = () => this.idToDelete = undefined;

    onConfirmDelete = async () => {
        try {
            const response = await fetchEquipment.deleteById(this.idToDelete as string);

            if ([201, 200].includes(response.status)) {
                this.fetchData = undefined;
                this.cdr.detectChanges();
                const newEquipments = [...this.equipments];
                const indexToDelete = newEquipments.findIndex(
                    (equipment) => equipment.idequipament === this.idToDelete
                );
                if (indexToDelete !== -1) {
                    newEquipments.splice(indexToDelete, 1);
                    this.equipments = newEquipments;
                }
                this.fetchData = this.getTableEquipments;
                this.cdr.detectChanges();
            }
        } catch (e) {
            this.toast.error({
                position: "bottomRight",
                detail: "Erro",
                summary: "Ocorreu um erro ao excluir o equipamento.",
                duration: 3000
            });
        } finally {
            this.idToDelete = undefined;
        }
    }

    getEquipments = async () => {
        try {
            const fetchedEquipments = await fetchEquipment.list();
            this.equipments = fetchedEquipments;
        } catch (e) {
            this.toast.error({
                position: "bottomRight",
                detail: "Erro",
                summary: "Ocorreu um erro ao buscar os equipamentos.",
                duration: 3000
            });
        }
    }

    getTableEquipments = (params: any) => {
        const { page, pageSize } = params;
        
        const newTableData = this.equipments.slice(
            page * pageSize,
            (page + 1) * pageSize
        );

        return {
            content: newTableData,
            totalPages: Math.ceil(this.equipments.length / pageSize)
        };
    }
}