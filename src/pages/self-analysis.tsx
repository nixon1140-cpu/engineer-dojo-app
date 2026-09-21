import type { FC } from 'hono/jsx'
import { withBase } from '../base-path'

// 自己分析ワークシート — 3軸マップ（職能・業界・開発スキル）を書き出してlocalStorageに保存

export const SelfAnalysisPage: FC = () => {
  return (
    <div class="max-w-3xl mx-auto px-4 py-12">
      <div class="mb-8">
        <a href={withBase('/tracks/career-strategy')} class="text-sm text-gray-400 hover:text-amber-400 transition">
          <i class="fa-solid fa-arrow-left mr-1"></i>キャリア戦略トラックへ
        </a>
      </div>

      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-map text-cyan-400 mr-2"></i>自己分析ワークシート
      </h1>
      <p class="text-gray-400 mb-2 leading-relaxed">
        「自分はどの領域で戦うか」を3軸で書き出しましょう。書いた内容はブラウザに自動保存されます。
      </p>
      <p class="text-sm text-cyan-400 mb-10">
        <i class="fa-solid fa-info-circle mr-1"></i>
        完璧に書こうとしなくて大丈夫。まず思いつくことを書き出してみましょう。
      </p>

      {/* ===== 保存状態インジケーター ===== */}
      <div
        id="save-indicator"
        class="hidden mb-6 text-sm text-emerald-400 flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30 rounded-lg px-4 py-2"
      >
        <i class="fa-solid fa-check-circle"></i>
        <span>保存しました</span>
      </div>

      {/* ===== 軸1: 職能 ===== */}
      <section class="mb-8">
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-6">
          <div class="flex items-start gap-3 mb-4">
            <div class="bg-cyan-400/10 text-cyan-400 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <div>
              <h2 class="font-bold text-lg">軸1: 職能（過去・現在の仕事・経験）</h2>
              <p class="text-sm text-gray-400 mt-1">
                前職・アルバイト・ボランティアで担当した仕事・業務を書いてください。
                「どんな作業をしていたか」「何が得意だったか」を具体的に。
              </p>
            </div>
          </div>
          <div class="bg-dojo-900/50 rounded-lg p-3 mb-3 text-xs text-gray-500">
            <span class="text-gray-400 font-medium">記入例: </span>
            コールセンター・ヘルプデスク対応（3年）、よくある質問の回答・エスカレーション対応、
            Excelで対応件数を集計してレポート作成、新人OJT担当
          </div>
          <textarea
            id="ws-occupation"
            class="w-full bg-dojo-900 border border-dojo-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-400/60 transition"
            rows={5}
            placeholder="例: ヘルプデスク5年。問い合わせ対応・FAQ整備・月次レポート作成・新人教育を担当。Excelは得意"
          ></textarea>
        </div>
      </section>

      {/* ===== 軸2: 業界 ===== */}
      <section class="mb-8">
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-6">
          <div class="flex items-start gap-3 mb-4">
            <div class="bg-cyan-400/10 text-cyan-400 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <i class="fa-solid fa-industry"></i>
            </div>
            <div>
              <h2 class="font-bold text-lg">軸2: 業界（関わってきた・興味がある業界）</h2>
              <p class="text-sm text-gray-400 mt-1">
                経験のある業界・よく使うサービスの業界・気になるニュースの業界を書いてください。
                「詳しい」ものも「興味がある」ものも両方OK。
              </p>
            </div>
          </div>
          <div class="bg-dojo-900/50 rounded-lg p-3 mb-3 text-xs text-gray-500">
            <span class="text-gray-400 font-medium">記入例: </span>
            ITサービス・SES業界（経験あり）、医療・ヘルスケア（興味あり、家族が医療従事者）、
            フードデリバリー（よく使う）、教育（塾講師のアルバイト経験）
          </div>
          <textarea
            id="ws-industry"
            class="w-full bg-dojo-900 border border-dojo-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-400/60 transition"
            rows={5}
            placeholder="例: ITサービス・SES（職場）、EC・通販（利用者として詳しい）、医療（興味あり）"
          ></textarea>
        </div>
      </section>

      {/* ===== 軸3: 開発スキル ===== */}
      <section class="mb-8">
        <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-6">
          <div class="flex items-start gap-3 mb-4">
            <div class="bg-cyan-400/10 text-cyan-400 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <i class="fa-solid fa-code"></i>
            </div>
            <div>
              <h2 class="font-bold text-lg">軸3: 開発スキル（習得中・習得済みの技術）</h2>
              <p class="text-sm text-gray-400 mt-1">
                学習中・使える技術を書いてください。「まだ初歩レベル」でもOK。
                言語・ツール・道場で学んだことも含めて。
              </p>
            </div>
          </div>
          <div class="bg-dojo-900/50 rounded-lg p-3 mb-3 text-xs text-gray-500">
            <span class="text-gray-400 font-medium">記入例: </span>
            HTML/CSS（学習中）、JavaScript基礎（学習中）、SQL（基本的なSELECT/JOIN程度）、
            Git（基本操作）、Excel VBA（業務で使用）
          </div>
          <textarea
            id="ws-skills"
            class="w-full bg-dojo-900 border border-dojo-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-400/60 transition"
            rows={5}
            placeholder="例: HTML/CSS・JS（学習中）、SQL（SELECT/JOINまで）、Git基礎、Excel VBA（実務経験あり）"
          ></textarea>
        </div>
      </section>

      {/* ===== T型まとめ ===== */}
      <section class="mb-8">
        <div class="bg-gradient-to-br from-cyan-400/10 to-dojo-800 border border-cyan-400/30 rounded-xl p-6">
          <div class="flex items-start gap-3 mb-4">
            <div class="bg-cyan-400/20 text-cyan-400 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <i class="fa-solid fa-star"></i>
            </div>
            <div>
              <h2 class="font-bold text-lg text-cyan-300">自分のT型を一言で表すと？</h2>
              <p class="text-sm text-gray-400 mt-1">
                「〇〇（ドメイン）の課題を、△△（技術）で解決するエンジニア」という形で書いてみましょう。
                採用担当者への自己紹介の核になる一文です。
              </p>
            </div>
          </div>
          <div class="bg-dojo-900/50 rounded-lg p-3 mb-3 text-xs text-gray-500">
            <span class="text-gray-400 font-medium">記入例: </span>
            「ヘルプデスク現場の業務課題を、Webアプリ・SQL・自動化ツールで解決するエンジニア」
            「医療事務の経験を活かし、診療所向けの予約管理・請求支援ツールを開発するエンジニア」
          </div>
          <textarea
            id="ws-summary"
            class="w-full bg-dojo-900 border border-cyan-400/30 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-400/60 transition"
            rows={3}
            placeholder="〇〇の課題を△△で解決するエンジニア"
          ></textarea>
        </div>
      </section>

      {/* ===== 保存・クリアボタン ===== */}
      <div class="flex flex-col sm:flex-row gap-3 mb-12">
        <button
          id="ws-save-btn"
          class="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-floppy-disk"></i>
          保存する
        </button>
        <button
          id="ws-clear-btn"
          class="sm:w-auto bg-dojo-800 hover:bg-dojo-700 border border-dojo-700 text-gray-400 hover:text-gray-200 font-medium py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-trash"></i>
          クリア
        </button>
      </div>

      {/* ===== ヒント: 次のステップ ===== */}
      <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-6">
        <h3 class="font-bold mb-3">
          <i class="fa-solid fa-lightbulb text-amber-400 mr-2"></i>書き終えたら次のステップ
        </h3>
        <ul class="space-y-2 text-sm text-gray-400">
          <li class="flex gap-2">
            <i class="fa-solid fa-arrow-right text-amber-400 mt-1 shrink-0"></i>
            <span>
              <span class="text-gray-300 font-medium">ポートフォリオの方向性を決める</span> —
              書き出したドメイン×開発スキルで「どんなアプリを作るか」のテーマが見えてきます
            </span>
          </li>
          <li class="flex gap-2">
            <i class="fa-solid fa-arrow-right text-amber-400 mt-1 shrink-0"></i>
            <span>
              <span class="text-gray-300 font-medium">自己PRの土台にする</span> —
              「T型を一言で」欄の文を磨けば、面接の自己紹介・職務経歴書の冒頭に使えます
            </span>
          </li>
          <li class="flex gap-2">
            <i class="fa-solid fa-arrow-right text-amber-400 mt-1 shrink-0"></i>
            <span>
              <span class="text-gray-300 font-medium">定期的に見直す</span> —
              スキルが増えるたびに「開発スキル」欄を更新しましょう。成長が可視化されます
            </span>
          </li>
        </ul>
        <div class="mt-4 pt-4 border-t border-dojo-700 flex flex-wrap gap-3">
          <a
            href={withBase('/tracks/career-strategy')}
            class="text-sm text-cyan-400 hover:underline"
          >
            <i class="fa-solid fa-compass mr-1"></i>キャリア戦略トラックに戻る
          </a>
          <a
            href={withBase('/tracks/portfolio')}
            class="text-sm text-amber-400 hover:underline"
          >
            <i class="fa-solid fa-folder-open mr-1"></i>ポートフォリオ制作トラックへ
          </a>
        </div>
      </div>
    </div>
  )
}
