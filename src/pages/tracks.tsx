import type { FC } from 'hono/jsx'
import type { Track } from '../types'
import { tracks } from '../data'
import { withBase } from '../base-path'

const categoryLabel = {
  tech: { label: '技術トラック', icon: 'fa-code' },
  business: { label: 'ビジネストラック', icon: 'fa-briefcase' },
  ai: { label: 'AI時代トラック', icon: 'fa-robot' },
} as const

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  sky: { text: 'text-sky-400', bg: 'bg-sky-400/10', border: 'hover:border-sky-400/60' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'hover:border-emerald-400/60' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'hover:border-orange-400/60' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-400/60' },
  pink: { text: 'text-pink-400', bg: 'bg-pink-400/10', border: 'hover:border-pink-400/60' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'hover:border-amber-400/60' },
  teal: { text: 'text-teal-400', bg: 'bg-teal-400/10', border: 'hover:border-teal-400/60' },
  violet: { text: 'text-violet-400', bg: 'bg-violet-400/10', border: 'hover:border-violet-400/60' },
  rose: { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'hover:border-rose-400/60' },
  indigo: { text: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'hover:border-indigo-400/60' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'hover:border-cyan-400/60' },
  lime: { text: 'text-lime-400', bg: 'bg-lime-400/10', border: 'hover:border-lime-400/60' },
  fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'hover:border-fuchsia-400/60' },
  red: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'hover:border-red-400/60' },
}

export function getColor(color: string) {
  return colorMap[color] ?? colorMap.amber
}

export const TrackListPage: FC = () => {
  return (
    <div class="max-w-6xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-book-open text-amber-400 mr-2"></i>カリキュラム
      </h1>
      <p class="text-gray-400 mb-10">
        {tracks.length}つのトラックを体系的に。未経験の方は「プログラミング基礎（入門）」から始めるのがおすすめです。
      </p>

      {(['tech', 'business', 'ai'] as const).map((cat) => (
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <i class={`fa-solid ${categoryLabel[cat].icon} text-amber-400`}></i>
            {categoryLabel[cat].label}
          </h2>
          <div class="grid md:grid-cols-2 gap-4">
            {tracks
              .filter((t) => t.category === cat)
              .map((t) => (
                <TrackCard track={t} />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const TrackCard: FC<{ track: Track }> = ({ track }) => {
  const c = getColor(track.color)
  const lessonCount = track.chapters.reduce((s, ch) => s + ch.lessons.length, 0)
  const minutes = track.chapters.reduce(
    (s, ch) => s + ch.lessons.reduce((m, l) => m + l.minutes, 0),
    0
  )
  return (
    <a
      href={withBase(`/tracks/${track.id}`)}
      class={`block bg-dojo-800 border border-dojo-700 rounded-xl p-6 transition ${c.border}`}
      data-track-card={track.id}
    >
      <div class="flex items-start gap-4">
        <div class={`${c.bg} ${c.text} w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0`}>
          <i class={`fa-solid ${track.icon}`}></i>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-lg">{track.title}</h3>
          <p class={`text-xs ${c.text} mb-2`}>{track.tagline}</p>
          <p class="text-sm text-gray-400 line-clamp-2">{track.description}</p>
          <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span><i class="fa-regular fa-file-lines mr-1"></i>{lessonCount}レッスン</span>
            <span><i class="fa-regular fa-clock mr-1"></i>約{minutes}分</span>
            <span class="ml-auto" data-track-progress={track.id}></span>
          </div>
        </div>
      </div>
    </a>
  )
}

export const TrackDetailPage: FC<{ track: Track }> = ({ track }) => {
  const c = getColor(track.color)
  return (
    <div class="max-w-4xl mx-auto px-4 py-12">
      <a href={withBase('/tracks')} class="text-sm text-gray-400 hover:text-amber-400 transition">
        <i class="fa-solid fa-arrow-left mr-1"></i>カリキュラム一覧へ
      </a>

      <div class="mt-6 mb-10">
        <div class={`inline-flex ${c.bg} ${c.text} w-16 h-16 rounded-xl items-center justify-center text-3xl mb-4`}>
          <i class={`fa-solid ${track.icon}`}></i>
        </div>
        <h1 class="text-3xl font-bold mb-2">{track.title}</h1>
        <p class={`${c.text} mb-4`}>{track.tagline}</p>
        <p class="text-gray-400 leading-relaxed">{track.description}</p>
      </div>

      <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-6 mb-10">
        <h2 class="font-bold mb-3">
          <i class="fa-solid fa-bullseye text-amber-400 mr-2"></i>このトラックで身につくこと
        </h2>
        <ul class="grid md:grid-cols-2 gap-2 text-sm text-gray-300">
          {track.outcomes.map((o) => (
            <li class="flex gap-2">
              <i class="fa-solid fa-check text-amber-400 mt-1 shrink-0"></i>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      <div class="space-y-8">
        {track.chapters.map((ch) => (
          <section class="bg-dojo-900 border border-dojo-700 rounded-xl overflow-hidden">
            <div class="px-6 py-4 border-b border-dojo-700">
              <h2 class="font-bold">{ch.title}</h2>
              <p class="text-sm text-gray-400">{ch.description}</p>
            </div>
            <ul class="divide-y divide-dojo-700">
              {ch.lessons.map((l) => (
                <li>
                  <a
                    href={withBase(`/lessons/${l.id}`)}
                    class="flex items-center gap-4 px-6 py-4 hover:bg-dojo-800 transition group"
                  >
                    <span
                      class="lesson-check w-6 h-6 rounded-full border-2 border-dojo-700 flex items-center justify-center text-xs shrink-0"
                      data-lesson-id={l.id}
                    >
                      <i class="fa-solid fa-check hidden"></i>
                    </span>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium group-hover:text-amber-400 transition">{l.title}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        <i class="fa-regular fa-clock mr-1"></i>{l.minutes}分
                        {l.quiz && (
                          <span class="ml-3"><i class="fa-solid fa-circle-question mr-1"></i>確認クイズ</span>
                        )}
                        {l.codeExercise && (
                          <span class="ml-3"><i class="fa-solid fa-code mr-1"></i>コード演習</span>
                        )}
                      </p>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-600 group-hover:text-amber-400 transition"></i>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
