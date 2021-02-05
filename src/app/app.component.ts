import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'News',
      url: '/posts',
      icon: 'newspaper'
    }
  ]
  constructor(private api: ApiService) {}

ngOnInit(){
  this.api.getPages().subscribe( pages => {
    console.log('OnInit Pages Wordpress: ', pages);
    this.appPages = [...this.appPages, ...pages]
  });
}

}
