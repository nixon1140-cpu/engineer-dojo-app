import type { FC } from 'hono/jsx'
import { dailyQuizPool } from '../data/daily-quiz-pool'

// ジャンルの日本語名とアイコン
const trackLabel: Record<string, { label: string; icon: string; color: string }> = {
  js: { label: 'JavaScript', icon: 'fa-js', color: 'text-yellow-400' },
  tech: { label: '技術', icon: 'fa-microchip', color: 'text-sky-400' },
  db: { label: 'DB / SQL', icon: 'fa-database', color: 'text-emerald-400' },
  git: { label: 'Git', icon: 'fa-code-branch', color: 'text-orange-400' },
  http: { label: 'HTTP / API', icon: 'fa-network-wired', color: 'text-sky-300' },
  testing: { label: 'テスト', icon: 'fa-flask', color: 'text-teal-400' },
  business: { label: 'ビジネス', icon: 'fa-briefcase', color: 'text-purple-400' },
  ai: { label: 'AI時代', icon: 'fa-robot', color: 'text-rose-400' },
}

export const DailyQuizPage: FC = () => {
  const totalPool = dailyQuizPool.length

  return (
    <div class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-calendar-day text-amber-400 mr-2"></i>デイリークイズ
      </h1>
      <p class="text-gray-400 mb-2 leading-relaxed">
        今日の3問に答えて知識を定着させましょう。問題は日付ごとに切り替わります。
      </p>
      <p class="text-xs text-gray-500 mb-10">
        <i class="fa-solid fa-rotate mr-1"></i>問題プール: {totalPool}問 ／ 毎日3問出題 ／ 間違えた問題は復習リストへ
      </p>

      {/* 今日の日付表示 */}
      <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400">本日の出題日</p>
          <p class="font-bold text-amber-400" id="daily-date">読み込み中…</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-400">連続学習</p>
          <p class="font-bold" id="daily-streak">0日</p>
        </div>
      </div>

      {/* クイズエリア */}
      <div id="daily-quiz-area">
        <div class="text-center py-16 text-gray-400">
          <i class="fa-solid fa-spinner fa-spin text-3xl mb-4"></i>
          <p>クイズを準備中…</p>
        </div>
      </div>

      {/* 履歴セクション */}
      <section class="mt-12">
        <h2 class="font-bold text-xl mb-4">
          <i class="fa-solid fa-chart-bar text-amber-400 mr-2"></i>学習履歴
        </h2>
        <div id="daily-history">
          <p class="text-gray-500 text-sm">履歴なし</p>
        </div>
      </section>

      {/* 復習リスト */}
      <section class="mt-10">
        <h2 class="font-bold text-xl mb-2">
          <i class="fa-solid fa-brain text-rose-400 mr-2"></i>忘却曲線復習リスト
        </h2>
        <p class="text-sm text-gray-500 mb-4">間違えた問題を 1日後・3日後・7日後・30日後 に復習します。</p>
        <div id="daily-review-list">
          <p class="text-gray-500 text-sm">復習待ちの問題なし</p>
        </div>
      </section>

      {/* 問題データをSSRで渡す */}
      <script
        type="application/json"
        id="daily-quiz-pool-data"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dailyQuizPool).replace(/</g, '\\u003c'),
        }}
      />
    </div>
  )
}
