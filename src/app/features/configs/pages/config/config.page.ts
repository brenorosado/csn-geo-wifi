import { Component } from "@angular/core";
import { CommonModule, NgFor } from "@angular/common";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

export const HIGH_COST_DEFAULT_PARAMETER = 150;
export const REGULAR_COST_DEFAULT_PARAMETER = 100;

export const HIGH_RSSI_DEFAULT_PARAMETER = -65;
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
                    level: "Alto",
                    id: "config-cost-high"
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
                    level: "Alto",
                    id: "config-rssi-high"
                },
                {
                    level: "Regular",
                    id: "config-rssi-regular"
                }
            ]
        }
    ];
    
    formValues = new FormGroup({
        "config-cost-high": new FormControl(
            localStorage.getItem("config-cost-high") ??
            HIGH_COST_DEFAULT_PARAMETER
        ),
        "config-cost-regular": new FormControl(
            localStorage.getItem("config-cost-regular") ??
            REGULAR_COST_DEFAULT_PARAMETER
        ),
        "config-rssi-high": new FormControl(
            localStorage.getItem("config-rssi-high") ??
            HIGH_RSSI_DEFAULT_PARAMETER
        ),
        "config-rssi-regular": new FormControl(
            localStorage.getItem("config-rssi-regular") ??
            REGULAR_RSSI_DEFAULT_PARAMETER
        ),
    })

    onSubmit() {
        Object.keys(this.formValues.value)
            .forEach((key) =>
                // @ts-ignore
                localStorage.setItem(key, this.formValues.value[key] ?? "")
        );
    }
}