// Comprehensive Question Bank for AI Learning Dashboard
// Contains realistic, educational questions for each topic

export interface QuestionItem {
    questionId: string;
    question: string;
    type: 'multiple_choice' | 'true_false';
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topic: string;
    subtopic: string;
    points: number;
}

// ============================================
// JAVASCRIPT QUESTIONS (25 questions)
// ============================================
export const javascriptQuestions: QuestionItem[] = [
    // Beginner
    {
        questionId: 'js-var-1',
        question: 'Which keyword declares a block-scoped variable that can be reassigned?',
        type: 'multiple_choice',
        options: ['var', 'let', 'const', 'function'],
        correctAnswer: 'let',
        explanation: 'let declares a block-scoped variable that can be reassigned. const is also block-scoped but cannot be reassigned. var is function-scoped.',
        difficulty: 'beginner',
        topic: 'JavaScript',
        subtopic: 'Variables',
        points: 10,
    },
    {
        questionId: 'js-type-1',
        question: 'What does typeof null return in JavaScript?',
        type: 'multiple_choice',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctAnswer: '"object"',
        explanation: 'This is a known bug in JavaScript. typeof null returns "object" even though null is a primitive value. This is due to how JavaScript was originally implemented.',
        difficulty: 'beginner',
        topic: 'JavaScript',
        subtopic: 'Types',
        points: 10,
    },
    {
        questionId: 'js-arr-1',
        question: 'Which method adds an element to the END of an array?',
        type: 'multiple_choice',
        options: ['unshift()', 'push()', 'pop()', 'shift()'],
        correctAnswer: 'push()',
        explanation: 'push() adds elements to the end of an array. unshift() adds to the beginning. pop() removes from the end, and shift() removes from the beginning.',
        difficulty: 'beginner',
        topic: 'JavaScript',
        subtopic: 'Arrays',
        points: 10,
    },
    {
        questionId: 'js-str-1',
        question: 'Template literals in JavaScript are enclosed by:',
        type: 'multiple_choice',
        options: ['Single quotes (\' \')', 'Double quotes (" ")', 'Backticks (` `)', 'Parentheses ( )'],
        correctAnswer: 'Backticks (` `)',
        explanation: 'Template literals use backticks (`) and allow embedded expressions using ${expression} syntax, as well as multi-line strings.',
        difficulty: 'beginner',
        topic: 'JavaScript',
        subtopic: 'Strings',
        points: 10,
    },
    {
        questionId: 'js-bool-1',
        question: 'In JavaScript, 0 is a falsy value.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'JavaScript has 6 falsy values: false, 0, "" (empty string), null, undefined, and NaN. All other values are truthy.',
        difficulty: 'beginner',
        topic: 'JavaScript',
        subtopic: 'Booleans',
        points: 10,
    },
    // Intermediate
    {
        questionId: 'js-closure-1',
        question: 'What is a closure in JavaScript?',
        type: 'multiple_choice',
        options: [
            'A function that has no return value',
            'A function that has access to variables from its outer scope even after the outer function has returned',
            'A function that is called immediately',
            'A function that only runs once'
        ],
        correctAnswer: 'A function that has access to variables from its outer scope even after the outer function has returned',
        explanation: 'A closure is created when a function retains access to its lexical scope even when executed outside that scope. This allows for data privacy and function factories.',
        difficulty: 'intermediate',
        topic: 'JavaScript',
        subtopic: 'Closures',
        points: 15,
    },
    {
        questionId: 'js-promise-1',
        question: 'Which method is used to handle a rejected Promise?',
        type: 'multiple_choice',
        options: ['.then()', '.catch()', '.finally()', '.resolve()'],
        correctAnswer: '.catch()',
        explanation: '.catch() handles rejected promises. .then() handles fulfilled promises (though it can also handle rejections as a second argument). .finally() runs regardless of outcome.',
        difficulty: 'intermediate',
        topic: 'JavaScript',
        subtopic: 'Promises',
        points: 15,
    },
    {
        questionId: 'js-async-1',
        question: 'What does the await keyword do?',
        type: 'multiple_choice',
        options: [
            'Creates a new Promise',
            'Pauses async function execution until a Promise settles',
            'Converts a function to async',
            'Runs code in parallel'
        ],
        correctAnswer: 'Pauses async function execution until a Promise settles',
        explanation: 'await pauses the execution of an async function until the Promise is resolved or rejected, making asynchronous code look and behave more like synchronous code.',
        difficulty: 'intermediate',
        topic: 'JavaScript',
        subtopic: 'Async/Await',
        points: 15,
    },
    {
        questionId: 'js-spread-1',
        question: 'What does the spread operator (...) do when used with an array?',
        type: 'multiple_choice',
        options: [
            'Removes all elements from the array',
            'Expands the array into individual elements',
            'Combines multiple arrays into one',
            'Reverses the array'
        ],
        correctAnswer: 'Expands the array into individual elements',
        explanation: 'The spread operator expands an iterable (like an array) into individual elements. It can be used for array copying, concatenation, and function arguments.',
        difficulty: 'intermediate',
        topic: 'JavaScript',
        subtopic: 'ES6',
        points: 15,
    },
    {
        questionId: 'js-destruct-1',
        question: 'What will const { name } = { name: "John", age: 30 }; assign to name?',
        type: 'multiple_choice',
        options: ['undefined', '"John"', '{ name: "John" }', 'null'],
        correctAnswer: '"John"',
        explanation: 'Object destructuring extracts values from objects based on property names. { name } extracts the name property value "John".',
        difficulty: 'intermediate',
        topic: 'JavaScript',
        subtopic: 'Destructuring',
        points: 15,
    },
    {
        questionId: 'js-map-1',
        question: 'What does Array.prototype.map() return?',
        type: 'multiple_choice',
        options: [
            'The original array modified in place',
            'A new array with the results of calling a function on every element',
            'A single value',
            'undefined'
        ],
        correctAnswer: 'A new array with the results of calling a function on every element',
        explanation: 'map() creates a new array by calling a function on every element. It does not modify the original array. Use reduce() for a single value.',
        difficulty: 'intermediate',
        topic: 'JavaScript',
        subtopic: 'Array Methods',
        points: 15,
    },
    {
        questionId: 'js-filter-1',
        question: 'What does Array.prototype.filter() return?',
        type: 'multiple_choice',
        options: [
            'The first element that matches the condition',
            'A new array with all elements that pass the test',
            'A boolean indicating if any element passes',
            'The count of matching elements'
        ],
        correctAnswer: 'A new array with all elements that pass the test',
        explanation: 'filter() creates a new array with all elements that pass the test implemented by the provided function.',
        difficulty: 'intermediate',
        topic: 'JavaScript',
        subtopic: 'Array Methods',
        points: 15,
    },
    // Advanced
    {
        questionId: 'js-proto-1',
        question: 'What is the prototype chain in JavaScript?',
        type: 'multiple_choice',
        options: [
            'A list of all functions in the program',
            'A mechanism for inheritance where objects inherit properties from other objects',
            'A chain of event handlers',
            'A method for string concatenation'
        ],
        correctAnswer: 'A mechanism for inheritance where objects inherit properties from other objects',
        explanation: 'The prototype chain is how JavaScript implements inheritance. When accessing a property, JavaScript looks up the prototype chain until it finds the property or reaches null.',
        difficulty: 'advanced',
        topic: 'JavaScript',
        subtopic: 'Prototypes',
        points: 20,
    },
    {
        questionId: 'js-this-1',
        question: 'In a regular function, what does "this" refer to when called without an object?',
        type: 'multiple_choice',
        options: [
            'undefined (in strict mode)',
            'The function itself',
            'The parent function',
            'null'
        ],
        correctAnswer: 'undefined (in strict mode)',
        explanation: 'In strict mode, "this" is undefined in a regular function called without context. In non-strict mode, it refers to the global object (window in browsers).',
        difficulty: 'advanced',
        topic: 'JavaScript',
        subtopic: 'this keyword',
        points: 20,
    },
    {
        questionId: 'js-event-1',
        question: 'What is event delegation in JavaScript?',
        type: 'multiple_choice',
        options: [
            'Removing event listeners after use',
            'Attaching a single event listener to a parent to handle events from children',
            'Preventing default browser behavior',
            'Creating custom events'
        ],
        correctAnswer: 'Attaching a single event listener to a parent to handle events from children',
        explanation: 'Event delegation uses event bubbling to handle events at a higher level in the DOM. This is more efficient than attaching listeners to many child elements.',
        difficulty: 'advanced',
        topic: 'JavaScript',
        subtopic: 'Events',
        points: 20,
    },
    {
        questionId: 'js-module-1',
        question: 'What is the difference between named exports and default exports?',
        type: 'multiple_choice',
        options: [
            'There is no difference',
            'Named exports must use the exact name when importing; default exports can be imported with any name',
            'Default exports are faster',
            'Named exports cannot be functions'
        ],
        correctAnswer: 'Named exports must use the exact name when importing; default exports can be imported with any name',
        explanation: 'Named exports require curly braces and exact names: import { foo } from "module". Default exports can be imported with any name: import myName from "module".',
        difficulty: 'advanced',
        topic: 'JavaScript',
        subtopic: 'Modules',
        points: 20,
    },
    {
        questionId: 'js-mem-1',
        question: 'What is a memory leak in JavaScript?',
        type: 'multiple_choice',
        options: [
            'When the program runs out of memory',
            'When memory is allocated but never released, causing increasing memory usage',
            'When variables are garbage collected too early',
            'When arrays become too large'
        ],
        correctAnswer: 'When memory is allocated but never released, causing increasing memory usage',
        explanation: 'Memory leaks occur when the program retains references to objects that are no longer needed, preventing garbage collection. Common causes include forgotten timers and closures.',
        difficulty: 'advanced',
        topic: 'JavaScript',
        subtopic: 'Memory',
        points: 20,
    },
    {
        questionId: 'js-curry-1',
        question: 'What is function currying?',
        type: 'multiple_choice',
        options: [
            'A way to speed up function execution',
            'Transforming a function with multiple arguments into a sequence of functions each taking a single argument',
            'A method for error handling',
            'A technique for async programming'
        ],
        correctAnswer: 'Transforming a function with multiple arguments into a sequence of functions each taking a single argument',
        explanation: 'Currying transforms add(a, b) into add(a)(b). This enables partial application and creates more flexible, reusable functions.',
        difficulty: 'advanced',
        topic: 'JavaScript',
        subtopic: 'Functional Programming',
        points: 20,
    },
];

