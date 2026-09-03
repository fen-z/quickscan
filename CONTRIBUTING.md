# Contributing to Quick Scan

Thank you for your interest in contributing to Quick Scan! This document provides guidelines and best practices for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/quickscan.git`
3. Install dependencies: `npm install`
4. Copy the environment template: `cp .env.example .env`
5. Configure your environment variables in `.env`

## Development Workflow

### Setting Up Your Environment

Before starting development, ensure you have:

- Node.js 18.x or higher
- npm (comes with Node.js)
- A text editor or IDE

### Environment Variables

This project uses environment variables for configuration. Never commit sensitive information to the repository:

1. Use `.env.example` as a template
2. Create your own `.env` file locally
3. Add any new environment variables to both `.env.example` (with placeholder values) and the README

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Running Tests

```bash
npm test
```

Ensure all tests pass before submitting a pull request.

## Code Style and Standards

### General Guidelines

- Write clean, readable code with clear variable names
- Add comments for complex logic
- Follow the existing code structure and patterns
- Keep functions small and focused on a single responsibility

### Security Guidelines

- **Never commit sensitive data** (API keys, passwords, email addresses, tokens)
- Store all sensitive configuration in environment variables
- Use `.env.example` for documenting required variables
- Review your changes before committing to ensure no secrets are included
- Run `git diff` before committing to verify what you're adding

### Testing

- Write tests for new features
- Ensure existing tests continue to pass
- Test your changes manually in the browser

## Pull Request Process

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes following the guidelines above
3. Run tests: `npm test`
4. Build the application: `npm run build`
5. Commit your changes with clear, descriptive messages
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a pull request against the `main` branch

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Keep pull requests focused on a single feature or fix

### Automatic Branch Deletion

To keep the repository clean, merged branches are automatically deleted after pull requests are successfully merged. This is handled by a GitHub Actions workflow that:

- Only deletes branches when a PR is merged (not just closed)
- Protects important branches (main, work, master, develop, production, staging) from deletion
- Preserves branches with the `keep-` prefix (e.g., `keep-feature-name`)
- Runs automatically without requiring any manual action

If you need to preserve a branch after merging:
1. Name your branch with a `keep-` prefix when creating it (e.g., `keep-experimental-feature`)
2. Or coordinate with maintainers to add it to the protected branches list

### Close All Pull Requests (Maintenance)

For repository maintenance, there is a manual workflow that closes all open pull requests and deletes their associated branches in one step. To run it:

1. Go to **Actions** → **Close All Pull Requests**
2. Click **Run workflow**
3. Optionally provide a reason (shown as a comment on each closed PR)
4. Click **Run workflow**

This workflow:
- Posts a comment on each PR explaining why it is being closed
- Closes all open PRs
- Deletes all non-protected, non-`keep-` branches
- Preserves protected branches (main, work, master, develop, production, staging) and branches with the `keep-` prefix

## Security

If you discover a security vulnerability, please do not create a public issue. Instead, refer to our [Security Policy](SECURITY.md) for reporting instructions.

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Check existing issues and pull requests
- Review the project documentation

Thank you for contributing to Quick Scan!
