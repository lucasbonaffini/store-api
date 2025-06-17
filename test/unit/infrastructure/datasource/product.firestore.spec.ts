// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-require-imports */
// import { FirebaseProductDataSource } from 'src/application/product/infrastructure/datasources/firebase/product.firestore.datasource';
// import { db } from 'src/application/product/infrastructure/datasources/firebase/config.firebase';
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   query,
//   orderBy,
//   Timestamp,
//   CollectionReference,
//   DocumentReference,
//   DocumentSnapshot,
//   QuerySnapshot,
//   QueryDocumentSnapshot,
//   DocumentData,
//   QueryOrderByConstraint,
// } from 'firebase/firestore';
// // Import mock separately, but mockDeep will be required inline for the factory
// import { mock, MockProxy } from 'jest-mock-extended';
// import { CreateFirebaseProductDto } from 'src/application/product/delivery/dtos/firebase-product.dto';

// // Mock the entire config.firebase module
// jest.mock('./config.firebase', () => {
//   // Require jest-mock-extended inline here to avoid hoisting issues
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const { mockDeep } = require('jest-mock-extended') as {
//     mockDeep: <T>() => T;
//   };
//   return {
//     db: mockDeep<typeof db>(), // Deep mock of the db instance
//   };
// });

// // Mock Timestamp.now()
// const mockTimestampNow = jest.fn();
// jest.mock('firebase/firestore', () => {
//   const actualFirestore = jest.requireActual('firebase/firestore');
//   // Preserve the actual Timestamp constructor
//   actualFirestore.Timestamp.now = () => mockTimestampNow();
//   actualFirestore.Timestamp.fromDate = jest.fn((date: Date) => ({
//     toDate: () => date,
//     seconds: Math.floor(date.getTime() / 1000),
//     nanoseconds: (date.getTime() % 1000) * 1e6,
//   }));

//   return {
//     ...actualFirestore,
//     // Other specific function mocks that don't need the original
//     collection: jest.fn(),
//     doc: jest.fn(),
//     getDoc: jest.fn(),
//     getDocs: jest.fn(),
//     addDoc: jest.fn(),
//     updateDoc: jest.fn(),
//     deleteDoc: jest.fn(),
//     query: jest.fn(),
//     orderBy: jest.fn(),
//   };
// });

// describe('FirebaseProductDataSource', () => {
//   let dataSource: FirebaseProductDataSource;
//   let mockDb: MockProxy<typeof db>; // Not directly used, but shows db is mocked via module mock

//   // Renamed mock functions for clarity and to avoid conflict
//   const mockCollectionFn = collection as jest.MockedFunction<typeof collection>;
//   const mockDocFn = doc as jest.MockedFunction<typeof doc>;
//   const mockGetDocFn = getDoc as jest.MockedFunction<typeof getDoc>;
//   const mockGetDocsFn = getDocs as jest.MockedFunction<typeof getDocs>;
//   const mockAddDocFn = addDoc as jest.MockedFunction<typeof addDoc>;
//   const mockUpdateDocFn = updateDoc as jest.MockedFunction<typeof updateDoc>;
//   const mockDeleteDocFn = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
//   const mockQueryFn = query as jest.MockedFunction<typeof query>;
//   const mockOrderByFn = orderBy as jest.MockedFunction<typeof orderBy>;

//   // Specific mock instances to be returned and checked
//   let mockProductsCollectionRef: MockProxy<CollectionReference<DocumentData>>;
//   let mockProductDocRef: MockProxy<DocumentReference<DocumentData>>;
//   let mockQueryObj: MockProxy<ReturnType<typeof query>>; // Query object mock
//   let mockOrderByConstraintObj: MockProxy<QueryOrderByConstraint>; // orderBy constraint mock

//   const mockDate = new Date('2023-01-01T00:00:00.000Z');
//   const mockTimestamp = {
//     toDate: () => mockDate,
//     seconds: Math.floor(mockDate.getTime() / 1000),
//     nanoseconds: (mockDate.getTime() % 1000) * 1e6,
//   } as Timestamp;

//   beforeEach(() => {
//     dataSource = new FirebaseProductDataSource();
//     jest.clearAllMocks();

//     mockTimestampNow.mockReturnValue(mockTimestamp);

//     // Initialize specific mock instances for each test
//     mockProductsCollectionRef = mock<CollectionReference<DocumentData>>();
//     mockProductDocRef = mock<DocumentReference<DocumentData>>();
//     mockQueryObj = mock<ReturnType<typeof query>>();
//     mockOrderByConstraintObj = mock<QueryOrderByConstraint>();

//     // Configure the factory mocks to return these specific instances
//     mockCollectionFn.mockReturnValue(mockProductsCollectionRef);
//     mockDocFn.mockReturnValue(mockProductDocRef);
//     mockQueryFn.mockReturnValue(mockQueryObj);
//     mockOrderByFn.mockReturnValue(mockOrderByConstraintObj);
//   });

//   describe('findAll', () => {
//     it('should return an empty list if no products exist', async () => {
//       const mockQuerySnapshot = mock<QuerySnapshot<DocumentData>>({ docs: [] });
//       mockGetDocsFn.mockResolvedValue(mockQuerySnapshot);

//       const result = await dataSource.findAll();

//       expect(mockCollectionFn).toHaveBeenCalledWith(db, 'products');
//       expect(mockOrderByFn).toHaveBeenCalledWith('createdAt', 'desc'); // Corrected: orderBy is called directly
//       expect(mockQueryFn).toHaveBeenCalledWith(
//         mockProductsCollectionRef,
//         mockOrderByConstraintObj,
//       );
//       expect(mockGetDocsFn).toHaveBeenCalledWith(mockQueryObj);

//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value.data).toEqual([]);
//         expect(result.value.pagination.hasNextPage).toBe(false);
//         expect(result.value.pagination.nextCursor).toBeNull();
//         expect(result.value.pagination.totalInPage).toBe(0);
//       }
//     });

//     it('should return a paginated list of products and pagination info', async () => {
//       const productsData = [
//         {
//           id: '1',
//           title: 'Product 1',
//           createdAt: mockTimestamp,
//           stock: 10,
//           price: 100,
//           description: 'Desc 1',
//           category: 'Cat 1',
//           image: 'Img 1',
//           updatedAt: mockTimestamp,
//         },
//         {
//           id: '2',
//           title: 'Product 2',
//           createdAt: mockTimestamp,
//           stock: 20,
//           price: 200,
//           description: 'Desc 2',
//           category: 'Cat 2',
//           image: 'Img 2',
//           updatedAt: mockTimestamp,
//         },
//       ];

//       const mockDocs = productsData.map((p) =>
//         mock<QueryDocumentSnapshot<DocumentData>>({
//           id: p.id,
//           data: () => p,
//           exists: (() => true) as any,
//         }),
//       );

//       const mockQuerySnapshot = mock<QuerySnapshot<DocumentData>>({
//         docs: mockDocs,
//       });
//       mockGetDocsFn.mockResolvedValue(mockQuerySnapshot);

//       const pageSize = 1;
//       const skip = 0;
//       const result = await dataSource.findAll(pageSize, skip);

//       expect(mockCollectionFn).toHaveBeenCalledWith(db, 'products');
//       expect(mockOrderByFn).toHaveBeenCalledWith('createdAt', 'desc');
//       expect(mockQueryFn).toHaveBeenCalledWith(
//         mockProductsCollectionRef,
//         mockOrderByConstraintObj,
//       );
//       expect(mockGetDocsFn).toHaveBeenCalledWith(mockQueryObj);

//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value.data).toHaveLength(1);
//         expect(result.value.data[0].id).toBe('1');
//         expect(result.value.data[0].title).toBe('Product 1');
//         expect(result.value.data[0].createdAt).toEqual(mockDate);
//         expect(result.value.pagination.hasNextPage).toBe(true);
//         expect(result.value.pagination.nextCursor).toBe('1');
//         expect(result.value.pagination.totalInPage).toBe(1);
//         expect(result.value.pagination.currentPage).toBe('first');
//       }
//     });

//     it('should handle pagination correctly for subsequent pages', async () => {
//       const productsData = [
//         {
//           id: '1',
//           title: 'P1',
//           createdAt: mockTimestamp,
//           stock: 1,
//           price: 10,
//           description: 'D1',
//           category: 'C1',
//           image: 'I1',
//           updatedAt: mockTimestamp,
//         },
//         {
//           id: '2',
//           title: 'P2',
//           createdAt: mockTimestamp,
//           stock: 2,
//           price: 20,
//           description: 'D2',
//           category: 'C2',
//           image: 'I2',
//           updatedAt: mockTimestamp,
//         },
//         {
//           id: '3',
//           title: 'P3',
//           createdAt: mockTimestamp,
//           stock: 3,
//           price: 30,
//           description: 'D3',
//           category: 'C3',
//           image: 'I3',
//           updatedAt: mockTimestamp,
//         },
//       ];
//       const mockDocs = productsData.map((p) =>
//         mock<QueryDocumentSnapshot<DocumentData>>({
//           id: p.id,
//           data: () => p,
//           exists: (() => true) as any,
//         }),
//       );
//       const mockQuerySnapshot = mock<QuerySnapshot<DocumentData>>({
//         docs: mockDocs,
//       });
//       mockGetDocsFn.mockResolvedValue(mockQuerySnapshot);

//       const pageSize = 1;
//       const skip = 1;
//       const result = await dataSource.findAll(pageSize, skip);

//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value.data).toHaveLength(1);
//         expect(result.value.data[0].id).toBe('2');
//         expect(result.value.pagination.hasNextPage).toBe(true);
//         expect(result.value.pagination.nextCursor).toBe('2');
//         expect(result.value.pagination.totalInPage).toBe(1);
//         expect(result.value.pagination.currentPage).toBe('page_2');
//       }
//     });

//     it('should return an error result on failure', async () => {
//       const error = new Error('Firestore error');
//       mockGetDocsFn.mockRejectedValue(error);

//       const result = await dataSource.findAll();

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable).toBe(error);
//       }
//     });
//   });

