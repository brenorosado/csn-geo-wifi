import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { formDefaultValues } from '../../../app.component';

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
  @Input() onSubmitForm: Function = () => {};
  @Input() onGenerateKMLFile: Function = () => {};

  mapForm = new FormGroup({
    startAt: new FormControl(formDefaultValues.startAt),
    endAt: new FormControl(formDefaultValues.endAt),
    dataType: new FormControl(formDefaultValues.dataType),
    precision: new FormControl(formDefaultValues.precision.toString())
  });

  onSubmit () {
    this.onSubmitForm(this.mapForm.value);
  }

  onDownloadKMLFile () {
    this.onGenerateKMLFile();
  }
}
