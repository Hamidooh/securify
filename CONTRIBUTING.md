# Contributing to Securify

Thank you for helping build **Securify**, the open-source DevSecOps & web security auditor!

## 🛠️ Development Setup

1. Fork & clone repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/securify.git
   cd securify
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development environment:
   ```bash
   npm run dev
   ```
   - Frontend runs on: `http://localhost:5174`
   - Scanner engine runs on: `http://localhost:3002`

## 🧪 Tests & Verification

Before submitting PRs, verify:
```bash
npm test
npm run build
```

## 📜 Pull Request Process

1. Create a feature branch: `git checkout -b feat/add-security-check`.
2. Commit with conventional commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
3. Open a Pull Request on GitHub.
