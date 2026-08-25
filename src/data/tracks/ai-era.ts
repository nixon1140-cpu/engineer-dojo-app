import type { Track } from '../../types'

// AI時代のエンジニアリング・トラック
export const aiTracks: Track[] = [
  {
    id: 'ai-engineering',
    title: 'AI時代のエンジニアリング',
    category: 'ai',
    icon: 'fa-robot',
    color: 'violet',
    tagline: 'AIが書く時代、人間は「判断」で価値を出す',
    description:
      'コードを書く速さはAIに敵わない。しかし「何を作るか」「この設計は妥当か」「このコードは信頼できるか」の判断は人間の仕事。AI時代に一人前と呼ばれるための中核スキル。',
    outcomes: [
      'AIが書いたコードの妥当性を検証できる',
      '曖昧な要件を実装可能な仕様に言語化できる',
      '設計のトレードオフを複数提示して判断できる',
      'AIを「部下」として指示・レビューできる',
    ],
    chapters: [
      {
        id: 'ai-verify',
        title: '第1章: AI生成コードの検証',
        description: 'AIの出力は「ほぼ正しい」。その「ほぼ」を見抜く技術。',
        lessons: [
          {
            id: 'ai-1-1',
            title: 'AIのコードを信用しない、検証する',
            minutes: 25,
            intro:
              'AIは自信満々に間違えます。「動くコード」と「正しいコード」の違いを見抜く力が、AI時代のエンジニアの基礎体力です。',
            content: [
              'AI生成コードの典型的な問題: **存在しないAPIの幻覚**、**非推奨の古い書き方**、**エッジケースの無視**、**セキュリティパターンの欠落**、**テストされていない「それらしい」ロジック**。',
              '検証の手順: ①**仕様との照合**（頼んだことを全部やっているか）→ ②**境界条件の確認**（0件・null・巨大データ）→ ③**公式ドキュメントとの照合**（APIは実在するか）→ ④**実際に動かす**。',
              '「動いたからOK」は最も危険な思考です。happy pathで動いても、エラー時にデータが壊れるコードは害悪です。**異常系のテストケースを自分で書く** 習慣が検証力を鍛えます。',
              'AIへの指示出しも技術です。曖昧な依頼（「ログイン作って」）は曖昧な結果を生みます。**コンテキスト（技術スタック・既存規約）＋要件＋制約＋受け入れ条件** を構造化して渡しましょう。',
            ],
            points: [
              'AIは「ほぼ正しい」コードを自信満々に出す',
              '検証4ステップ: 仕様照合→境界条件→ドキュメント照合→実行',
              '指示は構造化する（コンテキスト＋要件＋制約＋受入条件）',
            ],
            quiz: {
              question: 'AIに「パスワードリセット機能」を実装させた。レビューで最優先で確認すべきことは？',
              hint: 'AIは「動くhappy path」を優先しがちです。パスワードリセットが攻撃者に悪用されるとしたら、どこを突かれるでしょう？ セキュリティの観点で考えてみましょう。',
              options: [
                { text: 'コードスタイルがプロジェクトの規約に合っているか', correct: false, why: 'スタイルはLinterで機械的に直せます。セキュリティほど優先度は高くありません。' },
                { text: 'リセットトークンの有効期限・使い回し防止・推測困難性', correct: true, why: '正解！パスワードリセットは攻撃者の主要ターゲットです。トークンが推測可能・期限なし・再利用可能だとアカウント乗っ取りに直結します。AIはhappy pathを優先するため、セキュリティ要件は人間が確認する最重要項目です。' },
                { text: 'コメントが十分に書かれているか', correct: false, why: 'コメントは可読性の問題であり、機能の正しさの検証ではありません。' },
                { text: '変数名が分かりやすいか', correct: false, why: '命名は重要ですが、最優先の検証事項ではありません。' },
              ],
            },
            codingChallenge: {
              prompt:
                'AIに書かせたコードを検証する練習です。ユーザー入力が「危険な文字」を含むかチェックする関数を書いてください。< > & " \' のいずれかを含めば true、含まなければ false を返します（XSS対策の第一歩です）。',
              functionName: 'containsDangerousChars',
              signature: 'function containsDangerousChars(input)',
              starterCode: `function containsDangerousChars(input) {
  // input が < > & " ' のいずれかを含むか判定
  // ヒント: 配列にまとめて some() を使うと簡潔

}`,
              tests: [
                { description: "'<script>' → true", script: "fn('<script>')", expected: 'true' },
                { description: "'こんにちは' → false", script: "fn('こんにちは')", expected: 'false' },
                { description: "O'Neill → true", script: "fn(\"O'Neill\")", expected: 'true' },
                { description: "'a & b' → true", script: "fn('a & b')", expected: 'true' },
                { description: "'user@example.com' → false", script: "fn('user@example.com')", expected: 'false' },
              ],
              hints: [
                "const dangerous = ['<', '>', '&', '\"', \"'\"] と定義して、dangerous.some(ch => input.includes(ch)) を返す",
                'some() は「一つでも条件を満たせば true」を返す配列メソッドです',
              ],
              solution: `function containsDangerousChars(input) {
  const dangerous = ['<', '>', '&', '"', "'"]
  return dangerous.some(ch => input.includes(ch))
}`,
            },
          },
          {
            id: 'ai-1-2',
            title: '要件の言語化: 「なんとなく」を仕様にする',
            minutes: 25,
            intro:
              '「使いやすい検索画面を作って」という曖昧な要件。AIに投げても人に投げても、曖昧な結果しか返ってきません。言語化は最もAIに代替されにくいスキルです。',
            content: [
              '言語化の型: ①**誰が**（ユーザー種別）②**何のために**（目的・課題）③**何を**（操作・入力・出力）④**どうなれば成功**（受け入れ条件）の4点を文章にします。',
              '曖昧さを炙り出す質問集: 「対象ユーザーは全員？」「データが0件の時は？」「権限がない人は？」「スマホでは？」「同時に2人が操作したら？」— これらは **仕様の穴を探す質問** です。',
              '**受け入れ条件（Acceptance Criteria）** を Given/When/Then で書くと実装とテストがぶれません: 「Given 未ログインのユーザーが /mypage にアクセスした / When ページが表示される前に / Then ログイン画面にリダイレクトされる」。',
              '言語化した仕様は **AIへのプロンプトそのもの** になります。言語化能力 = AIを使いこなす能力、と言っても過言ではありません。',
            ],
            points: [
              '言語化の4点: 誰が・何のために・何を・成功条件',
              '仕様の穴を探す質問リストを持つ',
              '受け入れ条件はGiven/When/Thenで書く',
            ],
            quiz: {
              question: '「商品検索機能を作って」という要件。実装前に確認すべき仕様の穴として適切でないものは？',
              hint: '「適切でないもの」を選ぶ問題です。3つは「ユーザー体験やビジネスルールに関わる仕様の曖昧さ」、1つは「開発環境の技術情報」です。',
              options: [
                { text: '検索結果が0件の時の表示', correct: false, why: '重要な確認事項です。0件時のUX設計は必須です。' },
                { text: '大文字小文字・全角半角の扱い', correct: false, why: '日本語検索では必須の確認事項です。' },
                { text: '使用するプログラミング言語のバージョン', correct: false, why: '正解！これは「技術的な環境情報」であり、要件の言語化で確認する「仕様の穴」ではありません。環境情報は既に決まっていることが多く、要件の曖昧さとは別の話です。' },
                { text: '在庫切れ商品を検索結果に含めるか', correct: false, why: 'ビジネス要件に関わる重要な確認事項です。' },
              ],
            },
            codingChallenge: {
              prompt:
                '要件の言語化をコードで体験します。検索結果の表示件数に関する受け入れ条件を関数として実装してください。条件: 結果が0件なら "該当なし"、上限(第2引数)を超えるなら "1-{上限}件 / 全{総数}件"、それ以外なら "全{総数}件" を返します。',
              functionName: 'formatResultCount',
              signature: 'function formatResultCount(total, limit)',
              starterCode: `function formatResultCount(total, limit) {
  // 0件 → "該当なし"
  // total > limit → "1-{limit}件 / 全{total}件"
  // それ以外 → "全{total}件"

}`,
              tests: [
                { description: '0件 → "該当なし"', script: 'fn(0, 20)', expected: '"該当なし"' },
                { description: '15件(上限20) → "全15件"', script: 'fn(15, 20)', expected: '"全15件"' },
                { description: 'ちょうど上限 → "全20件"', script: 'fn(20, 20)', expected: '"全20件"' },
                { description: '95件(上限20) → "1-20件 / 全95件"', script: 'fn(95, 20)', expected: '"1-20件 / 全95件"' },
              ],
              hints: [
                'if (total === 0) → if (total > limit) → それ以外、の順に early return すると読みやすい',
                '文字列の埋め込みは `1-${limit}件 / 全${total}件` のようなテンプレートリテラルで',
              ],
              solution: `function formatResultCount(total, limit) {
  if (total === 0) return '該当なし'
  if (total > limit) return \`1-\${limit}件 / 全\${total}件\`
  return \`全\${total}件\`
}`,
            },
          },
        ],
      },
      {
        id: 'ai-design',
        title: '第2章: 設計判断とトレードオフ',
        description: '「正解」は一つではない。文脈に応じた最適解を選ぶ力。',
        lessons: [
          {
            id: 'ai-2-1',
            title: '設計の妥当性を判断するフレームワーク',
            minutes: 25,
            intro:
              'AIは「もっともらしい設計」をいくらでも生成します。しかし「このプロダクトの、このフェーズで、妥当か」の判断にはコンテキストが必要です。',
            content: [
              '設計判断の軸: **変化の速さ**（この部分は将来どれくらい変わるか）、**失敗のコスト**（壊れたら何が失われるか）、**チームのスキル**（その技術を維持できるか）。',
              '例: マイクロサービスは大規模組織には有効ですが、3人のスタートアップには過剰設計です。「Netflixがやっているから」は判断根拠になりません。**規模と課題が違う** からです。',
              '**トレードオフの言語化** が判断の核心です: 「案Aは実装が速いが拡張に弱い。案Bは拡張に強いが初期コストが高い。我々は3ヶ月で市場検証したいので案Aを選び、拡張が必要になったらBに移行する」',
              '判断を記録する文化: **ADR（Architecture Decision Records）** に「なぜそう決めたか」を残すと、未来のチーム（とAI）が過去の文脈を理解できます。',
            ],
            points: [
              '判断の軸: 変化の速さ・失敗のコスト・チームのスキル',
              '「大企業がやっているから」は根拠にならない',
              'トレードオフを言語化し、ADRに記録する',
            ],
            quiz: {
              question: '設計レビューで「この設計は妥当か？」を問われた。最も適切な評価方法は？',
              hint: '「妥当性」とは「一般的な正しさ」ではなく「このプロジェクトのコンテキストへの適合度」です。コンテキストを知らない相手（一般論・他社事例・AI）に答えを求めても核心的な評価にはなりません。',
              options: [
                { text: 'ベストプラクティスに従っているか確認する', correct: false, why: 'ベストプラクティスは文脈依存です。「一般的に良い」と「このプロジェクトで妥当」は別です。' },
                { text: '要件・制約・将来の変化予測に照らして、トレードオフが明示されているか確認する', correct: true, why: '正解！妥当性は「コンテキストに対する適合度」です。何と引き換えに何を得たかが明示された設計は、検証・修正が可能です。' },
                { text: '有名企業の類似システムと比較する', correct: false, why: '参考にはなりますが、規模・チーム・フェーズが異なれば妥当な設計も異なります。' },
                { text: 'AIに評価させる', correct: false, why: 'AIはコンテキスト（事業フェーズ・チームスキル・納期）を知らないため、一般論しか返せません。最終判断は人間の仕事です。' },
              ],
            },
            codingChallenge: {
              prompt:
                '設計のトレードオフを定量化する練習です。2つの設計案のスコアを計算して推薦案を返す関数を書いてください。各案は { name, speed: 実装の速さ(1-10), extensibility: 拡張性(1-10) }。重要度は weights = { speed, extensibility } で与えられ、スコア = speed×w.speed + extensibility×w.extensibility。スコアが高い方のnameを返し、同点なら "どちらでも" を返します。',
              functionName: 'recommendDesign',
              signature: 'function recommendDesign(a, b, weights)',
              starterCode: `function recommendDesign(a, b, weights) {
  // a, b: { name, speed, extensibility }
  // weights: { speed, extensibility }
  // スコア = speed * weights.speed + extensibility * weights.extensibility

}`,
              tests: [
                { description: '速度重視なら案A', script: "fn({name:'A',speed:9,extensibility:3}, {name:'B',speed:4,extensibility:9}, {speed:2,extensibility:1})", expected: '"A"' },
                { description: '拡張性重視なら案B', script: "fn({name:'A',speed:9,extensibility:3}, {name:'B',speed:4,extensibility:9}, {speed:1,extensibility:2})", expected: '"B"' },
                { description: '同点なら「どちらでも」', script: "fn({name:'A',speed:5,extensibility:5}, {name:'B',speed:5,extensibility:5}, {speed:1,extensibility:1})", expected: '"どちらでも"' },
              ],
              hints: [
                'const scoreA = a.speed * weights.speed + a.extensibility * weights.extensibility として比較',
                "if (scoreA > scoreB) return a.name / if (scoreB > scoreA) return b.name / return 'どちらでも'",
              ],
              solution: `function recommendDesign(a, b, weights) {
  const scoreA = a.speed * weights.speed + a.extensibility * weights.extensibility
  const scoreB = b.speed * weights.speed + b.extensibility * weights.extensibility
  if (scoreA > scoreB) return a.name
  if (scoreB > scoreA) return b.name
  return 'どちらでも'
}`,
            },
          },
          {
            id: 'ai-2-2',
            title: 'チームの既存ルールと「選べない技術」への対応',
            minutes: 20,
            intro:
              '実務では、技術は自分で選べません。jQueryのレガシーコード、社内独自フレームワーク、古いNodeのバージョン。「理想と違う」と向き合うのがプロの仕事です。',
            content: [
              '既存コードに飛び込んだら、まず **そのコードが存在する理由を探る**。歴史的経緯・過去の障害・顧客との契約…「意味不明なルール」には大抵、失われた文脈があります（チェスタートンの柵）。',
              'チームのルール（命名規約・コミットメッセージ・ブランチ戦略）は **まず従う**。改善提案は「従って理解した後」に行います。秩序なくルールを変えると、レビューコストとバグが増えます。',
              'レガシー技術への心構え: 「古い = 悪い」ではありません。10年動き続けているコードは **10年分のビジネスルールが埋め込まれた資産** です。書き換えは最後の手段です。',
              'AIツールも「チームのルールに従わせる」設定が重要です。規約をプロンプトやRulesファイルに埋め込み、生成物がプロジェクトの文脈に合うようにします。',
            ],
            points: [
              '不可解なルールには失われた文脈がある（チェスタートンの柵）',
              'ルールはまず従い、理解してから改善提案する',
              '10年動くコードは10年分のビジネス知識の資産',
            ],
            codeExercise: {
              prompt: '以下はレガシーシステムに残る「意味不明に見えるコード」です。新人のあなたが最初に取るべき行動を選んでください。',
              code: `// TODO: なぜか 0.9 を掛けている。消したい
function calcFee(amount) {
  return Math.floor(amount * 0.9)
}`,
              question: 'この「0.9」を即座に削除してコミットしてはいけない理由として、最も適切なものは？',
              hint: 'チェスタートンの柵: 「なぜそこにあるか分からないもの」を取り除く前に、まず「なぜ置かれたか」を調べます。この0.9に埋め込まれたビジネスルール（例: 特定顧客との契約上の10%割引）があるかもしれません。',
              options: [
                { text: '一見無意味なコードにも、過去の契約・障害対応などの文脈が埋め込まれている可能性があるから', correct: true, why: '正解！「0.9」は特定顧客との値引き契約や過去の障害対応の名残かもしれません。まず git log / 担当者ヒアリング / 仕様書で文脈を確認します。文脈がなければ削除の提案自体は正当です。' },
                { text: 'Math.floor を使っているから', correct: false, why: '端数処理自体は料金計算では一般的で、削除を止める理由にはなりません。' },
                { text: 'コメントに TODO と書かれているから', correct: false, why: 'TODOは「いずれやりたい」の意思表示であり、削除禁止の根拠ではありません。' },
                { text: 'テストが書かれていないから', correct: false, why: 'テストがないことは変更リスクを高めますが、本質的な理由は「失われた文脈」の存在です。' },
              ],
            },
          },
        ],
      },
    ],
  },
]
