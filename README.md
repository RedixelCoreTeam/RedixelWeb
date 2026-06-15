# Redixel Web

Redixel Web is the official frontend and interactive playground for the [Redixel Game Engine](https://github.com/RedixelCoreTeam/Redixel).

The primary goal of this repository is to demonstrate Redixel's cross-platform capabilities by running its native Rust games directly in the browser using **WebAssembly (WASM)** and **WebGPU**. It features a dynamic, CRT-themed UI that automatically catalogs and runs engine examples.

## How It Works

This repository serves strictly as the presentation layer. **No game logic or Rust code is maintained here.** Instead, it relies on an automated CI/CD pipeline connected to the main [Redixel Engine repository](https://github.com/RedixelCoreTeam/Redixel). Whenever the engine's `main` branch is updated:

1. The engine's CI compiles the examples (e.g., Pong, Shooter) into `.wasm` and `.js` bindings.
2. A build script generates a `games_manifest.json` containing the metadata (title, description, tags) from the engine's `Cargo.toml` files.
3. These artifacts are automatically pushed to the `public/static/` directory of this repository.
4. The React application dynamically fetches the manifest and renders the games in the browser.

## Tech Stack

- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Integration:** WebAssembly (WASM) + WebGPU (via Redixel Engine)

## Links

- [Redixel Engine Repository](https://github.com/RedixelCoreTeam/Redixel)
- [WebGPU Implementation Status](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status)

## License

Redixel Web is distributed under the terms of the MIT License.

See [LICENSE](./LICENSE) for details.

Copyright 2026 Redixel Core Team.
