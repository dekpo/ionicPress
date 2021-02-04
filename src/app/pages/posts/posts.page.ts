import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../services/api.service';
import { LoadingController, PopoverController } from '@ionic/angular';
import { CategoryFilterPage } from '../category-filter/category-filter.page';
import { Router } from '@angular/router';


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
  categoryName = '';
  searchTerm = '';

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private popOver: PopoverController,
    private router: Router) { }

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

    this.api.getPosts( this.page, this.categoryFilter, this.searchTerm ).subscribe( res => {


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
        this.loadPosts();
        // on réinitialise page et totalPages pour infiniteScroll
        this.page = 1;
        this.totalPages = 0;
        // on peut se permettre de récup le nom de la catégorie courante
        this.categoryName = res.data.name;
      }
    })
    await popover.present();
  }

  searchChanged(event){
    this.page = 1;
    this.loadPosts();
  }

  readPost(id){
    this.router.navigateByUrl('/posts/'+ id);
  }

}
