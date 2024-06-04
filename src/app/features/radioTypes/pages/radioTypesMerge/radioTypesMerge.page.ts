import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { fetchSystemType } from "../../../../core/services/fetchSystemTypes";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { ActivatedRoute, Router } from "@angular/router";

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
        private router: Router,
        private routeSub: ActivatedRoute
    ) {}
    id: string | number | undefined = "";

    radioTypeForm = new FormGroup({
        description: new FormControl("")
    });

    ngOnInit() {
        this.routeSub.params.subscribe(params => this.initialLoad(params['id'] as string));
    }

    initialLoad = async (id: string) => {
        const fetchedSystemType = await fetchSystemType.getById(id);
        if (fetchedSystemType) {
            this.radioTypeForm.patchValue(fetchedSystemType);
            this.id = id;
        }
    }

    onSubmit = async () => {
        const formValues = this.radioTypeForm.value;

        try {
            const response = await (
                this.id ?
                    fetchSystemType.update(this.id as string, formValues) :
                    fetchSystemType.create(formValues)
            );
            if ([201, 200].includes(response.status)) {
                this.router.navigate(['/tipos-radio']);
            }
        } catch (e) {
            console.log("error", e);
            this.toast.error({
                detail: "Erro",
                summary: `Ocorreu um erro ao ${this.id ? "editar" : "criar"} o tipo de rádio.`,
                duration: 3000
            })
        }
    }
}