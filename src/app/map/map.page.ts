import { ActivatedRoute } from '@angular/router';
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
    console.log('la ubicacion', this.ubicacion);
    this.loadMap();
  }

  async loadMap() {
    // this.util.showLoading();
    let myLatLng = { lat: -0.1740159, lng: -78.463816299 };
    if (this.ubicacion)
      myLatLng = this.ubicacion;
    else {
      try {
        myLatLng = await this.getLocation();
      } catch (error) {
        console.log('error capturando la geolocalizacion', error);
      }
    }
    const mapEle: HTMLElement = document.getElementById('map');
    // const mapEle: HTMLElement = this.mapElement.nativeElement;
    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

    google.maps.event
      .addListenerOnce(this.mapRef, 'idle', () => {
        console.log('esta listo el mapa');
        this.addMaker(myLatLng.lat, myLatLng.lng);
        setTimeout(async () => {
          await this.util.dismissLoading();
        }, 100);
      });
  }

  addMaker(lat: number, lng: number) {
    this.markerUbicacion = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      draggable: this.ubicacion ? false : true,
      title: 'Ubicación!'
    });
  }

  async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  close() {
    let ubicacionClase;
    /**
     * FIXME: verificar el codigo que captura la ubicacion de un marcador.
     */
    if (!this.ubicacion) {
      ubicacionClase = { lat: this.markerUbicacion.getPosition().lat(), lng: this.markerUbicacion.getPosition().lng() };
      console.log('estas coordenadas para la clase', ubicacionClase);
    }
    this.modalController.dismiss(ubicacionClase);
  }
}
