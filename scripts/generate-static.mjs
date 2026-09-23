// GitHub Pages向けの静的サイト生成スクリプト。
//
// src/index.tsx のHonoアプリをNode向けに一時バンドルし、app.request()で
// 全ページのHTMLを取得してディレクトリ形式（拡張子なしURL）で書き出す。
// Viteの通常ビルド（npm run dev）とは完全に独立したesbuildベースの生成処理。
import { build } from 'esbuild'
import { mkdir, writeFile, cp, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'dist-pages')
const TMP_BUNDLE = path.join(ROOT, '.static-gen-bundle.mjs')

// GitHub Pagesのプロジェクトサイトはリポジトリ名がサブディレクトリになる。
// 環境変数で上書き可能にしておく（フォーク・別リポジトリ名での再利用のため）。
const BASE_PATH = process.env.BASE_PATH ?? '/engineer-dojo-app'

const STATIC_ROUTES = [
  '/',
  '/tracks',
  '/scenarios',
  '/dashboard',
  '/glossary',
  '/daily-quiz',
  '/weakness-map',
  '/self-analysis',
]

function routeToOutputPath(route) {
  if (route === '/') return path.join(OUT_DIR, 'index.html')
  return path.join(OUT_DIR, route.replace(/^\//, ''), 'index.html')
}

async function main() {
  console.log('▶ src/index.tsx をNode向けにバンドル中...')
  await build({
    entryPoints: [path.join(ROOT, 'src/index.tsx')],
    outfile: TMP_BUNDLE,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    jsxImportSource: 'hono/jsx',
    define: { __BASE_PATH__: JSON.stringify(BASE_PATH) },
    logLevel: 'warning',
  })

  try {
    const mod = await import(pathToFileURL(TMP_BUNDLE).href + '?t=' + Date.now())
    const app = mod.default

    // /api/curriculum のレスポンスから tracks/lessons/scenarios のidを収集する
    // （findLesson等の既存ロジックと二重管理にならないよう、既存APIをそのまま使う）
    const curriculumRes = await app.request('/api/curriculum')
    if (curriculumRes.status !== 200) {
      throw new Error(`/api/curriculum が ${curriculumRes.status} を返しました`)
    }
    const curriculum = await curriculumRes.json()

    const trackRoutes = curriculum.tracks.map((t) => `/tracks/${t.id}`)
    const lessonRoutes = curriculum.tracks.flatMap((t) => t.lessons.map((id) => `/lessons/${id}`))
    const scenarioRoutes = curriculum.scenarios.map((s) => `/scenarios/${s.id}`)
    const htmlRoutes = [...STATIC_ROUTES, ...trackRoutes, ...lessonRoutes, ...scenarioRoutes]

    console.log(`▶ ${htmlRoutes.length}ページを生成中...`)
    await rm(OUT_DIR, { recursive: true, force: true })
    await mkdir(OUT_DIR, { recursive: true })

    let errorCount = 0
    for (const route of htmlRoutes) {
      const res = await app.request(route)
      if (res.status !== 200) {
        console.warn(`  ⚠ ${route} → HTTP ${res.status}`)
        errorCount++
        continue
      }
      const html = await res.text()
      const outPath = routeToOutputPath(route)
      await mkdir(path.dirname(outPath), { recursive: true })
      await writeFile(outPath, html, 'utf-8')
    }

    // /api/curriculum.json（静的JSON）
    const apiDir = path.join(OUT_DIR, 'api')
    await mkdir(apiDir, { recursive: true })
    await writeFile(path.join(apiDir, 'curriculum.json'), JSON.stringify(curriculum, null, 2), 'utf-8')

    // GitHub Pages標準の404.html（存在しないパスへのアクセス時に表示される）
    const notFoundRes = await app.request('/__not-found__')
    await writeFile(path.join(OUT_DIR, '404.html'), await notFoundRes.text(), 'utf-8')

    // public/static/ 配下の既存アセットをそのままコピー
    await cp(path.join(ROOT, 'public/static'), path.join(OUT_DIR, 'static'), { recursive: true })

    if (errorCount > 0) {
      throw new Error(`${errorCount}件のルートでHTTPエラーが発生しました`)
    }

    console.log(
      `✓ ${htmlRoutes.length}ページ + 404.html + api/curriculum.json を ${path.relative(ROOT, OUT_DIR)}/ に生成しました（BASE_PATH: "${BASE_PATH}"）`
    )
  } finally {
    await rm(TMP_BUNDLE, { force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
