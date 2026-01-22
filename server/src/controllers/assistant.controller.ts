import { Response, NextFunction } from 'express';
import ChatMessage from '../models/ChatMessage';
import { AuthRequest } from '../types';

// Enhanced AI response generator with comprehensive conversation patterns
const generateAIResponse = (userInput: string): string => {
    const responses: Record<string, string> = {
        // React Topics
        hook: `React Hooks are functions that let you use state and other React features in functional components. Let me break down the most common ones:

**1. useState** - Manages component state
\`\`\`javascript
const [count, setCount] = useState(0);
// count is the value, setCount updates it
\`\`\`

**2. useEffect** - Handles side effects (data fetching, subscriptions, timers)
\`\`\`javascript
useEffect(() => {
  // Runs after render
  document.title = \`Count: \${count}\`;
}, [count]); // Re-runs when count changes
\`\`\`

**3. useContext** - Access context values without prop drilling  
**4. useReducer** - Complex state management (like Redux)  
**5. useCallback** - Memoize functions to prevent re-renders  
**6. useMemo** - Memoize expensive calculations  
**7. useRef** - Access DOM elements or persist values

**Best Practices:**
- Only call hooks at the top level (not in loops/conditions)
- Custom hooks start with "use"
- Clean up effects to prevent memory leaks

Would you like me to dive deeper into any specific hook?`,

        useeffect: `**useEffect** is one of the most powerful React hooks! It lets you perform side effects in functional components.

**Basic Syntax:**
\`\`\`javascript
useEffect(() => {
  // Your side effect code here
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]);
\`\`\`

**Common Use Cases:**

**1. Data Fetching**
\`\`\`javascript
useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data));
}, []); // Empty array = run once on mount
\`\`\`

**2. Subscriptions**
\`\`\`javascript
useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, []);
\`\`\`

**Dependency Array Rules:**
- **No array** → Runs after every render
- **Empty array []** → Runs once on mount
- **[var1, var2]** → Runs when var1 or var2 change

Need more examples?`,

        useState: `**useState** is the fundamental hook for adding state to functional components!

**Basic Usage:**
\`\`\`javascript
const [state, setState] = useState(initialValue);
\`\`\`

**Examples:**

**1. Simple Counter**
\`\`\`javascript
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>Increment</button>
\`\`\`

**2. Object State**
\`\`\`javascript
const [user, setUser] = useState({ name: '', age: 0 });
setUser(prev => ({ ...prev, name: 'John' })); // Merge update
\`\`\`

**Pro Tips:**
- State updates are async - use functional updates for sequential changes
- Don't mutate state directly - always create new objects/arrays`,

        // TypeScript Topics
        generics: `TypeScript Generics allow you to write reusable code that works with multiple types while maintaining type safety!

**Basic Example:**
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(42);
\`\`\`

**Common Use Cases:**

**1. Generic Arrays**
\`\`\`typescript
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = getFirstElement([1, 2, 3]); // number
const firstStr = getFirstElement(['a', 'b']); // string
\`\`\`

**2. Generic Interfaces**
\`\`\`typescript
interface Response<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: Response<User> = {
  data: { id: 1, name: 'John' },
  status: 200,
  message: 'Success'
};
\`\`\`

Need more examples? Ask about utility types or advanced patterns!`,

        typescript: `TypeScript adds static typing to JavaScript, catching errors before runtime!

**Key Features:**

**1. Type Annotations**
\`\`\`typescript
let name: string = "John";
let age: number = 30;
let isActiv: boolean = true;
\`\`\`

**2. Interfaces**
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional
}
\`\`\`

**3. Union Types**
\`\`\`typescript
let value: string | number;
value = "hello";
value = 42;
\`\`\`

**Benefits:**
✅ Catch errors at compile time
✅ Better IDE autocomplete
✅ Self-documenting code
✅ Easier refactoring

What TypeScript topic should we explore deeper?`,

        // API & Backend
        api: `Best practices for RESTful API design:

**1. Use Proper HTTP Methods**
- **GET** - Retrieve data (no side effects)
- **POST** - Create new resources
- **PUT** - Update entire resource
- **PATCH** - Partial update
- **DELETE** - Remove resource

**2. Resource-Based URLs**
✅ \`GET /api/users\` - Get all users
✅ \`GET /api/users/123\` - Get specific user
✅ \`POST /api/users\` - Create user
✅ \`PUT /api/users/123\` - Update user
❌ \`GET /api/getUsers\` - Don't use verbs in URLs

**3. Status Codes**
- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Server Error

**4. Error Handling**
\`\`\`json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid format"
  }
}
\`\`\`

Would you like code examples for any of these?`,

        rest: `REST (Representational State Transfer) is an architectural style for APIs.

**Core Principles:**
1. **Client-Server Separation** - Frontend and backend are independent
2. **Stateless** - Each request contains all needed information
3. **Cacheable** - Responses should specify if they can be cached
4. **Uniform Interface** - Resource identification (URLs)

**Example RESTful API:**
\`\`\`javascript
// GET /api/posts
[
  { "id": 1, "title": "First Post", "author": "John" }
]

// POST /api/posts
{
  "title": "New Post",
  "content": "..."
}

// PUT /api/posts/1
{
  "id": 1,
  "title": "Updated Post"
}

// DELETE /api/posts/1
\`\`\`

Need help designing a specific API?`,

        // Database
        database: `Database optimization strategies:

**1. Indexing**
\`\`\`sql
CREATE INDEX idx_email ON users(email);
\`\`\`
✅ Speeds up WHERE, JOIN, ORDER BY
❌ Slows down INSERT, UPDATE, DELETE

**2. Query Optimization**
❌ **Bad:** \`SELECT * FROM users;\`
✅ **Good:** \`SELECT id, name, email FROM users WHERE active = true;\`

**3. N+1 Query Problem**
❌ **Bad:** Loop and fetch each item
✅ **Good:** Use JOINs or includes

**4. Pagination**
\`\`\`sql
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
\`\`\`

**5. Connection Pooling**
Reuse database connections instead of creating new ones

What's your database setup? I can give specific advice!`,

        sql: `SQL (Structured Query Language) fundamentals:

**Basic Queries:**

**1. SELECT**
\`\`\`sql
SELECT name, email FROM users;
SELECT * FROM users WHERE age > 25;
\`\`\`

**2. INSERT**
\`\`\`sql
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@example.com', 30);
\`\`\`

**3. UPDATE**
\`\`\`sql
UPDATE users
SET age = 31
WHERE id = 1;
\`\`\`

**4. JOINs**
\`\`\`sql
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;
\`\`\`

**5. GROUP BY**
\`\`\`sql
SELECT user_id, COUNT(*) as post_count
FROM posts
GROUP BY user_id;
\`\`\`

Want to practice with specific examples?`,

        // JavaScript
        async: `Async JavaScript explained:

**1. Promises**
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Success!'), 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
\`\`\`

**2. Async/Await** (cleaner syntax)
\`\`\`javascript
async function fetchUser() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

**3. Multiple Promises**
\`\`\`javascript
// Run in parallel
const [users, posts] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts')
]);
\`\`\`

Need help with a specific async pattern?`,

        promise: `Promises are JavaScript's way to handle asynchronous operations!

**Promise States:**
- **Pending** - Initial state
- **Fulfilled** - Operation succeeded
- **Rejected** - Operation failed

**Creating Promises:**
\`\`\`javascript
const myPromise = new Promise((resolve, reject) => {
  if (success) {
    resolve('Operation succeeded!');
  } else {
    reject('Operation failed!');
  }
});
\`\`\`

** Consuming Promises:**
\`\`\`javascript
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Always runs'));
\`\`\`

**Promise Utilities:**
\`\`\`javascript
Promise.all([promise1, promise2])
Promise.race([promise1, promise2])
Promise.allSettled([promise1, promise2])
\`\`\`

Modern code usually uses async/await instead!`,

        // Next.js
        nextjs: `Next.js is a powerful React framework for production!

**Key Features:**

**1. File-based Routing**
\`\`\`
pages/index.js → /
pages/about.js → /about
pages/blog/[slug].js → /blog/:slug
\`\`\`

**2. Server Components**
\`\`\`javascript
// app/page.tsx
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
\`\`\`

**3. API Routes**
\`\`\`javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello' });
}
\`\`\`

**4. Image Optimization**
\`\`\`javascript
import Image from 'next/image';
<Image src="/photo.jpg" width={500} height={300} />
\`\`\`

Want to learn more about any feature?`,

        // CSS
        css: `CSS (Cascading Style Sheets) tips:

**1. Flexbox**
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
\`\`\`

**2. Grid**
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

**3. Modern Units**
- **rem** - Relative to root font size
- **em** - Relative to parent font size
- **vw/vh** - Viewport width/height
- **%** - Percentage of parent

**4. CSS Variables**
\`\`\`css
:root {
  --primary-color: #3498db;
}

.button {
  background: var(--primary-color);
}
\`\`\`

What CSS topic are you struggling with?`,
    };

    const inputLower = userInput.toLowerCase();

    // Check for matches
    for (const [key, response] of Object.entries(responses)) {
        if (inputLower.includes(key)) {
            return response;
        }
    }

    // Context-aware fallback responses
    if (inputLower.includes('error') || inputLower.includes('debug') || inputLower.includes('fix')) {
        return `Debugging tips:

1. **Check the console** - \`console.log()\` is your friend
2. **Use browser devtools** - Set breakpoints, inspect variables
3. **Read error messages** - They tell you exactly what's wrong
4. **Check imports** - Missing or incorrect imports are common
5. **Verify API responses** - Use Network tab
6. **Test incrementally** - Isolate the problem

What specific error are you seeing? Share the message!`;
    }

    if (inputLower.includes('learn') || inputLower.includes('start') || inputLower.includes('begin')) {
        return `Great question! Here's my recommended learning path:

**For Frontend:**
1. HTML/CSS basics
2. JavaScript fundamentals
3. React (or Vue/Angular)
4. TypeScript
5. State management (Redux, Zustand)

**For Backend:**
1. Node.js & Express
2. Databases (MongoDB, PostgreSQL)
3. REST APIs
4. Authentication (JWT)
5. Testing (Jest)

**For Full-Stack:**
All of the above + deployment (Docker, Vercel)

What area interests you most?`;
    }

    if (inputLower.includes('help') || inputLower.includes('stuck')) {
        return `I'm here to help! I can assist with:

✅ **React** - Components, hooks, state management
✅ **TypeScript** - Types, interfaces, generics
✅ **APIs** - RESTful design, authentication
✅ **Databases** - SQL, MongoDB, optimization
✅ **JavaScript** - ES6+, async/await, promises
✅ **Next.js** - Routing, SSR, API routes
✅ **CSS** - Flexbox, grid, responsive design
✅ **Debugging** - Finding and fixing errors

What do you need help with?`;
    }

    // Default helpful response
    return `That's a great question! Based on your learning path, I'd recommend exploring this topic step by step. 

Would you like me to:

1. **Break it down** into smaller concepts?
2. **Provide code examples** to illustrate?
3. **Link to resources** from your recommended list?
4. **Quiz you** to test your understanding?
5. **Explain the "why"** behind the concept?

Or ask me about specific topics like:
- React (hooks, components, state management)
- TypeScript (types, generics, interfaces)
- APIs (REST, GraphQL, authentication)
- Databases (SQL, MongoDB, optimization)
- JavaScript (async, promises, ES6+)
- Next.js (routing, SSR, deployment)

How can I help you learn better?`;
};

