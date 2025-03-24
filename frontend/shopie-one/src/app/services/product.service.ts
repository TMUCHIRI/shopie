import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductDetails } from '../interfaces/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private apiUrl = 'http://localhost:5700';

  constructor(private http: HttpClient) {}

  createProduct(new_product: ProductDetails) {
    return this.http.post('http://localhost:5700/products/create', new_product);
  }
  getProducts() {
    return this.http.get(' http://localhost:5700/products/all-products');
  }
  updateProduct(product_id: string, updateProduct: ProductDetails) {
    return this.http.put(
      `http://localhost:5700/products/${product_id}`,
      updateProduct
    );
  }
  getProduct(product_id: string) {
    return this.http.get(`http://localhost:5700/products/${product_id}`);
  }
  deleteProduct(product_id: string) {
    return this.http.delete(`http://localhost:5700/products/${product_id}`);
  }

  addToBasket(product: ProductDetails): void {
    let basket: ProductDetails[] = JSON.parse(localStorage.getItem('basket') || '[]');
    const existingProduct = basket.find(item => item.product_id === product.product_id);
    if (!existingProduct) {
      basket.push(product);
      localStorage.setItem('basket', JSON.stringify(basket));
    }
  }

  getBasket(): ProductDetails[] {
    return JSON.parse(localStorage.getItem('basket') || '[]');
  }

  clearBasket(): void {
    localStorage.removeItem('basket');
  }
}
