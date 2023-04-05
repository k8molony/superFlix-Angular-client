import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  initialInput: any = {};
  @Input() updatedUser = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user={
        ...resp,
        Birthday: new Date(resp.Birthday).toLocaleDateString()
      };
      return this.user;
    })
  }

  updateUserInfo(): void {
    this.fetchApiData.editUser(this.updatedUser).subscribe((result) => {
      // Logic for a successful user registration goes here! (To be implemented)
      localStorage.setItem('username', result.Username);
      this.snackBar.open('Your profile is updated successfully!', 'OK', {
        duration: 4000
      });
      window.location.reload();
    }, (result) => {
      this.snackBar.open(result.errors[0].msg, 'OK', {
        duration: 6000
      });
    });
  }
  // updateUserInfo(): void {
  //   this.fetchApiData.editUser(this.updatedUser).subscribe((result) => {
  //     console.log(result);
  //     this.snackBar.open('User profile successfully updated', 'OK', {
  //       duration: 2000,
  //     });
  //     if (this.user.Username !== result.Username) {
  //       localStorage.clear();
  //       this.router.navigate(['welcome']);
  //       this.snackBar.open(
  //         'User profile successfully updated. Please login using your new credentials',
  //         'OK',
  //         {
  //           duration: 2000,
  //         }
  //       );
  //     }
  //   });
  // }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}
