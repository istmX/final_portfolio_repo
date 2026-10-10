import { cn } from '@/lib/utils'

export type TokenType =
  | 'tag'
  | 'attribute'
  | 'string'
  | 'keyword'
  | 'component'
  | 'type'
  | 'function'
  | 'literal'
  | 'number'
  | 'comment'
  | 'punctuation'
  | 'identifier'
  | 'space'

export type Token = {
  type: TokenType
  value: string
}

// Visual color palette matching the target editor reference
export const TOKEN_COLORS: Record<TokenType, string> = {
  tag: '#fb923c', // Warm orange for JSX / HTML tags (<AppleCarouselRoot>, <AnimatedText>, </MotionLink>)
  attribute: '#fde047', // Light / warm yellow for JSX attributes (aria-label, prefix, href, initial, animate)
  string: '#4ade80', // Emerald green for string values ("Featured", "blur", "@/components/...")
  keyword: '#f472b6', // Pink / magenta for language keywords (import, from, const, return, export)
  function: '#38bdf8', // Sky blue for function calls and methods (motion.create, useState)
  component: '#2dd4bf', // Teal / cyan for capitalized components & types in expressions
  type: '#2dd4bf', // Teal / cyan for TypeScript types
  literal: '#fdba74', // Warm peach for booleans & null (false, true, null)
  number: '#fdba74', // Warm peach for numbers
  comment: '#71717a', // Muted slate gray for comments
  punctuation: '#94a3b8', // Subtle neutral gray for punctuation (<, >, =, ;, {}, ())
  identifier: '#e2e8f0', // Warm off-white for plain variables & identifiers
  space: 'inherit',
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'default',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'switch',
  'case',
  'break',
  'continue',
  'for',
  'while',
  'do',
  'try',
  'catch',
  'finally',
  'throw',
  'new',
  'delete',
  'typeof',
  'instanceof',
  'void',
  'in',
  'of',
  'yield',
  'await',
  'async',
  'as',
])

const TYPES = new Set([
  'type',
  'interface',
  'extends',
  'implements',
  'class',
  'enum',
  'string',
  'number',
  'boolean',
  'any',
  'unknown',
  'never',
  'symbol',
  'bigint',
  'void',
  'Record',
  'ReactNode',
  'React',
  'keyof',
  'readonly',
])

const LITERALS = new Set(['true', 'false', 'null', 'undefined'])

