import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { MapPage } from './features/geomap/pages/map/map.page';

export type FormValuesType = {
  startAt: string | null,
  endAt: string | null,
  dataType: "custo" | "rssi",
  precision: string
}

export const formDefaultValues: FormValuesType = {
  startAt: "2019-01-01T00:00",
  endAt: "2023-12-31T23:59",
  dataType: "custo",
  precision: "0.001"
}

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MapPage
  ],
  templateUrl: './app.component.html'
})
export class AppComponent { }
