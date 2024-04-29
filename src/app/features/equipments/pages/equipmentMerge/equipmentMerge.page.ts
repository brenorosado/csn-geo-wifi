import { Component } from "@angular/core";
import { FormInput } from "../../../../core/components/formInput/formInput.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'equipment-merge-page',
    standalone: true,
    templateUrl: './equipmentMerge.page.html',
    styleUrl: './equipmentMerge.page.css',
    imports: [
        FormInput,
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