# 🏗️ Hosting WintrChess locally

> This is a guide on how to get WintrChess running on your local machine.

WintrChess does not need a database, user accounts or any API keys. The server only
serves static files: engine analysis and move classification run in the browser, and
saved games are stored in the browser's IndexedDB.

## Prerequisites

- Git
- Node.js 22 or later
- Docker, if you want to host with that

## Setup

### Clone the repository

```sh
git clone https://github.com/wintrcat/wintrchess.git

# Go to the directory
cd wintrchess
```

### Environment variables (optional)

You can put these in a `.env` file in the project root:

```toml
PORT=8080
```

The port that the server listens on. Defaults to `8080`.

```toml
NODE_ENV="production"
```

The environment that the app is built and run in: `production` (default) or `development`.

## Deploy manually

### Install dependencies

```sh
npm install
```

### Build the app

```sh
npm run build
```

You can also compile individual workspaces with the `-w` flag:

```sh
npm run build -w shared
npm run build -w server
npm run build -w client
```

### Start the server

```sh
npm start
```

The server will listen on the port that you defined, or `8080` if you have not defined one.

## Deploy with Docker

```sh
docker compose up
```
