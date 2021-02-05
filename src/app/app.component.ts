import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
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
    },
    {
      title: 'Account',
      url: '/account',
      icon: 'person'
    }
  ]
  constructor(private api: ApiService,
    private oneSignal: OneSignal,
    private router: Router) {
      this.setupPush();
    }

ngOnInit(){
  this.api.getPages().subscribe( pages => {
    console.log('OnInit Pages Wordpress: ', pages);
    this.appPages = [...this.appPages, ...pages]
  });
}

setupPush(){
this.oneSignal.startInit('91b4aa56-8b6b-46fe-9bb4-30add7e79dd1', '894975886561');

this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

this.oneSignal.handleNotificationReceived().subscribe(() => {
 // do something when notification is received
});

this.oneSignal.handleNotificationOpened().subscribe(() => {
  this.router.navigateByUrl('/posts/');
  // do something when a notification is opened
});

this.oneSignal.endInit();
}

}
