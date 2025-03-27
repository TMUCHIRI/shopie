// cart.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductDetails } from '../interfaces/products';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private localStorageKey = 'cartItems';
  private items: { product: ProductDetails; quantity: number }[] = [];
  private isBrowser: boolean;
  private itemCountSubject = new BehaviorSubject<number>(0);
  itemCount$ = this.itemCountSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadCart();
    }
  }

  private loadCart() {
    if (this.isBrowser) {
      const storedItems = localStorage.getItem(this.localStorageKey);
      this.items = storedItems ? JSON.parse(storedItems) : [];
      this.itemCountSubject.next(this.getTotalItemCount());
    }
  }

  private saveCart() {
    if (this.isBrowser) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.items));
      this.itemCountSubject.next(this.getTotalItemCount());
    }
  }

  addToCart(product: ProductDetails) {
    const existingItem = this.items.find((item) => item.product.product_id === product.product_id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveCart();
  }

  getItems() {
    return this.items;
  }

  removeItem(productId: string) {
    this.items = this.items.filter((item) => item.product.product_id !== productId);
    this.saveCart();
  }

  increaseQuantity(productId: string) {
    const item = this.items.find((item) => item.product.product_id === productId);
    if (item) {
      item.quantity += 1;
      this.saveCart();
    }
  }

  decreaseQuantity(productId: string) {
    const item = this.items.find((item) => item.product.product_id === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.saveCart();
    } else if (item && item.quantity === 1) {
      this.removeItem(productId);
    }
  }

  getTotalItemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }
}