export function tokenizeCode(code: string): Token[][] {
  const lines = code.replace(/\r\n/g, '\n').split('\n')
  const result: Token[][] = []
  let inTag = false
  let braceDepth = 0

  for (const line of lines) {
    const tokens: Token[] = []
    let i = 0
    const len = line.length

    while (i < len) {
      // 1. Whitespace
      if (/\s/.test(line[i])) {
        let space = ''
        while (i < len && /\s/.test(line[i])) {
          space += line[i++]
        }
        tokens.push({ type: 'space', value: space })
        continue
      }

      // 2. Comments
      if (line.startsWith('{/*', i)) {
        const end = line.indexOf('*/}', i)
        const val = end === -1 ? line.slice(i) : line.slice(i, end + 3)
        tokens.push({ type: 'comment', value: val })
        i += val.length
        continue
      }
      if (line.startsWith('//', i)) {
        const val = line.slice(i)
        tokens.push({ type: 'comment', value: val })
        break
      }
      if (line.startsWith('/*', i)) {
        const end = line.indexOf('*/', i)
        const val = end === -1 ? line.slice(i) : line.slice(i, end + 2)
        tokens.push({ type: 'comment', value: val })
        i += val.length
        continue
      }

      // 3. Strings
      if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
        const quote = line[i]
        let str = quote
        i++
        while (i < len) {
          if (line[i] === '\\') {
            str += line[i++]
            if (i < len) str += line[i++]
          } else if (line[i] === quote) {
            str += line[i++]
            break
          } else {
            str += line[i++]
          }
        }
        tokens.push({ type: 'string', value: str })
        continue
      }

      // 4. Closing JSX Tag: </Tag
      if (line.startsWith('</', i)) {
        const m = line.slice(i + 2).match(/^[a-zA-Z_$][a-zA-Z0-9_$.-]*/)
        if (m) {
          tokens.push({ type: 'punctuation', value: '</' })
          tokens.push({ type: 'tag', value: m[0] })
          i += 2 + m[0].length
          inTag = true
          braceDepth = 0
          continue
        }
      }

      // 5. Opening JSX Tag: <Tag
      if (line[i] === '<') {
        const m = line.slice(i + 1).match(/^[a-zA-Z_$][a-zA-Z0-9_$.-]*/)
        if (m && !line.startsWith('<=', i) && !line.startsWith('<<', i)) {
          tokens.push({ type: 'punctuation', value: '<' })
          tokens.push({ type: 'tag', value: m[0] })
          i += 1 + m[0].length
          inTag = true
          braceDepth = 0
          continue
        }
      }

      // Track braces inside JSX attributes
      if (inTag && line[i] === '{') {
        braceDepth++
        tokens.push({ type: 'punctuation', value: '{' })
        i++
        continue
      }
      if (inTag && line[i] === '}') {
        if (braceDepth > 0) braceDepth--
        tokens.push({ type: 'punctuation', value: '}' })
        i++
        continue
      }

      // Tag closers: /> or > (when outside attribute expressions)
      if (inTag && braceDepth === 0 && line.startsWith('/>', i)) {
        tokens.push({ type: 'punctuation', value: '/>' })
        i += 2
        inTag = false
        continue
      }
      if (inTag && braceDepth === 0 && line[i] === '>') {
        tokens.push({ type: 'punctuation', value: '>' })
        i += 1
        inTag = false
        continue
      }

      // 6. Multi-character operators
      const two = line.slice(i, i + 2)
      const three = line.slice(i, i + 3)
      if (three === '===' || three === '!==') {
        tokens.push({ type: 'punctuation', value: three })
        i += 3
        continue
      }
      if (
        two === '=>' ||
        two === '==' ||
        two === '!=' ||
        two === '<=' ||
        two === '>=' ||
        two === '&&' ||
        two === '||' ||
        two === '??' ||
        two === '?.'
      ) {
        tokens.push({ type: 'punctuation', value: two })
        i += 2
        continue
      }

      // Check preceding non-space token in this line
      const prevToken = [...tokens].reverse().find((t) => t.type !== 'space')
      const isAfterDeclaration =
        prevToken && ['const', 'let', 'var', 'export'].includes(prevToken.value)

      // 7. JSX Attribute: word before = (inTag or in multiline JSX)
      const attrMatch = line
        .slice(i)
        .match(/^[a-zA-Z_$][a-zA-Z0-9_$-]*(?=\s*=)/)
      if (attrMatch && (inTag || !isAfterDeclaration)) {
        tokens.push({ type: 'attribute', value: attrMatch[0] })
        i += attrMatch[0].length
        continue
      }

      // 8. Boolean attribute inside tag when braceDepth === 0
      if (inTag && braceDepth === 0) {
        const boolAttrMatch = line.slice(i).match(/^[a-zA-Z_$][a-zA-Z0-9_$-]*/)
        if (boolAttrMatch) {
          const val = boolAttrMatch[0]
          let nextIdx = i + val.length
          while (nextIdx < len && /\s/.test(line[nextIdx])) nextIdx++
          if (
            nextIdx >= len ||
            line[nextIdx] === '>' ||
            line.startsWith('/>', nextIdx) ||
            /^[a-zA-Z]/.test(line[nextIdx])
          ) {
            tokens.push({ type: 'attribute', value: val })
            i += val.length
            continue
          }
        }
      }

      // 9. Numbers
      const numMatch = line.slice(i).match(/^\d+(?:\.\d+)?\b/)
      if (numMatch) {
        tokens.push({ type: 'number', value: numMatch[0] })
        i += numMatch[0].length
        continue
      }

      // 10. Word / identifier
      const idMatch = line.slice(i).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)
      if (idMatch) {
        const val = idMatch[0]
        i += val.length

        let j = i
        while (j < len && /\s/.test(line[j])) j++
        const isCall = line[j] === '('

        if (KEYWORDS.has(val)) {
          tokens.push({ type: 'keyword', value: val })
        } else if (LITERALS.has(val)) {
          tokens.push({ type: 'literal', value: val })
        } else if (TYPES.has(val)) {
          tokens.push({ type: 'type', value: val })
        } else if (isCall) {
          tokens.push({ type: 'function', value: val })
        } else if (/^[A-Z]/.test(val)) {
          tokens.push({ type: 'component', value: val })
        } else {
          tokens.push({ type: 'identifier', value: val })
        }
        continue
      }

      // 11. Single-char punctuation
      tokens.push({ type: 'punctuation', value: line[i] })
      i++
    }

    result.push(tokens)
  }

  return result
}

export function TokenSpan({ token }: { token: Token }) {
  if (token.type === 'space') {
    return <>{token.value}</>
  }

  const color = TOKEN_COLORS[token.type] ?? '#e2e8f0'
  const isItalic = token.type === 'comment'

  return (
    <span style={{ color }} className={isItalic ? 'italic' : undefined}>
      {token.value}
    </span>
  )
}


export function CodeHighlighter({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  const lines = tokenizeCode(code)
  return (
    <pre className={cn('w-full max-w-full overflow-x-auto p-4 font-mono text-[13.5px] leading-[1.7] antialiased select-text sm:p-5 sm:text-[14.5px] sm:leading-[1.72]', className)} style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
      <code>{lines.map((line, lineIndex) => (
        <span key={`highlight-line-${lineIndex}`} className="block min-h-[1.7em] whitespace-pre">
          {line.length ? line.map((token, tokenIndex) => (
            <TokenSpan key={`highlight-${lineIndex}-${tokenIndex}`} token={token} />
          )) : <>&nbsp;</>}
        </span>
      ))}</code>
    </pre>
  )
}
