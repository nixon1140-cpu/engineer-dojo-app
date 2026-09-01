import type { FC } from 'hono/jsx'
import { tracks, scenarios, totalLessonCount } from '../data'
import { getColor } from './tracks'

export const DashboardPage: FC = () => {
  const lessonTotal = totalLessonCount()
  return (
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-chart-line text-amber-400 mr-2"></i>学習の進捗
      </h1>
      <p class="text-gray-400 mb-10">
        進捗はブラウザのローカルストレージに保存されます。
        <button id="progress-reset-btn" class="ml-3 text-xs text-gray-500 underline hover:text-red-400 transition">
          進捗をリセット
        </button>
      </p>

      {/* 全体サマリー */}
      <div class="grid grid-cols-3 gap-4 mb-6">
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
      <div class="grid grid-cols-3 gap-4 mb-10">
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

      {/* トラック別進捗 */}
      <h2 class="font-bold text-xl mb-4">トラック別の進捗</h2>
      <div class="space-y-3 mb-10">
        {tracks.map((t) => {
          const c = getColor(t.color)
          const count = t.chapters.reduce((s, ch) => s + ch.lessons.length, 0)
          return (
            <a href={`/tracks/${t.id}`} class="block bg-dojo-800 border border-dojo-700 rounded-xl p-4 hover:border-amber-400/40 transition">
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
          <a href={`/scenarios/${s.id}`} class="flex items-center gap-4 bg-dojo-800 border border-dojo-700 rounded-xl p-4 hover:border-amber-400/40 transition">
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
