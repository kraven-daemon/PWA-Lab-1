import { Injectable } from '@angular/core';
import { Movie } from '../Movie';
import { HttpClient } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
    apiRoute: string = "";

    randomMovie : Movie[] = [];

  constructor(private http: HttpClient) {
        this.apiRoute = "http://localhost:5555/api/movies";
    }

   getMovies(){
        return this.http.get<Movie>(this.apiRoute);
    }
    addMovie(){ }
}
