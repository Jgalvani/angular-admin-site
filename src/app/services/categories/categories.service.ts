import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl: string = environment.API_URL + 'products/categories';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Token ' + environment.TOKEN,
    })
  };

  constructor(private http: HttpClient) { }

  // GET
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl, this.httpOptions);
  }

  getCategoryFromId(id: number): Observable<Category> {
    return this.http.get<Category>(this.baseUrl + '/' + id, this.httpOptions);
  }

  // PUT
  editCategory(Category: Category): Observable<Category> {
    return this.http.put<Category>(this.baseUrl + '/' + Category.id, Category, this.httpOptions);
  }

  // POST
  addCategory(Category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl + '/' + Category.id, Category, this.httpOptions);
  }

  // DELETE
  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(this.baseUrl + '/' +  id, this.httpOptions);
  }
}