// ============================================
// REACT QUESTIONS (25 questions)
// ============================================
export const reactQuestions: QuestionItem[] = [
    // Beginner
    {
        questionId: 'react-jsx-1',
        question: 'What does JSX stand for?',
        type: 'multiple_choice',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Syntax'],
        correctAnswer: 'JavaScript XML',
        explanation: 'JSX stands for JavaScript XML. It allows you to write HTML-like syntax in JavaScript, which React transforms into JavaScript function calls.',
        difficulty: 'beginner',
        topic: 'React',
        subtopic: 'JSX',
        points: 10,
    },
    {
        questionId: 'react-comp-1',
        question: 'What is the correct way to render a React component?',
        type: 'multiple_choice',
        options: ['<MyComponent />', 'MyComponent()', '[MyComponent]', '{MyComponent}'],
        correctAnswer: '<MyComponent />',
        explanation: 'React components are rendered using JSX syntax with angle brackets, either self-closing <MyComponent /> or with children <MyComponent>...</MyComponent>.',
        difficulty: 'beginner',
        topic: 'React',
        subtopic: 'Components',
        points: 10,
    },
    {
        questionId: 'react-props-1',
        question: 'Props in React are:',
        type: 'multiple_choice',
        options: [
            'Mutable data that changes over time',
            'Read-only data passed from parent to child components',
            'Internal component state',
            'Event handlers only'
        ],
        correctAnswer: 'Read-only data passed from parent to child components',
        explanation: 'Props (properties) are read-only values passed from parent to child components. They should not be modified by the child component.',
        difficulty: 'beginner',
        topic: 'React',
        subtopic: 'Props',
        points: 10,
    },
    {
        questionId: 'react-state-1',
        question: 'Which hook is used to add state to a functional component?',
        type: 'multiple_choice',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'useState',
        explanation: 'useState is the primary hook for adding state to functional components. It returns an array with the current state value and a function to update it.',
        difficulty: 'beginner',
        topic: 'React',
        subtopic: 'Hooks',
        points: 10,
    },
    {
        questionId: 'react-key-1',
        question: 'Why is the "key" prop important when rendering lists in React?',
        type: 'multiple_choice',
        options: [
            'It is just for styling purposes',
            'It helps React identify which items have changed, are added, or removed',
            'It is required by JavaScript',
            'It determines the order of elements'
        ],
        correctAnswer: 'It helps React identify which items have changed, are added, or removed',
        explanation: 'Keys help React identify items efficiently during reconciliation. They should be stable, unique identifiers. Avoid using array indices as keys when items can reorder.',
        difficulty: 'beginner',
        topic: 'React',
        subtopic: 'Lists',
        points: 10,
    },
    // Intermediate
    {
        questionId: 'react-useeffect-1',
        question: 'When does useEffect run with an empty dependency array []?',
        type: 'multiple_choice',
        options: [
            'After every render',
            'Only once after the initial render',
            'Never',
            'Before the component mounts'
        ],
        correctAnswer: 'Only once after the initial render',
        explanation: 'An empty dependency array [] tells React to run the effect only once after the initial render, similar to componentDidMount in class components.',
        difficulty: 'intermediate',
        topic: 'React',
        subtopic: 'useEffect',
        points: 15,
    },
    {
        questionId: 'react-useeffect-2',
        question: 'What is the purpose of the cleanup function in useEffect?',
        type: 'multiple_choice',
        options: [
            'To reset the component state',
            'To clean up side effects like subscriptions before the component unmounts or effect re-runs',
            'To optimize performance',
            'To handle errors'
        ],
        correctAnswer: 'To clean up side effects like subscriptions before the component unmounts or effect re-runs',
        explanation: 'The cleanup function returned from useEffect runs before the component unmounts and before every re-run of the effect. Use it to cancel subscriptions, clear timers, etc.',
        difficulty: 'intermediate',
        topic: 'React',
        subtopic: 'useEffect',
        points: 15,
    },
    {
        questionId: 'react-context-1',
        question: 'What problem does React Context solve?',
        type: 'multiple_choice',
        options: [
            'Making components faster',
            'Prop drilling - passing props through many levels of components',
            'Handling form validation',
            'Managing API calls'
        ],
        correctAnswer: 'Prop drilling - passing props through many levels of components',
        explanation: 'Context provides a way to share values between components without explicitly passing props through every level of the component tree.',
        difficulty: 'intermediate',
        topic: 'React',
        subtopic: 'Context',
        points: 15,
    },
    {
        questionId: 'react-memo-1',
        question: 'What does React.memo() do?',
        type: 'multiple_choice',
        options: [
            'Memoizes expensive calculations',
            'Prevents re-rendering of a component if its props have not changed',
            'Stores component state in memory',
            'Creates a memory-efficient component'
        ],
        correctAnswer: 'Prevents re-rendering of a component if its props have not changed',
        explanation: 'React.memo() is a higher-order component that memoizes the result. It only re-renders if props (shallow comparison) have changed.',
        difficulty: 'intermediate',
        topic: 'React',
        subtopic: 'Performance',
        points: 15,
    },
    {
        questionId: 'react-usecallback-1',
        question: 'When should you use useCallback?',
        type: 'multiple_choice',
        options: [
            'For all functions in a component',
            'When passing callbacks to optimized child components that rely on reference equality',
            'Only for async functions',
            'Never, it is deprecated'
        ],
        correctAnswer: 'When passing callbacks to optimized child components that rely on reference equality',
        explanation: 'useCallback memoizes function references. Use it when passing callbacks to child components wrapped in React.memo() to prevent unnecessary re-renders.',
        difficulty: 'intermediate',
        topic: 'React',
        subtopic: 'Hooks',
        points: 15,
    },
    {
        questionId: 'react-usememo-1',
        question: 'What is the purpose of useMemo?',
        type: 'multiple_choice',
        options: [
            'To memoize component instances',
            'To memoize expensive calculations and return a cached result',
            'To create memos stored in a database',
            'To prevent all re-renders'
        ],
        correctAnswer: 'To memoize expensive calculations and return a cached result',
        explanation: 'useMemo returns a memoized value. It only recomputes when one of the dependencies has changed, avoiding expensive recalculations on every render.',
        difficulty: 'intermediate',
        topic: 'React',
        subtopic: 'Hooks',
        points: 15,
    },
    {
        questionId: 'react-ref-1',
        question: 'What is useRef commonly used for?',
        type: 'multiple_choice',
        options: [
            'Managing component state',
            'Accessing DOM elements directly and storing mutable values that dont cause re-renders',
            'Handling events',
            'Fetching data'
        ],
        correctAnswer: 'Accessing DOM elements directly and storing mutable values that dont cause re-renders',
        explanation: 'useRef returns a mutable ref object. Its .current property can hold DOM references or any mutable value that persists across renders without causing re-renders.',
        difficulty: 'intermediate',
        topic: 'React',
        subtopic: 'Refs',
        points: 15,
    },
    // Advanced
    {
        questionId: 'react-usereducer-1',
        question: 'When is useReducer preferred over useState?',
        type: 'multiple_choice',
        options: [
            'For simple boolean toggles',
            'When state logic is complex, involves multiple sub-values, or next state depends on previous',
            'For styling components',
            'useReducer is always preferred'
        ],
        correctAnswer: 'When state logic is complex, involves multiple sub-values, or next state depends on previous',
        explanation: 'useReducer is better for complex state logic. It centralizes state updates in a reducer function, making the logic easier to test and understand.',
        difficulty: 'advanced',
        topic: 'React',
        subtopic: 'useReducer',
        points: 20,
    },
    {
        questionId: 'react-suspense-1',
        question: 'What is React Suspense used for?',
        type: 'multiple_choice',
        options: [
            'Error handling',
            'Displaying a fallback while waiting for content to load',
            'Animation timing',
            'State management'
        ],
        correctAnswer: 'Displaying a fallback while waiting for content to load',
        explanation: 'Suspense lets you display a fallback UI while components are loading (code-splitting with lazy) or waiting for data (with concurrent features).',
        difficulty: 'advanced',
        topic: 'React',
        subtopic: 'Suspense',
        points: 20,
    },
    {
        questionId: 'react-portal-1',
        question: 'What is a React Portal?',
        type: 'multiple_choice',
        options: [
            'A routing mechanism',
            'A way to render children into a DOM node outside the parent hierarchy',
            'A state management solution',
            'A testing utility'
        ],
        correctAnswer: 'A way to render children into a DOM node outside the parent hierarchy',
        explanation: 'Portals render children into a different part of the DOM tree while preserving event bubbling. Ideal for modals, tooltips, and popups.',
        difficulty: 'advanced',
        topic: 'React',
        subtopic: 'Portals',
        points: 20,
    },
    {
        questionId: 'react-hoc-1',
        question: 'What is a Higher-Order Component (HOC)?',
        type: 'multiple_choice',
        options: [
            'A component at the top of the component tree',
            'A function that takes a component and returns a new enhanced component',
            'A component with more props',
            'A class component'
        ],
        correctAnswer: 'A function that takes a component and returns a new enhanced component',
        explanation: 'HOCs are functions that take a component and return a new component with added functionality. They are a pattern for reusing component logic.',
        difficulty: 'advanced',
        topic: 'React',
        subtopic: 'Patterns',
        points: 20,
    },
    {
        questionId: 'react-render-1',
        question: 'What triggers a re-render in React?',
        type: 'multiple_choice',
        options: [
            'Only state changes trigger re-renders',
            'State changes, prop changes, parent re-renders, or context changes',
            'Only prop changes',
            'Re-renders happen on a fixed timer'
        ],
        correctAnswer: 'State changes, prop changes, parent re-renders, or context changes',
        explanation: 'A component re-renders when: its state changes, props change, parent re-renders, or context it consumes changes. React.memo() can prevent unnecessary re-renders.',
        difficulty: 'advanced',
        topic: 'React',
        subtopic: 'Rendering',
        points: 20,
    },
    {
        questionId: 'react-reconciliation-1',
        question: 'What is React reconciliation?',
        type: 'multiple_choice',
        options: [
            'The process of combining components',
            'The algorithm React uses to determine which parts of the DOM need to change',
            'A debugging tool',
            'The build process'
        ],
        correctAnswer: 'The algorithm React uses to determine which parts of the DOM need to change',
        explanation: 'Reconciliation is Reacts diffing algorithm that compares the new virtual DOM with the previous one to determine the minimum changes needed to update the real DOM.',
        difficulty: 'advanced',
        topic: 'React',
        subtopic: 'Virtual DOM',
        points: 20,
    },
];

