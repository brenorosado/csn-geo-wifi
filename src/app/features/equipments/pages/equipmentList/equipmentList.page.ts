import { Component, Input } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { RouterLink, RouterLinkActive } from "@angular/router";

const mockedData = [
    {
        id: 1,
        name: "Equipamento 1",
        type: "FIXED",
        ip: "237.84.2.178"
    }, 
    {
        id: 2,
        name: "Equipamento 2",
        type: "MOBILE",
        ip: "237.84.2.178"
    }, 
    {
        id: 3,
        name: "Equipamento 3",
        type: "MOBILE",
        ip: "237.84.2.178"
    },
    {
        id: 4,
        name: "Equipamento 4",
        type: "FIXED",
        ip: "237.84.2.178"
    }, 
    {
        id: 5,
        name: "Equipamento 5",
        type: "FIXED",
        ip: "237.84.2.178"
    }, 
    {
        id: 6,
        name: "Equipamento 6",
        type: "MOBILE",
        ip: "237.84.2.178"
    }
]

@Component({
    selector: 'equipment-list-page',
    imports: [
        DataGridComponent,
        RouterLink,
        RouterLinkActive
    ],
    standalone: true,
    templateUrl: './equipmentList.page.html',
    styleUrl: './equipmentList.page.css'
})
export class EquipmentListPage {
    columns: Column[] = [
        {
            title: "ID",
            dataProp: "id"
        },
        {
            title: "Tipo",
            dataProp: "type"
        },
        {
            title: "Nome",
            dataProp: "name"
        },
        {
            title: "IP",
            dataProp: "ip"
        }
    ]

    fetchData = () => mockedData;
}