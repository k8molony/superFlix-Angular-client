import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: ''};

  constructor(
    private router: Router,
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }
  
  /**
   * login user
   * 
   * @remarks
   * Make API call to login the user. If successful, set the localStorage and close the login dialog.
   * If fail, open snackBar to show error message.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      //Success response
      console.log(result);
      localStorage.setItem('token', result.token);
      localStorage.setItem('username', result.user.Username);

      this.dialogRef.close(); // Close dialog on success
      this.snackBar.open('Login successful!', 'OK', {
        duration: 1000
      });
      this.router.navigate(['movies']);
    }, (response) => {
      // Error response
      console.log('loginUser()failedRes:', response);
      this.snackBar.open(response.message, 'OK', {
        duration: 4000      });
    });
  }
}
