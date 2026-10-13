import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatHistoryItem {
  role: 'user' | 'model';
  content: string;
}

// AI Chatbot endpoint for math tutoring and calculation assistance
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, calculatorContext } = req.body as {
      message: string;
      history?: ChatHistoryItem[];
      calculatorContext?: { expression?: string; result?: string; mode?: string };
    };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server.',
        fallback: true,
      });
    }

    let contextSnippet = '';
    if (calculatorContext && (calculatorContext.expression || calculatorContext.result)) {
      contextSnippet = `\nCurrent Calculator Display:\n- Expression: "${calculatorContext.expression || ''}"\n- Current Evaluated Result: "${calculatorContext.result || ''}"\n- Mode: ${calculatorContext.mode || 'standard'}`;
    }

    const systemInstruction = `You are OmniCalc AI, an expert math tutor and calculation assistant built directly into the OmniCalc application.
Your goal is to explain calculations, teach mathematical concepts, guide through algebraic steps, break down conversions, and clarify math formulas.
Guidelines:
1. Provide clear, encouraging, step-by-step explanations. Keep explanations direct and easy to scan.
2. When the user asks about the current calculator expression or result, explain the mechanics (e.g. order of operations, properties, formulas).
3. If your solution calculates a concrete final numerical answer (or an exact decimal/fraction), conclude with a clean final sentence stating the value.
4. On the very last line of your reply, if there is a primary numerical answer that the user can paste back into the calculator, write:
RESULT: <number>
(Example: "RESULT: 144" or "RESULT: 3.14159"). Do not add any text after RESULT: <number>.
If the answer is conceptual or does not have a single numeric output, do not include the RESULT: line.
${contextSnippet}`;

    // Format chat history into contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        contents.push({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const rawText = response.text || 'I could not generate an explanation for this calculation.';
    
    // Extract optional RESULT: <number>
    let extractedResult: string | null = null;
    const match = rawText.match(/\bRESULT:\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*$/m);
    let cleanText = rawText;
    if (match) {
      extractedResult = match[1];
      cleanText = rawText.replace(/\bRESULT:\s*[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\s*$/m, '').trim();
    }

    return res.json({
      text: cleanText,
      resultValue: extractedResult,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response from Gemini API',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniCalc AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
