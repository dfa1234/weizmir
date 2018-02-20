import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapsAPILoader } from '@agm/core';
import {HttpClient} from "@angular/common/http";
import {} from '@types/googlemaps';

import { FormControl } from '@angular/forms';
import { } from 'googlemaps';

declare var google: any;

interface Flight {
  "Airline": {
    "AirlineId": number,
    "AirlineCode": string,
    "AirlineName": string,
    "Country": string
  },
  "ArrivalAirport": {
    "AirportId": number,
    "AirportName": string,
    "AirportCity":string,
    "AirportCountry": string,
    "IATACode": string,
    "ICAOCode": string,
    "Latitude": number,
    "Longitude": number
  },
  "DepartureAirport": {
    "AirportId": number,
    "AirportName": string,
    "AirportCity": string,
    "AirportCountry": string,
    "IATACode": string,
    "ICAOCode": string,
    "Latitude": number,
    "Longitude": number
  },
  "FlightId": number,
  "carrier": string,
  "FlightNum": number,
  "AirlineId": number,
  "OperationalStartDate": string,
  "OperationalEndDate": string,
  "DepartureAirportId": number,
  "DepartureTime": string,
  "DepartureUTCVariance": string,
  "ArrivalAirportId": number,
  "ArrivalTime": string,
  "ArrivalUTCVariance": string,
  "TotalElapsedMinutes": number,
  "Stops": number,
  "stopCodes": string,
  "Day1": boolean,
  "Day2": boolean,
  "Day3": boolean,
  "Day4": boolean,
  "Day5": boolean,
  "Day6": boolean,
  "Day7": boolean,
  "DaysBits": number,
  "ArrivalDayIndicator": number,
  "flightDistance": string,
  "SSIMcodeShareCarrier": string,
  "codeshareIndicator": string,
  "codeshareInfo": string,
  "Distance": number
}

interface SelectionFlight {
  "Date": Date,
  "ExistFlight": boolean,
  "Flights": Flight[],
  "DateStr": string
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  request = {
    depart:'',
    arrival:'',
    date:new Date()
  };

  myResponses:any = null;

  leave = false;

  //PARIS
  latitude = 48.8566;
  longitude = 2.3522;
  zoom = 5;

  points:any = {
    latDeparture:null,
    lonDeparture:null,
    latAirport1:null,
    lonAirport1:null,
    latAirport2:null,
    lonAirport2:null,
    latAirport3:null,
    lonAirport3:null,
    latArrival:null,
    lonArrival:null
  };


  @ViewChild("searchElementRefDepart")
  public searchElementRefDepart: ElementRef;


  @ViewChild("searchElementRefDestination")
  public searchElementRefDestination: ElementRef;

  constructor(public navCtrl: NavController,
              public ngZone:NgZone,
              private http:HttpClient,
              public mapsAPILoader:MapsAPILoader) {
  }



  ngOnInit(){


    //set current position
    //this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRefDepart.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.points.latDeparture = place.geometry.location.lat();
          this.points.lonDeparture = place.geometry.location.lng();
        });
      });


      let autocompleteDest = new google.maps.places.Autocomplete(this.searchElementRefDestination.nativeElement, {
        types: ["address"]
      });
      autocompleteDest.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocompleteDest.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.points.latArrival = place.geometry.location.lat();
          this.points.lonArrival = place.geometry.location.lng();
        });
      });

    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.points.latDeparture = position.coords.latitude;
        this.points.lonDeparture = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }


  sendRequest(){
    this.leave = true;
    setTimeout(()=>{
      this.leave = false;
    },1000);
    //,this.request

    console.log(this.request);
    //this.http.post('http://localhost:1234', this.request)
    this.http.get('assets/weizmir.json')
      .subscribe(
      res => {
        this.myResponses = res;
        console.log(res)
      }
    );
  }


  selectResponse(flight:Flight,resJson){

    if(!flight){
      return;
    }

    this.points = {
      latDeparture:resJson.DepartLoc.GeoLoc.Latitude,
      lonDeparture:resJson.DepartLoc.GeoLoc.Longitude,
      latAirport1:flight.DepartureAirport.Latitude,
      lonAirport1:flight.DepartureAirport.Longitude,
      latAirport2:flight.ArrivalAirport.Latitude,
      lonAirport2 : flight.ArrivalAirport.Longitude,
      latArrival:resJson.ArrivalLoc.GeoLoc.Latitude,
      lonArrival:resJson.ArrivalLoc.GeoLoc.Longitude,
    };

    this.latitude = (this.points.latAirport1 + this.points.latAirport2) /2;
    this.longitude = (this.points.lonAirport1 + this.points.lonAirport2) /2;
  }

  sortDuration(){
    console.log(this.myResponses);
    this.myResponses.sort((a,b)=>{
      return a.TotalDuration - b.TotalDuration
    });
    console.log(this.myResponses);
  }

  sortDistanceDeparture(){

  }

  sortDistanceArrival(){

  }

  sortCarrier(){

  }

  sortSameCarrier(){

  }


}
