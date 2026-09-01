import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { tracks, scenarios, getTrack, getScenario, findLesson } from './data'
import { HomePage } from './pages/home'
import { TrackListPage, TrackDetailPage } from './pages/tracks'
import { LessonPage } from './pages/lesson'
import { ScenarioListPage, ScenarioPlayPage } from './pages/scenarios'
import { DashboardPage } from './pages/dashboard'
import { GlossaryPage } from './pages/glossary'
import { DailyQuizPage } from './pages/daily-quiz'
import { WeaknessMapPage } from './pages/weakness-map'

const app = new Hono()

app.use(renderer)
app.use('/static/*', serveStatic({ root: './public' }))

app.get('/', (c) => c.render(<HomePage />))

// カリキュラム
app.get('/tracks', (c) => c.render(<TrackListPage />, { title: 'カリキュラム' }))

app.get('/tracks/:id', (c) => {
  const track = getTrack(c.req.param('id'))
  if (!track) return c.notFound()
  return c.render(<TrackDetailPage track={track} />, { title: track.title })
})

// レッスン
app.get('/lessons/:id', (c) => {
  const loc = findLesson(c.req.param('id'))
  if (!loc) return c.notFound()
  return c.render(<LessonPage loc={loc} />, { title: loc.lesson.title })
})

// 実践シナリオ
app.get('/scenarios', (c) => c.render(<ScenarioListPage />, { title: '実践シナリオ' }))

app.get('/scenarios/:id', (c) => {
  const scenario = getScenario(c.req.param('id'))
  if (!scenario) return c.notFound()
  return c.render(<ScenarioPlayPage scenario={scenario} />, { title: scenario.title })
})

// ダッシュボード
app.get('/dashboard', (c) => c.render(<DashboardPage />, { title: '学習の進捗' }))

// 用語集
app.get('/glossary', (c) => c.render(<GlossaryPage />, { title: '用語集' }))

// デイリークイズ
app.get('/daily-quiz', (c) => c.render(<DailyQuizPage />, { title: 'デイリークイズ' }))

// 弱点マップ
app.get('/weakness-map', (c) => c.render(<WeaknessMapPage />, { title: '弱点マップ' }))

// API（進捗データはクライアント側localStorage管理。コンテンツ参照用の軽量API）
app.get('/api/curriculum', (c) => {
  return c.json({
    tracks: tracks.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      lessons: t.chapters.flatMap((ch) => ch.lessons.map((l) => l.id)),
    })),
    scenarios: scenarios.map((s) => ({ id: s.id, title: s.title, skill: s.skill })),
  })
})

// 404
app.notFound((c) => {
  c.status(404)
  return c.render(
    <div class="max-w-2xl mx-auto px-4 py-24 text-center">
      <p class="text-6xl mb-6">⛩️</p>
      <h1 class="text-2xl font-bold mb-4">ページが見つかりません</h1>
      <p class="text-gray-400 mb-8">お探しのページは存在しないか、移動しました。</p>
      <a href="/" class="text-amber-400 hover:underline">
        <i class="fa-solid fa-arrow-left mr-1"></i>トップへ戻る
      </a>
    </div>,
    { title: '404' }
  )
})

export default app
