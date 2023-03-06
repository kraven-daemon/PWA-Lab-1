import { Component, OnInit } from '@angular/core';
import { Film } from './film';
import './film.ts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isOnline: boolean;
  movies: Film[];

  constructor() {
    this.isOnline = false;
    this.movies = [];
  }

  public ngOnInit(): void {
    this.updateOnlineStatus();

    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));


     if(window.navigator.onLine){
        // this.fetchMovies()
    }

  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  private fetchMovies = async() => {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data);
    }
}