//   describe('findById', () => {
//     it('should return a product if found', async () => {
//       const productId = 'test-id';
//       const productData = {
//         title: 'Test Product',
//         createdAt: mockTimestamp,
//         stock: 10,
//         price: 100,
//         description: 'Desc',
//         category: 'Cat',
//         image: 'Img',
//         updatedAt: mockTimestamp,
//       };

//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => productData,
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const result = await dataSource.findById(productId);

//       expect(mockDocFn).toHaveBeenCalledWith(db, 'products', productId);
//       expect(mockGetDocFn).toHaveBeenCalledWith(mockProductDocRef);
//       expect(result.type).toBe('success');
//       if (result.type === 'success' && result.value) {
//         expect(result.value.id).toBe(productId);
//         expect(result.value.title).toBe(productData.title);
//         expect(result.value.createdAt).toEqual(mockDate);
//       } else {
//         throw new Error('Expected success with product data');
//       }
//     });

//     it('should return success with null if product not found', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => false) as any,
//         id: 'non-existent-id',
//         data: () => undefined,
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const result = await dataSource.findById('non-existent-id');

//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value).toBeNull();
//       }
//     });

//     it('should return an error result on failure', async () => {
//       const error = new Error('Firestore error');
//       mockGetDocFn.mockRejectedValue(error);

