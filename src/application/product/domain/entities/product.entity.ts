import { FakeStoreProduct } from 'src/application/product/infrastructure/datasources/adapters/fakestore/fakestore.types';

export class Product {
  private readonly _id: number;
  private _title: string;
  private _price: number;
  private _description: string;
  private _category: string;
  private _image: string;
  private _stock: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    stock: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._title = title;
    this._price = price;
    this._description = description;
    this._category = category;
    this._image = image;
    this._stock = stock;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get title(): string {
    return this._title;
  }
  get price(): number {
    return this._price;
  }
  get description(): string {
    return this._description;
  }
  get category(): string {
    return this._category;
  }
  get image(): string {
    return this._image;
  }
  get stock(): number {
    return this._stock;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Stetters and methods to modify the state of the object
  updateStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    this._stock = newStock;
    this._updatedAt = new Date();
  }

  updateDetails(
    title?: string,
    price?: number,
    description?: string,
    category?: string,
    image?: string,
  ): void {
    if (title) this._title = title;
    if (price) this._price = price;
    if (description) this._description = description;
    if (category) this._category = category;
    if (image) this._image = image;
    this._updatedAt = new Date();
  }

  // Factory method to create a new product
  static create(
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    stock: number = Math.floor(Math.random() * 100) + 1,
    id?: number,
  ): Product {
    const now = new Date();
    return new Product(
      id ?? 0,
      title,
      price,
      description,
      category,
      image,
      stock,
      now,
      now,
    );
  }

  // Method to creat a product from FakeStore API
  static fromFakeStore(
    fakeStoreProduct: FakeStoreProduct,
    stock: number = Math.floor(Math.random() * 100) + 1,
  ): Product {
    return Product.create(
      fakeStoreProduct.title,
      fakeStoreProduct.price,
      fakeStoreProduct.description,
      fakeStoreProduct.category,
      fakeStoreProduct.image,
      stock,
      fakeStoreProduct.id,
    );
  }

  // Method to serealize the entity
  toJSON() {
    return {
      id: this._id,
      title: this._title,
      price: this._price,
      description: this._description,
      category: this._category,
      image: this._image,
      stock: this._stock,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
