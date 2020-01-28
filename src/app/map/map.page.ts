import { AuthService } from './../servicios/auth.service';
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
  searchDestinationText;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild("searchD", { read: ElementRef }) searchD: ElementRef;

  constructor(public auth: AuthService, private geolocation: Geolocation, public util: UtilService, public modalController: ModalController) { }

  ngOnInit() {
    console.log('la ubicacion recibida', this.ubicacion);
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
      zoom: 15,
      disableDefaultUI: true
    });

    google.maps.event
      .addListenerOnce(this.mapRef, 'idle', () => {
        console.log('esta listo el mapa');
        this.addMaker(myLatLng.lat, myLatLng.lng);
        setTimeout(async () => {
          if(!this.ubicacion)
            this.initAutocomplete();
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

  async close() {
    let ubicacionClase;
    let lugar
    /**
     * FIXME: en el address component []=> buscar el type locality => shortname, si no existe locality utilizar el 0 de address component 
     */
    if (!this.ubicacion) {
      ubicacionClase = { lat: this.markerUbicacion.getPosition().lat(), lng: this.markerUbicacion.getPosition().lng() };
      try {
        console.log(this.markerUbicacion);
        lugar = await this.geocodeTransform(ubicacionClase);
      } catch (error) {
        console.log('error capturando la direccion segun las coordenadas', error);
      }
      this.modalController.dismiss({ coordenadas: ubicacionClase, ubicacion: lugar });
      return
    }
    this.modalController.dismiss();
  }

  async geocodeTransform(location) {

    let to = { latLng: location };
    const geocoder = new google.maps.Geocoder();


    const geocoderQuery = new Promise((resolve, reject) => {
      geocoder.geocode(to, (results, status) => {
        if (status === "OK") {
          let locate;
          console.log('esta el texto ', results);
          locate = results[0].formatted_address;
          return resolve(locate);
        } else {
          console.log("Error - ", results, " & Status - ", status);
          return resolve(status);
        }
      });
    });
    return await geocoderQuery;
  }

  initAutocomplete() {
    let inputElement = this.searchD.nativeElement.getElementsByTagName('input')[0];
    console.log(inputElement);
    let autocomplete = new google.maps.places.Autocomplete(inputElement
      , { componentRestrictions: { country: 'ec' } }
    );
    
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      let place = autocomplete.getPlace();
      console.log(place);
      if (place.geometry.location) {
        console.log(place);
        this.searchDestinationText = place.name;
        const center = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
        this.markerUbicacion.setPosition(center);
        this.mapRef.panTo(center);
      }
    });
  }
}
