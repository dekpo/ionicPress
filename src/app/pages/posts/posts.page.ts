import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../services/api.service';
import { LoadingController } from '@ionic/angular';


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

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController) { }

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
    
    this.api.getPosts( this.page ).subscribe( res => {

      if (infiniteScroll) {
        infiniteScroll.target.complete();
        this.posts = [...this.posts, ...res.posts];

        if (this.page == this.totalPages ) {
          infiniteScroll.target.disabled = true;
        }

      } else {
        this.posts = res.posts;
      }

      this.totalPages = res.pages;
      this.totalPosts = res.totalPosts;
      
      console.log('loadPosts: ', res);

      if (!infiniteScroll) {
      loading.dismiss();
      }
    })
  }

  loadMore( event ){
    this.page++;
    this.loadPosts( event );
  }

}
