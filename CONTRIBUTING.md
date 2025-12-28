# Contributing to LastMile Deployment Platform

Thank you for your interest in contributing to LastMile! We welcome contributions from the community and are grateful for your support.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and considerate in all interactions.

**Our Pledge:**
- Be welcoming and inclusive
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Node version, browser, etc.)
- **Code samples** or error messages
- **Screenshots** if applicable

**Use this template:**

```markdown
**Description:**
A clear description of the bug.

**Steps to Reproduce:**
1. Initialize SDK with...
2. Call method...
3. See error

**Expected Behavior:**
What should have happened.

**Actual Behavior:**
What actually happened.

**Environment:**
- OS: [e.g., macOS 14.0]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]
- SDK Version: [e.g., 1.0.0]

**Additional Context:**
Any other relevant information.
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **Clear use case** - Why is this needed?
- **Proposed solution** - How would it work?
- **Alternatives considered** - What other approaches did you think about?
- **Impact** - Who would benefit from this?

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** for new functionality
5. **Update documentation**
6. **Commit your changes** (see commit message guidelines)
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

---

## 💻 Development Setup

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Git

### Setup Steps

1. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/lastmile-deployment-platform.git
cd lastmile-deployment-platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open example in browser:**
```bash
npm run serve
# Visit http://localhost:8080
```

### Project Structure

```
lastmile-deployment-platform/
├── lastmile.js          # Core SDK
├── server.js            # API server
├── example.html         # Demo/example
├── lastmile.d.ts        # TypeScript definitions
├── package.json         # Dependencies
├── README.md            # Main documentation
├── CHANGELOG.md         # Version history
├── CONTRIBUTING.md      # This file
└── LICENSE              # MIT license
```

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] No merge conflicts
- [ ] Branch is up-to-date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Follows code style guidelines
```

### Review Process

1. **Automated checks** run on all PRs
2. **Maintainer review** - Usually within 48 hours
3. **Address feedback** if requested
4. **Approval and merge** by maintainer

---

## 📝 Coding Standards

### JavaScript Style

- Use **ES6+** features
- **Semicolons** required
- **Single quotes** for strings
- **2 spaces** for indentation
- **camelCase** for variables and functions
- **PascalCase** for classes
- **UPPER_CASE** for constants

### Example

```javascript
// Good
const apiKey = 'abc123';
const deploymentId = generateId();

class LastMile {
  constructor(config) {
    this.config = config;
  }
  
  deploy(options) {
    // implementation
  }
}

// Bad
const api_key = "abc123"
const DeploymentID = GenerateID()
```

### Documentation

- **JSDoc comments** for all public methods
- **Inline comments** for complex logic
- **README updates** for new features

Example:
```javascript
/**
 * Deploy code to production
 * @param {Object} deployment - Deployment configuration
 * @param {string} deployment.code - Code to deploy
 * @returns {Promise<Object>} Deployment result
 */
deploy(deployment) {
  // Implementation
}
```

---

## 💬 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Examples

```bash
feat(sdk): add deployment rollback functionality

Implement rollback method to revert to previous deployment.
Includes status checking and validation.

Closes #123

fix(api): correct status polling timeout

The polling timeout was incorrectly set to 5 minutes.
Changed to 10 minutes to allow for larger deployments.

docs(readme): update installation instructions

Added npm installation method and updated CDN example.
```

### Best Practices

- Use **present tense** ("add" not "added")
- Use **imperative mood** ("move" not "moves")
- **Capitalize** first letter
- **No period** at the end
- **Reference issues** in footer
- **Keep subject line** under 50 characters
- **Wrap body** at 72 characters

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Writing Tests

- **Test new features** thoroughly
- **Test edge cases** and error conditions
- **Use descriptive names** for test cases
- **Keep tests isolated** and independent

Example:
```javascript
describe('LastMile.deploy()', () => {
  it('should deploy code successfully', async () => {
    const result = await lastMile.deploy({
      projectName: 'test-app',
      code: 'console.log("test");'
    });
    
    expect(result.deploymentId).toBeDefined();
    expect(result.status).toBe('queued');
  });
  
  it('should throw error for missing code', async () => {
    await expect(
      lastMile.deploy({ projectName: 'test' })
    ).rejects.toThrow('code is required');
  });
});
```

---

## 📚 Documentation

### What to Document

- **Public API** - All public methods and properties
- **Configuration** - All options and their defaults
- **Examples** - Common use cases
- **Migration guides** - For breaking changes

### Where to Document

- **Code comments** - JSDoc for functions
- **README.md** - Main documentation
- **CHANGELOG.md** - Version changes
- **Type definitions** - TypeScript `.d.ts` files

### Documentation Style

- **Be clear and concise**
- **Use examples** to illustrate
- **Link to related docs**
- **Update all affected docs** when making changes

---

## 🎯 Areas We Need Help

We especially welcome contributions in these areas:

- 🐛 **Bug fixes** - Check the [issues](https://github.com/navin3756/lastmile-deployment-platform/issues)
- 📖 **Documentation** - Improve clarity, add examples
- 🧪 **Tests** - Increase code coverage
- 🌍 **Examples** - More integration examples
- ♿ **Accessibility** - Improve SDK accessibility
- 🌐 **Internationalization** - Multi-language support

---

## ❓ Questions?

- **GitHub Discussions:** Ask questions and share ideas
- **Issues:** Report bugs and request features
- **Email:** dev@lastmile.dev

---

## 🙏 Recognition

All contributors will be recognized in our README and release notes. Thank you for making LastMile better!

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to LastMile! 🚀**
