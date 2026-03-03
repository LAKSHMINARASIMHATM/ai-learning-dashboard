"use strict";
// Learning Path Templates for Technology Tracks
// Each track contains modules with specific milestones and checklists
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathsByDifficulty = exports.getPathsByCategory = exports.getPathById = exports.allLearningPaths = exports.aiPath = exports.backendPath = exports.reactSpecialistPath = exports.frontendPath = exports.fullStackPath = void 0;
// ============================================
// FULL STACK DEVELOPMENT TRACK
// ============================================
exports.fullStackPath = {
    id: 'fullstack-web-dev',
    title: 'Full Stack Web Development',
    description: 'Master both frontend and backend development to become a complete web developer',
    category: 'Web Development',
    totalWeeks: 12,
    difficulty: 'intermediate',
    tags: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Fullstack'],
    outcomes: [
        'Build complete web applications from scratch',
        'Design and implement RESTful APIs',
        'Work with databases and authentication',
        'Deploy applications to production',
        'Follow industry best practices'
    ],
    targetRoles: ['Full Stack Developer', 'Web Developer', 'Software Engineer'],
    modules: [
        {
            id: 'fs-mod-1',
            title: 'JavaScript Fundamentals',
            description: 'Master core JavaScript concepts and modern ES6+ features',
            order: 1,
            estimatedWeeks: 2,
            difficulty: 'beginner',
            prerequisites: [],
            milestones: [
                {
                    id: 'fs-m1-ms1',
                    title: 'Core JavaScript',
                    description: 'Variables, data types, operators, and control flow',
                    passingScore: 70,
                    quizTopic: 'JavaScript',
                    checklistItems: [
                        { id: 'fs-m1-c1', title: 'Understand var, let, and const', description: 'Learn the differences between variable declarations', estimatedHours: 1, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=XgSjoHgy3Rk' },
                        { id: 'fs-m1-c2', title: 'Master data types', description: 'Strings, numbers, booleans, null, undefined, symbols', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://javascript.info/types' },
                        { id: 'fs-m1-c3', title: 'Control flow statements', description: 'if/else, switch, loops (for, while, do-while)', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#basic-javascript' },
                        { id: 'fs-m1-c4', title: 'Practice: Build a calculator', description: 'Create a simple calculator using vanilla JS', estimatedHours: 3, resourceType: 'project', isRequired: true, url: 'https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript/' },
                    ]
                },
                {
                    id: 'fs-m1-ms2',
                    title: 'Modern JavaScript (ES6+)',
                    description: 'Arrow functions, destructuring, spread operator, modules',
                    passingScore: 70,
                    quizTopic: 'JavaScript',
                    checklistItems: [
                        { id: 'fs-m1-c5', title: 'Arrow functions', description: 'Syntax and this binding differences', estimatedHours: 1.5, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=h33Srr5J9nY' },
                        { id: 'fs-m1-c6', title: 'Destructuring assignment', description: 'Object and array destructuring', estimatedHours: 1, resourceType: 'article', isRequired: true, url: 'https://javascript.info/destructuring-assignment' },
                        { id: 'fs-m1-c7', title: 'Spread and rest operators', description: 'Using ... for arrays and objects', estimatedHours: 1, resourceType: 'exercise', isRequired: true, url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#es6' },
                        { id: 'fs-m1-c8', title: 'ES6 modules', description: 'Import/export syntax', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://javascript.info/modules-intro' },
                        { id: 'fs-m1-c9', title: 'Complete JavaScript quiz', description: 'Test your JavaScript knowledge', estimatedHours: 0.5, resourceType: 'quiz', isRequired: true, url: 'https://www.w3schools.com/js/js_quiz.asp' },
                    ]
                },
                {
                    id: 'fs-m1-ms3',
                    title: 'Asynchronous JavaScript',
                    description: 'Callbacks, Promises, async/await',
                    passingScore: 75,
                    quizTopic: 'JavaScript',
                    checklistItems: [
                        { id: 'fs-m1-c10', title: 'Understand callbacks', description: 'Callback pattern and callback hell', estimatedHours: 1, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=QSqc6MMS6Fk' },
                        { id: 'fs-m1-c11', title: 'Master Promises', description: 'Creating and chaining promises', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://javascript.info/promise-basics' },
                        { id: 'fs-m1-c12', title: 'Async/await syntax', description: 'Modern async programming', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#basic-algorithm-scripting' },
                        { id: 'fs-m1-c13', title: 'Fetch API', description: 'Making HTTP requests', estimatedHours: 1.5, resourceType: 'exercise', isRequired: true, url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' },
                        { id: 'fs-m1-c14', title: 'Project: Weather app', description: 'Build an app that fetches weather data', estimatedHours: 4, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=WZNG8UomjSI' },
                    ]
                }
            ]
        },
        {
            id: 'fs-mod-2',
            title: 'React Fundamentals',
            description: 'Build modern user interfaces with React',
            order: 2,
            estimatedWeeks: 2,
            difficulty: 'intermediate',
            prerequisites: ['fs-mod-1'],
            milestones: [
                {
                    id: 'fs-m2-ms1',
                    title: 'React Basics',
                    description: 'Components, JSX, and props',
                    passingScore: 70,
                    quizTopic: 'React',
                    checklistItems: [
                        { id: 'fs-m2-c1', title: 'Understand JSX syntax', description: 'How JSX compiles to JavaScript', estimatedHours: 1, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=7fPXI_MnBOY' },
                        { id: 'fs-m2-c2', title: 'Create functional components', description: 'Component structure and naming', estimatedHours: 1.5, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/your-first-component' },
                        { id: 'fs-m2-c3', title: 'Pass and use props', description: 'Data flow between components', estimatedHours: 1.5, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/passing-props-to-a-component' },
                        { id: 'fs-m2-c4', title: 'Conditional rendering', description: 'Rendering based on conditions', estimatedHours: 1, resourceType: 'article', isRequired: true, url: 'https://react.dev/learn/conditional-rendering' },
                        { id: 'fs-m2-c5', title: 'Lists and keys', description: 'Rendering lists efficiently', estimatedHours: 1, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/rendering-lists' },
                    ]
                },
                {
                    id: 'fs-m2-ms2',
                    title: 'React Hooks',
                    description: 'useState, useEffect, and custom hooks',
                    passingScore: 75,
                    quizTopic: 'React',
                    checklistItems: [
                        { id: 'fs-m2-c6', title: 'useState hook', description: 'Managing component state', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=O6P86uwfdR0' },
                        { id: 'fs-m2-c7', title: 'useEffect hook', description: 'Side effects and cleanup', estimatedHours: 2.5, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/synchronizing-with-effects' },
                        { id: 'fs-m2-c8', title: 'useRef and useContext', description: 'Refs and context API', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://react.dev/learn/referencing-values-with-refs' },
                        { id: 'fs-m2-c9', title: 'Custom hooks', description: 'Creating reusable logic', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
                        { id: 'fs-m2-c10', title: 'Project: Todo app', description: 'Build a full-featured todo application', estimatedHours: 5, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=T8mqZZ0r-RA' },
                    ]
                }
            ]
        },
        {
            id: 'fs-mod-3',
            title: 'TypeScript Essentials',
            description: 'Add type safety to your JavaScript applications',
            order: 3,
            estimatedWeeks: 1.5,
            difficulty: 'intermediate',
            prerequisites: ['fs-mod-1'],
            milestones: [
                {
                    id: 'fs-m3-ms1',
                    title: 'TypeScript Fundamentals',
                    description: 'Types, interfaces, and generics',
                    passingScore: 70,
                    quizTopic: 'TypeScript',
                    checklistItems: [
                        { id: 'fs-m3-c1', title: 'Basic types', description: 'string, number, boolean, arrays, tuples', estimatedHours: 1.5, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs' },
                        { id: 'fs-m3-c2', title: 'Interfaces', description: 'Defining object shapes', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html' },
                        { id: 'fs-m3-c3', title: 'Union and intersection types', description: 'Combining types', estimatedHours: 1, resourceType: 'exercise', isRequired: true, url: 'https://exercism.org/tracks/typescript/exercises' },
                        { id: 'fs-m3-c4', title: 'Generics basics', description: 'Creating flexible, reusable types', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
                        { id: 'fs-m3-c5', title: 'TypeScript with React', description: 'Typing React components', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/typescript' },
                        { id: 'fs-m3-c6', title: 'Complete TypeScript quiz', description: 'Test your TypeScript knowledge', estimatedHours: 0.5, resourceType: 'quiz', isRequired: true, url: 'https://www.w3schools.com/typescript/typescript_quiz.php' },
                    ]
                }
            ]
        },
        {
            id: 'fs-mod-4',
            title: 'Node.js & Express',
            description: 'Build backend APIs with Node.js and Express',
            order: 4,
            estimatedWeeks: 2,
            difficulty: 'intermediate',
            prerequisites: ['fs-mod-1'],
            milestones: [
                {
                    id: 'fs-m4-ms1',
                    title: 'Node.js Basics',
                    description: 'Core concepts, npm, and modules',
                    passingScore: 70,
                    quizTopic: 'Node.js',
                    checklistItems: [
                        { id: 'fs-m4-c1', title: 'Node.js runtime', description: 'Understanding the event loop', estimatedHours: 1.5, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=ENrzD9HAZK4' },
                        { id: 'fs-m4-c2', title: 'npm packages', description: 'Installing and managing dependencies', estimatedHours: 1, resourceType: 'article', isRequired: true, url: 'https://docs.npmjs.com/about-npm' },
                        { id: 'fs-m4-c3', title: 'CommonJS vs ES modules', description: 'Module systems in Node', estimatedHours: 1, resourceType: 'article', isRequired: true, url: 'https://nodejs.org/api/esm.html' },
                        { id: 'fs-m4-c4', title: 'File system operations', description: 'Reading and writing files', estimatedHours: 1.5, resourceType: 'exercise', isRequired: true, url: 'https://nodejs.org/api/fs.html' },
                    ]
                },
                {
                    id: 'fs-m4-ms2',
                    title: 'Express.js & REST APIs',
                    description: 'Building RESTful APIs',
                    passingScore: 75,
                    quizTopic: 'APIs',
                    checklistItems: [
                        { id: 'fs-m4-c5', title: 'Express basics', description: 'Routes, middleware setup', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=SccSCuHhOw0' },
                        { id: 'fs-m4-c6', title: 'RESTful design', description: 'HTTP methods and status codes', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://restfulapi.net/' },
                        { id: 'fs-m4-c7', title: 'Request handling', description: 'Body parsing, query params', estimatedHours: 1.5, resourceType: 'exercise', isRequired: true, url: 'https://expressjs.com/en/guide/routing.html' },
                        { id: 'fs-m4-c8', title: 'Error handling middleware', description: 'Centralized error handling', estimatedHours: 1, resourceType: 'article', isRequired: true, url: 'https://expressjs.com/en/guide/error-handling.html' },
                        { id: 'fs-m4-c9', title: 'Project: Build a REST API', description: 'Create a CRUD API', estimatedHours: 5, resourceType: 'project', isRequired: true, url: 'https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/' },
                    ]
                }
            ]
        },
        {
            id: 'fs-mod-5',
            title: 'Databases & Authentication',
            description: 'Work with MongoDB and implement user authentication',
            order: 5,
            estimatedWeeks: 2,
            difficulty: 'intermediate',
            prerequisites: ['fs-mod-4'],
            milestones: [
                {
                    id: 'fs-m5-ms1',
                    title: 'MongoDB & Mongoose',
                    description: 'Database operations and modeling',
                    passingScore: 70,
                    checklistItems: [
                        { id: 'fs-m5-c1', title: 'MongoDB basics', description: 'Documents, collections, CRUD', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=ofme2o29ngU' },
                        { id: 'fs-m5-c2', title: 'Mongoose schemas', description: 'Defining data models', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://mongoosejs.com/docs/guide.html' },
                        { id: 'fs-m5-c3', title: 'Queries and aggregation', description: 'Advanced querying', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://www.mongodb.com/docs/manual/aggregation/' },
                        { id: 'fs-m5-c4', title: 'Data validation', description: 'Schema validation rules', estimatedHours: 1, resourceType: 'article', isRequired: true, url: 'https://mongoosejs.com/docs/validation.html' },
                    ]
                },
                {
                    id: 'fs-m5-ms2',
                    title: 'Authentication & Security',
                    description: 'JWT, password hashing, protected routes',
                    passingScore: 80,
                    checklistItems: [
                        { id: 'fs-m5-c5', title: 'Password hashing', description: 'bcrypt for secure passwords', estimatedHours: 1, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=AzA_LTDoFqY' },
                        { id: 'fs-m5-c6', title: 'JWT authentication', description: 'Token-based auth flow', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://jwt.io/introduction' },
                        { id: 'fs-m5-c7', title: 'Protected routes', description: 'Auth middleware', estimatedHours: 1.5, resourceType: 'exercise', isRequired: true, url: 'https://www.freecodecamp.org/news/how-to-authenticate-users-in-node-js/' },
                        { id: 'fs-m5-c8', title: 'Security best practices', description: 'CORS, rate limiting, validation', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html' },
                        { id: 'fs-m5-c9', title: 'Project: User auth system', description: 'Complete registration and login', estimatedHours: 6, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=Nlg0JrUt0qg' },
                    ]
                }
            ]
        },
        {
            id: 'fs-mod-6',
            title: 'Full Stack Integration',
            description: 'Connect frontend and backend into a complete application',
            order: 6,
            estimatedWeeks: 1.5,
            difficulty: 'advanced',
            prerequisites: ['fs-mod-2', 'fs-mod-4', 'fs-mod-5'],
            milestones: [
                {
                    id: 'fs-m6-ms1',
                    title: 'Frontend-Backend Integration',
                    description: 'API calls, state management, deployment',
                    passingScore: 75,
                    checklistItems: [
                        { id: 'fs-m6-c1', title: 'API integration', description: 'Connecting React to Express', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=w3vs4a03y3I' },
                        { id: 'fs-m6-c2', title: 'Environment configuration', description: 'Dev/prod environments', estimatedHours: 1, resourceType: 'article', isRequired: true, url: 'https://www.freecodecamp.org/news/how-to-use-node-environment-variables-with-a-dotenv-file-for-node-js-and-npm/' },
                        { id: 'fs-m6-c3', title: 'State management patterns', description: 'Context or Redux for API state', estimatedHours: 2.5, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/scaling-up-with-reducer-and-context' },
                        { id: 'fs-m6-c4', title: 'Deployment', description: 'Deploying to Vercel/Railway', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://vercel.com/docs/getting-started-with-vercel' },
                        { id: 'fs-m6-c5', title: 'Capstone project', description: 'Build a complete full-stack app', estimatedHours: 15, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=mrHNSanmqQ4' },
                    ]
                }
            ]
        }
    ]
};
// ============================================
// FRONTEND DEVELOPER TRACK
// ============================================
exports.frontendPath = {
    id: 'frontend-specialist',
    title: 'Frontend Development',
    description: 'Become an expert in building beautiful, responsive user interfaces',
    category: 'Web Development',
    totalWeeks: 8,
    difficulty: 'beginner',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX'],
    outcomes: [
        'Build responsive web interfaces',
        'Master React and modern CSS',
        'Implement animations and interactions',
        'Optimize frontend performance'
    ],
    targetRoles: ['Frontend Developer', 'UI Developer', 'React Developer'],
    modules: [
        {
            id: 'fe-mod-1',
            title: 'HTML & CSS Mastery',
            description: 'Foundation of web development',
            order: 1,
            estimatedWeeks: 2,
            difficulty: 'beginner',
            prerequisites: [],
            milestones: [
                {
                    id: 'fe-m1-ms1',
                    title: 'Modern CSS',
                    description: 'Flexbox, Grid, and responsive design',
                    passingScore: 70,
                    quizTopic: 'CSS',
                    checklistItems: [
                        { id: 'fe-m1-c1', title: 'Flexbox layout', description: 'Master flexible box layout', estimatedHours: 3, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=JJSoEo8JSnc' },
                        { id: 'fe-m1-c2', title: 'CSS Grid', description: 'Two-dimensional layouts', estimatedHours: 3, resourceType: 'exercise', isRequired: true, url: 'https://cssgridgarden.com/' },
                        { id: 'fe-m1-c3', title: 'Responsive design', description: 'Media queries and mobile-first', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' },
                        { id: 'fe-m1-c4', title: 'CSS variables', description: 'Custom properties for theming', estimatedHours: 1, resourceType: 'exercise', isRequired: true, url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties' },
                        { id: 'fe-m1-c5', title: 'Project: Landing page', description: 'Build a responsive landing page', estimatedHours: 6, resourceType: 'project', isRequired: true, url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/#build-a-product-landing-page-project' },
                    ]
                }
            ]
        },
        {
            id: 'fe-mod-2',
            title: 'JavaScript for Frontend',
            description: 'DOM manipulation and browser APIs',
            order: 2,
            estimatedWeeks: 2,
            difficulty: 'beginner',
            prerequisites: ['fe-mod-1'],
            milestones: [
                {
                    id: 'fe-m2-ms1',
                    title: 'JavaScript Essentials',
                    description: 'Core JS for the browser',
                    passingScore: 70,
                    quizTopic: 'JavaScript',
                    checklistItems: [
                        { id: 'fe-m2-c1', title: 'DOM manipulation', description: 'Selecting and modifying elements', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=5fb2aPlgoys' },
                        { id: 'fe-m2-c2', title: 'Event handling', description: 'Click, submit, keyboard events', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://javascript.info/introduction-browser-events' },
                        { id: 'fe-m2-c3', title: 'Fetch API', description: 'Making HTTP requests', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' },
                        { id: 'fe-m2-c4', title: 'Local storage', description: 'Persisting data in browser', estimatedHours: 1, resourceType: 'exercise', isRequired: true, url: 'https://javascript.info/localstorage' },
                        { id: 'fe-m2-c5', title: 'Project: Interactive form', description: 'Form with validation', estimatedHours: 4, resourceType: 'project', isRequired: true, url: 'https://www.freecodecamp.org/news/build-a-survey-form-using-html-and-css/' },
                    ]
                }
            ]
        },
        {
            id: 'fe-mod-3',
            title: 'React Development',
            description: 'Build modern SPAs with React',
            order: 3,
            estimatedWeeks: 3,
            difficulty: 'intermediate',
            prerequisites: ['fe-mod-2'],
            milestones: [
                {
                    id: 'fe-m3-ms1',
                    title: 'React Fundamentals',
                    description: 'Components, props, state, hooks',
                    passingScore: 75,
                    quizTopic: 'React',
                    checklistItems: [
                        { id: 'fe-m3-c1', title: 'React setup', description: 'Create React App or Vite', estimatedHours: 1, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=CgkZ7MvWUAA' },
                        { id: 'fe-m3-c2', title: 'Components and JSX', description: 'Building UI with components', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/describing-the-ui' },
                        { id: 'fe-m3-c3', title: 'State management', description: 'useState, useReducer, Context', estimatedHours: 3, resourceType: 'article', isRequired: true, url: 'https://react.dev/learn/managing-state' },
                        { id: 'fe-m3-c4', title: 'Effects and lifecycle', description: 'useEffect patterns', estimatedHours: 2.5, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/synchronizing-with-effects' },
                        { id: 'fe-m3-c5', title: 'React Router', description: 'Client-side routing', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU' },
                        { id: 'fe-m3-c6', title: 'Project: Single Page App', description: 'Multi-page React app', estimatedHours: 8, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=RVFAyFWO4go' },
                    ]
                }
            ]
        }
    ]
};
// ============================================
// REACT SPECIALIST TRACK
// ============================================
exports.reactSpecialistPath = {
    id: 'react-specialist',
    title: 'React Specialist',
    description: 'Become an advanced React developer with deep expertise',
    category: 'Frontend Frameworks',
    totalWeeks: 6,
    difficulty: 'advanced',
    outcomes: [
        'Master advanced React patterns',
        'Build performant applications',
        'Implement complex state management',
        'Write testable React code'
    ],
    targetRoles: ['Senior React Developer', 'Frontend Architect', 'Tech Lead'],
    modules: [
        {
            id: 'rs-mod-1',
            title: 'Advanced React Patterns',
            description: 'HOCs, render props, compound components',
            order: 1,
            estimatedWeeks: 2,
            difficulty: 'advanced',
            prerequisites: [],
            milestones: [
                {
                    id: 'rs-m1-ms1',
                    title: 'Component Patterns',
                    description: 'Advanced component architecture',
                    passingScore: 80,
                    quizTopic: 'React',
                    checklistItems: [
                        { id: 'rs-m1-c1', title: 'Higher-Order Components', description: 'Creating and using HOCs', estimatedHours: 3, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=J5P0q7EROfw' },
                        { id: 'rs-m1-c2', title: 'Render props pattern', description: 'Sharing code with render props', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://react.dev/reference/react/cloneElement#alternatives' },
                        { id: 'rs-m1-c3', title: 'Compound components', description: 'Flexible component APIs', estimatedHours: 2.5, resourceType: 'exercise', isRequired: true, url: 'https://www.smashingmagazine.com/2021/08/compound-component-pattern-react/' },
                        { id: 'rs-m1-c4', title: 'Custom hooks', description: 'Building reusable logic', estimatedHours: 3, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
                        { id: 'rs-m1-c5', title: 'Project: Component library', description: 'Build reusable components', estimatedHours: 8, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=XHQi5a0TmMc' },
                    ]
                }
            ]
        },
        {
            id: 'rs-mod-2',
            title: 'Performance Optimization',
            description: 'Make React apps blazing fast',
            order: 2,
            estimatedWeeks: 1.5,
            difficulty: 'advanced',
            prerequisites: ['rs-mod-1'],
            milestones: [
                {
                    id: 'rs-m2-ms1',
                    title: 'React Performance',
                    description: 'Memoization, code splitting, profiling',
                    passingScore: 75,
                    checklistItems: [
                        { id: 'rs-m2-c1', title: 'React.memo and useMemo', description: 'Memoization strategies', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=DEPwA3mv_R8' },
                        { id: 'rs-m2-c2', title: 'useCallback optimization', description: 'Preventing unnecessary re-renders', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://react.dev/reference/react/useCallback' },
                        { id: 'rs-m2-c3', title: 'Code splitting', description: 'Lazy loading components', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://react.dev/reference/react/lazy' },
                        { id: 'rs-m2-c4', title: 'React DevTools Profiler', description: 'Identifying bottlenecks', estimatedHours: 1.5, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=00RoZflFE34' },
                        { id: 'rs-m2-c5', title: 'Virtual list rendering', description: 'Rendering large lists', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://tanstack.com/virtual/latest/docs/introduction' },
                    ]
                }
            ]
        },
        {
            id: 'rs-mod-3',
            title: 'State Management',
            description: 'Redux, Zustand, and server state',
            order: 3,
            estimatedWeeks: 2,
            difficulty: 'advanced',
            prerequisites: ['rs-mod-1'],
            milestones: [
                {
                    id: 'rs-m3-ms1',
                    title: 'Advanced State',
                    description: 'Complex state management patterns',
                    passingScore: 80,
                    checklistItems: [
                        { id: 'rs-m3-c1', title: 'Redux Toolkit', description: 'Modern Redux patterns', estimatedHours: 4, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=bbkBuqC1rU4' },
                        { id: 'rs-m3-c2', title: 'Zustand', description: 'Lightweight state management', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://docs.pmnd.rs/zustand/getting-started/introduction' },
                        { id: 'rs-m3-c3', title: 'React Query/TanStack Query', description: 'Server state management', estimatedHours: 3, resourceType: 'exercise', isRequired: true, url: 'https://tanstack.com/query/latest/docs/react/overview' },
                        { id: 'rs-m3-c4', title: 'State machines with XState', description: 'Finite state machines', estimatedHours: 2.5, resourceType: 'article', isRequired: false, url: 'https://xstate.js.org/docs/' },
                        { id: 'rs-m3-c5', title: 'Project: Dashboard app', description: 'Complex state app', estimatedHours: 10, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=jx5hdo50a2M' },
                    ]
                }
            ]
        }
    ]
};
// ============================================
// BACKEND DEVELOPER TRACK
// ============================================
exports.backendPath = {
    id: 'backend-developer',
    title: 'Backend Development',
    description: 'Master server-side development with Node.js',
    category: 'Backend Development',
    totalWeeks: 8,
    difficulty: 'intermediate',
    outcomes: [
        'Design and build RESTful APIs',
        'Work with SQL and NoSQL databases',
        'Implement authentication and authorization',
        'Deploy and scale backend services'
    ],
    targetRoles: ['Backend Developer', 'API Developer', 'Node.js Developer'],
    modules: [
        {
            id: 'be-mod-1',
            title: 'Node.js Fundamentals',
            description: 'Core Node.js concepts',
            order: 1,
            estimatedWeeks: 2,
            difficulty: 'beginner',
            prerequisites: [],
            milestones: [
                {
                    id: 'be-m1-ms1',
                    title: 'Node.js Core',
                    description: 'Event loop, modules, npm',
                    passingScore: 70,
                    quizTopic: 'Node.js',
                    checklistItems: [
                        { id: 'be-m1-c1', title: 'Node.js architecture', description: 'Understanding the runtime', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=ENrzD9HAZK4' },
                        { id: 'be-m1-c2', title: 'Module system', description: 'CommonJS and ES modules', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://nodejs.org/api/modules.html' },
                        { id: 'be-m1-c3', title: 'npm and package.json', description: 'Dependency management', estimatedHours: 1, resourceType: 'exercise', isRequired: true, url: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json' },
                        { id: 'be-m1-c4', title: 'Built-in modules', description: 'fs, path, http, events', estimatedHours: 2.5, resourceType: 'exercise', isRequired: true, url: 'https://nodejs.org/docs/latest/api/' },
                        { id: 'be-m1-c5', title: 'Project: CLI tool', description: 'Build a command-line app', estimatedHours: 4, resourceType: 'project', isRequired: true, url: 'https://www.freecodecamp.org/news/how-to-build-a-command-line-application-with-nodejs/' },
                    ]
                }
            ]
        },
        {
            id: 'be-mod-2',
            title: 'Express.js & APIs',
            description: 'Building web servers and APIs',
            order: 2,
            estimatedWeeks: 2,
            difficulty: 'intermediate',
            prerequisites: ['be-mod-1'],
            milestones: [
                {
                    id: 'be-m2-ms1',
                    title: 'Express Framework',
                    description: 'Routing, middleware, REST',
                    passingScore: 75,
                    quizTopic: 'APIs',
                    checklistItems: [
                        { id: 'be-m2-c1', title: 'Express setup', description: 'Creating an Express app', estimatedHours: 1, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=SccSCuHhOw0' },
                        { id: 'be-m2-c2', title: 'Routing', description: 'Routes and route parameters', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://expressjs.com/en/guide/routing.html' },
                        { id: 'be-m2-c3', title: 'Middleware', description: 'Custom and third-party middleware', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://expressjs.com/en/guide/using-middleware.html' },
                        { id: 'be-m2-c4', title: 'REST API design', description: 'RESTful principles', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://restfulapi.net/' },
                        { id: 'be-m2-c5', title: 'Error handling', description: 'Error middleware patterns', estimatedHours: 1.5, resourceType: 'exercise', isRequired: true, url: 'https://expressjs.com/en/guide/error-handling.html' },
                        { id: 'be-m2-c6', title: 'Project: Blog API', description: 'Complete CRUD API', estimatedHours: 6, resourceType: 'project', isRequired: true, url: 'https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/' },
                    ]
                }
            ]
        },
        {
            id: 'be-mod-3',
            title: 'Databases',
            description: 'MongoDB and PostgreSQL',
            order: 3,
            estimatedWeeks: 2,
            difficulty: 'intermediate',
            prerequisites: ['be-mod-2'],
            milestones: [
                {
                    id: 'be-m3-ms1',
                    title: 'Database Fundamentals',
                    description: 'SQL and NoSQL databases',
                    passingScore: 75,
                    checklistItems: [
                        { id: 'be-m3-c1', title: 'MongoDB basics', description: 'Documents, collections, CRUD', estimatedHours: 3, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=ofme2o29ngU' },
                        { id: 'be-m3-c2', title: 'Mongoose ODM', description: 'Schemas, models, queries', estimatedHours: 3, resourceType: 'exercise', isRequired: true, url: 'https://mongoosejs.com/docs/guide.html' },
                        { id: 'be-m3-c3', title: 'PostgreSQL basics', description: 'SQL, tables, relationships', estimatedHours: 3, resourceType: 'video', isRequired: false, url: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
                        { id: 'be-m3-c4', title: 'Database design', description: 'Normalization, indexes', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://www.mongodb.com/docs/manual/core/data-model-design/' },
                        { id: 'be-m3-c5', title: 'Project: E-commerce DB', description: 'Design product database', estimatedHours: 5, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=VyuF2T0rm80' },
                    ]
                }
            ]
        },
        {
            id: 'be-mod-4',
            title: 'Authentication & Security',
            description: 'Secure your APIs',
            order: 4,
            estimatedWeeks: 2,
            difficulty: 'advanced',
            prerequisites: ['be-mod-3'],
            milestones: [
                {
                    id: 'be-m4-ms1',
                    title: 'Auth & Security',
                    description: 'JWT, OAuth, security practices',
                    passingScore: 80,
                    checklistItems: [
                        { id: 'be-m4-c1', title: 'Password security', description: 'Hashing with bcrypt', estimatedHours: 1.5, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=AzA_LTDoFqY' },
                        { id: 'be-m4-c2', title: 'JWT authentication', description: 'Token creation and verification', estimatedHours: 3, resourceType: 'exercise', isRequired: true, url: 'https://jwt.io/introduction' },
                        { id: 'be-m4-c3', title: 'OAuth 2.0', description: 'Social login integration', estimatedHours: 2.5, resourceType: 'article', isRequired: false, url: 'https://oauth.net/2/' },
                        { id: 'be-m4-c4', title: 'API security', description: 'Rate limiting, CORS, helmet', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html' },
                        { id: 'be-m4-c5', title: 'Input validation', description: 'Joi/Zod validation', estimatedHours: 1.5, resourceType: 'article', isRequired: true, url: 'https://zod.dev/' },
                        { id: 'be-m4-c6', title: 'Project: Secure API', description: 'Full auth implementation', estimatedHours: 8, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=Nlg0JrUt0qg' },
                    ]
                }
            ]
        }
    ]
};
// ============================================
// AI & MACHINE LEARNING TRACK
// ============================================
exports.aiPath = {
    id: 'ai-ml-fundamentals',
    title: 'AI & Machine Learning Fundamentals',
    description: 'Understand the core concepts of AI, from data processing to neural networks',
    category: 'Artificial Intelligence',
    totalWeeks: 10,
    difficulty: 'intermediate',
    tags: ['Python', 'TensorFlow', 'LLMs', 'Neural Networks', 'AI'],
    outcomes: [
        'Understand supervised and unsupervised learning',
        'Build and train simple neural networks',
        'Work with Large Language Models (LLMs)',
        'Implement data preprocessing techniques',
        'Deploy AI models to production environments'
    ],
    targetRoles: ['AI Engineer', 'Machine Learning Developer', 'Data Scientist'],
    modules: [
        {
            id: 'ai-mod-1',
            title: 'Python for AI',
            description: 'Master Python libraries used in the AI ecosystem',
            order: 1,
            estimatedWeeks: 2,
            difficulty: 'beginner',
            prerequisites: [],
            milestones: [
                {
                    id: 'ai-m1-ms1',
                    title: 'NumPy & Pandas Essentials',
                    description: 'Efficient data manipulation and analysis',
                    passingScore: 70,
                    quizTopic: 'Python',
                    checklistItems: [
                        { id: 'ai-m1-c1', title: 'NumPy arrays', description: 'Working with multi-dimensional arrays', estimatedHours: 3, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI' },
                        { id: 'ai-m1-c2', title: 'Pandas DataFrames', description: 'Data structures for data sets', estimatedHours: 4, resourceType: 'exercise', isRequired: true, url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html' },
                        { id: 'ai-m1-c3', title: 'Data Cleaning', description: 'Handling missing values and outliers', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://www.kaggle.com/learn/data-cleaning' },
                        { id: 'ai-m1-c4', title: 'Vectorization', description: 'Performance optimization with NumPy', estimatedHours: 2, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=BR9h47Jtqyw' },
                    ]
                }
            ]
        },
        {
            id: 'ai-mod-2',
            title: 'Neural Networks 101',
            description: 'Understanding the building blocks of deep learning',
            order: 2,
            estimatedWeeks: 3,
            difficulty: 'intermediate',
            prerequisites: ['ai-mod-1'],
            milestones: [
                {
                    id: 'ai-m2-ms1',
                    title: 'Perceptrons & Backpropagation',
                    description: 'How machines learn from data',
                    passingScore: 75,
                    checklistItems: [
                        { id: 'ai-m2-c1', title: 'Artificial Neural Networks', description: 'Biological inspiration and structure', estimatedHours: 3, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=aircAruvnKk' },
                        { id: 'ai-m2-c2', title: 'Activation Functions', description: 'ReLU, Sigmoid, and Tanh', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://machinelearningmastery.com/choose-an-activation-function-for-deep-learning/' },
                        { id: 'ai-m2-c3', title: 'Gradient Descent', description: 'Optimization techniques', estimatedHours: 3, resourceType: 'exercise', isRequired: true, url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
                        { id: 'ai-m2-c4', title: 'Loss Functions', description: 'Measuring error in AI models', estimatedHours: 2, resourceType: 'article', isRequired: true, url: 'https://machinelearningmastery.com/loss-and-loss-functions-for-training-deep-learning-neural-networks/' },
                    ]
                }
            ]
        },
        {
            id: 'ai-mod-3',
            title: 'LLMs & Modern AI',
            description: 'Working with GPT and Large Language Models',
            order: 3,
            estimatedWeeks: 3,
            difficulty: 'advanced',
            prerequisites: ['ai-mod-2'],
            milestones: [
                {
                    id: 'ai-m3-ms1',
                    title: 'Prompt Engineering & Fine-tuning',
                    description: 'Mastering modern AI interaction',
                    passingScore: 80,
                    checklistItems: [
                        { id: 'ai-m3-c1', title: 'Transformer Architecture', description: 'Attention mechanisms and encoders', estimatedHours: 4, resourceType: 'video', isRequired: true, url: 'https://www.youtube.com/watch?v=wjZofJX0v4M' },
                        { id: 'ai-m3-c2', title: 'Prompt engineering patterns', description: 'Zero-shot and few-shot prompting', estimatedHours: 2, resourceType: 'exercise', isRequired: true, url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
                        { id: 'ai-m3-c3', title: 'Vector Databases', description: 'Storing and retrieving AI memory', estimatedHours: 3, resourceType: 'article', isRequired: true, url: 'https://www.pinecone.io/learn/vector-database/' },
                        { id: 'ai-m3-c4', title: 'Project: AI Chatbot', description: 'Build your own AI-powered assistant', estimatedHours: 10, resourceType: 'project', isRequired: true, url: 'https://www.youtube.com/watch?v=pNcQ5XXMgH4' },
                    ]
                }
            ]
        }
    ]
};
// ============================================
// EXPORT ALL TEMPLATES
// ============================================
exports.allLearningPaths = [
    exports.fullStackPath,
    exports.frontendPath,
    exports.reactSpecialistPath,
    exports.backendPath,
    exports.aiPath,
];
const getPathById = (id) => {
    return exports.allLearningPaths.find(path => path.id === id);
};
exports.getPathById = getPathById;
const getPathsByCategory = (category) => {
    return exports.allLearningPaths.filter(path => path.category.toLowerCase().includes(category.toLowerCase()));
};
exports.getPathsByCategory = getPathsByCategory;
const getPathsByDifficulty = (difficulty) => {
    return exports.allLearningPaths.filter(path => path.difficulty === difficulty);
};
exports.getPathsByDifficulty = getPathsByDifficulty;
//# sourceMappingURL=learningPathTemplates.js.map