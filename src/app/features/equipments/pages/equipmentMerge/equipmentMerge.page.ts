import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'equipment-merge-page',
    standalone: true,
    templateUrl: './equipmentMerge.page.html',
    styleUrl: './equipmentMerge.page.css',
    imports: [
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class EquipmentMergePage {
    formValues = new FormGroup({
        name: new FormControl(''),
        ip: new FormControl(''),
        type: new FormControl(''),
    })
}