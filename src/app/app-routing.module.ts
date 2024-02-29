import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { resolveWeather } from './guards/resolve.guard';

const routes: Routes = [
  {path:'',redirectTo:'weather-info',pathMatch:'full'},
  {path:'weather-info',component:WeatherComponent,resolve:{data:resolveWeather}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