// @desc    Send message to AI assistant
// @route   POST /api/assistant/chat
// @access  Private
export const sendMessage = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { content } = req.body;

        if (!content) {
            res.status(400).json({
                success: false,
                error: 'Message content is required',
            });
            return;
        }

        // Save user message
        const userMessage = await ChatMessage.create({
            userId: req.user?._id,
            type: 'user',
            content,
        });

        // Generate AI response
        const aiContent = generateAIResponse(content);

        // Save AI response
        const aiMessage = await ChatMessage.create({
            userId: req.user?._id,
            type: 'ai',
            content: aiContent,
        });

        res.status(200).json({
            success: true,
            data: {
                userMessage,
                aiMessage,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get chat history
// @route   GET /api/assistant/history
// @access  Private
export const getChatHistory = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const messages = await ChatMessage.find({ userId: req.user?._id })
            .sort({ createdAt: 1 })
            .limit(50);

        // If no messages, return welcome message
        if (messages.length === 0) {
            res.status(200).json({
                success: true,
                data: [
                    {
                        id: 1,
                        type: 'ai',
                        content: "Hello! I'm your AI Learning Tutor. I'm here to help you master any topic and answer all your questions. What would you like to learn about today?",
                    },
                ],
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear chat history
// @route   DELETE /api/assistant/history
// @access  Private
export const clearHistory = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await ChatMessage.deleteMany({ userId: req.user?._id });

        res.status(200).json({
            success: true,
            message: 'Chat history cleared',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get suggested topics
// @route   GET /api/assistant/suggestions
// @access  Private
export const getSuggestions = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const suggestions = [
            "Explain React hooks to me",
            "Help me with TypeScript generics",
            "What's the best way to structure APIs?",
            "How do I optimize database queries?",
            "Explain async/await in JavaScript",
            "What is the virtual DOM?",
            "How does useEffect work?",
            "Teach me about Next.js routing",
            "What are CSS Grid and Flexbox?",
            "How do I debug my code?",
        ];

        res.status(200).json({
            success: true,
            data: suggestions,
        });
    } catch (error) {
        next(error);
    }
};