// ============================================
// TYPESCRIPT QUESTIONS (20 questions)
// ============================================
export const typescriptQuestions: QuestionItem[] = [
    // Beginner
    {
        questionId: 'ts-basic-1',
        question: 'What is TypeScript?',
        type: 'multiple_choice',
        options: [
            'A completely new programming language',
            'A typed superset of JavaScript that compiles to plain JavaScript',
            'A JavaScript framework',
            'A database query language'
        ],
        correctAnswer: 'A typed superset of JavaScript that compiles to plain JavaScript',
        explanation: 'TypeScript adds optional static typing and class-based OOP to JavaScript. It compiles to regular JavaScript that runs in any browser or Node.js.',
        difficulty: 'beginner',
        topic: 'TypeScript',
        subtopic: 'Basics',
        points: 10,
    },
    {
        questionId: 'ts-type-1',
        question: 'How do you declare a variable with a specific type in TypeScript?',
        type: 'multiple_choice',
        options: [
            'let name = string: "John"',
            'let name: string = "John"',
            'string let name = "John"',
            'let string name = "John"'
        ],
        correctAnswer: 'let name: string = "John"',
        explanation: 'TypeScript uses a colon after the variable name followed by the type: variableName: type = value',
        difficulty: 'beginner',
        topic: 'TypeScript',
        subtopic: 'Types',
        points: 10,
    },
    {
        questionId: 'ts-interface-1',
        question: 'What is an interface in TypeScript?',
        type: 'multiple_choice',
        options: [
            'A type of component',
            'A contract that defines the structure of an object',
            'A function type',
            'A class method'
        ],
        correctAnswer: 'A contract that defines the structure of an object',
        explanation: 'Interfaces define the shape of objects, specifying which properties and methods an object should have, along with their types.',
        difficulty: 'beginner',
        topic: 'TypeScript',
        subtopic: 'Interfaces',
        points: 10,
    },
    {
        questionId: 'ts-any-1',
        question: 'What does the "any" type do in TypeScript?',
        type: 'multiple_choice',
        options: [
            'Throws an error',
            'Disables type checking for that variable',
            'Makes the variable required',
            'Creates a new type'
        ],
        correctAnswer: 'Disables type checking for that variable',
        explanation: 'The "any" type opts out of type checking. Use it sparingly as it defeats the purpose of TypeScript. Prefer "unknown" for truly unknown types.',
        difficulty: 'beginner',
        topic: 'TypeScript',
        subtopic: 'Types',
        points: 10,
    },
    // Intermediate
    {
        questionId: 'ts-union-1',
        question: 'What is a union type in TypeScript?',
        type: 'multiple_choice',
        options: [
            'A type that never changes',
            'A type that can be one of several specified types',
            'A type for unions (labor organizations)',
            'A type that combines all properties'
        ],
        correctAnswer: 'A type that can be one of several specified types',
        explanation: 'Union types use the | operator: type StringOrNumber = string | number. The variable can be either type.',
        difficulty: 'intermediate',
        topic: 'TypeScript',
        subtopic: 'Union Types',
        points: 15,
    },
    {
        questionId: 'ts-generic-1',
        question: 'What are generics used for in TypeScript?',
        type: 'multiple_choice',
        options: [
            'Making code run faster',
            'Creating reusable components that work with multiple types while maintaining type safety',
            'Generating automatic documentation',
            'Creating generic error messages'
        ],
        correctAnswer: 'Creating reusable components that work with multiple types while maintaining type safety',
        explanation: 'Generics allow you to write flexible, reusable code that works with any type while preserving type information: function identity<T>(arg: T): T { return arg; }',
        difficulty: 'intermediate',
        topic: 'TypeScript',
        subtopic: 'Generics',
        points: 15,
    },
    {
        questionId: 'ts-optional-1',
        question: 'How do you make a property optional in a TypeScript interface?',
        type: 'multiple_choice',
        options: [
            'optional: propertyName: string',
            'propertyName?: string',
            'propertyName: string | undefined',
            '@optional propertyName: string'
        ],
        correctAnswer: 'propertyName?: string',
        explanation: 'The ? after the property name makes it optional: interface User { name: string; age?: number; }. Age is optional.',
        difficulty: 'intermediate',
        topic: 'TypeScript',
        subtopic: 'Interfaces',
        points: 15,
    },
    {
        questionId: 'ts-enum-1',
        question: 'What is an enum in TypeScript?',
        type: 'multiple_choice',
        options: [
            'A type of error',
            'A way to define a set of named constants',
            'A function type',
            'A loop construct'
        ],
        correctAnswer: 'A way to define a set of named constants',
        explanation: 'Enums define a set of named constants: enum Direction { Up, Down, Left, Right }. They improve code readability and provide autocompletion.',
        difficulty: 'intermediate',
        topic: 'TypeScript',
        subtopic: 'Enums',
        points: 15,
    },
    {
        questionId: 'ts-type-guard-1',
        question: 'What is a type guard in TypeScript?',
        type: 'multiple_choice',
        options: [
            'A security feature',
            'A technique to narrow down the type of a variable within a conditional block',
            'A type of interface',
            'An error handler'
        ],
        correctAnswer: 'A technique to narrow down the type of a variable within a conditional block',
        explanation: 'Type guards narrow types: if (typeof x === "string") { // x is string here }. They use typeof, instanceof, or custom type predicates.',
        difficulty: 'intermediate',
        topic: 'TypeScript',
        subtopic: 'Type Guards',
        points: 15,
    },
    // Advanced
    {
        questionId: 'ts-utility-1',
        question: 'What does the Partial<T> utility type do?',
        type: 'multiple_choice',
        options: [
            'Makes all properties of T required',
            'Makes all properties of T optional',
            'Removes all properties from T',
            'Makes T a partial function'
        ],
        correctAnswer: 'Makes all properties of T optional',
        explanation: 'Partial<T> constructs a type with all properties of T set to optional. Useful for update functions where you only want to change some properties.',
        difficulty: 'advanced',
        topic: 'TypeScript',
        subtopic: 'Utility Types',
        points: 20,
    },
    {
        questionId: 'ts-utility-2',
        question: 'What does the Pick<T, K> utility type do?',
        type: 'multiple_choice',
        options: [
            'Picks a random property from T',
            'Constructs a type by picking specified properties K from T',
            'Picks the first property from T',
            'Removes properties K from T'
        ],
        correctAnswer: 'Constructs a type by picking specified properties K from T',
        explanation: 'Pick<User, "name" | "email"> creates a type with only name and email properties from User. Useful for creating subsets of types.',
        difficulty: 'advanced',
        topic: 'TypeScript',
        subtopic: 'Utility Types',
        points: 20,
    },
    {
        questionId: 'ts-mapped-1',
        question: 'What are mapped types in TypeScript?',
        type: 'multiple_choice',
        options: [
            'Types that map to geographic locations',
            'Types that transform each property of an existing type in some way',
            'Types for Map data structures',
            'Types that dont compile'
        ],
        correctAnswer: 'Types that transform each property of an existing type in some way',
        explanation: 'Mapped types create new types by transforming properties: type Readonly<T> = { readonly [P in keyof T]: T[P] }',
        difficulty: 'advanced',
        topic: 'TypeScript',
        subtopic: 'Mapped Types',
        points: 20,
    },
    {
        questionId: 'ts-conditional-1',
        question: 'What is a conditional type in TypeScript?',
        type: 'multiple_choice',
        options: [
            'A type that only works in if statements',
            'A type that selects one of two possible types based on a condition',
            'A type for boolean values',
            'A deprecated feature'
        ],
        correctAnswer: 'A type that selects one of two possible types based on a condition',
        explanation: 'Conditional types: T extends U ? X : Y. If T is assignable to U, the type is X, otherwise Y. Used in advanced type manipulation.',
        difficulty: 'advanced',
        topic: 'TypeScript',
        subtopic: 'Conditional Types',
        points: 20,
    },
    {
        questionId: 'ts-infer-1',
        question: 'What does the "infer" keyword do in TypeScript?',
        type: 'multiple_choice',
        options: [
            'Infers types at runtime',
            'Declares a type variable that is inferred from a conditional type',
            'Automatically imports types',
            'Infers variable names'
        ],
        correctAnswer: 'Declares a type variable that is inferred from a conditional type',
        explanation: 'infer is used in conditional types to extract types: type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never',
        difficulty: 'advanced',
        topic: 'TypeScript',
        subtopic: 'Advanced Types',
        points: 20,
    },
];