//       const result = await dataSource.findById('test-id');

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable).toBe(error);
//       }
//     });
//   });

//   describe('create', () => {
//     it('should create a product and return it', async () => {
//       const createDto: CreateFirebaseProductDto = {
//         title: 'New Product',
//         price: 150,
//         stock: 50,
//         description: 'Desc new',
//         category: 'New Cat',
//         image: 'New Img',
//       };
//       const newId = 'new-id';

//       const mockReturnedDocRef = mock<DocumentReference<DocumentData>>({
//         id: newId,
//       });
//       mockAddDocFn.mockResolvedValue(mockReturnedDocRef);
//       mockTimestampNow.mockReturnValue(mockTimestamp);

//       const result = await dataSource.create(createDto);

//       expect(mockCollectionFn).toHaveBeenCalledWith(db, 'products');
//       expect(mockAddDocFn).toHaveBeenCalledWith(mockProductsCollectionRef, {
//         ...createDto,
//         createdAt: mockTimestamp,
//         updatedAt: mockTimestamp,
//       });
//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value.id).toBe(newId);
//         expect(result.value.title).toBe(createDto.title);
//         expect(result.value.createdAt).toEqual(mockDate);
//         expect(result.value.updatedAt).toEqual(mockDate);
//       } else {
//         throw new Error('Expected success with product data');
//       }
//     });

//     it('should sanitize data on create', async () => {
//       const createDto = {
//         title: null,
//         price: undefined,
//       } as unknown as CreateFirebaseProductDto;
//       const newId = 'new-id';

//       const mockReturnedDocRef = mock<DocumentReference<DocumentData>>({
//         id: newId,
//       });
//       mockAddDocFn.mockResolvedValue(mockReturnedDocRef);
//       mockTimestampNow.mockReturnValue(mockTimestamp);

//       const result = await dataSource.create(createDto);

