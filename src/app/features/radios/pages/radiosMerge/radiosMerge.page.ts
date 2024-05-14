import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

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
    radioForm = new FormGroup({
        description: new FormControl("")
    });

    onSubmit = async () => {

    }
}