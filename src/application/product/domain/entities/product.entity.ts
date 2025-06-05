import { FakeStoreProduct } from 'src/application/product/infrastructure/datasources/adapters/fakestore/fakestore.types';

export class Product {
  private readonly _id: string; // Cambiado a string para Firebase
  private _title: string;
  private _price: number;
  private _description: string;
  private _category: string;
  private _image: string;
  private _stock: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
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
  get id(): string {
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

  // Métodos de negocio
  updateStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    this._stock = newStock;
    this._updatedAt = new Date();
  }

  updateDetails(updates: {
    title?: string;
    price?: number;
    description?: string;
    category?: string;
    image?: string;
  }): void {
    if (updates.title !== undefined) this._title = updates.title;
    if (updates.price !== undefined) this._price = updates.price;
    if (updates.description !== undefined)
      this._description = updates.description;
    if (updates.category !== undefined) this._category = updates.category;
    if (updates.image !== undefined) this._image = updates.image;
    this._updatedAt = new Date();
  }

  // Métodos de validación
  isInStock(): boolean {
    return this._stock > 0;
  }

  isLowStock(threshold: number = 10): boolean {
    return this._stock <= threshold && this._stock > 0;
  }

  // Factory method para crear un nuevo producto
  static create(
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    stock: number = Math.floor(Math.random() * 100) + 1,
    id?: string,
  ): Product {
    const now = new Date();
    return new Product(
      id ?? '', // Firebase generará el ID
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

  // Factory method para crear desde FakeStore API
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
      fakeStoreProduct.id?.toString(), // Convertir a string si viene como number
    );
  }

  // Método para serializar la entidad
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
