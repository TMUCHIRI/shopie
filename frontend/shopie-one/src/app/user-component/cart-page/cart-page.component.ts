import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetails } from '../../interfaces/products';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  basketItems: ProductDetails[] = [];
  isLoggedIn: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.basketItems = this.productService.getBasket();
    this.isLoggedIn = !!this.authService.getToken(); // Check if token exists
  }

  checkout(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { state: { fromCart: true } });
    } else {
      // For logged-in users, proceed with checkout (e.g., send to backend)
      console.log('Proceeding to checkout with items:', this.basketItems);
      // Example: this.productService.submitOrder(this.basketItems).subscribe(...);
      // Clear basket after successful checkout if desired
      this.productService.clearBasket();
      this.router.navigate(['/user/checkout']); // Placeholder route
    }
  }
}