import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'form-input',
    standalone: true,
    templateUrl: './formInput.component.html',
    styleUrl: './formInput.component.css',
    imports: [
        ReactiveFormsModule,
        CommonModule
    ]
})
export class FormInputComponent {
    @Input("label") label: string = "";
    @Input("name") name: string = "";
    @Input("isTextArea") isTextArea: boolean = false;

    ngOnInit() {
        console.log({
            label: this.label,
            name: this.name,
            isTextArea: this.isTextArea
        })
    }
}