//       expect(mockAddDocFn).toHaveBeenCalledWith(mockProductsCollectionRef, {
//         title: '',
//         price: 0,
//         description: '',
//         category: '',
//         image: '',
//         stock: 0,
//         createdAt: mockTimestamp,
//         updatedAt: mockTimestamp,
//       });
//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value.id).toBe(newId);
//         expect(result.value.title).toBe('');
//         expect(result.value.price).toBe(0);
//       }
//     });

//     it('should return an error result on failure', async () => {
//       const error = new Error('Firestore error');
//       mockAddDocFn.mockRejectedValue(error);

//       const result = await dataSource.create({
//         title: 'Error Product',
//         price: 10,
//         stock: 5,
//         description: 'D',
//         category: 'C',
//         image: 'I',
//       });

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable).toBe(error);
//       }
//     });
//   });

//   describe('update', () => {
//     const productId = 'update-id';
//     const updateDto: Partial<CreateFirebaseProductDto> = {
//       title: 'Updated Title',
//       price: 120,
//     };
//     const existingProductData = {
//       id: productId,
//       title: 'Old Title',
//       price: 100,
//       stock: 10,
//       description: 'Old Desc',
//       category: 'Old Cat',
//       image: 'Old Img',
//       createdAt: new Timestamp(1000, 0),
//       updatedAt: new Timestamp(1000, 0),
//     };

//     it('should update a product if it exists', async () => {
//       const mockExistingDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => existingProductData,
//       });

//       const updatedProductDataAfterWrite = {
//         ...existingProductData,
//         ...updateDto,
//         updatedAt: mockTimestamp,
//       };
//       const mockUpdatedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => updatedProductDataAfterWrite,
//       });

//       mockGetDocFn
//         .mockResolvedValueOnce(
//           mockExistingDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//         )
//         .mockResolvedValueOnce(
//           mockUpdatedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//         );

//       mockUpdateDocFn.mockResolvedValue(undefined);
//       mockTimestampNow.mockReturnValue(mockTimestamp);

//       const result = await dataSource.update(productId, updateDto);

//       expect(mockDocFn).toHaveBeenCalledWith(db, 'products', productId);
//       expect(mockGetDocFn).toHaveBeenCalledTimes(2);
//       expect(mockUpdateDocFn).toHaveBeenCalledWith(mockProductDocRef, {
//         ...updateDto,
//         updatedAt: mockTimestamp,
//       });
//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value.id).toBe(productId);
//         expect(result.value.title).toBe(updateDto.title);
//         expect(result.value.price).toBe(updateDto.price);
//         expect(result.value.updatedAt).toEqual(mockDate);
//         expect(result.value.createdAt).toEqual(
//           existingProductData.createdAt.toDate(),
//         );
//       } else {
//         throw new Error('Expected success with updated product data');
//       }
//     });

