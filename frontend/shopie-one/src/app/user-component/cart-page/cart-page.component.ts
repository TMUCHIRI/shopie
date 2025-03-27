import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetails } from '../../interfaces/products';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/local-storage-servic.service'; // Use CartService

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  basketItems: { product: ProductDetails; quantity: number }[] = []; // Update type to match CartService
  isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService, // Replace ProductService with CartService
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.basketItems = this.cartService.getItems(); // Use CartService to fetch items
    this.isLoggedIn = !!this.authService.getToken();
  }

  checkout(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { state: { fromCart: true } });
    } else {
      console.log('Proceeding to checkout with items:', this.basketItems);
      // Example: Submit order to backend here if needed
      this.cartService.clearCart(); // Clear cart after checkout
      this.router.navigate(['/user/checkout']);
    }
  }
}