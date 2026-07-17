import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Makes a GET request to the API
   * @param endpoint - The API endpoint (e.g., '/api/users')
   */
  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`);
  }

  /**
   * Makes a POST request to the API
   * @param endpoint - The API endpoint (e.g., '/api/users')
   * @param data - The request body
   */
  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data);
  }

  /**
   * Makes a PUT request to the API
   * @param endpoint - The API endpoint (e.g., '/api/users/1')
   * @param data - The request body
   */
  put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data);
  }

  /**
   * Makes a DELETE request to the API
   * @param endpoint - The API endpoint (e.g., '/api/users/1')
   */
  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
  }

  /**
   * Makes a PATCH request to the API
   * @param endpoint - The API endpoint
   * @param data - The request body
   */
  patch<T>(endpoint: string, data: any) {
    return this.http.patch<T>(`${this.apiUrl}${endpoint}`, data);
  }

  /**
   * Get the base API URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
