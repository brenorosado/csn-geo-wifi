import { Component, Input } from "@angular/core";

@Component({
    selector: 'modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css',
    imports: []
})
export class ModalComponent {
    @Input('title') title: string = "";
    @Input('message') message: string = "";
    @Input('onClose') onClose: Function = () => {}
    @Input('onConfirm') onConfirm: Function = () => {}
}