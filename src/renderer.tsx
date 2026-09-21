import { jsxRenderer } from 'hono/jsx-renderer'
import { BASE_PATH, withBase } from './base-path'

declare module 'hono' {
  interface ContextRenderer {
    (content: any, props?: { title?: string }): any
  }
}

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | 一人前エンジニア道場` : '一人前エンジニア道場'}</title>
        <meta
          name="description"
          content="AI時代に一人称で活躍するためのエンジニア学習プラットフォーム。技術×ビジネス×AI時代の判断力を体系的に。"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>⛩️</text></svg>"
        />
        <link href={withBase('/static/styles.css')} rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  dojo: {
                    950: '#0f0e17',
                    900: '#17161f',
                    800: '#211f2e',
                    700: '#2e2c3f',
                  }
                }
              }
            }
          }
        `,
          }}
        />
      </head>
      <body class="bg-dojo-950 text-gray-100 min-h-screen flex flex-col">
        <header class="border-b border-dojo-700 bg-dojo-900/80 backdrop-blur sticky top-0 z-50">
          <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href={withBase('/')} class="flex items-center gap-2 font-bold text-lg hover:text-amber-400 transition">
              <i class="fa-solid fa-torii-gate text-amber-400"></i>
              <span>一人前エンジニア道場</span>
            </a>
            <nav class="hidden md:flex items-center gap-3 text-sm">
              <a href={withBase('/tracks')} class="hover:text-amber-400 transition">
                <i class="fa-solid fa-book-open mr-1"></i>カリキュラム
              </a>
              <a href={withBase('/scenarios')} class="hover:text-amber-400 transition">
                <i class="fa-solid fa-user-ninja mr-1"></i>実践シナリオ
              </a>
              <a href={withBase('/daily-quiz')} class="hover:text-amber-400 transition">
                <i class="fa-solid fa-calendar-day mr-1"></i>デイリークイズ
              </a>
              <a href={withBase('/glossary')} class="hover:text-amber-400 transition">
                <i class="fa-solid fa-book mr-1"></i>用語集
              </a>
              <a href={withBase('/self-analysis')} class="hover:text-amber-400 transition">
                <i class="fa-solid fa-map mr-1"></i>自己分析
              </a>
              <a href={withBase('/dashboard')} class="hover:text-amber-400 transition">
                <i class="fa-solid fa-chart-line mr-1"></i>進捗
              </a>
            </nav>
            <button
              id="nav-toggle-btn"
              class="md:hidden text-xl text-gray-200 hover:text-amber-400 transition"
              aria-label="メニューを開く"
              aria-expanded="false"
              aria-controls="mobile-nav"
            >
              <i class="fa-solid fa-bars"></i>
            </button>
          </div>
          <nav
            id="mobile-nav"
            class="hidden md:hidden border-t border-dojo-700 bg-dojo-900 px-4 py-2 text-sm"
          >
            <a href={withBase('/tracks')} class="block py-2 hover:text-amber-400 transition">
              <i class="fa-solid fa-book-open mr-2 w-4 text-center"></i>カリキュラム
            </a>
            <a href={withBase('/scenarios')} class="block py-2 hover:text-amber-400 transition">
              <i class="fa-solid fa-user-ninja mr-2 w-4 text-center"></i>実践シナリオ
            </a>
            <a href={withBase('/daily-quiz')} class="block py-2 hover:text-amber-400 transition">
              <i class="fa-solid fa-calendar-day mr-2 w-4 text-center"></i>デイリークイズ
            </a>
            <a href={withBase('/glossary')} class="block py-2 hover:text-amber-400 transition">
              <i class="fa-solid fa-book mr-2 w-4 text-center"></i>用語集
            </a>
            <a href={withBase('/self-analysis')} class="block py-2 hover:text-amber-400 transition">
              <i class="fa-solid fa-map mr-2 w-4 text-center"></i>自己分析
            </a>
            <a href={withBase('/dashboard')} class="block py-2 hover:text-amber-400 transition">
              <i class="fa-solid fa-chart-line mr-2 w-4 text-center"></i>進捗
            </a>
          </nav>
        </header>
        <main class="flex-1">{children}</main>
        <footer class="border-t border-dojo-700 py-8 mt-12">
          <div class="max-w-6xl mx-auto px-4 text-sm text-gray-400 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p class="font-bold text-gray-300 mb-1">
                <i class="fa-solid fa-torii-gate text-amber-400 mr-1"></i>一人前エンジニア道場
              </p>
              <p>AIが書く時代、人間は「判断」で価値を出す。</p>
            </div>
            <p>進捗データはブラウザのローカルストレージに保存されます。</p>
          </div>
        </footer>
        <script
          dangerouslySetInnerHTML={{ __html: `window.__BASE_PATH__ = ${JSON.stringify(BASE_PATH)};` }}
        />
        <script src={withBase('/static/app.js')}></script>
      </body>
    </html>
  )
})
