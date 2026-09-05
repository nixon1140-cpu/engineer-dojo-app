import type { FC } from 'hono/jsx'
import { tracks, scenarios, totalLessonCount } from '../data'

const categoryLabel = {
  tech: { label: '技術トラック', icon: 'fa-code', desc: 'フロント・バック・インフラ・DB設計' },
  business: { label: 'ビジネストラック', icon: 'fa-briefcase', desc: 'マーケ・経営・営業の視点' },
  ai: { label: 'AI時代トラック', icon: 'fa-robot', desc: 'コード検証・言語化・設計判断' },
} as const

export const HomePage: FC = () => {
  const lessonTotal = totalLessonCount()
  const quizTotal = tracks.reduce(
    (sum, t) =>
      sum +
      t.chapters.reduce(
        (s, ch) => s + ch.lessons.filter((l) => l.quiz || l.codeExercise).length,
        0
      ),
    0
  )

  return (
    <div>
      {/* ヒーロー */}
      <section id="hero-section" class="bg-gradient-to-b from-dojo-800 to-dojo-950 border-b border-dojo-700">
        <div class="max-w-6xl mx-auto px-4 py-20 text-center">
          <p class="text-amber-400 font-bold mb-4 tracking-widest text-sm">
            <i class="fa-solid fa-torii-gate mr-2"></i>
            AI時代のエンジニア育成プラットフォーム
          </p>
          <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight">
            AIが書く時代、
            <br class="md:hidden" />
            人間は<span class="text-amber-400">「判断」</span>で価値を出す。
          </h1>
          <p class="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            コードを書く速さではAIに敵わない。だからこそ「何を作るかの言語化」「設計の妥当性判断」
            「AIが書いたコードの検証」「本番を安全に変える技術」を、一人称で体験しながら学ぶ。
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a
              href="/tracks"
              class="bg-amber-400 text-dojo-950 font-bold px-8 py-3 rounded-lg hover:bg-amber-300 transition"
            >
              <i class="fa-solid fa-book-open mr-2"></i>カリキュラムを始める
            </a>
            <a
              href="/scenarios"
              class="border border-dojo-700 px-8 py-3 rounded-lg hover:border-amber-400 hover:text-amber-400 transition"
            >
              <i class="fa-solid fa-user-ninja mr-2"></i>実践シナリオに挑む
            </a>
          </div>
          <div class="flex justify-center gap-8 mt-12 text-sm text-gray-400">
            <span><strong class="text-2xl text-white block">{tracks.length}</strong>トラック</span>
            <span><strong class="text-2xl text-white block">{lessonTotal}</strong>レッスン</span>
            <span><strong class="text-2xl text-white block">{quizTotal}</strong>演習問題</span>
            <span><strong class="text-2xl text-white block">{scenarios.length}</strong>実践シナリオ</span>
          </div>
        </div>
      </section>

      {/* 学習の3本柱 */}
      <section id="pillars-section" class="max-w-6xl mx-auto px-4 py-16">
        <h2 class="text-2xl font-bold mb-2 text-center">学習の3本柱</h2>
        <p class="text-gray-400 text-center mb-10">技術だけでは一人前になれない。ビジネスだけでも届かない。</p>
        <div class="grid md:grid-cols-3 gap-6">
          {(['tech', 'business', 'ai'] as const).map((cat) => (
            <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-6">
              <div class="text-amber-400 text-3xl mb-4">
                <i class={`fa-solid ${categoryLabel[cat].icon}`}></i>
              </div>
              <h3 class="font-bold text-lg mb-2">{categoryLabel[cat].label}</h3>
              <p class="text-gray-400 text-sm mb-4">{categoryLabel[cat].desc}</p>
              <ul class="space-y-2 text-sm">
                {tracks
                  .filter((t) => t.category === cat)
                  .map((t) => (
                    <li>
                      <a href={`/tracks/${t.id}`} class="text-gray-300 hover:text-amber-400 transition">
                        <i class={`fa-solid ${t.icon} mr-2 text-gray-500`}></i>
                        {t.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 実践シナリオ紹介 */}
      <section id="scenarios-section" class="bg-dojo-900 border-y border-dojo-700">
        <div class="max-w-6xl mx-auto px-4 py-16">
          <h2 class="text-2xl font-bold mb-2 text-center">
            <i class="fa-solid fa-user-ninja text-amber-400 mr-2"></i>実践シナリオ（ロールプレイ）
          </h2>
          <p class="text-gray-400 text-center mb-10">
            「教室では学べない」現場の判断を、一人称のストーリーで体験する。
          </p>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map((s) => (
              <a
                href={`/scenarios/${s.id}`}
                class="bg-dojo-800 border border-dojo-700 rounded-xl p-5 hover:border-amber-400/60 transition group"
              >
                <div class="text-xs text-amber-400 mb-2">
                  {'★'.repeat(s.difficulty)}{'☆'.repeat(3 - s.difficulty)}
                  <span class="text-gray-500 ml-2">{s.minutes}分</span>
                </div>
                <h3 class="font-bold mb-2 group-hover:text-amber-400 transition">{s.title}</h3>
                <p class="text-xs text-gray-400">{s.skill}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 学習ロードマップ */}
      <section id="roadmap-section" class="max-w-6xl mx-auto px-4 py-16">
        <h2 class="text-2xl font-bold mb-2 text-center">
          <i class="fa-solid fa-map text-amber-400 mr-2"></i>学習ロードマップ
        </h2>
        <p class="text-gray-400 text-center mb-4 max-w-2xl mx-auto leading-relaxed">
          この道場は「入口」と「土台」です。ここで基礎と判断力を身につけたら、
          次は<strong class="text-gray-200">自分の手で実際に作る</strong>ステージへ進みましょう。
        </p>
        {/* フェーズバッジ */}
        <div class="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { phase: 'フェーズ1', label: '入門・技術・ビジネス基礎', color: 'emerald' },
            { phase: 'フェーズ2', label: 'AI活用・DX・高度演習', color: 'violet' },
            { phase: 'フェーズ3', label: 'ポートフォリオ・面接対策', color: 'amber' },
          ].map((p) => (
            <span class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-${p.color}-400/10 text-${p.color}-300 border border-${p.color}-400/30`}>
              <i class="fa-solid fa-check-circle"></i>{p.phase}: {p.label} ✅ 実装済み
            </span>
          ))}
        </div>
        <div class="grid md:grid-cols-4 gap-4">
          {[
            {
              step: 'STEP 1',
              title: '入門で基礎体力',
              icon: 'fa-seedling',
              place: 'この道場',
              badge: '✅ フェーズ1',
              desc: '「プログラミング基礎（入門）」で変数・分岐・関数をブラウザ内演習で習得。Gitトラック・HTTPトラック・テスト/実務演習・デイリークイズ・スキルチェックも完備。',
            },
            {
              step: 'STEP 2',
              title: '技術・視点の土台',
              icon: 'fa-layer-group',
              place: 'この道場',
              badge: '✅ フェーズ2',
              desc: 'AI活用開発演習・DX改善シナリオで現代エンジニアの実践力を強化。ビジネス視点・AI時代の判断力を学び、14本のロールプレイシナリオで現場判断を疑似体験。',
            },
            {
              step: 'STEP 3',
              title: 'ポートフォリオ設計',
              icon: 'fa-folder-open',
              place: 'この道場',
              badge: '✅ フェーズ3',
              desc: 'ポートフォリオ制作演習（4レッスン）と面接ロールプレイ3本で「作れる・説明できる」エンジニアへ。DB設計・API設計・README作成・面接ストーリーを完全設計。',
            },
            {
              step: 'STEP 4',
              title: '実践で磨く',
              icon: 'fa-briefcase',
              place: '道場の外',
              badge: null,
              desc: '設計図を手に自分のPCで実際にポートフォリオを実装・デプロイ。インターン・個人開発・コミュニティで本物のコードレビューとチーム開発を経験する。',
            },
          ].map((s, i) => (
            <div class="relative">
              <div
                class={`bg-dojo-800 border rounded-xl p-5 h-full ${
                  s.place === 'この道場' ? 'border-amber-400/40' : 'border-dojo-700'
                }`}
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-bold text-amber-400 tracking-wider">{s.step}</span>
                  <span
                    class={`text-xs px-2 py-0.5 rounded ${
                      s.place === 'この道場'
                        ? 'bg-amber-400/15 text-amber-300'
                        : 'bg-dojo-700 text-gray-400'
                    }`}
                  >
                    {s.place}
                  </span>
                </div>
                <div class="text-2xl text-amber-400 mb-3">
                  <i class={`fa-solid ${s.icon}`}></i>
                </div>
                <h3 class="font-bold mb-2">{s.title}</h3>
                {s.badge && (
                  <p class="text-xs text-emerald-400 mb-2 font-bold">{s.badge}</p>
                )}
                <p class="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
              {i < 3 && (
                <div class="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-amber-400">
                  <i class="fa-solid fa-chevron-right"></i>
                </div>
              )}
            </div>
          ))}
        </div>
        <p class="text-xs text-gray-500 text-center mt-8 leading-relaxed">
          ※ この道場の全3フェーズのコンテンツは約16時間分。一人前の土台と設計力を効率よく習得できます。
          STEP 4以降は道場の設計図をもとに、実際に手を動かして完成させてください。
        </p>
        <div class="flex flex-wrap justify-center gap-4 mt-6">
          <a
            href="/tracks/beginner"
            class="inline-block bg-amber-400 text-dojo-950 font-bold px-8 py-3 rounded-lg hover:bg-amber-300 transition text-sm"
          >
            <i class="fa-solid fa-seedling mr-2"></i>STEP 1: 入門トラックから始める
          </a>
          <a
            href="/tracks/portfolio"
            class="inline-block border border-indigo-400/60 text-indigo-300 font-bold px-8 py-3 rounded-lg hover:bg-indigo-400/10 transition text-sm"
          >
            <i class="fa-solid fa-folder-open mr-2"></i>STEP 3: ポートフォリオ設計へ
          </a>
        </div>
      </section>

      {/* こんな人に */}
      <section id="audience-section" class="max-w-6xl mx-auto px-4 py-16">
        <div class="bg-dojo-800 border border-dojo-700 rounded-2xl p-8 md:p-12">
          <h2 class="text-2xl font-bold mb-6">こんな人のための道場</h2>
          <div class="grid md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div class="flex gap-3">
              <i class="fa-solid fa-check text-amber-400 mt-1"></i>
              <p>AIにコードは書かせられるが、<strong>それが正しいか判断できない</strong>未経験・ジュニアエンジニア</p>
            </div>
            <div class="flex gap-3">
              <i class="fa-solid fa-check text-amber-400 mt-1"></i>
              <p>技術だけでなく、<strong>マーケ・経営・営業の視点</strong>で仕事の意味を理解したい人</p>
            </div>
            <div class="flex gap-3">
              <i class="fa-solid fa-check text-amber-400 mt-1"></i>
              <p>コードレビューや本番運用など、<strong>現場でしか学べない経験</strong>を入社前に疑似体験したい人</p>
            </div>
            <div class="flex gap-3">
              <i class="fa-solid fa-check text-amber-400 mt-1"></i>
              <p>「要件の言語化」「設計の妥当性判断」など、<strong>AIに代替されにくいスキル</strong>を磨きたい人</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
