import { Observable } from "rxjs"
import { WeatherService } from "../Services/weather.service";
import {inject} from '@angular/core';

export const resolveWeather=()=>
{
    let service=inject(WeatherService);
    return service.resolve;
}