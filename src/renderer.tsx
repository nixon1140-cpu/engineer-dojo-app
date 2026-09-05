import { jsxRenderer } from 'hono/jsx-renderer'

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
        <link href="/static/styles.css" rel="stylesheet" />
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
            <a href="/" class="flex items-center gap-2 font-bold text-lg hover:text-amber-400 transition">
              <i class="fa-solid fa-torii-gate text-amber-400"></i>
              <span>一人前エンジニア道場</span>
            </a>
            <nav class="flex items-center gap-3 text-sm">
              <a href="/tracks" class="hover:text-amber-400 transition">
                <i class="fa-solid fa-book-open mr-1"></i>カリキュラム
              </a>
              <a href="/scenarios" class="hover:text-amber-400 transition">
                <i class="fa-solid fa-user-ninja mr-1"></i>実践シナリオ
              </a>
              <a href="/daily-quiz" class="hover:text-amber-400 transition">
                <i class="fa-solid fa-calendar-day mr-1"></i>デイリークイズ
              </a>
              <a href="/glossary" class="hover:text-amber-400 transition">
                <i class="fa-solid fa-book mr-1"></i>用語集
              </a>
              <a href="/self-analysis" class="hover:text-amber-400 transition">
                <i class="fa-solid fa-map mr-1"></i>自己分析
              </a>
              <a href="/dashboard" class="hover:text-amber-400 transition">
                <i class="fa-solid fa-chart-line mr-1"></i>進捗
              </a>
            </nav>
          </div>
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
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
