import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable, SubscriptionLike } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Product } from 'src/app/models/product';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductsService implements OnDestroy {

  public productObs: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private productSubscription: SubscriptionLike | undefined;

  private baseUrl: string = environment.API_URL + 'products/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Token ' + environment.TOKEN,
    })
  };


  constructor(private http: HttpClient) {
    this.productSubscription = this.getProducts().subscribe();
  }

  ngOnDestroy() {
    if (this.productSubscription) this.productSubscription.unsubscribe();
  }

  // GET
  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, this.httpOptions)
    .pipe(
      tap((products: Product[]) => this.productObs.next(products))
    );
  }

  public getProductFromId(id: number): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + id, this.httpOptions);
  }

  // POST
  public addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, this.httpOptions);
  }

  // PUT
  public editProduct(product: Product): Observable<Product> {
  return this.http.put<Product>(this.baseUrl  + product.id, product, this.httpOptions);
  }

  // DELETE
  public deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(this.baseUrl  + id, this.httpOptions);
  }
}
