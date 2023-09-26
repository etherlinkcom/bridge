A simple webapp bridging ꜩ between Tezos L1 and L2 EVM.

## Prerequisites

- Node.js (v18.15.0 or higher)
- yarn (v1.22.19 or higher)

## Getting Started

Install depandancies:

```bash
yarn
```

### Development:

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production:

```bash
yarn build
yarn start
```

## Docker

### Build & Run

```bash
docker build -t evm-bridge .
docker run -p 3000:3000 evm-bridge
```

### Compose

```bash
docker compose up -d
```

## License

EVM Bridge is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
