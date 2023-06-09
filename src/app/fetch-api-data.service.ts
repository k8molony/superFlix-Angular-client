import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-k8molony.vercel.app'

//Decorater that makes this service available everywhere
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  /**
   * POST to the '/users' endpoint of apiUrl to register a new user
   * 
   * @param userDetails 
   * @returns An Observable, which can be subscribed for a response.  The response holds
   * a user object if resolved, or an error object if rejected.
   * @function userRegistration
   */
  userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST to the '/login' endpoint of apiUrl to login a user
   * 
   * @param userDetails 
   * @returns An Observable, which can be subscribed for a response. The response 
   * returns a user object if resolved, or an error object if rejected.  
   */
  userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET request to the '/movies' endpoint of apiUrl to get the full list of movies.
   * 
   * @returns An Observable, which can be subscribed for a response.  The response returns an object
   * holding data of all the movies if resolved, or an error object if rejected.  
   */
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

  /**
   * GET request to the '/users/[Username]' endpoint of apiUrl to get all the data of a specific user
   * 
   * @returns An Observable, which can be subscribed for a response.  The response returns an object
   * holding data of a specific user if resolved, or an error object if rejected. 
   */
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

  /**
   * POST request to the '/users/[Username]/movies/[movieId]' endpoint of apiUrl to add
   * a movie to the user's favorite movie list
   * 
   * @param movieId - the ID number of the added movie 
   * @returns An Observable, which can be subscribed for a response.  The response returns an object
   * holding data of the updated user if resolved, or an error object if rejected.
   */
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

  /**
   * DELETE request to the '/users/[Username]/movies/[movieId]' endpoint of apiUrl to remove a movie
   * from the user's favorite movie list.
   * 
   * @param movieId - the ID number of the deleted movie 
   * @returns An observable which can be subscribed for a response. The response returns an object
   * holding data of the updated user if resolved, or an error object if rejected. 
   */
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

  /**
   * PUT request to the '/users/[Username]' endpoint of apiUrl to update the user's data.
   * 
   * @param updatedUser - an object that holds updated user data 
   * @returns An Observable which can be subscribed for a response. The response returns an object
   * holding data of the updated user if resolved, or an error object if rejected.
   */
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

  /**
   * DELETE request to the '/users/[Username]' endpoint of apiUrl to remove the user's data.
   * 
   * @returns An Observable which can be subscribed for a response. The response returns a message
   * if resolved or an error message if rejected.  
   */
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

  /**
   * Extracts response data from HTTP response
   * 
   * @param res - response from HTTP response 
   * @returns response body or empty object
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Error handler
   * 
   * @param error 
   * @returns error message 
   */
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
