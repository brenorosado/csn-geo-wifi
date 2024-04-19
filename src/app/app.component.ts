import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent, polygonStyleFunction } from './core/components/map/map.component';
import { HeaderComponent } from './core/components/header/header.component';
import { MockedMeasuresType, generateMockedMeasures } from './core/utils/generateMockedMeasures';
import KML from 'ol/format/KML.js';
import Vector from "ol/layer/Vector";
import { Feature } from 'ol';
import {
  DEFAULT_MIN_LATITUDE,
  DEFAULT_MAX_LATITUDE,
  DEFAULT_MIN_LONGITUDE,
  DEFAULT_MAX_LONGITUDE
} from "./core/utils/generateMockedMeasures";
import { NgToastModule, NgToastService } from "ng-angular-popup";

const API_BASE_URL = "http://localhost:4011";
const MEASURES_ENDPOINT = "/mapeamento/buscar-peers/";

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
    NgToastModule,
    RouterOutlet,
    MapComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QGisProject';
  formValues: FormValuesType = formDefaultValues;
  measures: MockedMeasuresType[] = [];
  polygonsLayer: Vector<any> | undefined;
  loadingMeasures: boolean = false;

  constructor(
    private toast: NgToastService,
    public cdr: ChangeDetectorRef,
  ) {}

  onSubmitForm = async (data: any) => {
    this.formValues = {...data};
    await this.fetchMeasures();
    this.cdr.detectChanges();
  }

  onGenerateKMLFile = () => {
    let kmlFormat = new KML({
      extractStyles: true,
      writeStyles: true
    });

    const features: Feature[] = this.polygonsLayer?.getSource().getFeatures({
      extractStyles: true
    });

    features.forEach(feature => feature.setStyle(polygonStyleFunction));
  
    const kmlString = kmlFormat.writeFeatures(features, {
      featureProjection: 'EPSG:4326',
    });

    const blob = new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CSN-${this.formValues.dataType}-${Number(new Date())}.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  updatePolygonsLayer = (newPolygonsLayer: Vector<any>) => {
    this.polygonsLayer = newPolygonsLayer;
  }

  fetchMeasures = async () => {
    try {
      this.loadingMeasures = true;

      const response = await fetch(
        API_BASE_URL + MEASURES_ENDPOINT,
        { method: "POST" }
      );
      
      const fetchedMeasures = await response.json() as MockedMeasuresType[];
      
      this.measures = fetchedMeasures.filter(
        ({ latitude, longitude }) => 
          latitude >= DEFAULT_MIN_LATITUDE &&
        latitude <= DEFAULT_MAX_LATITUDE &&
        longitude >= DEFAULT_MIN_LONGITUDE &&
        longitude <= DEFAULT_MAX_LONGITUDE
      );
      this.loadingMeasures = false;
      this.onSubmitForm(this.formValues);
    } catch (e) {
      this.toast.error({
        position: "bottomRight",
        detail: "Erro",
        summary: "Ocorreu um erro ao buscar as medidas.",
        duration: 3000
      });
    }
  }

  async ngOnInit() {
    await this.fetchMeasures();
  }
}
