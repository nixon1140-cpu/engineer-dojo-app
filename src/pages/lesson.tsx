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
            {lesson.quiz.hint && (
              <details class="quiz-hint mb-4 rounded-lg border border-sky-400/30 bg-sky-400/5">
                <summary class="cursor-pointer px-4 py-2 text-sm text-sky-300 hover:text-sky-200 select-none">
                  <i class="fa-regular fa-lightbulb mr-1"></i>ヒントを見る
                </summary>
                <p class="px-4 pb-3 text-sm text-gray-300 leading-relaxed">{lesson.quiz.hint}</p>
              </details>
            )}
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
            {lesson.codeExercise.hint && (
              <details class="quiz-hint mb-4 rounded-lg border border-sky-400/30 bg-sky-400/5">
                <summary class="cursor-pointer px-4 py-2 text-sm text-sky-300 hover:text-sky-200 select-none">
                  <i class="fa-regular fa-lightbulb mr-1"></i>ヒントを見る
                </summary>
                <p class="px-4 pb-3 text-sm text-gray-300 leading-relaxed">{lesson.codeExercise.hint}</p>
              </details>
            )}
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

        {lesson.codingChallenge && (
          <section
            class="coding-challenge bg-dojo-900 border border-amber-400/30 rounded-xl p-6 mb-8"
            data-lesson-id={lesson.id}
            data-function-name={lesson.codingChallenge.functionName}
          >
            <h2 class="font-bold mb-1">
              <i class="fa-solid fa-keyboard text-amber-400 mr-2"></i>コーディング演習
              <span class="ml-2 text-xs font-normal bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
                実際に書く
              </span>
            </h2>
            <p class="text-sm text-gray-400 mb-4 leading-relaxed">{lesson.codingChallenge.prompt}</p>

            <div class="bg-dojo-800 border border-dojo-700 rounded-lg px-4 py-2 mb-3 text-xs text-gray-400 font-mono">
              {lesson.codingChallenge.signature}
            </div>

            <textarea
              class="coding-editor w-full h-64 bg-dojo-950 border border-dojo-700 rounded-lg p-4 font-mono text-sm text-gray-100 leading-relaxed focus:border-amber-400/60 focus:outline-none resize-y"
              spellcheck="false"
            >{lesson.codingChallenge.starterCode}</textarea>

            <div class="flex flex-wrap items-center gap-3 mt-3">
              <button class="coding-run-btn bg-amber-400 text-dojo-950 font-bold px-5 py-2 rounded-lg hover:bg-amber-300 transition text-sm">
                <i class="fa-solid fa-play mr-1"></i>テストを実行
              </button>
              <button class="coding-reset-btn text-sm text-gray-400 hover:text-amber-400 transition">
                <i class="fa-solid fa-rotate-left mr-1"></i>初期コードに戻す
              </button>
              <button class="coding-hints-btn text-sm text-gray-400 hover:text-amber-400 transition">
                <i class="fa-regular fa-lightbulb mr-1"></i>ヒント
              </button>
              <button class="coding-solution-btn text-sm text-gray-400 hover:text-amber-400 transition">
                <i class="fa-regular fa-eye mr-1"></i>模範解答を見る
              </button>
            </div>

            <div class="coding-hints hidden mt-4 bg-dojo-800 border border-dojo-700 rounded-lg p-4">
              <p class="text-xs font-bold text-amber-400 mb-2">
                <i class="fa-regular fa-lightbulb mr-1"></i>ヒント
              </p>
              <ul class="space-y-1 text-sm text-gray-300">
                {lesson.codingChallenge.hints.map((h, i) => (
                  <li class="flex gap-2">
                    <span class="text-gray-500 shrink-0">{i + 1}.</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div class="coding-solution hidden mt-4">
              <p class="text-xs font-bold text-amber-400 mb-2">
                <i class="fa-regular fa-eye mr-1"></i>模範解答（読んで理解したら、自力で書き直してみましょう）
              </p>
              <pre class="bg-dojo-950 border border-dojo-700 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed"><code>{lesson.codingChallenge.solution}</code></pre>
            </div>

            <div class="coding-results hidden mt-4"></div>

            <script
              type="application/json"
              class="coding-tests-data"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(lesson.codingChallenge.tests).replace(/</g, '\\u003c'),
              }}
            />
          </section>
        )}

        {lesson.sqlChallenge && (
          <section
            class="sql-challenge bg-dojo-900 border border-emerald-400/30 rounded-xl p-6 mb-8"
            data-lesson-id={lesson.id}
          >
            <h2 class="font-bold mb-1">
              <i class="fa-solid fa-database text-emerald-400 mr-2"></i>SQL演習
              <span class="ml-2 text-xs font-normal bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded">
                ブラウザ内SQLite
              </span>
            </h2>
            <p class="text-sm text-gray-400 mb-4 leading-relaxed">{lesson.sqlChallenge.prompt}</p>

            <details class="mb-4 rounded-lg border border-dojo-700 bg-dojo-800">
              <summary class="cursor-pointer px-4 py-2 text-sm text-gray-300 hover:text-emerald-300 select-none">
                <i class="fa-solid fa-table mr-1"></i>テーブル定義と初期データを見る
              </summary>
              <div class="px-4 pb-4 space-y-3">
                <pre class="bg-dojo-950 border border-dojo-700 rounded-lg p-3 text-xs overflow-x-auto leading-relaxed"><code>{lesson.sqlChallenge.schemaSql}</code></pre>
                <pre class="bg-dojo-950 border border-dojo-700 rounded-lg p-3 text-xs overflow-x-auto leading-relaxed"><code>{lesson.sqlChallenge.seedSql}</code></pre>
              </div>
            </details>

            <textarea
              class="sql-editor w-full h-40 bg-dojo-950 border border-dojo-700 rounded-lg p-4 font-mono text-sm text-gray-100 leading-relaxed focus:border-emerald-400/60 focus:outline-none resize-y"
              spellcheck="false"
              placeholder="SELECT ..."
            ></textarea>

            <div class="flex flex-wrap items-center gap-3 mt-3">
              <button class="sql-run-btn bg-emerald-400 text-dojo-950 font-bold px-5 py-2 rounded-lg hover:bg-emerald-300 transition text-sm">
                <i class="fa-solid fa-play mr-1"></i>実行して採点
              </button>
              <button class="sql-hints-btn text-sm text-gray-400 hover:text-emerald-400 transition">
                <i class="fa-regular fa-lightbulb mr-1"></i>ヒント
              </button>
              <button class="sql-solution-btn text-sm text-gray-400 hover:text-emerald-400 transition">
                <i class="fa-regular fa-eye mr-1"></i>模範解答を見る
              </button>
            </div>

            <div class="sql-hints hidden mt-4 bg-dojo-800 border border-dojo-700 rounded-lg p-4">
              <p class="text-xs font-bold text-emerald-400 mb-2">
                <i class="fa-regular fa-lightbulb mr-1"></i>ヒント
              </p>
              <ul class="space-y-1 text-sm text-gray-300">
                {lesson.sqlChallenge.hints.map((h, i) => (
                  <li class="flex gap-2">
                    <span class="text-gray-500 shrink-0">{i + 1}.</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div class="sql-solution hidden mt-4">
              <p class="text-xs font-bold text-emerald-400 mb-2">
                <i class="fa-regular fa-eye mr-1"></i>模範解答（読んで理解したら、自力で書き直してみましょう）
              </p>
              <pre class="bg-dojo-950 border border-dojo-700 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed"><code>{lesson.sqlChallenge.solutionSql}</code></pre>
            </div>

            <div class="sql-results hidden mt-4"></div>

            <script
              type="application/json"
              class="sql-challenge-data"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  schemaSql: lesson.sqlChallenge.schemaSql,
                  seedSql: lesson.sqlChallenge.seedSql,
                  solutionSql: lesson.sqlChallenge.solutionSql,
                }).replace(/</g, '\\u003c'),
              }}
            />
          </section>
        )}

        {/* スキルチェックリスト */}
        <section class="skill-check-section bg-dojo-900 border border-dojo-700 rounded-xl p-6 mb-8" data-lesson-id={lesson.id}>
          <h2 class="font-bold mb-1">
            <i class="fa-solid fa-clipboard-check text-amber-400 mr-2"></i>スキルセルフチェック
          </h2>
          <p class="text-sm text-gray-400 mb-4">このレッスンの内容をどの程度理解できましたか？</p>
          <div class="flex flex-wrap gap-3">
            <button
              class="skill-check-btn flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dojo-700 hover:border-emerald-400/60 transition text-sm font-medium"
              data-level="ok"
            >
              <i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>
              <span>できる</span>
            </button>
            <button
              class="skill-check-btn flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dojo-700 hover:border-amber-400/60 transition text-sm font-medium"
              data-level="partial"
            >
              <i class="fa-solid fa-circle-half-stroke text-amber-400 text-base"></i>
              <span>だいたいできる</span>
            </button>
            <button
              class="skill-check-btn flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dojo-700 hover:border-rose-400/60 transition text-sm font-medium"
              data-level="ng"
            >
              <i class="fa-solid fa-circle-xmark text-rose-400 text-base"></i>
              <span>できない</span>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-3 skill-check-saved hidden">
            <i class="fa-solid fa-check text-emerald-400 mr-1"></i>チェック結果を保存しました
          </p>
          <div class="mt-3">
            <a href="/weakness-map" class="text-xs text-gray-500 hover:text-amber-400 transition">
              <i class="fa-solid fa-map mr-1"></i>弱点マップで全体を確認する
            </a>
          </div>
        </section>

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
