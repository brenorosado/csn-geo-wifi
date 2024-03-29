import { AfterViewInit, OnInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageWMS from 'ol/source/ImageWMS.js';
import VectorSource from "ol/source/Vector";
import Vector from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import OSM from "ol/source/OSM";
import ImageLayer from 'ol/layer/Image';
import { MockedMeasuresType } from '../../utils/generateMockedMeasures';
import { gatherCloseMeasures } from '../../utils/handleMeasures';
import { formDefaultValues, FormValuesType } from '../../../app.component';

const goodConnectionStyle = new Style({
  fill: new Fill({
    color: "lightgreen"
  }),
  stroke: new Stroke({
    color: "green",
    width: 1
  })
});

const regularConnectionStyle = new Style({
  fill: new Fill({
    color: "lightyellow"
  }),
  stroke: new Stroke({
    color: "yellow",
    width: 1
  })
});

const badConnectionStyle = new Style({
  fill: new Fill({
    color: "lightcoral"
  }),
  stroke: new Stroke({
    color: "red",
    width: 1
  })
});

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  polygonsLayer: Vector<any> | undefined;
  map: Map | undefined;

  @Input() updatePolygonsLayer: undefined | ((m: Vector<any>) => void);
  @Input() measures: Array<MockedMeasuresType> = [];
  @Input() formValues: FormValuesType = formDefaultValues;

  ngOnInit(): void {}

  ngAfterViewInit() {
    let goodConnectionsVectorSource = new VectorSource({features: []});

    this.polygonsLayer = new Vector({
      source: goodConnectionsVectorSource,
      style: (feature) => {
        const qualityClassification = feature.get('qualityClassification');
        
        if (qualityClassification === "good")
          return goodConnectionStyle;

        if (qualityClassification === "regular")
          return regularConnectionStyle;

        return badConnectionStyle;
      }
    });

    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({ source: new OSM() }),
        new ImageLayer({
          extent: [-43.976368616, -20.510904917, -43.824099190, -20.410643808],
          source: new ImageWMS({
            projection: "EPSG:4326",
            url: 'http://localhost:7070/geoserver/wms',
            params: {
              // 'LAYERS': 'ne:world'
              'LAYERS': 'mina_csn:congonhas_2018_2019'
            },
            ratio: 1,
            serverType: 'geoserver',
          }),
        }),
        this.polygonsLayer,
      ],
      view: new View({
        projection: "EPSG:4326",
        extent: [-43.976368616, -20.510904917, -43.824099190, -20.410643808],
        center: [-43.900233903, -20.9607743625],
        zoom: 13
      })
    });

    this.addPolygons();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.measures = changes['measures'].currentValue;
    this.formValues = {
      ...changes['formValues'].currentValue,
      precision: Number(changes['formValues'].currentValue.precision)
    };

    this.addPolygons()
  }

  addPolygons() {
    this?.polygonsLayer?.getSource()?.clear();

    const precision = Number(this.formValues.precision);
    const dataType = this.formValues.dataType;

    const {
      goodCoordinates,
      regularCoordinates,
      badCoordinates
    } = gatherCloseMeasures(this.measures, precision, dataType);

    [
      badCoordinates,
      regularCoordinates,
      goodCoordinates
    ].forEach((coordinates, index) => {
      const measuresGeometry = new Polygon(coordinates)
        .transform('EPSG:4326', this.map?.getView().getProjection());
      
      const polygonsFeatures = new Feature(measuresGeometry);
      
      polygonsFeatures.setProperties({
        qualityClassification: ['bad', 'regular', 'good'][index]
      });
      
      this.polygonsLayer
        ?.getSource()
        ?.addFeature(polygonsFeatures);
    });

    if (this.updatePolygonsLayer && this.polygonsLayer)
      this.updatePolygonsLayer(this.polygonsLayer);
  }
}
