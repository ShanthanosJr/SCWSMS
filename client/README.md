# Unified Frontend for SCWMS

## Overview

This is the unified frontend application for the Smart Construction Workflow & Safety Management System (SCWMS). It integrates all five modules (WSPM, ETM, CIM, MISTM, PTFD) into a single React application with module-specific routing.

## Technology Stack

- React.js (Create React App)
- React Router v6 for navigation
- Bootstrap 5 for UI components
- Axios for API communication
- Concurrently for development scripts

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

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

## Project Structure

```
src/
├── App.js              # Main application component with routing
├── Nav.js              # Navigation component for module switching
├── modules/            # Individual module components
│   ├── wspm/           # Worker Safety & Payroll Management
│   ├── etm/            # Equipment Tracking Management
│   ├── cim/            # Compliance & Inspection Management
│   ├── mistm/          # Materials & Suppliers Tracking Management
│   └── ptfd/           # Projects Timeline & Financial Dashboard
└── index.js            # Entry point
```

## Module Integration

Each module is integrated as a React component under the `/modules` directory. The main `App.js` file sets up routing for all modules:

- `/wspm/*` - Worker Safety & Payroll Management
- `/etm/*` - Equipment Tracking Management
- `/cim/*` - Compliance & Inspection Management
- `/mistm/*` - Materials & Suppliers Tracking Management
- `/ptfd/*` - Projects Timeline & Financial Dashboard

## Navigation

The `Nav.js` component provides top-level navigation between modules. Each module maintains its own internal routing structure.

## API Integration

The frontend communicates with backend services through HTTP requests. Each module's components make API calls to their respective backend services:

- WSPM API: `http://localhost:5001/api/`
- ETM API: `http://localhost:5002/api/`
- CIM API: `http://localhost:5003/api/`
- MISTM API: `http://localhost:5004/api/`
- PTFD API: `http://localhost:5050/`

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the client directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3000
```

## Development

### Adding New Modules

To add a new module:

1. Create a new directory under `src/modules/`
2. Copy the module's frontend files into this directory
3. Create a main component file (e.g., `ModuleNameModule.js`)
4. Update `App.js` to include the new route
5. Add navigation link in `Nav.js`

### Styling

The application uses Bootstrap 5 for styling. Custom styles can be added to individual component files or to the main `index.css` file.

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