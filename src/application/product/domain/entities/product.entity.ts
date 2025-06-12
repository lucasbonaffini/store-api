export class Product {
  private readonly _id: string;
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
      id ?? '',
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
}