// ============================================
// NODE.JS/API QUESTIONS (15 questions)
// ============================================
export const nodejsQuestions: QuestionItem[] = [
    {
        questionId: 'node-basic-1',
        question: 'What is Node.js?',
        type: 'multiple_choice',
        options: [
            'A web browser',
            'A JavaScript runtime built on Chromes V8 engine',
            'A database',
            'A front-end framework'
        ],
        correctAnswer: 'A JavaScript runtime built on Chromes V8 engine',
        explanation: 'Node.js allows JavaScript to run outside the browser, enabling server-side programming with the same language used on the client side.',
        difficulty: 'beginner',
        topic: 'Node.js',
        subtopic: 'Basics',
        points: 10,
    },
    {
        questionId: 'node-npm-1',
        question: 'What does npm stand for?',
        type: 'multiple_choice',
        options: ['Node Package Manager', 'New Programming Method', 'Node Project Maker', 'Network Protocol Module'],
        correctAnswer: 'Node Package Manager',
        explanation: 'npm is the default package manager for Node.js, used to install, share, and manage dependencies in JavaScript projects.',
        difficulty: 'beginner',
        topic: 'Node.js',
        subtopic: 'npm',
        points: 10,
    },
    {
        questionId: 'node-express-1',
        question: 'What is Express.js?',
        type: 'multiple_choice',
        options: [
            'A database ORM',
            'A minimal and flexible Node.js web application framework',
            'A testing library',
            'A bundler'
        ],
        correctAnswer: 'A minimal and flexible Node.js web application framework',
        explanation: 'Express is the most popular Node.js framework for building web applications and APIs. It provides routing, middleware support, and HTTP utilities.',
        difficulty: 'beginner',
        topic: 'Node.js',
        subtopic: 'Express',
        points: 10,
    },
    {
        questionId: 'api-rest-1',
        question: 'What does REST stand for?',
        type: 'multiple_choice',
        options: [
            'Representational State Transfer',
            'Remote Execution System Transfer',
            'Request State Technology',
            'Resource Extended Standard Transfer'
        ],
        correctAnswer: 'Representational State Transfer',
        explanation: 'REST is an architectural style for designing networked applications. It uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources.',
        difficulty: 'beginner',
        topic: 'APIs',
        subtopic: 'REST',
        points: 10,
    },
    {
        questionId: 'api-http-1',
        question: 'Which HTTP method is typically used to create a new resource?',
        type: 'multiple_choice',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 'POST',
        explanation: 'POST is used to create new resources. GET retrieves, PUT updates/replaces, PATCH partially updates, and DELETE removes resources.',
        difficulty: 'intermediate',
        topic: 'APIs',
        subtopic: 'HTTP Methods',
        points: 15,
    },
    {
        questionId: 'node-middleware-1',
        question: 'What is middleware in Express?',
        type: 'multiple_choice',
        options: [
            'Code that runs between the software layers',
            'Functions that have access to request, response, and next objects',
            'Hardware between client and server',
            'Database connectors'
        ],
        correctAnswer: 'Functions that have access to request, response, and next objects',
        explanation: 'Middleware functions can modify req/res objects, end the request-response cycle, or call next() to pass control to the next middleware.',
        difficulty: 'intermediate',
        topic: 'Node.js',
        subtopic: 'Middleware',
        points: 15,
    },
    {
        questionId: 'api-status-1',
        question: 'What does HTTP status code 404 indicate?',
        type: 'multiple_choice',
        options: ['Success', 'Created', 'Not Found', 'Server Error'],
        correctAnswer: 'Not Found',
        explanation: '404 means the requested resource was not found. 200 = OK, 201 = Created, 400 = Bad Request, 500 = Server Error.',
        difficulty: 'intermediate',
        topic: 'APIs',
        subtopic: 'Status Codes',
        points: 15,
    },
    {
        questionId: 'node-async-1',
        question: 'How does Node.js handle concurrent operations?',
        type: 'multiple_choice',
        options: [
            'Multiple threads for each request',
            'Single-threaded event loop with non-blocking I/O',
            'Creating new processes for each operation',
            'It cannot handle concurrency'
        ],
        correctAnswer: 'Single-threaded event loop with non-blocking I/O',
        explanation: 'Node.js uses a single thread with an event loop for non-blocking async operations. CPU-intensive tasks can use worker threads.',
        difficulty: 'advanced',
        topic: 'Node.js',
        subtopic: 'Event Loop',
        points: 20,
    },
    {
        questionId: 'api-auth-1',
        question: 'What is JWT commonly used for?',
        type: 'multiple_choice',
        options: [
            'Database queries',
            'Stateless authentication and information exchange',
            'File compression',
            'SSL encryption'
        ],
        correctAnswer: 'Stateless authentication and information exchange',
        explanation: 'JSON Web Tokens are self-contained tokens that securely transmit information. They contain a header, payload, and signature.',
        difficulty: 'advanced',
        topic: 'APIs',
        subtopic: 'Authentication',
        points: 20,
    },
    {
        questionId: 'api-graphql-1',
        question: 'What is a key difference between REST and GraphQL?',
        type: 'multiple_choice',
        options: [
            'GraphQL is faster',
            'GraphQL lets clients request exactly the data they need',
            'REST is more secure',
            'GraphQL only works with Node.js'
        ],
        correctAnswer: 'GraphQL lets clients request exactly the data they need',
        explanation: 'GraphQL provides a single endpoint where clients specify their data needs, reducing over-fetching and under-fetching compared to REST multiple endpoints.',
        difficulty: 'advanced',
        topic: 'APIs',
        subtopic: 'GraphQL',
        points: 20,
    },
];

