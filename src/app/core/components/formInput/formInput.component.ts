import { Component, Input } from "@angular/core";


@Component({
    selector: 'form-input',
    standalone: true,
    templateUrl: 'formInput.component.html',
    styleUrl: 'formInput.component.css'
})
export class FormInput {
    @Input('label') label: string = '';
    @Input('placeholder') placeholder: string = '';
}