import { ChangeDetectorRef, Component } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { ModalComponent } from "../../../../core/components/modal/modal.component";
import { fetchSystems } from "../../../../core/services/fetchSystems";
import { NgIf } from "@angular/common";
import { fetchSystemType } from "../../../../core/services/fetchSystemTypes";
import { fetchEquipment } from "../../../../core/services/fetchEquipments";
import { FiltersComponent } from "../../../../core/components/filters/filters.component";
import { applyFilters } from "../../../../core/utils/filters";

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
        ModalComponent,
        FiltersComponent,
        NgIf
    ]
})
export class RadiosListPage {
    idToDelete: string | number | undefined = "";
    systems: any[] = [];
    fetchData: undefined | Function = undefined;
    radioTypeOptions: { label: string, value: string }[] = [];
    equipmentOptions: { label: string, value: string }[] = [];
    columns: Column[] = [
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
            title: "IPv4",
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
            title: "IPv6",
            dataProp: "ipv6address",
        },
        {
            title: "Tipo de rádio",
            dataProp: "idsystemtype_fk",
            customRender: ({ idsystemtype_fk }) =>
                this.radioTypeOptions.find(({ value }) => Number(value) === Number(idsystemtype_fk))?.label
                ?? "-"
        },
        {
            title: "Equipamento",
            dataProp: "idequipament_fk",
            customRender: ({ idequipament_fk }) =>
                this.equipmentOptions.find(({ value }) => Number(value) === Number(idequipament_fk))?.label
                ?? "-"
        },
        {
            title: "Ações",
            dataProp: "",
            isActions: true,
            onDelete: (data) => this.idToDelete = data.idsystem,
            onEdit: (data) => this.router.navigate([`/radios/${data.idsystem}`]),
        }
    ];
    filters: any[] = [];
    filterOptions = this.columns.filter(c => !!c.dataProp);

    constructor(
        public cdr: ChangeDetectorRef,
        private toast: NgToastService,
        private router: Router
    ) {}

    async ngOnInit() {
        await Promise.all([
            this.getSystems(),
            this.getRadioTypeOptions(),
            this.getEquipmentOptions()
        ]);
        this.fetchData = this.getTableSystems;
        this.cdr.detectChanges();
    }

    getRadioTypeOptions = async () => {
        const fetchedSystemTypes = await fetchSystemType.list();
        this.radioTypeOptions = fetchedSystemTypes.map(
            ({ idsystemtype, description }) => ({
                label: description, value: idsystemtype
            })
        );
    }

    getEquipmentOptions = async () => {
        const fetchedEquipmentOptions = await fetchEquipment.list();
        this.equipmentOptions = fetchedEquipmentOptions.map(
            ({ idequipament, equipament }) => ({
                label: equipament, value: idequipament
            })
        );
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
                    (systemType) => systemType.idsystem === this.idToDelete
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
                summary: "Ocorreu um erro ao excluir o rádio.",
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
                summary: "Ocorreu um erro ao buscar os rádios.",
                duration: 3000
            });
        }
    }

    onChangeFilters = (newFilters: any[]) => {
        this.fetchData = undefined;
        this.cdr.detectChanges();
        this.filters = newFilters;
        this.fetchData = this.getTableSystems;
        this.cdr.detectChanges();
    }

    getTableSystems = (params: any) => {
        const { page, pageSize } = params;
        
        const filteredTableSystems = applyFilters(
            this.systems,
            this.filters,
            [
                { field: "idsystemtype_fk", list: this.radioTypeOptions },
                { field: "idequipament_fk", list: this.equipmentOptions }
            ]
        );

        const newTableData = filteredTableSystems.slice(
            page * pageSize,
            (page + 1) * pageSize
        );

        return {
            content: newTableData,
            totalPages: Math.ceil(filteredTableSystems.length / pageSize)
        };
    }
}