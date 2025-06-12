/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config.firebase';
import { IProductDataSource } from '../../../data/repositories/interfaces/product-datasource.interface';
import { Result } from '../../../../core/types/result';
import {
  FirebaseProductEntity,
  CreateFirebaseProductEntity,
  PaginatedFirebaseResponse,
} from '../../entities/firebase-product.entity';

@Injectable()
export class FirebaseProductDataSource implements IProductDataSource {
  private readonly collectionName = 'products';

  async findAll(
    pageSize: number = 10,
    cursor?: string,
  ): Promise<Result<PaginatedFirebaseResponse, Error>> {
    try {
      const productsCollection = collection(db, this.collectionName);

      let queryRef = query(
        productsCollection,
        orderBy('createdAt', 'desc'),
        limit(pageSize + 1),
      );

      if (cursor) {
        try {
          const lastDocRef = doc(db, this.collectionName, cursor);
          const lastDocSnapshot = await getDoc(lastDocRef);

          if (lastDocSnapshot.exists()) {
            queryRef = query(
              productsCollection,
              orderBy('createdAt', 'desc'),
              startAfter(lastDocSnapshot),
              limit(pageSize + 1),
            );
          }
        } catch (cursorError) {
          console.warn('Invalid cursor, starting from beginning:', cursorError);
        }
      }

      const querySnapshot = await getDocs(queryRef);
      const docs = querySnapshot.docs;

      const hasNextPage = docs.length > pageSize;
      const dataToReturn = hasNextPage ? docs.slice(0, pageSize) : docs;

      const products: FirebaseProductEntity[] = dataToReturn.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          price: data.price,
          description: data.description,
          category: data.category,
          image: data.image,
          stock: data.stock,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });

      const nextCursor =
        hasNextPage && dataToReturn.length > 0
          ? dataToReturn[dataToReturn.length - 1].id
          : null;

      const response: PaginatedFirebaseResponse = {
        data: products,
        pagination: {
          hasNextPage,
          nextCursor,
          totalInPage: products.length,
        },
      };

      return { type: 'success', value: response };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async findById(
    id: string,
  ): Promise<Result<FirebaseProductEntity | null, Error>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { type: 'success', value: null };
      }

      const data = docSnap.data();
      const product: FirebaseProductEntity = {
        id: docSnap.id,
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        image: data.image,
        stock: data.stock,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };

      return { type: 'success', value: product };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async create(
    productData: CreateFirebaseProductEntity,
  ): Promise<Result<FirebaseProductEntity, Error>> {
    try {
      const now = Timestamp.now();

      const dataToStore = {
        ...productData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(
        collection(db, this.collectionName),
        dataToStore,
      );

      const createdProduct: FirebaseProductEntity = {
        id: docRef.id,
        ...productData,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };

      return { type: 'success', value: createdProduct };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async update(
    id: string,
    productData: Partial<CreateFirebaseProductEntity>,
  ): Promise<Result<FirebaseProductEntity, Error>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error(`Product with id ${id} not found`);
      }

      const updateData = {
        ...productData,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);

      const updatedDocSnap = await getDoc(docRef);
      const updatedData = updatedDocSnap.data()!;

      const updatedProduct: FirebaseProductEntity = {
        id: updatedDocSnap.id,
        title: updatedData.title,
        price: updatedData.price,
        description: updatedData.description,
        category: updatedData.category,
        image: updatedData.image,
        stock: updatedData.stock,
        createdAt: updatedData.createdAt?.toDate() || new Date(),
        updatedAt: updatedData.updatedAt?.toDate() || new Date(),
      };

      return { type: 'success', value: updatedProduct };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async updateStock(
    id: string,
    stock: number,
  ): Promise<Result<FirebaseProductEntity, Error>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error(`Product with id ${id} not found`);
      }

      const currentData = docSnap.data();
      const currentStock = currentData.stock || 0;
      const stockDifference = stock - currentStock;

      await updateDoc(docRef, {
        stock: increment(stockDifference),
        updatedAt: Timestamp.now(),
      });

      const updatedDocSnap = await getDoc(docRef);
      const updatedData = updatedDocSnap.data()!;

      const updatedProduct: FirebaseProductEntity = {
        id: updatedDocSnap.id,
        title: updatedData.title,
        price: updatedData.price,
        description: updatedData.description,
        category: updatedData.category,
        image: updatedData.image,
        stock: updatedData.stock,
        createdAt: updatedData.createdAt?.toDate() || new Date(),
        updatedAt: updatedData.updatedAt?.toDate() || new Date(),
      };

      return { type: 'success', value: updatedProduct };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error(`Product with id ${id} not found`);
      }

      await deleteDoc(docRef);
      return { type: 'success', value: undefined };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async exists(id: string): Promise<Result<boolean, Error>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return { type: 'success', value: docSnap.exists() };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }
}
