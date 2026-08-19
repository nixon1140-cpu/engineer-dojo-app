import type { FC } from 'hono/jsx'
import type { LessonLocation } from '../data'
import { getColor } from './tracks'

// 簡易マークダウン変換: **太字**, `コード`
// XSS防止のため、まずHTML特殊文字をエスケープしてから装飾タグを適用する
export function md(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-dojo-700 px-1.5 py-0.5 rounded text-amber-200 text-sm">$1</code>')
}

export const LessonPage: FC<{ loc: LessonLocation }> = ({ loc }) => {
  const { track, chapterTitle, lesson, prev, next } = loc
  const c = getColor(track.color)
  return (
    <div class="max-w-3xl mx-auto px-4 py-12">
      <nav class="text-sm text-gray-400 mb-6 flex flex-wrap gap-1">
        <a href="/tracks" class="hover:text-amber-400 transition">カリキュラム</a>
        <span class="mx-1">/</span>
        <a href={`/tracks/${track.id}`} class="hover:text-amber-400 transition">{track.title}</a>
        <span class="mx-1">/</span>
        <span class="text-gray-500">{chapterTitle}</span>
      </nav>

      <article class="lesson-article" data-lesson-id={lesson.id} data-track-id={track.id}>
        <header class="mb-8">
          <p class={`text-sm ${c.text} mb-2`}>
            <i class={`fa-solid ${track.icon} mr-1`}></i>
            {track.title} / 約{lesson.minutes}分
          </p>
          <h1 class="text-3xl font-bold leading-tight">{lesson.title}</h1>
        </header>

        <div class="bg-amber-400/10 border border-amber-400/30 rounded-xl p-5 mb-8">
          <p class="text-sm font-bold text-amber-400 mb-1">
            <i class="fa-solid fa-lightbulb mr-1"></i>なぜこれを学ぶか
          </p>
          <p class="text-gray-200 text-sm leading-relaxed">{lesson.intro}</p>
        </div>

        <div class="space-y-5 mb-10">
          {lesson.content.map((p) => (
            <p class="text-gray-200 leading-loose" dangerouslySetInnerHTML={{ __html: md(p) }} />
          ))}
        </div>

        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-6 mb-10">
          <h2 class="font-bold mb-3">
            <i class="fa-solid fa-key text-amber-400 mr-2"></i>重要ポイント
          </h2>
          <ul class="space-y-2 text-sm">
            {lesson.points.map((pt) => (
              <li class="flex gap-2 text-gray-300">
                <i class="fa-solid fa-check text-amber-400 mt-1 shrink-0"></i>
                <span dangerouslySetInnerHTML={{ __html: md(pt) }} />
              </li>
            ))}
          </ul>
        </div>

        {lesson.quiz && (
          <section class="quiz-block bg-dojo-900 border border-dojo-700 rounded-xl p-6 mb-8">
            <h2 class="font-bold mb-1">
              <i class="fa-solid fa-circle-question text-amber-400 mr-2"></i>理解度チェック
            </h2>
            <p class="text-sm text-gray-400 mb-4">選ぶと即座に解説が表示されます。</p>
            <p class="font-medium mb-4">{lesson.quiz.question}</p>
            <div class="space-y-2">
              {lesson.quiz.options.map((opt, i) => (
                <button
                  class="quiz-option w-full text-left px-4 py-3 rounded-lg border border-dojo-700 hover:border-amber-400/60 transition text-sm"
                  data-correct={opt.correct ? '1' : '0'}
                  data-why={opt.why}
                >
                  <span class="text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt.text}
                </button>
              ))}
            </div>
            <div class="quiz-feedback hidden mt-4 p-4 rounded-lg text-sm leading-relaxed"></div>
          </section>
        )}

        {lesson.codeExercise && (
          <section class="quiz-block bg-dojo-900 border border-dojo-700 rounded-xl p-6 mb-8">
            <h2 class="font-bold mb-1">
              <i class="fa-solid fa-code text-amber-400 mr-2"></i>コードレビュー演習
            </h2>
            <p class="text-sm text-gray-400 mb-4">{lesson.codeExercise.prompt}</p>
            <pre class="bg-dojo-950 border border-dojo-700 rounded-lg p-4 text-xs overflow-x-auto mb-4 leading-relaxed"><code>{lesson.codeExercise.code}</code></pre>
            <p class="font-medium mb-4">{lesson.codeExercise.question}</p>
            <div class="space-y-2">
              {lesson.codeExercise.options.map((opt, i) => (
                <button
                  class="quiz-option w-full text-left px-4 py-3 rounded-lg border border-dojo-700 hover:border-amber-400/60 transition text-sm"
                  data-correct={opt.correct ? '1' : '0'}
                  data-why={opt.why}
                >
                  <span class="text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt.text}
                </button>
              ))}
            </div>
            <div class="quiz-feedback hidden mt-4 p-4 rounded-lg text-sm leading-relaxed"></div>
          </section>
        )}

        <div class="flex items-center justify-between border-t border-dojo-700 pt-6">
          <button
            id="lesson-complete-btn"
            class="bg-amber-400 text-dojo-950 font-bold px-6 py-3 rounded-lg hover:bg-amber-300 transition"
          >
            <i class="fa-solid fa-check mr-2"></i>完了にする
          </button>
          <div class="flex gap-3 text-sm">
            {prev && (
              <a href={`/lessons/${prev.lessonId}`} class="text-gray-400 hover:text-amber-400 transition">
                <i class="fa-solid fa-arrow-left mr-1"></i>前のレッスン
              </a>
            )}
            {next && (
              <a href={`/lessons/${next.lessonId}`} class="text-gray-400 hover:text-amber-400 transition">
                次のレッスン<i class="fa-solid fa-arrow-right ml-1"></i>
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
