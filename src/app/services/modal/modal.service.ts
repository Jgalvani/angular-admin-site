import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/product';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public actionProductModalObs: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  public addProductModalObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public editProductModalObs: BehaviorSubject<Product | undefined> = new BehaviorSubject<Product | undefined >(undefined);


  constructor() { }

  public openActionProductModal(id: number) {
    this.actionProductModalObs.next(id);
  }

  public openAddProductModal(isActive: boolean = false) {
    this.addProductModalObs.next(isActive);
  }

  public openEditProductModal(product: Product) {
    this.editProductModalObs.next(product);
  }
}
