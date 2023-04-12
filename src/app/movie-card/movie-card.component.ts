import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SeriesComponent } from '../series/series.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  movies: any[]=[];
  user: any={};
  favoriteMovies: any[]=[];

  constructor(
    public fetchMovies: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavMovies();
  }

  /**
   * Fetch movies via API
   * @returns an array holding movie objects
   */
  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any)=>{
      this.movies=resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Fetch user info via API and set favoriteMovies variable to FavoriteMovies property of the returned user object
   * @returns an array holding movieIDs
   */
  getFavMovies(): void {
    this.fetchMovies.getUser().subscribe((resp: any)=>{
      this.favoriteMovies=resp.FavoriteMovies;
      console.log(this.favoriteMovies);
      return this.favoriteMovies;
    })
  }

  /**
   * Opens SeriesComponent as a dialog
   * @param name - name of the series
   * @param description - description of the series
   */
  openSeriesDialog(name: string, description: string): void {
    this.dialog.open(SeriesComponent, {
      data: {
        Name: name,
        Description: description
      }
    });
  }

  /**
   * Opens DirectorComponent as a dialog
   * @param name - name of the director
   * @param bio - biography of the director
   * @param birthday - birthday of the director
   */
  openDirectorDialog(name: string, bio: string, birthday: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birthday: birthday
      }
    });
  }

  /**
   * Opens SynopsisComponent as a dialog
   * @param title - title of the movie
   * @param description - description of the movie
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Name: title,
        Description: description
      }
    });
  }

  /**
   * Add/remove a movie from the user's favorite movie list
   * @remarks 
   * Check if the favoriteMovies variable contains the movieID, if no, make API call to add this ID into the
   * user's FavoriteMovie property; if yes, make API call to delete this ID.  After the API call,
   * set the favoriteMovies variable to the updated FavoriteMovies property. Open snackBar to inform.
   * @param id - movieId of the particular movie
   */
  onToggleFavMovie(id: string): void {
    console.log(this.favoriteMovies);
    if(!this.favoriteMovies.includes(id)) {
      this.fetchMovies.addFavoriteMovie(id).subscribe((resp)=>{
        this.favoriteMovies=resp.FavoriteMovies;
        this.snackBar.open('Movie added to favorites!', 'OK', {
          duration: 3000
        })
      }, (resp) => {
        //Error response
        this.snackBar.open(resp.message, 'OK', {
          duration: 4000
        });
      })
    } else {
      this.fetchMovies.removeFavoriteMovie(id).subscribe((resp)=>{
        this.favoriteMovies=resp.FavoriteMovies;
        this.snackBar.open('Movie removed from favorites!', 'OK', {
          duration: 3000
        })
      }, (resp) => {
        //Error response
        this.snackBar.open(resp.message, 'OK', {
          duration: 4000
        });
      })
    }
  }
}
