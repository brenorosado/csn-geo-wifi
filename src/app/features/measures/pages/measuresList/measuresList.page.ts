import { ChangeDetectorRef, Component } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { Measure, generateMockedMeasures } from "../../../geomap/utils/generateMockedMeasures";
import { fetchMeasures } from "../../../../core/services/fetchMeasures";
import { FiltersComponent } from "../../../../core/components/filters/filters.component";
import { applyFilters } from "../../../../core/utils/filters";

@Component({
    selector: 'measures-list-page',
    standalone: true,
    templateUrl: './measuresList.page.html',
    styleUrl: './measuresList.page.css',
    imports: [
        DataGridComponent,
        FiltersComponent
    ]
})
export class MeasuresListPage {
    constructor(
        public cdr: ChangeDetectorRef,
    ) {}

    measures: Measure[] = [];
    fetchData: undefined | Function = undefined;

    columns: Column[] = [
        {
            title: "IP",
            dataProp: "ip"
        },
        {
            title: "IPv4",
            dataProp: "ipv4Address"
        },
        {
            title: "Data",
            dataProp: "timestamp",
            customRender: (data) => 
                new Date(data?.timestamp)
                    .toLocaleDateString(
                        "pt-BR",
                        {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit"
                        }
                    )
        },
        {
            title: "Latitude",
            dataProp: "latitude"
        },
        {
            title: "Longitude",
            dataProp: "longitude"
        },
        {
            title: "Altitude",
            dataProp: "altitude"
        },
        {
            title: "RSSI",
            dataProp: "rssi"
        },
        {
            title: "Custo",
            dataProp: "cost"
        }
    ];
    filters: any[] = [];
    filterOptions = this.columns.filter(c => !!c.dataProp);

    async ngOnInit() {
        await this.getMeasures();
        this.fetchData = this.getTableMeasures;
        this.cdr.detectChanges();
    }

    getMeasures = async () => {
        const fetchedMeasures = await fetchMeasures.list();
        this.measures = fetchedMeasures;
    }

    onChangeFilters = (newFilters: any[]) => {
        this.fetchData = undefined;
        this.cdr.detectChanges();
        this.filters = newFilters;
        this.fetchData = this.getTableMeasures;
        this.cdr.detectChanges();
    }

    getTableMeasures = async (params: any) => {
        const { page, pageSize } = params;
        
        const filteredMeasures = applyFilters(
            this.measures,
            this.filters,
        );

        const newTableData = filteredMeasures.slice(
            page * pageSize,
            (page + 1) * pageSize
        );

        return {
            content: newTableData,
            totalPages: Math.ceil(filteredMeasures.length / pageSize)
        };
    }
}