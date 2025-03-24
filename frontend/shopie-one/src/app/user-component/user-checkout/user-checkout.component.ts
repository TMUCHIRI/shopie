import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductDetails } from '../../interfaces/products'; // Assuming this is your product interface
import { CheckoutDetails, OrderDetails } from '../../interfaces/order';
import { ProductsService } from '../../services/products.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-checkout',
  standalone: true,
  imports: [CommonModule], // Add other imports if needed (e.g., UserNavbarComponent)
  templateUrl: './user-checkout.component.html',
  styleUrls: ['./user-checkout.component.css']
})
export class UserCheckoutComponent implements OnInit {
  items: { product: ProductDetails; quantity: number }[] = [];
  userId: string | null = null;
  showConfirmationModal: boolean = false;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(
    private productsService: ProductsService, // Use ProductsService instead of CartService
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { state: { fromCheckout: true } });
    } else {
      this.userId = localStorage.getItem('user_id');
      this.loadCartItems();
    }
  }

  loadCartItems(): void {
    const basketItems = this.productsService.getBasket();
    // Map basket items to include quantity (default to 1 if not tracked)
    this.items = basketItems.map(item => ({
      product: item,
      quantity: 1 // Adjust if you want to track quantity in local storage
    }));
  }

  confirmCheckout(): void {
    if (this.items.length === 0) {
      this.showErrorMessage = true;
      setTimeout(() => {
        this.showErrorMessage = false;
      }, 3000);
    } else {
      this.showConfirmationModal = true;
    }
  }

  cancel(): void {
    this.showConfirmationModal = false;
  }

  removeItem(productId: string): void {
    const updatedBasket = this.productsService.getBasket().filter(item => item.product_id !== productId);
    localStorage.setItem('basket', JSON.stringify(updatedBasket));
    this.loadCartItems();
  }

  increaseQuantity(productId: string): void {
    const item = this.items.find(i => i.product.product_id === productId);
    if (item) {
      item.quantity++;
      this.updateLocalStorage();
    }
  }

  decreaseQuantity(productId: string): void {
    const item = this.items.find(i => i.product.product_id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.updateLocalStorage();
    }
  }

  placeOrder(): void {
    this.showConfirmationModal = false;
    this.showSuccessMessage = true;

    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);

    const orderItems: OrderDetails[] = this.items.map(item => ({
      product_id: item.product.product_id,
      product_name: item.product.product_name,
      quantity: item.quantity,
      price: item.product.product_price, // Adjust field name based on your ProductDetails interface
    }));

    const totalPrice = orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const order: CheckoutDetails = {
      user_id: this.userId || '',
      order_id: '', // Will be set by backend
      order_items: orderItems,
      total_price: totalPrice,
    };

    this.orderService.placeOrder(order).subscribe(
      (response) => {
        console.log('Order placed successfully', response);
        this.productsService.clearBasket();
        this.loadCartItems();
      },
      (error) => {
        console.error('Error placing order', error);
      }
    );
  }

  private updateLocalStorage(): void {
    const updatedBasket = this.items.map(item => ({
      ...item.product,
      quantity: item.quantity // Add quantity to product if needed by backend
    }));
    localStorage.setItem('basket', JSON.stringify(updatedBasket));
  }
}