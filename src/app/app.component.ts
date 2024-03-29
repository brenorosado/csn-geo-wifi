import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent, polygonStyleFunction } from './core/components/map/map.component';
import { HeaderComponent } from './core/components/header/header.component';
import { MockedMeasuresType, generateMockedMeasures } from './core/utils/generateMockedMeasures';
import KML from 'ol/format/KML.js';
import Vector from "ol/layer/Vector";
import { Feature } from 'ol';

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
  imports: [RouterOutlet, MapComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QGisProject';
  formValues: FormValuesType = formDefaultValues;
  measures: MockedMeasuresType[] = [];
  polygonsLayer: Vector<any> | undefined;

  constructor(public cdr: ChangeDetectorRef) {}

  onSubmitForm = (data: any) => {
    let newMeasures = [...this.measures];

    if (data?.startAt)
      newMeasures = new Array(
        ...newMeasures.filter(
          ({ timestamp }) => 
            Number(new Date(timestamp)) >= 
            Number(new Date(data.startAt))
        )
      );

    if (data?.endAt)
      newMeasures = new Array(
        ...newMeasures.filter(
          ({ timestamp }) =>
            Number(new Date(timestamp)) <=
            Number(new Date(data.endAt))
        )
      );

    this.formValues = {...data};
    this.measures = new Array(...newMeasures);
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
    a.download = `CSN-${Number(new Date())}.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
   }

  updatePolygonsLayer = (newPolygonsLayer: Vector<any>) => {
    this.polygonsLayer = newPolygonsLayer;
  }

  ngOnInit() {
    this.measures = generateMockedMeasures({});
  }
}
