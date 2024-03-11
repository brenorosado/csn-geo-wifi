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
import { MockedMeasuresType } from "../../../app.component";
import ImageLayer from 'ol/layer/Image';
import LayerGroup from 'ol/layer/Group';

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
          // extent: [-13884991, 2870341, -7455066, 6338219],
          source: new ImageWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'clipped_csn:congonhas_2018_2019'},
            // ratio: 1,
            serverType: 'geoserver',
          }),
        }),
        this.goodConnectionsLayer,
        this.regularConnectionsLayer,
        this.badConnectionsLayer
      ],
      view: new View({
        projection: "EPSG:4326",
        center: [-43.891283221587805, -20.49695191169992],
        zoom: 15
      })
    });

    // const overlays = new LayerGroup({
    //   layers: [
    //     new ImageLayer({
    //       source: new ImageWMS({
    //         url: "http://localhost:8080/geoserver/wms",
    //         params: {
    //           "LAYERS": "clipped_csn:congonhas_2018_2019"
    //         },
    //         ratio: 1,
    //         serverType: "geoserver"
    //       })
    //     })
    //   ]
    // });

    // this.map.addLayer(overlays);

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

    const precision = Number(this.formValues.precision)
    const goodConnectionsCoordinates: number[][][] = [];
    const regularConnectionsCoordinates: number[][][] = [];
    const badConnectionsCoordinates: number[][][] = [];

    [
      {
        quality: "good",
        array: goodConnectionsCoordinates
      },
      {
        quality: "regular",
        array: regularConnectionsCoordinates
      },
      {
        quality: "bad",
        array: badConnectionsCoordinates
      }
    ].forEach(({ quality, array }) => array.push(
      ...this.measures.filter(({ connection }) => connection === quality)
      .map(({ coordinates }) => [
        [coordinates[0] - precision, coordinates[1]],
        [coordinates[0], coordinates[1] - precision],
        [coordinates[0] + precision, coordinates[1]],
        [coordinates[0], coordinates[1] + precision]
      ])
    ));

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
