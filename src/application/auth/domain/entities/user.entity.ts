export class User {
  private readonly _id: string;
  private _email: string;
  private readonly _password: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(email: string, password: string, id?: string): User {
    const now = new Date();
    return new User(id ?? '', email, password, now, now);
  }
}
