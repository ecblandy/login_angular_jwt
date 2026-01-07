import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userId: any;

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
  }

  logout() {
    this.authService.signOut();
    this.router.navigateByUrl('/');
  }
}
