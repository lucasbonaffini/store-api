# Store API

A RESTful API for product management built with NestJS following Clean Architecture principles.

## Features

- **Clean Architecture**: Separation of concerns with domain, application, and infrastructure layers
- **REST API**: Endpoints for product management
- **External API Integration**: Integration with FakeStore API
- **Persistence**: PostgreSQL database with Prisma ORM
- **Documentation**: Swagger/OpenAPI specification
- **Error Handling**: Custom exceptions and global error handling
- **Caching**: Improved performance with caching strategies
- **Testing**: Unit and integration tests
- **Docker**: Containerization for easy deployment

## Architecture

This project follows Clean Architecture principles with the following layers:

- **Domain Layer**: Core business logic, entities, and repository interfaces
- **Application Layer**: Use cases, DTOs, and service interfaces
- **Infrastructure Layer**: External services, controllers, database, and repository implementations

## Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL or Docker

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd store-api

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Setup environment variables
cp .env.example .env
# Edit .env with your database connection string
```

## Running the Application

### Local Development

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Using Docker

```bash
# Start the application and database
docker-compose up -d

# Stop the containers
docker-compose down
```

## Database Migration

```bash
# Apply migrations
npx prisma migrate deploy

# Create a new migration
npx prisma migrate dev --name <migration-name>
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Available Endpoints

- `GET /products` - Get all products
- `GET /products/:id` - Get a product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

## Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

## Performance

- **Caching**: The API implements caching strategies for improved performance
- **Database Indexing**: Key fields are indexed for faster queries

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `FAKESTORE_API_URL`: URL for the FakeStore API (default: https://fakestoreapi.com)
- `PORT`: Application port (default: 3000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License