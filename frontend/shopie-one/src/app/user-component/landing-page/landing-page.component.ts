import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
// import { UserComponentComponent } from '../user-component.component';
import { ProductDetails } from '../../interfaces/products';
// import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CartComponent } from "../cart/cart.component";
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CartComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  products: ProductDetails[] = [];
  filteredProducts: ProductDetails[] = [];
  isLoggedIn: boolean = false;
  email: string = '';
  selectedCategory: string = '';
  isSearchVisible: boolean = false; // Toggle for search input visibility
  searchQuery: string = ''; // Store the search input

  constructor(private productService: ProductsService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.isLoggedIn = !!this.authService.getToken(); 
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // Initially show all products
      },
      error: (error) => console.error('Error fetching products:', error)
    });
  }

  filterProductsByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters(); // Apply both category and search filters
  }

  // Toggle search input visibility
  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchQuery = ''; // Clear search when hiding
      this.applyFilters(); // Reset filters when search is hidden
    }
  }

  // Filter products based on category and search query
  applyFilters(): void {
    let tempProducts = this.products;

    // Apply category filter if selected
    if (this.selectedCategory) {
      tempProducts = tempProducts.filter(
        product => product.product_category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Apply search filter if query exists
    if (this.searchQuery) {
      tempProducts = tempProducts.filter(product =>
        product.product_description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredProducts = tempProducts;
  }

  // Handle search input changes
  onSearchChange(): void {
    this.applyFilters(); // Update filtered products as user types
  }

  handleAddToBasket(productId: string): void {
    const product = this.products.find(p => p.product_id === productId);
    if (product) {
      this.productService.addToBasket(product); // Use service to handle local storage
    }
    // if (!this.isLoggedIn) {
    //   // No redirect here; let user continue adding items
    // }
  }

  redirectToSignUp(): void {
    this.router.navigate(['/login']);
  }

  submitNewsletter(event: Event): void {
    event.preventDefault();
    if (this.email) {
      console.log(`Subscribed with email: ${this.email}`);
      this.email = '';
    }
  }

  scrollToAbout(): void {
    const element = document.getElementById('about-us');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}