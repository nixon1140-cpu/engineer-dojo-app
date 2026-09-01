import type { FC } from 'hono/jsx'
import { tracks } from '../data'
import { getColor } from './tracks'

export const WeaknessMapPage: FC = () => {
  // 全トラックの全レッスンのスキルユニット一覧を生成
  const allUnits = tracks.flatMap((t) =>
    t.chapters.flatMap((ch) =>
      ch.lessons.map((l) => ({
        trackId: t.id,
        trackTitle: t.title,
        trackIcon: t.icon,
        trackColor: t.color,
        chapterTitle: ch.title,
        lessonId: l.id,
        lessonTitle: l.title,
      }))
    )
  )

  return (
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-map text-rose-400 mr-2"></i>弱点マップ
      </h1>
      <p class="text-gray-400 mb-10 leading-relaxed">
        各レッスンのセルフチェック（できる／だいたいできる／できない）の結果をまとめています。
        「できない」単元を優先して復習しましょう。
      </p>

      {/* サマリーカード */}
      <div class="grid grid-cols-3 gap-4 mb-10">
        <div class="bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-5 text-center">
          <p class="text-3xl font-black text-emerald-400" id="skill-achieved-count">0</p>
          <p class="text-xs text-gray-400 mt-1">達成（できる）</p>
        </div>
        <div class="bg-amber-400/10 border border-amber-400/30 rounded-xl p-5 text-center">
          <p class="text-3xl font-black text-amber-400" id="skill-partial-count">0</p>
          <p class="text-xs text-gray-400 mt-1">部分達成（だいたいできる）</p>
        </div>
        <div class="bg-rose-400/10 border border-rose-400/30 rounded-xl p-5 text-center">
          <p class="text-3xl font-black text-rose-400" id="skill-weakness-count">0</p>
          <p class="text-xs text-gray-400 mt-1">弱点（できない・未チェック）</p>
        </div>
      </div>

      {/* フィルタ */}
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          class="skill-filter-btn bg-dojo-800 border border-amber-400 text-amber-400 text-xs px-3 py-1.5 rounded-full transition"
          data-filter="weakness"
        >
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>弱点のみ表示
        </button>
        <button
          class="skill-filter-btn bg-dojo-800 border border-dojo-700 text-gray-400 text-xs px-3 py-1.5 rounded-full transition hover:border-amber-400/50"
          data-filter="all"
        >
          <i class="fa-solid fa-list mr-1"></i>全て表示
        </button>
      </div>

      {/* トラック別弱点一覧 */}
      <div id="weakness-map-content">
        {tracks.map((t) => {
          const c = getColor(t.color)
          const lessons = t.chapters.flatMap((ch) =>
            ch.lessons.map((l) => ({
              chapterTitle: ch.title,
              lessonId: l.id,
              lessonTitle: l.title,
            }))
          )
          return (
            <section class="mb-8 weakness-track-section" data-track-id={t.id}>
              <h2 class="font-bold text-lg mb-3 flex items-center gap-2">
                <i class={`fa-solid ${t.icon} ${c.text}`}></i>
                <span>{t.title}</span>
                <span class={`text-xs font-normal px-2 py-0.5 rounded-full ${c.bg} ${c.text}`} data-track-skill-summary={t.id}>
                  確認中…
                </span>
              </h2>
              <div class="space-y-2">
                {lessons.map((l) => (
                  <div
                    class="skill-map-item bg-dojo-800 border border-dojo-700 rounded-xl p-4 flex items-center gap-4 hover:border-dojo-600 transition"
                    data-lesson-id={l.lessonId}
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-gray-500 mb-0.5">{l.chapterTitle}</p>
                      <a
                        href={`/lessons/${l.lessonId}`}
                        class="font-medium hover:text-amber-400 transition text-sm"
                      >
                        {l.lessonTitle}
                      </a>
                    </div>
                    <div class="shrink-0" data-skill-badge={l.lessonId}>
                      <span class="text-xs text-gray-500 bg-dojo-700 px-2 py-1 rounded-full">
                        未チェック
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <div class="mt-10 bg-amber-400/10 border border-amber-400/30 rounded-xl p-6 text-center">
        <p class="text-sm text-gray-200 mb-4">
          各レッスンページでセルフチェックを記録して弱点を把握しましょう。
        </p>
        <a
          href="/tracks"
          class="inline-block bg-amber-400 text-dojo-950 font-bold px-6 py-2 rounded-lg hover:bg-amber-300 transition text-sm"
        >
          <i class="fa-solid fa-book-open mr-2"></i>カリキュラムへ
        </a>
      </div>
    </div>
  )
}
