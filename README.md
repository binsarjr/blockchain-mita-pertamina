# Sveltekit Boilerplate

This is a boilerplate for a SvelteKit project. It includes:

## Installation

You can choose to use [pnpm](https://pnpm.io/) or [bun](https://bun.sh/) or any other package manager.

But for this boilerplate i use [pnpm](https://pnpm.io/).

### 1. Clone the repository

```bash
git clone https://github.com/binsarjr/sveltekit-boilerplate
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm run dev
```

### 4. Build the application

```bash
pnpm run build
```

### 5. Preview the application

```bash
pnpm run preview
```

## Included

- [Typescript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TailwindCSS](https://tailwindcss.com/) and [Tailwindcss Typography](https://github.com/tailwindlabs/tailwindcss-typography)

## Deployment

This boilerplate is designed to be deployed on Virtual Private Servers (VPS) or any other hosting service that supports Node.js and SvelteKit.

You can deploy the application to any hosting service that supports Node.js and SvelteKit.

For deployemnt, on this boilerplate i use socket file instead of port number. because I don't want to create a lot of ports that then in the end I do a reverse proxy and I think that would be rubbish. but sometimes the problem is the file permissions. But that has been resolved from the [systemd service](./etc/systemd/your-app.service)

## License

[MIT](https://choosealicense.com/licenses/mit/)
