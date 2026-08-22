# 🤝 Contributing to Dayflow HRMS

Thank you for your interest in contributing to **Dayflow HRMS**! We welcome contributions from engineers, designers, and testers of all backgrounds to build the world's most elegant, robust, and accessible enterprise workforce platform.

---

## 📜 Code of Conduct

This project is governed by standard open-source community guidelines. By participating, you agree to uphold a welcoming, respectful, and harassment-free environment for everyone.

---

## 🏗️ Architecture & Development Principles

To maintain strict production-grade software engineering standards, all contributions must adhere to the following principles:

1. **Strict N-Layer Backend Separation**:
   - `Router`: Route mappings and middleware bindings only.
   - `Middleware`: Authentication, RBAC, input validation, rate limiting, and request tracing.
   - `Controller`: HTTP request extraction and standardized response mapping (`res.status().json()`).
   - `Service`: Pure business logic, calculations, domain transactions, and orchestration.
   - `Repository`: Direct PostgreSQL / Prisma database queries.
2. **ES Modules & JavaScript**:
   - Use standard Node.js ES Module syntax (`import`/`export`).
   - Always include `.js` file extensions in relative import paths.
3. **Database Integrity**:
   - Never perform destructive migrations on shared databases without backward-compatible migration scripts.
   - Always utilize composite unique constraints and transactional blocks for multi-step mutations.
4. **Error Handling**:
   - Throw specialized domain errors (`ValidationError`, `UnauthorizedError`, `NotFoundError`, etc.) derived from `AppError`.
   - Never leak internal database stack traces in client-facing HTTP error responses.

---

## 🚀 How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/DataFlow_V0.1.git
cd DataFlow_V0.1
```

### 2. Create a Feature Branch
Use semantic branch naming:
- `feat/add-biometric-attendance`
- `fix/payroll-unpaid-multiplier`
- `docs/update-swagger-schema`
- `refactor/redis-sliding-window`

```bash
git checkout -b feat/your-feature-name
```

### 3. Setup Local Environment
```bash
# Setup Backend
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

# Setup Frontend (in separate terminal)
cd ../frontend
npm install
npm run dev
```

### 4. Running Tests
Ensure all unit and integration test suites pass before opening a PR:
```bash
cd backend
node tests/runAllTests.js
```

### 5. Commit Guidelines
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```bash
feat(payroll): support customized tax exemption slabs
fix(attendance): resolve midnight rollover work hour calculation
docs(readme): add docker-compose installation section
```

### 6. Submitting a Pull Request
1. Push your branch to your forked repository:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of `naveencmy/DataFlow_V0.1`.
3. Provide a clear description of the problem, proposed solution, and screenshots/recordings for any visual UI changes.

---

## 📋 Pull Request Review Checklist

- [ ] Code follows the strict N-Layer architecture guidelines.
- [ ] No direct business logic placed inside controllers or route files.
- [ ] Zod schema validation is present for all new request endpoints.
- [ ] Database queries are parameterized to prevent SQL injection.
- [ ] Unit or integration tests are added/updated for new features.
- [ ] All automated tests pass locally (`node tests/runAllTests.js`).

---

## 📄 License

By contributing to Dayflow HRMS, you agree that your contributions will be licensed under the **Apache License 2.0**.
