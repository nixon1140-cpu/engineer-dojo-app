import type { Track } from '../../types'

// 入門トラック: 未経験・初学者のためのファーストステップ
export const beginnerTracks: Track[] = [
  {
    id: 'beginner',
    title: 'プログラミング基礎（入門）',
    category: 'tech',
    icon: 'fa-seedling',
    color: 'lime',
    tagline: 'ここから始める、エンジニアの第一歩',
    description:
      'プログラミング未経験者向けの入門トラック。変数・条件分岐・関数といった基礎を、ブラウザ上で実際にコードを書きながら身につける。すべての演習は「実行ボタンを押せばすぐ答え合わせ」できる形式。',
    outcomes: [
      '変数・条件分岐・ループ・関数の基本が書ける',
      'エラーメッセージを読んで原因を特定できる',
      '「動かして確かめる」学習サイクルを回せる',
      '次のトラック（フロントエンド等）に進む準備ができる',
    ],
    chapters: [
      {
        id: 'bg-basics',
        title: '第1章: はじめてのプログラミング',
        description: '難しい環境構築は不要。ブラウザだけで、今日からコードが書けます。',
        lessons: [
          {
            id: 'bg-1-1',
            title: '変数と計算: プログラムの最小単位',
            minutes: 15,
            intro:
              'すべてのプログラムは「データを覚えて（変数）」「計算して」「結果を返す」の組み合わせです。まずこの最小単位を自分の手で書いてみましょう。',
            content: [
              '**変数** とは、データに名前を付けて保存する箱のようなものです。JavaScriptでは `const`（変更しない）または `let`（変更する）で宣言します。迷ったらまず `const` を使いましょう。',
              '`const price = 100` と書くと、「price という名前に 100 を保存」という意味になります。以降 `price` と書けば 100 として使えます。',
              '計算は算数とほぼ同じです: `+` `-` `*` `/` が使えます。`%` は余りを求めます（例: `7 % 3` は 1）。',
              '**文字列** は `\'こんにちは\'` のようにクォートで囲みます。数値と文字列は別物です: `1 + 1` は 2 ですが、`\'1\' + \'1\'` は `\'11\'` になります。この違いは初心者が最初にハマるポイントです。',
              'わからなくなったら **小さく書いて、すぐ実行する**。この道場の演習はすべて「書いて → 実行して → 確かめる」のサイクルで進みます。',
            ],
            points: [
              '変数は const で宣言（変更が必要な時だけ let）',
              '数値と文字列は別物（\'1\' + \'1\' = \'11\'）',
              '小さく書いて、すぐ実行して確かめる',
            ],
            quiz: {
              question: '`const result = \'100\' + 200` の結果はどうなる？',
              hint: '文字列と数値の「+」は、JavaScriptでは文字列の連結として扱われます。',
              options: [
                { text: '300（数値として計算される）', correct: false, why: '数値同士なら300ですが、片方が文字列の場合は「連結」が優先されます。' },
                { text: '\'100200\'（文字列として連結される）', correct: true, why: '正解！片方が文字列の場合、+ は文字列連結になります。これが「フォームの入力値（文字列）をそのまま足して金額がおかしい」という初心者バグの原因になります。' },
                { text: 'エラーになる', correct: false, why: 'JavaScriptは暗黙の型変換を行うため、エラーにはなりません。だからこそ気づきにくいバグになります。' },
              ],
            },
            codingChallenge: {
              prompt:
                'はじめてのコーディング演習です。商品の価格（price）と個数（quantity）を受け取り、消費税10%を加えた「税込み合計金額」を返す関数を書いてください。小数点以下は Math.floor() で切り捨ててください。例: totalWithTax(100, 3) → 330',
              functionName: 'totalWithTax',
              signature: 'function totalWithTax(price, quantity)',
              starterCode: `function totalWithTax(price, quantity) {
  // 1. まず小計（price × quantity）を計算
  // 2. 消費税10%を加える（× 1.1）
  // 3. Math.floor() で小数点以下を切り捨てて返す

}`,
              tests: [
                { description: '100円×3個 = 330円', script: 'fn(100, 3)', expected: '330' },
                { description: '198円×2個 = 435円（小数点切り捨て）', script: 'fn(198, 2)', expected: '435' },
                { description: '0個なら0円', script: 'fn(500, 0)', expected: '0' },
                { description: '1円×1個 = 1円', script: 'fn(1, 1)', expected: '1' },
              ],
              hints: [
                'const subtotal = price * quantity で小計が計算できます',
                '税込みは subtotal * 1.1',
                'return Math.floor(subtotal * 1.1) で完成です',
              ],
              solution: `function totalWithTax(price, quantity) {
  const subtotal = price * quantity
  return Math.floor(subtotal * 1.1)
}`,
            },
          },
          {
            id: 'bg-1-2',
            title: '条件分岐: 「もし〜なら」を書く',
            minutes: 20,
            intro:
              'プログラムの半分は「条件によって処理を変える」ことです。if文さえ書ければ、バリデーションも権限チェックも、その第一歩は同じです。',
            content: [
              '**if文** は「もし〜なら、これをする」という構文です: `if (age >= 18) { ... }`。条件が成り立つ（true の）時だけ中身が実行されます。',
              '比較の記号: `===`（等しい）、`!==`（等しくない）、`>=`（以上）、`<`（未満）など。注意: `=` 1つは「代入」、比較は `===` 3つが基本です。',
              '`else if` で条件を追加、`else` で「どれでもない場合」を書けます: 上から順に判定され、最初に合致したブロックだけが実行されます。',
              '条件を組み合わせる記号: `&&`（かつ）、`||`（または）、`!`（否定）。`if (age >= 18 && hasTicket)` は「18歳以上で、チケットを持っている」。',
              '**早期リターン** という書き方が重要です: 「ダメな条件」を先に if で弾いて return すると、残りのコードがすっきりします。実務のコードレビューでも推奨される定石です。',
            ],
            points: [
              '比較は === （= は代入、== は非推奨）',
              'else if は上から順に評価される',
              '早期リターンで「ダメな条件」を先に弾く',
            ],
            quiz: {
              question: 'if文で「年齢が18歳以上かつ会員」という条件を書きたい。正しいのは？',
              hint: '「かつ」を表す演算子と、比較に使う記号の2つがポイントです。',
              options: [
                { text: 'if (age >= 18 && isMember)', correct: true, why: '正解！&& は「かつ」（両方trueの時だけtrue）。>= は「以上」、=== と混同しないよう比較の向きにも注意です。' },
                { text: 'if (age >= 18 || isMember)', correct: false, why: '|| は「または」なので、片方だけ満たせば通ってしまいます。18歳未満の会員も通るため要件を満たしません。' },
                { text: 'if (age = 18 && isMember)', correct: false, why: '= 1つは「代入」です。age に 18 を上書きしてしまうバグになります。比較は >= や === を使います。' },
              ],
            },
            codingChallenge: {
              prompt:
                '入場料金を計算する関数を書いてください。料金ルール: ①12歳未満は無料（0円）②12歳以上18歳未満は500円 ③18歳以上は1000円 ④65歳以上は800円（シニア割引・一般より優先）。例: getPrice(10) → 0、getPrice(15) → 500、getPrice(30) → 1000、getPrice(70) → 800',
              functionName: 'getPrice',
              signature: 'function getPrice(age)',
              starterCode: `function getPrice(age) {
  // 条件を上から順に判定していきます
  // ヒント: 厳しい条件（子ども無料）から先に書く

}`,
              tests: [
                { description: '10歳は無料', script: 'fn(10)', expected: '0' },
                { description: '15歳は500円', script: 'fn(15)', expected: '500' },
                { description: '30歳は1000円', script: 'fn(30)', expected: '1000' },
                { description: '70歳はシニア割引800円', script: 'fn(70)', expected: '800' },
                { description: '12歳ちょうどは500円（12歳以上）', script: 'fn(12)', expected: '500' },
                { description: '18歳ちょうどは1000円（18歳以上）', script: 'fn(18)', expected: '1000' },
              ],
              hints: [
                'if (age < 12) return 0 のように、上から順に return していく形が書きやすい',
                '「12歳以上18歳未満」は age >= 12 && age < 18',
                'シニア（65歳以上）は「18歳以上」より先に判定しないと、1000円が返ってしまう',
              ],
              solution: `function getPrice(age) {
  if (age < 12) return 0
  if (age < 18) return 500
  if (age >= 65) return 800
  return 1000
}`,
            },
          },
        ],
      },
      {
        id: 'bg-next',
        title: '第2章: 関数・配列・エラーとの付き合い方',
        description: 'ワンランク上の基礎体力。ここを越えれば各トラックのレッスンが読めるようになります。',
        lessons: [
          {
            id: 'bg-2-1',
            title: '関数と配列: 処理を部品化し、データをまとめて扱う',
            minutes: 20,
            intro:
              '「同じ処理を何度も書く」のは悪い設計のサイン。関数で部品化し、配列でまとめて処理する——これが実務コードの基本形です。',
            content: [
              '**関数** は処理に名前を付けて再利用する仕組みです。`function add(a, b) { return a + b }` と定義し、`add(1, 2)` で呼び出します。',
              '**配列** は複数のデータを順番に格納する入れ物です: `const scores = [80, 92, 67]`。`scores[0]` で先頭（0から数える！）、`scores.length` で個数が取れます。',
              '配列の定番メソッド: `map`（全要素を変換した新配列）、`filter`（条件に合う要素だけの新配列）、`find`（条件に合う最初の1件）。これらは元の配列を変更しません。',
              '例: `scores.filter(s => s >= 80)` は「80点以上だけの配列」。`s => s >= 80` は **アロー関数** と呼ばれる短い関数の書き方です。',
              '実務のコードの大半は「配列から必要なものを filter/map で取り出す」処理です。この形に慣れると、他人のコードがぐっと読みやすくなります。',
            ],
            points: [
              '関数 = 処理の部品化、配列 = データのまとまり',
              '配列の添字は 0 始まり',
              'map / filter / find は元の配列を変えない',
            ],
            quiz: {
              question: 'const nums = [1, 2, 3] に対して nums.map(n => n * 2) の結果は？',
              hint: 'map は「各要素を変換した新しい配列」を返します。元の nums は変わりません。',
              options: [
                { text: '[2, 4, 6]（新しい配列）', correct: true, why: '正解！map は各要素に関数を適用した「新しい配列」を返します。元の nums は [1, 2, 3] のまま変わりません。' },
                { text: '[1, 2, 3] が [2, 4, 6] に書き換わる', correct: false, why: 'map は元の配列を変更しません（非破壊）。変更しない性質はバグを防ぐ重要な特徴です。' },
                { text: '6（合計値）', correct: false, why: '合計を求めるのは reduce の仕事です。map は要素ごとの変換を行います。' },
              ],
            },
            codingChallenge: {
              prompt:
                'テストの点数一覧（scores）から「60点以上の合格者だけ」を取り出し、さらにそれぞれに +5点のボーナスを加えた配列を返す関数を書いてください。例: applyBonus([55, 60, 80]) → [65, 85]（55は不合格で除外、60→65、80→85）',
              functionName: 'applyBonus',
              signature: 'function applyBonus(scores)',
              starterCode: `function applyBonus(scores) {
  // 1. filter で 60点以上だけに絞る
  // 2. map で +5点する

}`,
              tests: [
                { description: '[55, 60, 80] → [65, 85]', script: 'JSON.stringify(fn([55, 60, 80]))', expected: '"[65,85]"' },
                { description: '全員不合格なら空配列', script: 'JSON.stringify(fn([10, 20]))', expected: '"[]"' },
                { description: '全員合格なら全員+5', script: 'JSON.stringify(fn([100, 95]))', expected: '"[105,100]"' },
                { description: '60点ちょうどは合格', script: 'JSON.stringify(fn([60]))', expected: '"[65]"' },
              ],
              hints: [
                'scores.filter(s => s >= 60) で合格者だけの配列になります',
                '.map(s => s + 5) を続けて繋げられます（メソッドチェーン）',
                'return scores.filter(...).map(...) の1行でも書けます',
              ],
              solution: `function applyBonus(scores) {
  return scores
    .filter(s => s >= 60)
    .map(s => s + 5)
}`,
            },
          },
          {
            id: 'bg-2-2',
            title: 'エラーメッセージの読み方: エラーは敵ではなく案内人',
            minutes: 15,
            intro:
              '初心者が最もつまずくのはエラーの赤文字です。しかしエラーメッセージは「どこが、なぜおかしいか」を教えてくれる最も正直な案内人です。',
            content: [
              'エラーメッセージの3点セット: ①**エラーの種類**（SyntaxError / TypeError / ReferenceError など）②**場所**（ファイル名と行番号）③**内容**。この順で読みます。',
              '代表的なエラー: `SyntaxError` = 文法ミス（括弧の閉じ忘れ等）。`ReferenceError: x is not defined` = 未定義の変数を使った。`TypeError: cannot read ... of undefined` = 存在しないものの中身を読もうとした。',
              '「エラーが出たらAIに丸投げ」は非推奨です。まず **自分で1分読む** 習慣をつけましょう。エラーを読む力は、AIの出力を検証する力に直結します。',
              'デバッグの基本は **二分探索**: 「ここまでは動く・ここからは動かない」の境界を、console.log を挟みながら絞り込みます。闇雲に全部書き直さないこと。',
              'この道場の演習でも、テスト失敗時に「期待値と実際の値」が表示されます。その差分を読む練習こそが、デバッグ力の基礎トレーニングです。',
            ],
            points: [
              'エラーは「種類・場所・内容」の順で読む',
              'まず1分、自分で読んでから調べる/聞く',
              'デバッグは二分探索（境界の絞り込み）',
            ],
            codeExercise: {
              prompt: 'あなたが書いたコードがエラーになりました。以下を読んで、原因を特定してください。',
              code: `const user = {
  name: '田中',
  age: 28
}

console.log('ユーザー名: ' + user.name)
console.log('メール: ' + user.email.toLowerCase())`,
              question: 'このコードで発生するエラーと原因は？',
              hint: 'user オブジェクトに email というプロパティは定義されているでしょうか？',
              options: [
                { text: 'SyntaxError: 文字列の書き方が間違っている', correct: false, why: 'クォートや括弧は正しく閉じられており、文法エラーではありません。' },
                { text: 'TypeError: user.email は undefined なので toLowerCase() を呼べない', correct: true, why: '正解！user に email プロパティは存在しないため undefined になり、undefined に対してメソッドを呼ぶと TypeError になります。「cannot read properties of undefined」は実務でも頻出のエラーです。対策: オプショナルチェーン（user.email?.toLowerCase()）や事前チェック。' },
                { text: 'ReferenceError: user が定義されていない', correct: false, why: 'user は const で定義されています。存在しないのは email プロパティの方です。' },
              ],
            },
          },
        ],
      },
    ],
  },
]
