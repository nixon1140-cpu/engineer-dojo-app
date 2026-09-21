import type { FC } from 'hono/jsx'
import { tracks, scenarios, totalLessonCount } from '../data'
import { getColor } from './tracks'
import { withBase } from '../base-path'

// バッジ定義（8個）
const BADGES = [
  {
    id: 'first-lesson',
    title: '最初の一歩',
    desc: '最初のレッスンを完了する',
    icon: 'fa-seedling',
    color: 'emerald',
  },
  {
    id: 'ten-lessons',
    title: '10レッスン達成',
    desc: '10本以上のレッスンを完了する',
    icon: 'fa-star',
    color: 'amber',
  },
  {
    id: 'twenty-lessons',
    title: '20レッスン達成',
    desc: '20本以上のレッスンを完了する',
    icon: 'fa-trophy',
    color: 'amber',
  },
  {
    id: 'all-tracks',
    title: '全トラック到達',
    desc: 'すべてのトラックで1本以上完了する',
    icon: 'fa-map',
    color: 'sky',
  },
  {
    id: 'scenario-master',
    title: 'シナリオマスター',
    desc: 'シナリオを5本以上クリアする',
    icon: 'fa-user-ninja',
    color: 'purple',
  },
  {
    id: 'scenario-ace',
    title: 'シナリオ全制覇',
    desc: '全シナリオを80%以上でクリアする',
    icon: 'fa-crown',
    color: 'amber',
  },
  {
    id: 'streak-three',
    title: '3日連続学習',
    desc: '3日以上連続してレッスンを完了する',
    icon: 'fa-fire',
    color: 'orange',
  },
  {
    id: 'skill-check',
    title: 'スキルチェック完走',
    desc: '10レッスン以上にスキルチェックを記録する',
    icon: 'fa-clipboard-check',
    color: 'teal',
  },
] as const

