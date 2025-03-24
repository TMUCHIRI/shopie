import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Corrected import
import { ProductDetails } from '../../interfaces/products';
import { ProductService } from '../../services/product.service'; // Corrected import
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  basketItems: ProductDetails[] = [];
  isCartVisible: boolean = false;

  constructor(private productService: ProductService, private router: Router) {} // Corrected service

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket(): void {
    this.basketItems = this.productService.getBasket();
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
    this.loadBasket(); // Refresh basket when toggled
  }

  navigateToCartPage(): void {
    this.isCartVisible = false;
    this.router.navigate(['/cart']);
  }
}
