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
  Timestamp,
} from 'firebase/firestore';
import { db } from './config.firebase';
import { IProductDataSource } from '../../../data/repositories/interfaces/product-datasource.interface';
import { Result } from '../../../../core/types/result';
import {
  FirebaseProductDto,
  CreateFirebaseProductDto,
  PaginatedFirebaseResponse,
} from '../../../delivery/dtos/firebase-product.dto';

@Injectable()
export class FirebaseProductDataSource implements IProductDataSource {
  private readonly collectionName = 'products';

  async findAll(
    pageSize: number = 10,
    skip: number = 0,
  ): Promise<Result<PaginatedFirebaseResponse, Error>> {
    try {
      const productsCollection = collection(db, this.collectionName);

      // Get all documents ordered by createdAt
      const allDocsQuery = query(
        productsCollection,
        orderBy('createdAt', 'desc'),
      );
      const allDocsSnapshot = await getDocs(allDocsQuery);

      // Apply skip and limit manually
      const allDocs = allDocsSnapshot.docs;
      const paginatedDocs = allDocs.slice(skip, skip + pageSize);

      const products: FirebaseProductDto[] = [];

      paginatedDocs.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          title: data.title,
          price: data.price,
          description: data.description,
          category: data.category,
          image: data.image,
          stock: data.stock,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      const hasNextPage = skip + pageSize < allDocs.length;
      const currentPage =
        skip === 0 ? 'first' : `page_${Math.floor(skip / pageSize) + 1}`;

      const response: PaginatedFirebaseResponse = {
        data: products,
        pagination: {
          hasNextPage,
          nextCursor: hasNextPage ? `${skip + pageSize}` : null,
          currentPage,
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
  ): Promise<Result<FirebaseProductDto | null, Error>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { type: 'success', value: null };
      }

      const data = docSnap.data();
      const product: FirebaseProductDto = {
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
    productData: CreateFirebaseProductDto,
  ): Promise<Result<FirebaseProductDto, Error>> {
    try {
      const now = Timestamp.now();

      const sanitizedData = {
        title: String(productData.title || ''),
        price: Number(productData.price) || 0,
        description: String(productData.description || ''),
        category: String(productData.category || ''),
        image: String(productData.image || ''),
        stock: Number(productData.stock) || 0,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(
        collection(db, this.collectionName),
        sanitizedData,
      );

      const createdProduct: FirebaseProductDto = {
        id: docRef.id,
        title: sanitizedData.title,
        price: sanitizedData.price,
        description: sanitizedData.description,
        category: sanitizedData.category,
        image: sanitizedData.image,
        stock: sanitizedData.stock,
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
    productData: Partial<CreateFirebaseProductDto>,
  ): Promise<Result<FirebaseProductDto, Error>> {
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

      const updatedProduct: FirebaseProductDto = {
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
  ): Promise<Result<FirebaseProductDto, Error>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error(`Product with id ${id} not found`);
      }

      await updateDoc(docRef, {
        stock,
        updatedAt: Timestamp.now(),
      });

      const updatedDocSnap = await getDoc(docRef);
      const updatedData = updatedDocSnap.data()!;

      const updatedProduct: FirebaseProductDto = {
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
