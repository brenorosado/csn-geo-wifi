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
import LayerGroup from 'ol/layer/Group';
import { MockedMeasuresType } from '../../utils/generateMockedMeasures';
import { gatherCloseMeasures } from '../../utils/handleMeasures';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  goodConnectionsLayer: any;
  regularConnectionsLayer: any;
  badConnectionsLayer: any;
  map: Map | undefined;
  vectorTileSource: any;
  vtLayer: any;

  @Input() measures: Array<MockedMeasuresType> = [];
  @Input() formValues = {
    startAt: null,
    endAt: null,
    dataType: null,
    precision: 0.001
  };

  ngOnInit(): void {}

  ngAfterViewInit() {
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

    let goodConnectionsVectorSource = new VectorSource({features: []});
    let regularConnectionsVectorSource = new VectorSource({features: []});
    let badConnectionsVectorSource = new VectorSource({features: []});

    this.goodConnectionsLayer = new Vector({
      source: goodConnectionsVectorSource,
      style: [goodConnectionStyle]
    });

    this.regularConnectionsLayer = new Vector({
      source: regularConnectionsVectorSource,
      style: [regularConnectionStyle]
    });

    this.badConnectionsLayer = new Vector({
      source: badConnectionsVectorSource,
      style: [badConnectionStyle]
    });

    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({ source: new OSM() }),
        new ImageLayer({
          extent: [-43.976368616, -20.510904917, -43.824099190, -20.410643808],
          source: new ImageWMS({
            url: 'http://localhost:7070/geoserver/wms',
            params: {
              // 'LAYERS': 'ne:world'
              'LAYERS': 'mina_csn:congonhas_2018_2019'
            },
            ratio: 1,
            serverType: 'geoserver',
          }),
        }),
        this.goodConnectionsLayer,
        this.regularConnectionsLayer,
        this.badConnectionsLayer
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
    this.goodConnectionsLayer.getSource().clear();
    this.regularConnectionsLayer.getSource().clear();
    this.badConnectionsLayer.getSource().clear();

    const precision = Number(this.formValues.precision);

    const {
      goodConnectionsCoordinates,
      regularConnectionsCoordinates,
      badConnectionsCoordinates
    } = gatherCloseMeasures(this.measures, precision);

    // const goodConnectionsCoordinates: number[][][] = [];
    // const regularConnectionsCoordinates: number[][][] = [];
    // const badConnectionsCoordinates: number[][][] = [];


    // [
    //   {
    //     checkQuality: (c: number) => c >= 0.8,
    //     array: goodConnectionsCoordinates
    //   },
    //   {
    //     checkQuality: (c: number) => c >= 0.5 && c < 0.8,
    //     array: regularConnectionsCoordinates
    //   },
    //   {
    //     checkQuality: (c: number) => c <= 0.65,
    //     array: badConnectionsCoordinates
    //   }
    // ].forEach(({ checkQuality, array }) => array.push(
    //   ...this.measures.filter(({ connection }) => checkQuality(connection))
    //   .map(({ coordinates }) => [
    //     [coordinates[0] - (precision / 2), coordinates[1] + (precision / 2)],
    //     [coordinates[0] - (precision / 2), coordinates[1] - (precision / 2)],
    //     [coordinates[0] + (precision / 2), coordinates[1] - (precision / 2)],
    //     [coordinates[0] + (precision / 2), coordinates[1] + (precision / 2)]
    //   ])
    // ));

    const goodConnectionsGeometry = new Polygon(goodConnectionsCoordinates)
      .transform('EPSG:4326', this.map?.getView().getProjection());

    const regularConnectionsGeometry = new Polygon(regularConnectionsCoordinates)
      .transform('EPSG:4326', this.map?.getView().getProjection());

    const badConnectionsGeometry = new Polygon(badConnectionsCoordinates)
      .transform('EPSG:4326', this.map?.getView().getProjection());

    this.goodConnectionsLayer.getSource().addFeature(new Feature(goodConnectionsGeometry));
    this.regularConnectionsLayer.getSource().addFeature(new Feature(regularConnectionsGeometry));
    this.badConnectionsLayer.getSource().addFeature(new Feature(badConnectionsGeometry));
  }
}
