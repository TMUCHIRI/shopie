import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Corrected import
import { ProductDetails } from '../../interfaces/products';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/local-storage-servic.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  basketItems: { product: ProductDetails; quantity: number }[] = [];
  isCartVisible = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket(): void {
    this.basketItems = this.cartService.getItems();
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
    this.loadBasket();
  }

  navigateToCartPage(): void {
    this.isCartVisible = false;
    this.router.navigate(['/cart']);
  }
}