import { Component } from "@angular/core";
import { CommonModule, NgFor } from "@angular/common";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

export const GOOD_COST_DEFAULT_PARAMETER = 60;
export const REGULAR_COST_DEFAULT_PARAMETER = 120;

export const GOOD_RSSI_DEFAULT_PARAMETER = -65;
export const REGULAR_RSSI_DEFAULT_PARAMETER = -75;

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
                {
                    level: "Bom",
                    id: "config-cost-good"
                },
                {
                    level: "Regular",
                    id: "config-cost-regular"
                }
            ]
        },
        {
            name: "Parâmetros RSSI",
            id: "rssi",
            comparison: "maior que",
            options: [
                {
                    level: "Bom",
                    id: "config-rssi-good"
                },
                {
                    level: "Regular",
                    id: "config-rssi-regular"
                }
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
        "config-rssi-good": new FormControl(
            localStorage.getItem("config-rssi-good") ??
            GOOD_RSSI_DEFAULT_PARAMETER
        ),
        "config-rssi-regular": new FormControl(
            localStorage.getItem("config-rssi-regular") ??
            REGULAR_RSSI_DEFAULT_PARAMETER
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