export const DashboardPage: FC = () => {
  const lessonTotal = totalLessonCount()
  return (
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-chart-line text-amber-400 mr-2"></i>学習の進捗
      </h1>
      <p class="text-gray-400 mb-2">
        進捗はブラウザのローカルストレージに保存されます。
        <button id="progress-reset-btn" class="ml-3 text-xs text-gray-500 underline hover:text-red-400 transition">
          進捗をリセット
        </button>
      </p>
      <div class="flex flex-wrap items-center gap-3 mb-2">
        <button
          id="progress-export-btn"
          class="text-xs bg-dojo-800 border border-dojo-700 rounded-lg px-3 py-1.5 hover:border-amber-400/60 hover:text-amber-400 transition"
        >
          <i class="fa-solid fa-download mr-1"></i>進捗をエクスポート
        </button>
        <button
          id="progress-import-btn"
          class="text-xs bg-dojo-800 border border-dojo-700 rounded-lg px-3 py-1.5 hover:border-amber-400/60 hover:text-amber-400 transition"
        >
          <i class="fa-solid fa-upload mr-1"></i>進捗をインポート
        </button>
        <input type="file" id="progress-import-input" accept="application/json" class="hidden" />
      </div>
      <p id="progress-io-message" class="text-xs mb-8 hidden"></p>

      {/* 全体サマリー */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-5 text-center">
          <p class="text-3xl font-black text-amber-400" id="stat-lessons">0</p>
          <p class="text-xs text-gray-400 mt-1">完了レッスン / {lessonTotal}</p>
        </div>
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-5 text-center">
          <p class="text-3xl font-black text-amber-400" id="stat-quiz">0</p>
          <p class="text-xs text-gray-400 mt-1">正解した演習</p>
        </div>
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-5 text-center">
          <p class="text-3xl font-black text-amber-400" id="stat-scenarios">0</p>
          <p class="text-xs text-gray-400 mt-1">クリアしたシナリオ / {scenarios.length}</p>
        </div>
      </div>

      {/* スキルチェック統計 */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-4 text-center">
          <p class="text-2xl font-black text-emerald-400" id="stat-skill-ok">0</p>
          <p class="text-xs text-gray-400 mt-1">
            <i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i>できる
          </p>
        </div>
        <div class="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 text-center">
          <p class="text-2xl font-black text-amber-400" id="stat-skill-partial">0</p>
          <p class="text-xs text-gray-400 mt-1">
            <i class="fa-solid fa-circle-half-stroke text-amber-400 mr-1"></i>だいたいできる
          </p>
        </div>
        <div class="bg-rose-400/10 border border-rose-400/30 rounded-xl p-4 text-center">
          <p class="text-2xl font-black text-rose-400" id="stat-skill-weakness">0</p>
          <p class="text-xs text-gray-400 mt-1">
            <i class="fa-solid fa-circle-xmark text-rose-400 mr-1"></i>弱点（できない）
          </p>
        </div>
      </div>

      {/* 学習時間・ストリーク */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-4 text-center">
          <p class="text-2xl font-black text-sky-400" id="stat-study-time">0<span class="text-base font-normal text-gray-400">分</span></p>
          <p class="text-xs text-gray-400 mt-1">
            <i class="fa-regular fa-clock text-sky-400 mr-1"></i>推定学習時間
          </p>
        </div>
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-4 text-center">
          <p class="text-2xl font-black text-orange-400" id="stat-streak">0<span class="text-base font-normal text-gray-400">日</span></p>
          <p class="text-xs text-gray-400 mt-1">
            <i class="fa-solid fa-fire text-orange-400 mr-1"></i>連続学習ストリーク
          </p>
        </div>
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-4 text-center">
          <p class="text-2xl font-black text-purple-400" id="stat-active-days">0<span class="text-base font-normal text-gray-400">日</span></p>
          <p class="text-xs text-gray-400 mt-1">
            <i class="fa-solid fa-calendar-check text-purple-400 mr-1"></i>学習した日数
          </p>
        </div>
      </div>

      {/* バッジ */}
      <h2 class="font-bold text-xl mb-4">
        <i class="fa-solid fa-medal text-amber-400 mr-2"></i>獲得バッジ
        <span class="text-sm font-normal text-gray-400 ml-2">（<span id="badge-count">0</span> / {BADGES.length}）</span>
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {BADGES.map((badge) => {
          const colorClass: Record<string, string> = {
            emerald: 'text-emerald-400',
            amber: 'text-amber-400',
            sky: 'text-sky-400',
            purple: 'text-purple-400',
            orange: 'text-orange-400',
            teal: 'text-teal-400',
          }
          const bgClass: Record<string, string> = {
            emerald: 'bg-emerald-400/10 border-emerald-400/30',
            amber: 'bg-amber-400/10 border-amber-400/30',
            sky: 'bg-sky-400/10 border-sky-400/30',
            purple: 'bg-purple-400/10 border-purple-400/30',
            orange: 'bg-orange-400/10 border-orange-400/30',
            teal: 'bg-teal-400/10 border-teal-400/30',
          }
          return (
            <div
              class="badge-card bg-dojo-800 border border-dojo-700 rounded-xl p-4 text-center opacity-40 transition-all duration-300"
              data-badge-id={badge.id}
            >
              <div class={`text-3xl mb-2 ${colorClass[badge.color] ?? 'text-gray-400'}`}>
                <i class={`fa-solid ${badge.icon}`}></i>
              </div>
              <p class="text-xs font-bold text-gray-300 mb-1">{badge.title}</p>
              <p class="text-xs text-gray-500 leading-tight">{badge.desc}</p>
            </div>
          )
        })}
      </div>

      {/* 活動履歴（日別サマリ） */}
      <h2 class="font-bold text-xl mb-4">
        <i class="fa-solid fa-calendar-days text-amber-400 mr-2"></i>学習活動履歴
        <span class="text-sm font-normal text-gray-400 ml-2">（直近30日）</span>
      </h2>
      <div id="activity-history" class="mb-10">
        <p class="text-gray-500 text-sm">まだ学習記録がありません。レッスンを完了すると表示されます。</p>
      </div>

      {/* トラック別進捗 */}
      <h2 class="font-bold text-xl mb-4">トラック別の進捗</h2>
      <div class="space-y-3 mb-10">
        {tracks.map((t) => {
          const c = getColor(t.color)
          const count = t.chapters.reduce((s, ch) => s + ch.lessons.length, 0)
          return (
            <a href={withBase(`/tracks/${t.id}`)} class="block bg-dojo-800 border border-dojo-700 rounded-xl p-4 hover:border-amber-400/40 transition">
              <div class="flex items-center gap-3 mb-2">
                <i class={`fa-solid ${t.icon} ${c.text}`}></i>
                <span class="font-medium">{t.title}</span>
                <span class="ml-auto text-xs text-gray-400" data-track-progress-label={t.id}>0 / {count}</span>
              </div>
              <div class="h-2 bg-dojo-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style="width: 0%"
                  data-track-progress-bar={t.id}
                ></div>
              </div>
            </a>
          )
        })}
      </div>

      {/* シナリオ成績 */}
      <h2 class="font-bold text-xl mb-4">実践シナリオの成績</h2>
      <div class="space-y-3">
        {scenarios.map((s) => (
          <a href={withBase(`/scenarios/${s.id}`)} class="flex items-center gap-4 bg-dojo-800 border border-dojo-700 rounded-xl p-4 hover:border-amber-400/40 transition">
            <div class="flex-1 min-w-0">
              <p class="font-medium">{s.title}</p>
              <p class="text-xs text-gray-500">{s.skill}</p>
            </div>
            <span class="text-sm" data-scenario-score={s.id}>
              <span class="text-gray-500 text-xs">未挑戦</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
