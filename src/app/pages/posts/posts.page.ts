import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../services/api.service';
import { LoadingController, PopoverController } from '@ionic/angular';
import { CategoryFilterPage } from '../category-filter/category-filter.page';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  page = 1;
  posts = [];
  totalPosts = 0;
  totalPages = 0
  categoryFilter = null;

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private popOver: PopoverController) { }

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts( infiniteScroll = null ){
    // on définit le loading
    let loading = null;
    if (!infiniteScroll) {
      // lancement du loading si on a pas infiniteScroll
    loading = await this.loadingCtrl.create({
      message: 'Loading posts...'
    });
    await loading.present();
    } 

    this.api.getPosts( this.page, this.categoryFilter ).subscribe( res => {


      if (infiniteScroll) {

        
        this.posts = [...this.posts, ...res.posts];
        infiniteScroll.target.complete();
        
        // condition inutile remplacée par *ngIf sur l'infiniteScroll
        /* if (this.page == this.totalPages ) {
          infiniteScroll.target.complete();
        }  */

      } else {
        this.posts = res.posts;
      }

      this.totalPages = res.pages;
      this.totalPosts = res.totalPosts;
      
      console.log('loadPosts: ', res);
      console.log('this.page: ', this.page);
      console.log('categoryFilter: ',this.categoryFilter);
      console.log('infiniteScroll: ',infiniteScroll);


    }, err => {
      console.log('loadPosts ERROR !', err );
    }, () => {
      if (!infiniteScroll) {
        loading.dismiss();
        }  
    })
  }

  loadMore( event ){
    this.page++;
    this.loadPosts( event );
  }

  async openFilter(event){
    const popover = await this.popOver.create({
      component: CategoryFilterPage,
      event: event,
      translucent: false,
      componentProps: {
        selected: this.categoryFilter
      }
    });
    popover.onDidDismiss().then( res => {
      console.log('after popOver: ', res);
      if (res && res.data) {
        this.categoryFilter = res.data.id;
        this.page = 1;
        this.totalPages = 0;
        this.loadPosts();
      }
    })
    await popover.present();
  }

}
