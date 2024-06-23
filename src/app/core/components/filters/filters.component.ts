import { NgFor, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { bootstrapXCircleFill } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from "@ng-icons/core";

@Component({
    selector: 'app-filters',
    standalone: true,
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.css',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgIconComponent,
        NgIf,
        NgFor
    ],
    viewProviders: [
        provideIcons({ bootstrapXCircleFill })
    ],
})
export class FiltersComponent {
    addingFilter: boolean = false;
    @Input("filterOptions") filterOptions: any[] = [];
    @Input("filters") filters: any[] = [];
    @Input("onChangeFilters") onChangeFilters: (d: any[]) => void = () => undefined;

    newFilterForm = new FormGroup({
        field: new FormControl(""),
        value: new FormControl("")
    });

    toggleAddFilter = () => {
        this.addingFilter = !this.addingFilter;
        this.newFilterForm.reset();
    }

    saveNewFilter = () => {
        const formValues = this.newFilterForm.value;
        if (!formValues.field || !formValues.value) return;
        this.onChangeFilters([
            ...this.filters,
            {
                ...formValues,
                label: this.filterOptions.find(({ dataProp }) => dataProp === formValues.field)?.title
            }
        ]);
        this.toggleAddFilter();
    }

    removeFilter = (indexToDelete: number) => {
        this.onChangeFilters(this.filters.filter((_, index) => index !== indexToDelete));
    }
}