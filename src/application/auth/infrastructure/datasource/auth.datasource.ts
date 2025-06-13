/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { User } from '../../domain/entities/user.entity';
import {
  adminAuth,
  auth,
} from 'src/application/product/infrastructure/datasources/firebase/config.firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
@Injectable()
export class AuthDataSource {
  async findAll(): Promise<Result<User[], Error>> {
    try {
      const listUsersResult = await adminAuth.listUsers();
      const users: User[] = listUsersResult.users.map((userRecord) => {
        return new User(
          userRecord.uid,
          userRecord.email || '',
          '',
          new Date(userRecord.metadata.creationTime),
          new Date(
            userRecord.metadata.lastSignInTime ||
              userRecord.metadata.creationTime,
          ),
        );
      });

      return { type: 'success', value: users };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async findByEmail(email: string): Promise<Result<User | null, Error>> {
    try {
      const userRecord = await adminAuth.getUserByEmail(email);

      const user = new User(
        userRecord.uid,
        userRecord.email || '',
        '',
        new Date(userRecord.metadata.creationTime),
        new Date(
          userRecord.metadata.lastSignInTime ||
            userRecord.metadata.creationTime,
        ),
      );

      return { type: 'success', value: user };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return { type: 'success', value: null };
      }
      return { type: 'error', throwable: error as Error };
    }
  }

  async delete(uid: string): Promise<Result<void, Error>> {
    try {
      await adminAuth.deleteUser(uid);
      return { type: 'success', value: undefined };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async exists(email: string): Promise<Result<boolean, Error>> {
    try {
      await adminAuth.getUserByEmail(email);
      return { type: 'success', value: true };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return { type: 'success', value: false };
      }
      return { type: 'error', throwable: error as Error };
    }
  }

  async register(
    email: string,
    password: string,
  ): Promise<Result<User, Error>> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      const user = new User(
        userCredential.user.uid,
        userCredential.user.email!,
        password,
        new Date(userCredential.user.metadata.creationTime!),
        new Date(userCredential.user.metadata.lastSignInTime!),
      );

      return { type: 'success', value: user };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async login(email: string, password: string): Promise<Result<string, Error>> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const token = await userCredential.user.getIdToken();

      return { type: 'success', value: token };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async logout(): Promise<Result<void, Error>> {
    try {
      await signOut(auth);
      return { type: 'success', value: undefined };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }
}
