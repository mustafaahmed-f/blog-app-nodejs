# Node.js TypeScript Prisma Learning App

This project is a Node.js application written in TypeScript, created to learn and experiment with [Prisma](https://www.prisma.io/). The app is fully dockerized for easy setup and deployment.

## Features

- Node.js + TypeScript backend
- Uses Prisma ORM for database access
- Fully dockerized (see Docker files for details)
- Express server with CORS and logging (Morgan)
- Environment variable management with dotenv

## Used Libraries

### Dependencies

- `@prisma/client`
- `cors`
- `dotenv`
- `express`
- `morgan`

### Dev Dependencies

- `@types/cors`
- `@types/express`
- `@types/morgan`
- `@types/node`
- `nodemon`
- `ts-node`
- `typescript`

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Build the project**
   ```bash
   npm run build
   ```
4. **Run in development mode**
   ```bash
   npm run dev
   ```
5. **Run with Docker**
   - Build and start containers using Docker Compose:
     ```bash
     docker-compose -f docker-compose.yml -f [optional-docker-compose-file (may be .dev.yml , .prod.yml or .build.yml according to target environment)] up -d --build
     ```

## Scripts

- `build`: Compile TypeScript to JavaScript
- `dev`: Run in development mode with ts-node
- `prod`: Run compiled code
- `local:watch`: Watch for changes and restart automatically

## License

ISC

---

This app is for learning and experimenting with Prisma in a Node.js + TypeScript environment. - `index.ts`: Main entry point of the application. - `helloWorld.ts`: Example module demonstrating TypeScript functionality.

- `dist/`: Output directory where the compiled JavaScript files are stored.

## Configuration Files

- `tsconfig.json`: TypeScript compiler configuration.
- `package.json`: Project metadata and script definitions.
- `nodemon.json`: Nodemon configuration for development.
