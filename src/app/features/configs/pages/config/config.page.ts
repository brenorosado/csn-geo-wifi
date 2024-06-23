import { Component } from "@angular/core";
import { CommonModule, NgFor } from "@angular/common";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

export const GOOD_COST_DEFAULT_PARAMETER = 60;
export const REGULAR_COST_DEFAULT_PARAMETER = 120;
export const BAD_COST_DEFAULT_COLOR = "#F08080";
export const REGULAR_COST_DEFAULT_COLOR = "#FFFF00";
export const GOOD_COST_DEFAULT_COLOR = "#90EE90";

export const GOOD_RSSI_DEFAULT_PARAMETER = -65;
export const REGULAR_RSSI_DEFAULT_PARAMETER = -75;
export const BAD_RSSI_DEFAULT_COLOR = "#90EE90";
export const REGULAR_RSSI_DEFAULT_COLOR = "#FFFF00";
export const GOOD_RSSI_DEFAULT_COLOR = "#F08080";

@Component({
    selector: 'config-page',
    standalone: true,
    templateUrl: './config.page.html',
    styleUrl: './config.page.css',
    imports: [
        NgFor,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class ConfigPage {
    configs = [
        {
            name: "Parâmetros de Custo",
            comparison: "menor que",
            id: "cost",
            options: [
                { level: "Bom", id: "config-cost-good" },
                { level: "Regular", id: "config-cost-regular" }
            ]
        },
        {
            name: "Parâmetros RSSI",
            id: "rssi",
            comparison: "maior que",
            options: [
                { level: "Bom", id: "config-rssi-good" },
                { level: "Regular", id: "config-rssi-regular" }
            ]
        }
    ];
    
    formValues = new FormGroup({
        "config-cost-good": new FormControl(
            localStorage.getItem("config-cost-good") ??
            GOOD_COST_DEFAULT_PARAMETER
        ),
        "config-cost-regular": new FormControl(
            localStorage.getItem("config-cost-regular") ??
            REGULAR_COST_DEFAULT_PARAMETER
        ),
        "config-cost-bad-color": new FormControl(
            localStorage.getItem("config-cost-bad-color") ??
            BAD_COST_DEFAULT_COLOR
        ),
        "config-cost-regular-color": new FormControl(
            localStorage.getItem("config-cost-regular-color") ??
            REGULAR_COST_DEFAULT_COLOR
        ),
        "config-cost-good-color": new FormControl(
            localStorage.getItem("config-cost-good-color") ??
            GOOD_COST_DEFAULT_COLOR
        ),
        "config-rssi-good": new FormControl(
            localStorage.getItem("config-rssi-good") ??
            GOOD_RSSI_DEFAULT_PARAMETER
        ),
        "config-rssi-regular": new FormControl(
            localStorage.getItem("config-rssi-regular") ??
            REGULAR_RSSI_DEFAULT_PARAMETER
        ),
        "config-rssi-bad-color": new FormControl(
            localStorage.getItem("config-rssi-bad-color") ??
            BAD_RSSI_DEFAULT_COLOR
        ),
        "config-rssi-regular-color": new FormControl(
            localStorage.getItem("config-rssi-regular-color") ??
            REGULAR_RSSI_DEFAULT_COLOR
        ),
        "config-rssi-good-color": new FormControl(
            localStorage.getItem("config-rssi-good-color") ??
            GOOD_RSSI_DEFAULT_COLOR
        ),
    })

    onSubmit() {
        const data = this.formValues.value;

        Object.keys(data)
            .forEach((key) =>
                // @ts-ignore
                localStorage.setItem(key, data[key] ?? "")
        );
    }
}