import { Component, inject } from '@angular/core';
import { faMagnifyingGlass,faLocation,faCloud, faRainbow,faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';
import cities from '../../assets/cities.json';
import { resolveWeather } from '../guards/resolve.guard';
import { Router } from '@angular/router';
@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.css'],
  
})
export class LeftContainerComponent {
MagnifyingGlass=faMagnifyingGlass;
Location=faLocation; 
Cloud=faCloud;
Rain=faCloudRain;
cityList=cities;
cityName:string[]=[];
route:Router=inject(Router);
 constructor(public weatherService:WeatherService)
 {
    console.log(this.cityList.cities[0].City.toLowerCase());
 }
 findCity(place:any)
 {
    if(!((place.keyCode>=65&&place.keyCode<=90)||(place.keyCode==8)))
    {
      this.cityName=[];
        return;
    }
    if(place.target.value=='')
    {
      this.cityName=[];
      return;
    }
    this.cityName=[];
    for(let i=0;i<this.cityList.cities.length;i++)
    {
      if((this.cityList.cities[i].City).toLowerCase().startsWith(place.target.value.toLowerCase()))
      {
        this.cityName.push(this.cityList.cities[i].City);
        if(this.cityName.length==4)
        {
          break;
        }
      }
    }
 }
  sendCityName(name:string,place:any)
 {
    this.weatherService.getData(name);
    this.cityName=[];
    place.value=name;
    
 }
}
