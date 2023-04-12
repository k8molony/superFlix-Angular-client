import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Logout the user. Navigate to the welcome page and clear the localStorage.
   */
  logOut(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
