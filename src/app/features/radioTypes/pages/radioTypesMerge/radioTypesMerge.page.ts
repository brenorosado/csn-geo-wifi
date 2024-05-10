import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { fetchSystemType } from "../../../../core/services/fetchMeasures";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { Router } from "@angular/router";

@Component({
    selector: 'radio-types-merge-page',
    standalone: true,
    templateUrl: './radioTypesMerge.page.html',
    styleUrl: './radioTypesMerge.page.css',
    imports: [
        NgToastModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class RadioTypesMergePage {
    constructor(
        private toast: NgToastService,
        private router: Router
      ) {}
    

    radioTypeForm = new FormGroup({
        description: new FormControl("")
    });

    onSubmit = async () => {
        const formValues = this.radioTypeForm.value;

        try {

            const response = await fetchSystemType.create(formValues);
            console.log("response", response);
            if ([201, 200].includes(response.status)) {
                this.router.navigate(['/tipos-radio']);
            }
        } catch (e) {
            console.log("error", e);
            this.toast.error({
                // position: "bottomRight",
                detail: "Erro",
                summary: "Ocorreu um erro ao criar o tipo de rádio.",
                duration: 3000
            })
        }
    }
}