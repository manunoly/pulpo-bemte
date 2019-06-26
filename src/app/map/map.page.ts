import { ModalController } from '@ionic/angular';
import { UtilService } from './../servicios/util.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})

export class MapPage implements OnInit {
  mapRef = null;
  markerUbicacion;
  ubicacion;
  @ViewChild('map') mapElement: ElementRef;

  constructor(private geolocation: Geolocation, public util: UtilService, public modalController: ModalController) { }

  ngOnInit() {
    console.log(this.ubicacion);
    this.loadMap();
  }

  async loadMap() {
    this.util.showLoading();
    let myLatLng
    try {
      myLatLng = await this.getLocation();
    } catch (error) {
    }

    const mapEle: HTMLElement = document.getElementById('map');
    // const mapEle: HTMLElement = this.mapElement.nativeElement;
    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    google.maps.event
      .addListenerOnce(this.mapRef, 'idle', () => {
        this.addMaker(myLatLng.lat, myLatLng.lng);
        this.util.dismissLoading();
      });
  }

  private addMaker(lat: number, lng: number) {
    this.markerUbicacion = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      title: 'Ubicación!'
    });
  }

  private async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  close() {
    this.modalController.dismiss();
  }
}
