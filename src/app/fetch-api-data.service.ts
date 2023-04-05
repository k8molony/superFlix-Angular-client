import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-k8molony.vercel.app'
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  // Creates a new user; expects a JSON in the request body
  userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // User logs in
  userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // Get a list of all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http  
      .get(`${apiUrl}/movies`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // // Get a movie by title
  // getMovie(title: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(`${apiUrl}/movies/${title}`, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }

  // // Get Director's info
  // getDirector(directorName: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(`${apiUrl}/movies/directors/${directorName}`, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }

  // // Get genre/series data by name
  // getSeries(seriesName: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(`${apiUrl}/movies/series/${seriesName}`, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }

  // Get user data by username
  getUser(): Observable<any> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // // Get user's favorite movies
  // getFavoriteMovies(): Observable<any> {
  //   const username = localStorage.getItem('user');
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(`${apiUrl}/users/${username}`, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(
  //       map(this.extractResponseData),
  //       map((data) => data.FavoriteMovies),
  //       catchError(this.handleError)
  //     );
  // }

  // Add movie to user favorites
  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .post(`${apiUrl}/users/${username}/movies/${movieId}`, {
        FavoriteMovie: movieId },
        { headers: new HttpHeaders({
          Authorization: 'Bearer ' + token
        })
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Remove a movie from user favorites
  removeFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .delete(`${apiUrl}/users/${username}/movies/${movieId}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token
        })
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Update a user's data
  editUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .put(`${apiUrl}/users/${username}`, updatedUser, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Delete a user's account
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return this.http
      .delete(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Extracts data from HTTP response

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Error handler
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status},` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later');
  }
}
