import { EventEmitter, Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDeatils';
import { WeatherDetails } from '../Models/WeatherDeatils';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentalVariable } from '../Environment/EnvironmentalVariables';
import { TodaysHighlight } from '../Models/TodaysHighlights';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  status:EventEmitter<boolean>=new EventEmitter<boolean>();
  cityName:string='new delhi';
  locationDetails:LocationDetails;
  weatherDetails:WeatherDetails;
  temperatureData:TemperatureData=new TemperatureData();
  todayData:TodayData[]=[];
  weekData:WeekData[]=[];
  highlights:TodaysHighlight=new TodaysHighlight();

  language:string='en-US';
  resolve;
  constructor(private http:HttpClient) { 
     this.getData(this.cityName);
  }
  getImageSummary(summary:string)
  {
     var baseAddress='../../assets/';
     var cloudySunny="cloudyandsunny.png";
     var rainSunny="sunny.png";
     var windy="wind.png";
     var sunny="sun.png";
     var rainy="rainy-day.png";
     if(summary.includes('Partly Cloudy')||summary.includes('P Cloudy'))
     {
        return baseAddress+cloudySunny;
     }
     else
     {
      if(summary.includes('Partly Rainy')||summary.includes('P Rainy'))
      {
        return baseAddress+rainSunny;
      }
     else
     {
       if(summary.includes('wind'))
       {
          return baseAddress+windy;
       }
       else
       {
        if(summary.includes('rain'))
        {
           return baseAddress+rainy;
        }
        else
        {
          if(summary.includes('sun'))
          {
             return baseAddress+sunny;
          }
        }
       }
     }
     }
     return baseAddress+cloudySunny;
  }
  fillTemperatureData()
  {
    var currentTime=new Date();
    this.temperatureData.day=this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time=String(currentTime.getHours()).padStart(2,'0')+":"+String(currentTime.getMinutes()).padStart(2,'0');
    this.temperatureData.temperature=this.weatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.rainPercent=this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.summaryPhrase=this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.location=this.locationDetails.location.city[0]+','+this.locationDetails.location.country[0];
    this.temperatureData.summaryImage=this.getImageSummary(this.temperatureData.summaryPhrase);
  }
  fillWeekData()
  {
    let weekCount=0;
    let weekContainer:WeekData;
    this.weekData=[];
    while(weekCount<7)
    {
      weekContainer=new WeekData()
       weekContainer.day=this.weatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0,3);
       weekContainer.tempMax=this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
       weekContainer.tempMin=this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
       weekContainer.summaryImage=this.getImageSummary(this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]);
       this.weekData.push(weekContainer);
       weekCount++;
    }
  }
  fillTodayData()
  {
    let todayCount=0;
    let todayContainer:TodayData=new TodayData();
    this.todayData=[];
    while(todayCount<7)
    {
      todayContainer=new TodayData();
      todayContainer.time=this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11,16);
      todayContainer.temp=this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];
      todayContainer.summaryImage=this.getImageSummary(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
      this.todayData.push(todayContainer);
      todayCount++;
    }
  }
  fillTodayHighlights()
  {
     this.highlights.airQuality=this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
     this.highlights.humidity=this.weatherDetails['v3-wx-observations-current'].precip24Hour;
     this.highlights.sunrise=this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal.slice(11,16);
     this.highlights.sunset=this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal.slice(11,16);
     this.highlights.uvIndex=this.weatherDetails['v3-wx-observations-current'].uvIndex;
     this.highlights.visibility=this.weatherDetails['v3-wx-observations-current'].visibility;
     this.highlights.windStatus=this.weatherDetails['v3-wx-observations-current'].windSpeed;
    }
 prepareData()
 {
     this.fillTemperatureData();
     this.fillWeekData();   
     this.fillTodayData();
     this.fillTodayHighlights();
     console.log(this.temperatureData);
     console.log(this.weekData);
     console.log(this.todayData);
     console.log(this.highlights);
 }
  getLocationDetails(cityName:string,language:string)  
  {
          this.resolve=this.http.get(EnvironmentalVariable.weatherApiLocationBaseURL,{
            headers:new HttpHeaders()
            .set(EnvironmentalVariable.xRapidApiKeyName,EnvironmentalVariable.xRapidApiKeyValue)
            .set(EnvironmentalVariable.xRapidApiHostName,EnvironmentalVariable.xRapidApiHostValue),
            params:new HttpParams()
            .set('query',cityName)
            .set('language',language)
          });
          return this.resolve;
  }
  getWeatherReport(date:string,latitude:number,longitude:number,language:string,units:string)
  {
    this.resolve=this.http.get(EnvironmentalVariable.weatherApiForecastBaseURL,{
      headers:new HttpHeaders()
      .set(EnvironmentalVariable.xRapidApiKeyName,EnvironmentalVariable.xRapidApiKeyValue)
      .set(EnvironmentalVariable.xRapidApiHostName,EnvironmentalVariable.xRapidApiHostValue),
      params:new HttpParams()
      .set('date',date)
      .set('latitude',latitude)
      .set('longitude',longitude)
      .set('language',language)
      .set('units',units)
    });
    return this.resolve;
  }
   getData(name:string)
   {
      var latitude;
      var longitude;
      var date="20200622";
      this.cityName=name;
      this.resolve=this.getLocationDetails(this.cityName,this.language);
      this.status.emit(true);
      this.resolve.subscribe((response:any)=>
      {
         this.locationDetails=response;
         latitude=response.location.latitude[0];
         longitude=response.location.longitude[0];
         this.getWeatherReport(date,latitude,longitude,this.language,'m').subscribe((response:any)=>
         {
             this.weatherDetails=response;
             this.prepareData();
             this.status.emit(false);
         })
      }
      )
       
   }
}
