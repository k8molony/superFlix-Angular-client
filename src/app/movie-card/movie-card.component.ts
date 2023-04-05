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

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any)=>{
      this.movies=resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getFavMovies(): void {
    this.fetchMovies.getUser().subscribe((resp: any)=>{
      this.favoriteMovies=resp.FavoriteMovies;
      console.log(this.favoriteMovies);
      return this.favoriteMovies;
    })
  }

  openSeriesDialog(name: string, description: string): void {
    this.dialog.open(SeriesComponent, {
      data: {
        Name: name,
        Description: description
      }
    });
  }

  openDirectorDialog(name: string, bio: string, birthday: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birthday: birthday
      }
    });
  }

  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Name: title,
        Description: description
      }
    });
  }

  onToggleFavMovie(id: string): void {
    console.log(this.favoriteMovies);
    if(!this.favoriteMovies.includes(id)) {
      this.fetchMovies.addFavoriteMovie(id).subscribe((resp)=>{
        this.favoriteMovies=resp.FavoriteMovies;
        this.snackBar.open('Movie added to favorites!', 'OK', {
          duration: 3000
        })
      }, (resp) => {
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
        this.snackBar.open(resp.message, 'OK', {
          duration: 4000
        });
      })
    }
  }
}