// ============================================
// CSS QUESTIONS (10 questions)
// ============================================
export const cssQuestions: QuestionItem[] = [
    {
        questionId: 'css-flex-1',
        question: 'Which CSS property creates a flex container?',
        type: 'multiple_choice',
        options: ['display: flex', 'flex: container', 'flexbox: true', 'container: flex'],
        correctAnswer: 'display: flex',
        explanation: 'Setting display: flex on an element makes it a flex container. Its direct children become flex items.',
        difficulty: 'beginner',
        topic: 'CSS',
        subtopic: 'Flexbox',
        points: 10,
    },
    {
        questionId: 'css-flex-2',
        question: 'What does justify-content: center do in a flex container?',
        type: 'multiple_choice',
        options: [
            'Centers items vertically',
            'Centers items along the main axis',
            'Justifies text',
            'Creates centered content boxes'
        ],
        correctAnswer: 'Centers items along the main axis',
        explanation: 'justify-content positions items along the main axis (horizontal by default). align-items centers along the cross axis (vertical by default).',
        difficulty: 'beginner',
        topic: 'CSS',
        subtopic: 'Flexbox',
        points: 10,
    },
    {
        questionId: 'css-grid-1',
        question: 'How do you create a CSS Grid with 3 equal columns?',
        type: 'multiple_choice',
        options: [
            'grid-columns: 3',
            'grid-template-columns: repeat(3, 1fr)',
            'columns: 3',
            'grid: 3-columns'
        ],
        correctAnswer: 'grid-template-columns: repeat(3, 1fr)',
        explanation: 'repeat(3, 1fr) creates 3 columns of equal width. 1fr means 1 fraction of available space.',
        difficulty: 'intermediate',
        topic: 'CSS',
        subtopic: 'Grid',
        points: 15,
    },
    {
        questionId: 'css-position-1',
        question: 'What does position: sticky do?',
        type: 'multiple_choice',
        options: [
            'Makes element invisible',
            'Element toggles between relative and fixed based on scroll position',
            'Sticks element to cursor',
            'Makes element non-interactive'
        ],
        correctAnswer: 'Element toggles between relative and fixed based on scroll position',
        explanation: 'position: sticky makes an element behave like relative until it crosses a threshold (defined by top/bottom), then it becomes fixed.',
        difficulty: 'intermediate',
        topic: 'CSS',
        subtopic: 'Positioning',
        points: 15,
    },
    {
        questionId: 'css-var-1',
        question: 'How do you use a CSS custom property (variable)?',
        type: 'multiple_choice',
        options: [
            'color: $primary',
            'color: var(--primary)',
            'color: @primary',
            'color: #{primary}'
        ],
        correctAnswer: 'color: var(--primary)',
        explanation: 'CSS custom properties are defined with -- prefix and used with var() function. They enable dynamic styling and theming.',
        difficulty: 'intermediate',
        topic: 'CSS',
        subtopic: 'Variables',
        points: 15,
    },
    {
        questionId: 'css-animation-1',
        question: 'Which property controls how long a CSS animation takes to complete?',
        type: 'multiple_choice',
        options: ['animation-time', 'animation-duration', 'animation-speed', 'transition-time'],
        correctAnswer: 'animation-duration',
        explanation: 'animation-duration specifies the time in seconds or milliseconds for one cycle of the animation.',
        difficulty: 'beginner',
        topic: 'CSS',
        subtopic: 'Animations',
        points: 10,
    },
    {
        questionId: 'css-media-1',
        question: 'What does @media (max-width: 768px) target?',
        type: 'multiple_choice',
        options: [
            'Screens wider than 768px',
            'Screens 768px wide or narrower',
            'Print media only',
            'All screen sizes'
        ],
        correctAnswer: 'Screens 768px wide or narrower',
        explanation: 'max-width targets screens up to and including the specified width. Its commonly used for responsive mobile-first designs.',
        difficulty: 'beginner',
        topic: 'CSS',
        subtopic: 'Responsive',
        points: 10,
    },
    {
        questionId: 'css-selector-1',
        question: 'What does the selector "div > p" select?',
        type: 'multiple_choice',
        options: [
            'All p elements inside div',
            'Only p elements that are direct children of div',
            'p elements next to div',
            'div elements inside p'
        ],
        correctAnswer: 'Only p elements that are direct children of div',
        explanation: 'The > combinator selects direct children only, not nested descendants. "div p" (space) selects all descendants.',
        difficulty: 'intermediate',
        topic: 'CSS',
        subtopic: 'Selectors',
        points: 15,
    },
];

// ============================================
// EXPORT ALL QUESTIONS
// ============================================
export const allQuestions = {
    javascript: javascriptQuestions,
    react: reactQuestions,
    typescript: typescriptQuestions,
    nodejs: nodejsQuestions,
    css: cssQuestions,
};

export const getQuestionsByTopic = (topic: string): QuestionItem[] => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('javascript') || topicLower === 'js') return javascriptQuestions;
    if (topicLower.includes('react')) return reactQuestions;
    if (topicLower.includes('typescript') || topicLower === 'ts') return typescriptQuestions;
    if (topicLower.includes('node') || topicLower.includes('api')) return nodejsQuestions;
    if (topicLower.includes('css')) return cssQuestions;
    return [];
};

export const getQuestionsByDifficulty = (questions: QuestionItem[], difficulty: string): QuestionItem[] => {
    return questions.filter(q => q.difficulty === difficulty);
};
