import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { formDefaultValues } from '../../pages/map/map.page';
import { CommonModule } from '@angular/common';
import { bootstrapChevronCompactUp } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-header',
  standalone: true,
  viewProviders: [
    provideIcons({
      bootstrapChevronCompactUp
    })
],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showHeader: boolean = true;

  @Input() onSubmitForm: Function = () => {};
  @Input() onGenerateKMLFile: Function = () => {};

  mapForm = new FormGroup({
    startAt: new FormControl(formDefaultValues.startAt),
    endAt: new FormControl(formDefaultValues.endAt),
    dataType: new FormControl(formDefaultValues.dataType),
    precision: new FormControl(formDefaultValues.precision.toString())
  });

  onToggleShowHeader () {
    this.showHeader = !this.showHeader;
  }

  onSubmit () {
    this.onSubmitForm(this.mapForm.value);
  }

  onDownloadKMLFile () {
    this.onGenerateKMLFile();
  }
}
