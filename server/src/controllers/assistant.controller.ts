import { Response, NextFunction } from 'express';
import ChatMessage from '../models/ChatMessage';
import { AuthRequest } from '../types';

// Hugging Face Inference API configuration
const HF_API_KEY = process.env.HF_API_KEY || '';
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// System prompt for the learning assistant
const SYSTEM_PROMPT = `You are an expert AI Learning Tutor for a web development learning platform. Your role:

1. Help students learn JavaScript, React, TypeScript, Node.js, CSS, APIs, and MongoDB
2. Provide clear, concise explanations with code examples when relevant
3. Use markdown formatting: **bold**, \`inline code\`, and fenced code blocks
4. Break complex topics into digestible steps
5. Encourage the student and suggest next steps
6. If you don't know something, say so honestly
7. Keep responses focused and under 500 words unless the topic requires more detail

Always be helpful, patient, and encouraging.`;

// Call Hugging Face Inference API
const callHuggingFace = async (
  userMessage: string,
  conversationHistory: { role: string; content: string }[]
): Promise<string> => {
  if (!HF_API_KEY || HF_API_KEY === 'your-huggingface-api-key-here') {
    throw new Error('HF_API_KEY_NOT_SET');
  }

  // Build the prompt in Mistral instruction format
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-6), // Last 6 messages for context
    { role: 'user', content: userMessage },
  ];

  // Format for Mistral instruct
  let prompt = '';
  for (const msg of messages) {
    if (msg.role === 'system') {
      prompt += `<s>[INST] ${msg.content} [/INST]</s>`;
    } else if (msg.role === 'user') {
      prompt += `[INST] ${msg.content} [/INST]`;
    } else {
      prompt += `${msg.content}</s>`;
    }
  }

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`HuggingFace API error (${response.status}):`, errorBody);

    if (response.status === 503) {
      throw new Error('MODEL_LOADING');
    }
    throw new Error(`HF_API_ERROR_${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
    return data[0].generated_text.trim();
  }

  throw new Error('UNEXPECTED_RESPONSE');
};

// Fallback responses when HF API is unavailable
const generateFallbackResponse = (userInput: string): string => {
  const lower = userInput.toLowerCase();

  if (lower.includes('react') || lower.includes('hook') || lower.includes('component')) {
    return `Great question about React! Here's a quick overview:

**React** is a JavaScript library for building user interfaces using components.

**Key Concepts:**
- **Components** – Reusable UI building blocks
- **Props** – Data passed from parent to child
- **State** – Local data that triggers re-renders
- **Hooks** – \`useState\`, \`useEffect\`, \`useContext\` for functional components

\`\`\`javascript
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
\`\`\`

💡 *For deeper AI-powered answers, add your Hugging Face API key in the server settings.*`;
  }

  if (lower.includes('javascript') || lower.includes('js') || lower.includes('async') || lower.includes('promise')) {
    return `Here's a quick JavaScript overview:

**Modern JavaScript (ES6+) essentials:**
- \`const\`/\`let\` for variable declarations
- Arrow functions: \`const fn = (x) => x * 2\`
- Destructuring: \`const { name, age } = user\`
- Spread operator: \`[...arr1, ...arr2]\`
- Template literals: \`\`Hello \${name}\`\`

**Async/Await:**
\`\`\`javascript
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed:', error);
  }
}
\`\`\`

💡 *For deeper AI-powered answers, add your Hugging Face API key in the server settings.*`;
  }

  if (lower.includes('typescript') || lower.includes('type') || lower.includes('interface')) {
    return `Here's a TypeScript primer:

**TypeScript** adds static types to JavaScript for better developer experience.

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email?: string; // optional
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

**Key Features:**
- **Interfaces** – Define object shapes
- **Generics** – Reusable typed functions: \`Array<T>\`
- **Union types** – \`string | number\`
- **Type guards** – Runtime type checking

💡 *For deeper AI-powered answers, add your Hugging Face API key in the server settings.*`;
  }

  if (lower.includes('node') || lower.includes('express') || lower.includes('api') || lower.includes('backend')) {
    return `Here's a Node.js & Express overview:

**Express.js** is the most popular Node.js web framework.

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
});

app.listen(3000, () => console.log('Server running on port 3000'));
\`\`\`

**Key Concepts:**
- **Routing** – Define endpoints (GET, POST, PUT, DELETE)
- **Middleware** – Functions that process requests
- **Error handling** – Centralized error middleware

💡 *For deeper AI-powered answers, add your Hugging Face API key in the server settings.*`;
  }

  if (lower.includes('css') || lower.includes('flex') || lower.includes('grid') || lower.includes('style')) {
    return `Here's a CSS layout guide:

**Flexbox** – 1D layouts (row or column):
\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

**CSS Grid** – 2D layouts (rows AND columns):
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
\`\`\`

**Pro Tips:**
- Use \`rem\` for spacing, \`em\` for component-local sizing
- Mobile-first: write base styles, then \`@media (min-width: ...)\`
- CSS variables: \`--color-primary: #135bec\`

💡 *For deeper AI-powered answers, add your Hugging Face API key in the server settings.*`;
  }

  return `I'd be happy to help you learn! Here are topics I can assist with:

- **React** – Components, hooks, state management, routing
- **JavaScript** – ES6+, async/await, closures, DOM
- **TypeScript** – Types, interfaces, generics
- **Node.js** – Express, REST APIs, middleware
- **CSS** – Flexbox, Grid, responsive design
- **MongoDB** – Schema design, queries, aggregation

Try asking something specific like:
> "Explain useEffect in React"
> "How do async/await work?"
> "What is TypeScript generics?"

💡 *For deeper AI-powered answers, add your Hugging Face API key in the server settings.*`;
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

    let aiContent: string;
    let source: 'huggingface' | 'fallback' = 'fallback';

    try {
      // Get recent conversation history for context
      const recentMessages = await ChatMessage.find({ userId: req.user?._id })
        .sort({ createdAt: -1 })
        .limit(6);

      const conversationHistory = recentMessages
        .reverse()
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

      // Try Hugging Face API
      aiContent = await callHuggingFace(content, conversationHistory);
      source = 'huggingface';
    } catch (hfError: unknown) {
      const errorMessage = hfError instanceof Error ? hfError.message : 'Unknown error';
      console.warn(`HuggingFace API unavailable (${errorMessage}), using fallback`);

      if (errorMessage === 'MODEL_LOADING') {
        aiContent = `⏳ The AI model is currently loading (this can take 20-30 seconds on the first request). Please try again in a moment!\n\nIn the meantime, here's a quick answer:\n\n${generateFallbackResponse(content)}`;
      } else {
        aiContent = generateFallbackResponse(content);
      }
    }

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
        source,
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
            content: "Hello! I'm your **AI Learning Tutor** powered by Hugging Face 🤗\n\nI can help you with:\n- 🟡 **JavaScript** & **TypeScript**\n- ⚛️ **React** hooks, components & patterns\n- 🟢 **Node.js** & **Express** APIs\n- 🎨 **CSS** layouts & animations\n- 🗄️ **MongoDB** & database design\n\nAsk me anything! For example:\n> *\"Explain useEffect in React\"*\n> *\"How do I build a REST API?\"*",
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
  _req: AuthRequest,
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
