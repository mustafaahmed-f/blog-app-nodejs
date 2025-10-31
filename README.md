# Blog App Backend

A robust and scalable blog backend built with **Node.js**, **TypeScript**, **MySQL**, **Prisma**, and **Redis**. This project provides a modern API for blog management, authentication, and media handling, with a focus on security, performance, and extensibility.

---

## Frontend Repository

The frontend for this project can be found here:  
[https://github.com/mustafaahmed-f/blog-next-app](https://github.com/mustafaahmed-f/blog-next-app)

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Uploading Post Images](#uploading-post-images)
- [Getting Started](#getting-started)
- [Docker Usage](#docker-usage)
- [Database Diagram](#database-diagram)
- [Deployment](#deployment)
- [API Collections](#API-Collections)
- [License](#license)

---

## Features

- User authentication and authorization (Clerk)
- Blog post CRUD operations
- Image upload and management (Cloudinary, soon AWS S3)
- Input validation (Zod)
- Featured posts, rate limiting, and view tracking (Redis)
- RESTful API design
- Global access for testing webhooks (ngrok)
- Modern TypeScript codebase

---

## Technologies Used

### Core

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **TypeScript**: Strongly-typed language that builds on JavaScript, providing better tooling and safer code.
- **Express**: Fast, unopinionated web framework for Node.js.

### Database & ORM

- **MySQL**: Relational database used as the main data store.
- **Prisma**: Next-generation ORM for TypeScript and Node.js, providing type-safe database access and migrations.

### Authentication

- **Clerk**: User authentication and management platform, integrated for secure sign-up, login, and session handling.

### Validation

- **Zod**: TypeScript-first schema validation library, used for validating API inputs and ensuring data integrity.

### Caching & Rate Limiting

- **Redis**: In-memory data store used for:
  - Caching featured posts
  - Implementing rate limiting
  - Ensuring one-time API calls (e.g., incrementing post views)

### File Uploads

- **Cloudinary**: Cloud-based image and video management service for uploading and serving post images.
- _(Planned: AWS S3 for future image storage)_

### Utilities

- **ngrok**: Exposes local servers to the public internet, used for testing Clerk webhooks and integrations.
- **dotenv**: Loads environment variables from `.env` files.
- **morgan**: HTTP request logger middleware.
- **multer**: Middleware for handling `multipart/form-data` (file uploads).
- **dompurify** & **jsdom**: Used for sanitizing HTML content.

### Development Tools

- **nodemon**: Automatically restarts the server on code changes.
- **ts-node**: Runs TypeScript files directly.
- **@types/\***: TypeScript type definitions for various libraries.

---

## Uploading Post Images

When a user inserts an image through the Quill editor we use a custom toolbar handler (quillImageHandler) that uploads the image to the backend and sets a loader state to true so the UI shows a spinner and blocks user actions while the upload is in progress. The backend uploads the file to Cloudinary and responds with a secure_url and a public_id.

To handle temporary uploads and automatic cleanup, the backend creates a Redis key with a TTL and associated expiration logic. If the post is never published or the user abandons the editor (closes the page, cancels, etc.), the Redis TTL triggers server-side cleanup: the uploaded image(s) are removed from Cloudinary (and the folder removed if empty). When a post is successfully published or edited, the temporary Redis key is deleted so the TTL cleanup does not run.

On the frontend we use a CustomImageBlot (a class that extends Quill’s image blot) so the editor can embed an object { secure_url, public_id } instead of a plain src string. CustomImageBlot:

- create(): accepts an object and sets both src (secure_url) and a custom attribute data-public-id (public_id) on the image node.
- value(): returns the object { secure_url, public_id } for persistence.

For deletions, we listen to Quill's text-change events and compare the previous delta with the current delta. If an image has been removed (detected by comparing public_ids extracted from both deltas), we add those public_ids to a deletedIds state. When the user publishes or updates the post, deletedIds are sent with the post payload to the backend, which deletes the images in parallel (Promise.allSettled) from Cloudinary.

This flow keeps image uploads responsive, prevents orphaned files, and ensures published posts retain their images while temporary uploads are automatically cleaned up.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) (for containerized setup)
- [MySQL](https://www.mysql.com/) (if not using Docker)
- [Redis](https://redis.io/) (if not using Docker)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)
- [Clerk](https://clerk.com/) account (for authentication)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd Blog-App-Backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your credentials.

4. **Run database migrations:**

   ```bash
   npx prisma migrate deploy
   ```

5. **Start the app (development mode):**
   ```bash
   npm run local:watch
   ```

---

## Docker Usage

This app is fully containerized for easy deployment.

1. **Build and start the containers for dev mode :**

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
   ```

2. **Build and start the containers for production mode :**

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

   _(Check the `Dockerfile` and `docker-compose.yml` for configuration details.)_

3. **Default exposed port:**  
   The backend API is available on **port 5001** (unless overridden in your `.env`).

---

## Database Diagram

<img
        src="https://res.cloudinary.com/dvvmu40wx/image/upload/v1760553147/Public%20images/Blog_app_DB_schema_fds3fm.png"
        alt="Blog app DB design"
/>

---

## Deployment

Main Endpoint: [https://bh5rsluyme.execute-api.us-east-1.amazonaws.com/](https://bh5rsluyme.execute-api.us-east-1.amazonaws.com/)

---

## API Collections

Link : [https://documenter.getpostman.com/view/25990827/2sB3WpQLBZ](https://documenter.getpostman.com/view/25990827/2sB3WpQLBZ)

---

## License

This project is licensed under the ISC License.

---
