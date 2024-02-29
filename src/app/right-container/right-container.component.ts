import { Component } from '@angular/core';
import { faMeteor,faCircleArrowUp,faCircleArrowDown,faThumbsUp,faThumbsDown,faFaceMeh } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';
@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.css']
})
export class RightContainerComponent {

  weekToday:boolean=false;
  tempStatus:boolean=false;
  Meteor=faMeteor;
  ArrowUp=faCircleArrowUp;
  ArrowDown=faCircleArrowDown;
  ThumbsUp=faThumbsUp;
  ThumbsDown=faThumbsDown;
  FaceMeh=faFaceMeh;
  constructor(public service:WeatherService){}
  dayChange()
  {
    this.weekToday=!this.weekToday;
  }
  tempChangeClick()
  {
     this.tempStatus=!this.tempStatus;
    
  }
}