//     it('should throw an error if product to update does not exist', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => false) as any,
//         id: 'non-existent-id',
//         data: () => undefined,
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const result = await dataSource.update('non-existent-id', {
//         title: 'Title',
//       });

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable?.message).toBe(
//           'Product with id non-existent-id not found',
//         );
//       }
//       expect(mockUpdateDocFn).not.toHaveBeenCalled();
//     });

//     it('should return an error result on general failure during update', async () => {
//       const mockExistingDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => existingProductData,
//       });
//       mockGetDocFn.mockResolvedValueOnce(
//         mockExistingDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const error = new Error('Firestore update error');
//       mockUpdateDocFn.mockRejectedValue(error);
//       mockTimestampNow.mockReturnValue(mockTimestamp);

//       const result = await dataSource.update(productId, {
//         title: 'Error Update',
//       });

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable).toBe(error);
//       }
//     });
//   });

//   describe('updateStock', () => {
//     const productId = 'stock-update-id';
//     const newStock = 75;
//     const existingProductData = {
//       id: productId,
//       title: 'Stock Product',
//       price: 50,
//       stock: 25,
//       description: 'Stock Desc',
//       category: 'Stock Cat',
//       image: 'Stock Img',
//       createdAt: new Timestamp(1000, 0),
//       updatedAt: new Timestamp(1000, 0),
//     };

//     it('should update stock if product exists', async () => {
//       const mockExistingDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => existingProductData,
//       });

//       const updatedProductDataAfterWrite = {
//         ...existingProductData,
//         stock: newStock,
//         updatedAt: mockTimestamp,
//       };
//       const mockUpdatedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => updatedProductDataAfterWrite,
//       });

//       mockGetDocFn
//         .mockResolvedValueOnce(
//           mockExistingDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//         )
//         .mockResolvedValueOnce(
//           mockUpdatedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//         );
//       mockUpdateDocFn.mockResolvedValue(undefined);
//       mockTimestampNow.mockReturnValue(mockTimestamp);

//       const result = await dataSource.updateStock(productId, newStock);

//       expect(mockDocFn).toHaveBeenCalledWith(db, 'products', productId);
//       expect(mockGetDocFn).toHaveBeenCalledTimes(2);
//       expect(mockUpdateDocFn).toHaveBeenCalledWith(mockProductDocRef, {
//         stock: newStock,
//         updatedAt: mockTimestamp,
//       });
//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value.stock).toBe(newStock);
//         expect(result.value.updatedAt).toEqual(mockDate);
//       } else {
//         throw new Error('Expected success with updated product data');
//       }
//     });

//     it('should throw an error if product for stock update does not exist', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => false) as any,
//         id: 'non-existent-id',
//         data: () => undefined,
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const result = await dataSource.updateStock('non-existent-id', 100);

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable?.message).toBe(
//           'Product with id non-existent-id not found',
//         );
//       }
//       expect(mockUpdateDocFn).not.toHaveBeenCalled();
//     });

//     it('should return an error result on general failure during stock update', async () => {
//       const mockExistingDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => existingProductData,
//       });
//       mockGetDocFn.mockResolvedValueOnce(
//         mockExistingDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const error = new Error('Firestore stock update error');
//       mockUpdateDocFn.mockRejectedValue(error);
//       mockTimestampNow.mockReturnValue(mockTimestamp);

//       const result = await dataSource.updateStock(productId, 100);

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable).toBe(error);
//       }
//     });
//   });

//   describe('delete', () => {
//     const productId = 'delete-id';

//     it('should delete a product if it exists', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => ({}),
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );
//       mockDeleteDocFn.mockResolvedValue(undefined);

//       const result = await dataSource.delete(productId);

//       expect(mockDocFn).toHaveBeenCalledWith(db, 'products', productId);
//       expect(mockGetDocFn).toHaveBeenCalledWith(mockProductDocRef); // Check correct DocumentReference
//       expect(mockDeleteDocFn).toHaveBeenCalledWith(mockProductDocRef); // Check correct DocumentReference
//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value).toBeUndefined();
//       }
//     });

//     it('should throw an error if product to delete does not exist', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => false) as any,
//         id: 'non-existent-id',
//         data: () => undefined,
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const result = await dataSource.delete('non-existent-id');

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable?.message).toBe(
//           'Product with id non-existent-id not found',
//         );
//       }
//       expect(mockDeleteDocFn).not.toHaveBeenCalled();
//     });

//     it('should return an error result on failure', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: productId,
//         data: () => ({}),
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const error = new Error('Firestore error');
//       mockDeleteDocFn.mockRejectedValue(error);

//       const result = await dataSource.delete(productId);

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable).toBe(error);
//       }
//     });
//   });

//   describe('exists', () => {
//     it('should return true if product exists', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => true) as any,
//         id: 'existing-id',
//         data: () => ({}),
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const result = await dataSource.exists('existing-id');

//       expect(mockDocFn).toHaveBeenCalledWith(db, 'products', 'existing-id');
//       expect(mockGetDocFn).toHaveBeenCalledWith(mockProductDocRef);
//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value).toBe(true);
//       }
//     });

//     it('should return false if product does not exist', async () => {
//       const mockReturnedDocSnapshot = mock<DocumentSnapshot<DocumentData>>({
//         exists: (() => false) as any,
//         id: 'non-existent-id',
//         data: () => undefined,
//       });
//       mockGetDocFn.mockResolvedValue(
//         mockReturnedDocSnapshot as unknown as DocumentSnapshot<DocumentData>,
//       );

//       const result = await dataSource.exists('non-existent-id');

//       expect(mockGetDocFn).toHaveBeenCalledWith(mockProductDocRef);
//       expect(result.type).toBe('success');
//       if (result.type === 'success') {
//         expect(result.value).toBe(false);
//       }
//     });

//     it('should return an error result on failure', async () => {
//       const error = new Error('Firestore error');
//       mockGetDocFn.mockRejectedValue(error);

//       const result = await dataSource.exists('test-id');

//       expect(result.type).toBe('error');
//       if (result.type === 'error') {
//         expect(result.throwable).toBe(error);
//       }
//     });
//   });
// });
