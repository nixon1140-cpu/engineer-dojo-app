import type { FC } from 'hono/jsx'
import type { Scenario } from '../types'
import { scenarios } from '../data'

export const ScenarioListPage: FC = () => {
  return (
    <div class="max-w-6xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-user-ninja text-amber-400 mr-2"></i>実践シナリオ
      </h1>
      <p class="text-gray-400 mb-4">
        教室では学べない「現場の判断」をロールプレイで体験します。会話の流れの中で、あなたの選択が評価されます。
      </p>
      <p class="text-sm text-gray-500 mb-10">
        <i class="fa-solid fa-circle-info mr-1"></i>
        各選択には3段階の評価（◎最善 / ○及第点 / △改善余地）があります。フィードバックは必ず読みましょう。
      </p>

      <div class="grid md:grid-cols-2 gap-5">
        {scenarios.map((s) => (
          <a
            href={`/scenarios/${s.id}`}
            class="bg-dojo-800 border border-dojo-700 rounded-xl p-6 hover:border-amber-400/60 transition group block"
            data-scenario-card={s.id}
          >
            <div class="flex items-center gap-3 text-xs mb-3">
              <span class="text-amber-400">{'★'.repeat(s.difficulty)}{'☆'.repeat(3 - s.difficulty)}</span>
              <span class="text-gray-500"><i class="fa-regular fa-clock mr-1"></i>{s.minutes}分</span>
              <span class="ml-auto" data-scenario-progress={s.id}></span>
            </div>
            <h2 class="font-bold text-lg mb-2 group-hover:text-amber-400 transition">{s.title}</h2>
            <p class="text-sm text-amber-200/80 mb-3">
              <i class="fa-solid fa-dumbbell mr-1"></i>{s.skill}
            </p>
            <p class="text-sm text-gray-400 line-clamp-3">{s.situation}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

export const ScenarioPlayPage: FC<{ scenario: Scenario }> = ({ scenario }) => {
  return (
    <div class="max-w-3xl mx-auto px-4 py-12">
      <a href="/scenarios" class="text-sm text-gray-400 hover:text-amber-400 transition">
        <i class="fa-solid fa-arrow-left mr-1"></i>シナリオ一覧へ
      </a>

      <div
        id="scenario-root"
        class="mt-6"
        data-scenario-id={scenario.id}
        data-total-steps={scenario.steps.length}
      >
        <header class="mb-8">
          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span class="text-amber-400">{'★'.repeat(scenario.difficulty)}{'☆'.repeat(3 - scenario.difficulty)}</span>
            <span><i class="fa-regular fa-clock mr-1"></i>{scenario.minutes}分</span>
            <span><i class="fa-solid fa-dumbbell mr-1"></i>{scenario.skill}</span>
          </div>
          <h1 class="text-3xl font-bold mb-4">{scenario.title}</h1>
          <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-5">
            <p class="text-sm font-bold text-amber-400 mb-1">
              <i class="fa-solid fa-book-open mr-1"></i>あらすじ
            </p>
            <p class="text-sm text-gray-300 leading-relaxed">{scenario.situation}</p>
          </div>
        </header>

        {/* 会話の流れがここに蓄積される */}
        <div id="scenario-thread" class="space-y-6"></div>

        {/* 結果表示エリア */}
        <div id="scenario-result" class="hidden mt-10"></div>

        {/* まとめ（data属性にJSONで保持） */}
        <script
          type="application/json"
          id="scenario-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(scenario).replace(/</g, '\\u003c') }}
        />
      </div>
    </div>
  )
}
