# HR Certificate Portal

[![CI](https://github.com/Chaitra-Yogananda/Certificate-Download-FE-HR-Portal/actions/workflows/ci.yml/badge.svg)](https://github.com/Chaitra-Yogananda/Certificate-Download-FE-HR-Portal/actions/workflows/ci.yml)
[![CD](https://github.com/Chaitra-Yogananda/Certificate-Download-FE-HR-Portal/actions/workflows/cd.yml/badge.svg)](https://github.com/Chaitra-Yogananda/Certificate-Download-FE-HR-Portal/actions/workflows/cd.yml)
[![Security Scan](https://github.com/Chaitra-Yogananda/Certificate-Download-FE-HR-Portal/actions/workflows/security.yml/badge.svg)](https://github.com/Chaitra-Yogananda/Certificate-Download-FE-HR-Portal/actions/workflows/security.yml)

This project is an HR Certificate Download Portal bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline with the following workflows:

### Continuous Integration (CI)
- **Build and Test**: Runs on push/PR to main and develop branches
  - Tests on Node.js 18.x and 20.x
  - Installs dependencies and runs tests
  - Builds the application
  - Uploads build artifacts and coverage reports
  - Code quality checks

### Continuous Deployment (CD)
- **Staging Deployment**: Automatic deployment to staging on push to main
- **Production Deployment**: Automatic deployment on version tags (v*.*.*)
- **Manual Deployment**: Can be triggered manually via workflow dispatch

### Security Scanning
- **Weekly Security Audits**: Runs every Monday
- **Dependency Review**: Runs on pull requests
- **CodeQL Analysis**: Static code analysis for security vulnerabilities
- **npm Audit**: Checks for vulnerable dependencies

### Pull Request Checks
- **PR Metadata Validation**: Checks PR title format
- **Commit Message Linting**: Validates commit messages
- **Changed Files Tracking**: Lists all changed files

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
