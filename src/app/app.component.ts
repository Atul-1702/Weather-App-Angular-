import { Component,OnInit,inject } from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import { WeatherService } from './Services/weather.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Weather-App';
   route:Router=inject(Router);
   weatherService:WeatherService=inject(WeatherService);
   status:boolean=false;
   ngOnInit()
   {
      this.route.events.subscribe((events)=>
      {
        if(events instanceof NavigationStart)
        {
          this.status=true;
        }
        if(events instanceof NavigationEnd)
        {
          this.status=false;
        }
      }
      )
      this.weatherService.status.subscribe((data)=>
      {
        this.status=data;
      }
      )    
   }
}
