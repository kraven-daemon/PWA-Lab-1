import { Component, OnInit } from '@angular/core';
import { Movie } from "./Movie";
import { MovieService } from './services/movie.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    movies: Movie[] = [];

    constructor(private movieService: MovieService) {
    }

    ngOnInit(): void {
        this.movieService.getMovies()
            .subscribe((data: any) => {
                // console.log(data)
                this.movies = data;
            })
    }


}
