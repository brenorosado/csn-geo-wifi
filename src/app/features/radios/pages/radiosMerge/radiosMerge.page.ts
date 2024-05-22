import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgToastModule, NgToastService } from "ng-angular-popup";
import { ActivatedRoute, Router } from "@angular/router";
import { fetchSystems } from "../../../../core/services/fetchSystems";

@Component({
    selector: 'radios-merge-page',
    standalone: true,
    templateUrl: './radiosMerge.page.html',
    styleUrl: './radiosMerge.page.css',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
})
export class RadiosMergePage {
    constructor(
        private toast: NgToastService,
        private router: Router,
        private routeSub: ActivatedRoute
    ) {}

    id: string | number | undefined = "";

    radioForm = new FormGroup({
        platform: new FormControl(""),
        uptime: new FormControl(""),
        idle: new FormControl(""),
        running: new FormControl(""),
        bridgeup: new FormControl(""),
        version: new FormControl(""),
        freeMemory: new FormControl(""),
        generateEntropy: new FormControl(""),
        factoryMode: new FormControl(""),
        networkId: new FormControl(""),
        ipv4address: new FormControl(""),
        subnet: new FormControl(""),
        gateway: new FormControl(""),
        dns: new FormControl(""),
        ipv6address: new FormControl(""),
        encapId: new FormControl(""),
        locked: new FormControl(""),
        reboot: new FormControl(""),
        legacyPlatform: new FormControl(""),
        temperature: new FormControl(""),
        isRebooting: new FormControl(""),
        bootCounter: new FormControl(""),
        idsystemtype_fk: new FormControl(""),
        description: new FormControl(""),
    });

    ngOnInit() {
        this.routeSub.params.subscribe(params => this.initialLoad(params['id'] as string));
    }

    initialLoad = async (id: string) => {
        const fetchedSystemType = await fetchSystems.getById(id);
        if (fetchedSystemType) {
            this.radioForm.patchValue(fetchedSystemType);
            this.id = id;
        }
    }

    onSubmit = async () => {
        const formValues = this.radioForm.value;

        const payload = {
            ...formValues,
            uptime: formValues.uptime ? parseFloat(formValues.uptime) : null,
            idle: formValues.idle ? parseFloat(formValues.idle) : null,
            running: formValues.running ? parseInt(formValues.running) : null,
            bridgeup: formValues.bridgeup ? parseInt(formValues.bridgeup) : null,
            freeMemory: formValues.freeMemory ? parseInt(formValues.freeMemory) : null,
            generateEntropy: formValues.generateEntropy ? parseInt(formValues.generateEntropy) : null,
            factoryMode: formValues.factoryMode ? parseInt(formValues.factoryMode) : null,
            networkId: formValues.networkId ? parseInt(formValues.networkId) : null,
            encapId: formValues.encapId ? parseInt(formValues.encapId) : null,
            locked: formValues.locked ? parseInt(formValues.locked) : null,
            reboot: formValues.reboot ? parseInt(formValues.reboot) : null,
            temperature: formValues.temperature ? parseInt(formValues.temperature) : null,
            isRebooting: formValues.isRebooting ? parseInt(formValues.isRebooting) : null,
            bootCounter: formValues.bootCounter ? parseInt(formValues.bootCounter) : null,
        }

        Object.entries(payload).forEach(([key, value]) => {
            // @ts-ignore
            if (value === "") delete payload[key];
        })

        try {
            const response = await (
                this.id ?
                    fetchSystems.update(this.id as string, payload) :
                    fetchSystems.create(payload)
            );
            if ([201, 200].includes(response.status)) {
                this.router.navigate(['/radios']);
            }
        } catch (e) {
            console.log("error", e);
            this.toast.error({
                detail: "Erro",
                summary: "Ocorreu um erro ao criar o rádio.",
                duration: 3000
            })
        }
    }
}