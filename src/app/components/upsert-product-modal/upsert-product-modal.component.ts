import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, SubscriptionLike } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalService } from 'src/app/services/modal/modal.service';


@Component({
  selector: 'app-upsert-product-modal',
  templateUrl: './upsert-product-modal.component.html',
  styleUrls: ['./upsert-product-modal.component.scss']
})
export class UpsertProductModalComponent implements OnInit {

  @ViewChild('background') background: ElementRef | undefined;
  @ViewChild('modal') modal: ElementRef | undefined;

  private addSubscription: SubscriptionLike | undefined;
  private editSubscription: SubscriptionLike | undefined;

  public categoriesObs: Observable<Category[]>;

  public isCategorySet: boolean = false;
  private isEditing: boolean = false;
  private canBeClosed: boolean = false;

  public product: Product = {} as Product;

  public form: FormGroup;


  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    public modalService: ModalService,
    private formBuilder: FormBuilder,
    ) {
      this.categoriesObs = this.categoriesService.getCategories();
      this.form = this.createForm();
    }

  ngOnInit() {
    this.addSubscription = this.modalService.addProductModalObs
    .subscribe(
      isActive => {
        if (!isActive) return;

        this.isEditing = false;
        this.product = {} as Product;
        this.openModal();
      }
    );

    this.editSubscription = this.modalService.editProductModalObs
    .subscribe(
      product => {
        if (!product) return;

        this.isEditing = true;
        this.product = product;
        this.openModal();
      }
    );
  }

  ngOnDestroy() {
    if (this.addSubscription) this.addSubscription.unsubscribe();
    if (this.editSubscription) this.editSubscription.unsubscribe();
  }

  private createForm(): FormGroup {

    const name = this.isEditing ? this.product?.name : '';
    const description = this.isEditing ? this.product?.description : '';
    const price = this.isEditing ? this.product?.price : '';
    const stock = this.isEditing ? this.product?.stock : '';

    return this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      description: new FormControl(description, Validators.required),
      price: new FormControl(price, Validators.required),
      stock: new FormControl(stock, Validators.required),
      image: new FormControl(''),
    });
  }

  private productSerializer(): Product {

    const product: Product = {
      ...this.form.value,
      category: this.product.category,
    }

    if (this.isEditing) {
      product.id = this.product.id;

      if (!this.form.controls.image.dirty) {
        product.image = this.product.image;
      }
    }

    return product;
  }

  private resetModal() {
    this.canBeClosed = false;
    this.isCategorySet = false;
    this.form = this.createForm();
  }

  private openModal() {
    if (!this.background) return;

    this.background.nativeElement.classList.remove('hidden');
    this.background.nativeElement.classList.add('display');

    this.resetModal();
  }

  private closeModal() {
    if (!this.background) return;

    this.background.nativeElement.classList.remove('display');
    this.background.nativeElement.classList.add('hidden');

    this.canBeClosed = false;
  }

  // Template functions

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: ElementRef) {
    if (!this.modal) return;

    const clickedInside: boolean = this.modal.nativeElement.contains(targetElement);
    if (!clickedInside && this.canBeClosed) {
      this.closeModal();
      return;
    }

    this.canBeClosed = true;
  }

  public setCategoryId(categoryId: number) {
    this.product.category = categoryId;
    this.isCategorySet = true;
    this.canBeClosed = false;
  }

  public onCancel() {
    this.isCategorySet = false;
    this.canBeClosed = false;
  }

  public onSubmit() {

    const product: Product = this.productSerializer();

    if (this.isEditing) {

      this.productsService.editProduct(product)
      .pipe(
        concatMap((product: Product) => {
          console.log('Edit product:', product);
          return this.productsService.getProducts();
        })
      ).subscribe(
        () => this.closeModal(),
        error => console.log('error:', error),
        () => console.log('complete')
      );

      return;
    }

    this.productsService.addProduct(product)
    .pipe(
      concatMap((product: Product) => {
        console.log('Add product:', product);
        return this.productsService.getProducts();
      })
    ).subscribe(
      () => this.closeModal(),
      error => console.log('error:', error),
      () => console.log('complete')
    );
  }
}
