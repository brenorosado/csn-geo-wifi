import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  mapForm = new FormGroup({
    startAt: new FormControl(),
    endAt: new FormControl(),
    dataType: new FormControl(),
    precision: new FormControl()
  });
  @Input() onSubmitForm: Function = () => {};

  onSubmit () {
    this.onSubmitForm(this.mapForm.value);
  }
}
