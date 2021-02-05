import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-wp-page',
  templateUrl: './wp-page.page.html',
  styleUrls: ['./wp-page.page.scss'],
})
export class WpPagePage implements OnInit {
  page = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Wp Page Id:',id);
    this.api.getPageContent(id).subscribe( res => {
      this.page = res;
    })
  }

}
