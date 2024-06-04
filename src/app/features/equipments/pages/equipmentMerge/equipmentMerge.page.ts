import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { fetchEquipment } from "../../../../core/services/fetchEquipments";
import { fetchSystems } from "../../../../core/services/fetchSystems";

@Component({
    selector: 'equipment-merge-page',
    standalone: true,
    templateUrl: './equipmentMerge.page.html',
    styleUrl: './equipmentMerge.page.css',
    imports: [
        NgToastModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class EquipmentMergePage {
    constructor(
        private toast: NgToastService,
        private router: Router,
        private routeSub: ActivatedRoute
    ) {}
    id: string | number | undefined = "";
    radioOptions: { label: string, value: string }[] = [];

    equipmentForm = new FormGroup({
        sigla: new FormControl(""),
        description: new FormControl("")
    });

    ngOnInit() {
        this.getRadioOptions();
        this.routeSub.params.subscribe(params => this.initialLoad(params['id'] as string));
    }

    getRadioOptions = async () => {
        const fetchedSystemTypes = await fetchSystems.list();
        this.radioOptions = fetchedSystemTypes.map(
            ({ idsystem, description }) => ({
                label: description, value: idsystem
            })
        );
    }

    initialLoad = async (id: string) => {
        const fetchedEquipment = await fetchEquipment.getById(id);
        if (fetchedEquipment) {
            this.equipmentForm.patchValue(fetchedEquipment);
            this.id = id;
        }
    }

    onSubmit = async () => {
        const formValues = this.equipmentForm.value;

        try {
            const response = await (
                this.id ?
                    fetchEquipment.update(this.id as string, formValues) :
                    fetchEquipment.create(formValues)
            );
            if ([201, 200].includes(response.status)) {
                this.router.navigate(['/equipamentos']);
            }
        } catch (e) {
            console.log("error", e);
            this.toast.error({
                detail: "Erro",
                summary: `Ocorreu um erro ao ${this.id ? "editar" : "criar"} o equipamento.`,
                duration: 3000
            })
        }
    }
}