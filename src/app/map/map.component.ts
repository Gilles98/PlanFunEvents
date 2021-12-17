import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {latLng, MapOptions, Map, Marker, tileLayer, icon} from 'leaflet';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input()
  placeAdress: string;

  map: Map;
  mapOptions: MapOptions;


  constructor() {
    this.initializeMapOptions();
  }
test(){
    console.log('heyyyy');
}


  onMapReady(map: Map): void {
    this.map = map;
    this.addSampleMarker();
  }
  ionViewWillEnter() {

  }
  ngOnInit() {
    this.initializeMapOptions();
  }



  private addSampleMarker() {
    const marker = new Marker([51.505, 0])
      .setIcon(
        icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: '../../assets/marker-icon.png'
        }));
    marker.addTo(this.map);
  }

  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(51.505, 0),
      zoom: 12,
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            attribution: 'Map data © OpenStreetMap contributors'
          })
      ],
    };
  }

  private reInitializeMapOptions(lat: number, long: number) {
    this.mapOptions = {
      center: latLng(lat, long),
      zoom: 12,
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            attribution: 'Map data © OpenStreetMap contributors'
          })
      ],
    };
  }

}
