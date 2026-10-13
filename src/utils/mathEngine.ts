/**
 * Pure client-side math parsing and evaluation engine.
 * Fully functional offline with zero external network dependencies.
 */

// Format numbers nicely, avoiding IEEE 754 float precision artifacts
export function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  // Fix floating point issues like 0.1 + 0.2 = 0.30000000000000004
  const rounded = Number(num.toPrecision(12));
  
  // Format very large or very small numbers with scientific notation
  if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-7)) {
    return rounded.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Convert to clean string without trailing float zeroes
  return rounded.toString();
}

// Compute factorial for positive integers
function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial of negative number');
  if (n > 170) return Infinity; // JS overflow
  if (Math.floor(n) !== n) throw new Error('Factorial requires integer');
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Tokenizer & Safe Recursive-Descent Expression Parser
 */
export function evaluateMathExpression(expr: string, isDegreeMode = false): { success: boolean; result?: number; formatted?: string; error?: string } {
  try {
    if (!expr || expr.trim() === '') {
      return { success: true, result: 0, formatted: '0' };
    }

    // Replace display symbols with standard math tokens
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/√\s*\(/g, 'sqrt(')
      .replace(/√([0-9.]+)/g, 'sqrt($1)');

    // Lexer
    let pos = 0;

    function peek(): string {
      while (pos < sanitized.length && sanitized[pos] === ' ') pos++;
      return pos < sanitized.length ? sanitized[pos] : '';
    }

    function getChar(): string {
      while (pos < sanitized.length && sanitized[pos] === ' ') pos++;
      return pos < sanitized.length ? sanitized[pos++] : '';
    }

    function parsePrimary(): number {
      const ch = peek();

      if (ch === '(') {
        getChar(); // '('
        const val = parseExpression();
        if (peek() === ')') {
          getChar(); // ')'
        }
        return val;
      }

      if (ch === '+' || ch === '-') {
        getChar();
        const factor = ch === '-' ? -1 : 1;
        return factor * parsePrimary();
      }

      // Check for named functions or constants
      const remaining = sanitized.slice(pos);
      const funcMatch = remaining.match(/^([a-zA-Z]+)/);
      if (funcMatch) {
        const name = funcMatch[1].toLowerCase();
        pos += name.length;

        if (name === 'pi') return Math.PI;
        if (name === 'e') return Math.E;

        // Named functions require parenthesis
        if (peek() === '(') {
          getChar(); // '('
          const arg = parseExpression();
          if (peek() === ')') getChar(); // ')'

          switch (name) {
            case 'sin': {
              const rad = isDegreeMode ? (arg * Math.PI) / 180 : arg;
              return Math.sin(rad);
            }
            case 'cos': {
              const rad = isDegreeMode ? (arg * Math.PI) / 180 : arg;
              return Math.cos(rad);
            }
            case 'tan': {
              const rad = isDegreeMode ? (arg * Math.PI) / 180 : arg;
              return Math.tan(rad);
            }
            case 'sqrt':
              if (arg < 0) throw new Error('Square root of negative number');
              return Math.sqrt(arg);
            case 'cbrt':
              return Math.cbrt(arg);
            case 'log':
              if (arg <= 0) throw new Error('Log of non-positive number');
              return Math.log10(arg);
            case 'ln':
              if (arg <= 0) throw new Error('Ln of non-positive number');
              return Math.log(arg);
            case 'abs':
              return Math.abs(arg);
            case 'fact':
              return factorial(arg);
            default:
              throw new Error(`Unknown function: ${name}`);
          }
        }
      }

      // Numeric literal
      const numMatch = sanitized.slice(pos).match(/^(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
      if (numMatch) {
        pos += numMatch[0].length;
        let val = parseFloat(numMatch[0]);

        // Check for immediate percentage: e.g. 50%
        if (peek() === '%') {
          getChar();
          val = val / 100;
        }

        // Check for immediate factorial: e.g. 5!
        if (peek() === '!') {
          getChar();
          val = factorial(val);
        }

        return val;
      }

      throw new Error(`Unexpected character '${ch}' at position ${pos}`);
    }

    // Exponentiation (right-associative: 2^3^2 = 2^(3^2))
    function parseExponent(): number {
      let left = parsePrimary();
      while (peek() === '^') {
        getChar(); // '^'
        const right = parseExponent();
        left = Math.pow(left, right);
      }
      return left;
    }

    // Multiplication and Division
    function parseTerm(): number {
      let left = parseExponent();

      while (true) {
        const op = peek();
        if (op === '*' || op === '/' || op === '%') {
          getChar();
          const right = parseExponent();
          if (op === '*') {
            left *= right;
          } else if (op === '/') {
            if (right === 0) throw new Error('Division by zero');
            left /= right;
          } else if (op === '%') {
            left = left % right;
          }
        } else if (op === '(') {
          // Implicit multiplication: e.g. 2(3) or (2)(3)
          const right = parsePrimary();
          left *= right;
        } else {
          break;
        }
      }

      return left;
    }

    // Addition and Subtraction
    function parseExpression(): number {
      let left = parseTerm();

      while (true) {
        const op = peek();
        if (op === '+' || op === '-') {
          getChar();
          const right = parseTerm();
          if (op === '+') {
            left += right;
          } else {
            left -= right;
          }
        } else {
          break;
        }
      }

      return left;
    }

    const value = parseExpression();

    if (pos < sanitized.length) {
      // Unparsed trailing tokens
      throw new Error(`Invalid syntax at: ${sanitized.slice(pos)}`);
    }

    if (isNaN(value)) {
      throw new Error('Calculation resulted in NaN');
    }

    return {
      success: true,
      result: value,
      formatted: formatResult(value),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Calculation error',
    };
  }
}
