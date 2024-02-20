import { AfterViewInit, OnInit, Component } from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import Vector from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import ImageWMS from 'ol/source/ImageWMS';
import Tile from 'ol/layer/Tile';
import * as ol from 'ol';
import ImageLayer from 'ol/layer/Image';
import LayerGroup from 'ol/layer/Group';
import OSM from "ol/source/OSM";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {
  vectorLayer: any;   
  map: Map | undefined;
  vectorTileSource: any;
  vtLayer: any;
  initialCoordinates = [
    [[-43.91519575044, -20.471007400233]],
    [[-43.9377800, -19.9208300]]
  ];
  coordinatesPolygon: any[] = [];

  constructor () {}

  ngOnInit(): void {
    this.coordinatesPolygon = this.initialCoordinates;
  }

  ngAfterViewInit(): void {
    var baseMap = new LayerGroup({
      layers: [
        new Tile({ source: new OSM() })
      ]
    });

    var overlays = new LayerGroup({
      layers: [
        new ImageLayer({
          source: new ImageWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {
              'LAYERS': 'map_test:ne2_hr_lc_sr_w_dr'
            },
            ratio: 1,
            serverType: 'geoserver'
          })
        })
      ]
    })
    
    this.map = new Map({
      target: "map",
      view: new View({
        projection: 'EPSG:4326',
        center: [-43.78611, -20.66028],
        zoom: 12
      })
    });

    this.map.addLayer(baseMap);
    // this.map.addLayer(overlays);

    let polygonStyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 10
      })
    });
    let vectorSource = new VectorSource({ features: [] });
    this.vectorLayer = new Vector({
      source: vectorSource,
      style: [polygonStyle]
    });
    this.addPolygon();
  }

  addPolygon() {
    const geometry = new Polygon(this.coordinatesPolygon).transform("EPSG:4326", this.map?.getView().getProjection());
    this.vectorLayer.getSource().addFeature(new Feature(geometry));
  }
}
