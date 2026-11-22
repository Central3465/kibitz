<h1 align="center">
    <img width="96" src="client/public/img/logo.svg" alt="" />
    <br>
    Kibitz
</h1>

<p align="center">
    Free, private chess game analysis with move classifications. Runs entirely in your browser.
</p>

## ✨ Features

- **Game review** – import a game and get Stockfish evaluations, an evaluation graph, accuracy for both players and a classification for every move.
- **Import from anywhere** – paste a PGN, upload a `.pgn` file, start from a FEN, or search your Chess.com and Lichess games by username.
- **Live analysis** – play moves on the board at any point. New moves are evaluated and classified as you go, and variations are kept in the move tree.
- **Saved games** – keep analysed games in your browser and come back to them later.
- **Mobile friendly** – the board, analysis panel and move navigation adapt to small screens.
- **Private by design** – no accounts, no ads, no analytics or tracking. Settings and saved games never leave your device.
- **Customisable** – engine version, depth, number of lines, suggestion arrows, board colours and which classifications to show.
- **Translations** – available in 11 languages.

## 🏷️ Move classifications

Each move is compared with the engine's best move using *expected points*: the chance of winning (0 to 1) in the position. The less a move gives away, the better its classification.

| | Classification | Meaning |
|---|---|---|
| <img src="client/public/img/classifications/brilliant.png" width="20"> | Brilliant | A strong sacrifice that can't simply be taken safely |
| <img src="client/public/img/classifications/critical.png" width="20"> | Critical | The only good move: every alternative loses a lot |
| <img src="client/public/img/classifications/best.png" width="20"> | Best | The engine's top choice, or just as good |
| <img src="client/public/img/classifications/excellent.png" width="20"> | Excellent | Loses less than 3.5% |
| <img src="client/public/img/classifications/okay.png" width="20"> | Okay | Loses less than 7% |
| <img src="client/public/img/classifications/inaccuracy.png" width="20"> | Inaccuracy | Loses less than 11% |
| <img src="client/public/img/classifications/miss.png" width="20"> | Miss | Fails to punish the opponent's mistake, without throwing the game |
| <img src="client/public/img/classifications/mistake.png" width="20"> | Mistake | Loses less than 20% |
| <img src="client/public/img/classifications/blunder.png" width="20"> | Blunder | Loses 20% or more |
| <img src="client/public/img/classifications/theory.png" width="20"> | Theory | A known opening move |
| <img src="client/public/img/classifications/forced.png" width="20"> | Forced | The only legal move |

When the played move was one of the engine's candidate lines, it is scored using that line's evaluation from the same search, which keeps classifications consistent. Mate evaluations are handled separately, so you won't be punished for choosing a slightly longer mate or for escaping one.

## 🚀 Getting started

Requires **Node.js 22+**. No database or API keys are needed.

```sh
git clone https://github.com/central3465/wintrchess.git
cd wintrchess
npm install
npm start
```

Then open [http://localhost:8080](http://localhost:8080).

The first `npm start` builds the project automatically, which takes about a minute. After changing the code, run `npm run dev` to rebuild everything and start the server, or `npm run build` to only rebuild.

### With Docker

```sh
docker compose up
```

### Configuration

Optionally create a `.env` file in the project root:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Port the server listens on |
| `NODE_ENV` | `production` | `production` or `development` |

## 📂 Project structure

This is an npm workspaces monorepo:

| Package | Description |
|---|---|
| `client` | React + TypeScript frontend, bundled with webpack. Runs Stockfish (WebAssembly) and the move classifier in the browser. |
| `shared` | Chess logic shared by the other packages: the game state tree, PGN handling, and the reporter that classifies moves and calculates accuracy. |
| `server` | A small Express server that serves the built pages and static assets. |

Useful scripts:

```sh
npm start                  # start the server (builds first if needed)
npm run dev                # rebuild everything, then start
npm run build              # build every package
npm run build -w client    # build a single package (shared, server or client)
npm run lint               # lint the codebase
```

## 🤝 Contributing

Issues and pull requests are welcome. Please run `npm run lint` and make sure `npm run build` succeeds before opening a pull request.

## 📜 Credits & license

Kibitz is based on [WintrChess](https://github.com/WintrCat/wintrchess) by WintrCat. It is licensed under the GNU GPL v3; see [LICENSE](LICENSE).
