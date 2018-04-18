import { Component, ViewChild, ElementRef } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {PizzaFormPage} from "../pizza-form/pizza-form";

declare var google;

@Component({
  selector: 'page-basket',
  templateUrl: 'basket.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  pizzaFormPage: typeof PizzaFormPage;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public geolocation: Geolocation) {

    this.pizzaFormPage = PizzaFormPage;

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();

    }, (err) => {
      console.log(err);
    });

  }

  addMarker(){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

}
