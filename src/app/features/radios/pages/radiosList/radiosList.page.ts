import { Component } from "@angular/core";
import { Column, DataGridComponent } from "../../../../core/components/dataGrid/dataGrid.component";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'radios-list-page',
    standalone: true,
    templateUrl: './radiosList.page.html',
    styleUrl: './radiosList.page.css',
    imports: [
        DataGridComponent,
        RouterLink,
        RouterLinkActive
    ]
})
export class RadiosListPage {
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
            title: "Uptime",
            dataProp: "uptime",
        },
        {
            title: "Idle",
            dataProp: "idle",
        },
        {
            title: "Running",
            dataProp: "running",
        },
        {
            title: "Bridgeup",
            dataProp: "bridgeup",
        },
        {
            title: "Versão",
            dataProp: "version",
        },
        {
            title: "Memória libre",
            dataProp: "freeMemory",
        },
        {
            title: "Generate Entropy",
            dataProp: "generateEntropy",
        },
        {
            title: "Factory Mode",
            dataProp: "factoryMode",
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
            title: "subnet",
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
            title: "encapId",
            dataProp: "encapId",
        },
        {
            title: "locked",
            dataProp: "locked",
        },
        {
            title: "reboot",
            dataProp: "reboot",
        },
        {
            title: "legacyPlatform",
            dataProp: "legacyPlatform",
        },
        {
            title: "temperature",
            dataProp: "temperature",
        },
        {
            title: "isRebooting",
            dataProp: "isRebooting",
        },
        {
            title: "bootCounter",
            dataProp: "bootCounter",
        },
        {
            title: "idsystemtype_fk",
            dataProp: "idsystemtype_fk",
        },
        {
            title: "idequipament_fk",
            dataProp: "idequipament_fk",
        }
    ];
    fetchData = undefined;
}