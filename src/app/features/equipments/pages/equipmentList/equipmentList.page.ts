import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { fetchSystems } from "../../../../core/services/fetchSystems";
import { fetchEquipment } from "../../../../core/services/fetchEquipments";
import { ModalComponent } from "../../../../core/components/modal/modal.component";
import { NgIf } from "@angular/common";
import { FiltersComponent } from "../../../../core/components/filters/filters.component";
import { applyFilters } from "../../../../core/utils/filters";

@Component({
    selector: 'equipment-list-page',
    imports: [
        NgToastModule,
        DataGridComponent,
        RouterLink,
        RouterLinkActive,
        ModalComponent,
        FiltersComponent,
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
    ];
    filters: any[] = [];
    filterOptions = this.columns.filter(c => !!c.dataProp)

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

    onChangeFilters = (newFilters: any[]) => {
        this.fetchData = undefined;
        this.cdr.detectChanges();
        this.filters = newFilters;
        this.fetchData = this.getTableEquipments;
        this.cdr.detectChanges();
    }

    getTableEquipments = (params: any) => {
        const { page, pageSize } = params;

        const filteredEquipments = applyFilters(
            this.equipments,
            this.filters
        );

        const newTableData = filteredEquipments.slice(
            page * pageSize,
            (page + 1) * pageSize
        );

        return {
            content: newTableData,
            totalPages: Math.ceil(filteredEquipments.length / pageSize)
        };
    }
}