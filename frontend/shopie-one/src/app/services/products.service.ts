import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProductDetails } from '../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:5700/products/all-products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductDetails[]> {
    return this.http.get<{ products: ProductDetails[] }>(this.apiUrl).pipe(
      map((response: { products: ProductDetails[] }) => response.products) // Extract the 'products' array
    );
  }

}