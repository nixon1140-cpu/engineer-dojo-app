import type { Track } from '../../types'

export const testingTracks: Track[] = [
  {
    id: 'testing',
    title: 'テストと品質',
    category: 'tech',
    icon: 'fa-flask',
    color: 'teal',
    tagline: '「動く」から「壊れない」へ。テストが品質を守る',
    description:
      '単体テストの考え方からTDDの基本サイクルまで。テストを書くことでコード設計が改善され、安心してリファクタリングできる力を身につける。',
    outcomes: [
      '単体テストの目的と「何をテストすべきか」を説明できる',
      'TDDの Red-Green-Refactor サイクルを理解している',
      'テストしやすいコードとテストしにくいコードの違いを判断できる',
      '境界値・正常系・異常系を意識したテストケースを設計できる',
    ],
    chapters: [
      {
        id: 'testing-basics',
        title: '第1章: テストの基礎とTDD',
        description: '「なぜテストを書くか」から始め、TDDで先にテストを書く体験をする。',
        lessons: [
          {
            id: 'test-1-1',
            title: '単体テストの考え方: 何を・どうテストするか',
            minutes: 20,
            intro:
              '「テストを書いてから実装する」というTDDを聞いたことがあるでしょうか。テストは「動くか確認するもの」ではなく、「仕様を実行可能な形で書いたもの」です。この視点の転換がエンジニアとしての大きな成長点です。',
            content: [
              '**単体テスト（ユニットテスト）** は、関数・クラスなどの小さな単位が「仕様通りに動くか」を自動で検証します。手動テストは1回限りですが、単体テストは何度でも繰り返せます。',
              'テストするべき3パターン: ①**正常系**（想定どおりの入力）②**異常系**（不正な入力・エラー）③**境界値**（0、空文字、上限ぴったり等）。この3つを意識するだけでテスト品質が大幅に上がります。',
              '**テストしやすいコードの特徴**: 副作用がない（同じ入力→同じ出力）、依存が注入できる（グローバル変数を使わない）、1関数が1つのことだけする。逆に「テストが書きにくい」は設計の悪さのサインです。',
              'テストを書くことのメリット: ①リファクタリングへの安心感（壊れたらすぐ気づく）②仕様の文書化（テストを読めば動作がわかる）③AIが書いたコードの検証ツール。',
              '**Arrange-Act-Assert（AAA）パターン**: テストは「準備（Arrange）→実行（Act）→検証（Assert）」の3フェーズで書くと読みやすくなります。この道場のコーディング演習のテストも同じ構造になっています。',
            ],
            points: [
              'テストは「仕様の実行可能な文書」',
              '正常系・異常系・境界値の3パターンを意識する',
              'テストしにくいコードは設計が悪いサイン',
            ],
            quiz: {
              question: '「テストしにくいコード」の代表的な特徴はどれか？',
              hint: 'テストは「同じ入力を与えると同じ結果が返るか」を確認します。何があると「同じ入力・同じ結果」が保証できなくなりますか？',
              options: [
                { text: '関数が短くて処理が単純', correct: false, why: '短くシンプルな関数はむしろテストが書きやすいです。理想的な設計です。' },
                { text: '関数内でDate.now()やMath.random()などの外部状態に依存している', correct: true, why: '正解！毎回結果が変わる処理があると、同じ入力でも同じ出力にならず、テストの「期待値」が書けません。これを「非決定論的」と言います。依存を引数として注入できる設計にすることで解決します。' },
                { text: '引数が2つ以上ある', correct: false, why: '引数の数はテストのしやすさに直接関係しません。引数が多くても純粋関数ならテストしやすいです。' },
              ],
            },
            codingChallenge: {
              prompt:
                'TDDの精神で、テストケースを満たす関数を実装してください。`calculateDiscount(price, memberType)` は価格と会員タイプから割引後の価格を返します。仕様: ①"premium"会員は20%割引②"regular"会員は10%割引③その他は割引なし④価格が0以下なら0を返す⑤小数点以下はfloor。例: calculateDiscount(1000, "premium") → 800',
              functionName: 'calculateDiscount',
              signature: 'function calculateDiscount(price, memberType)',
              starterCode: `// 先にテスト（仕様）を読んで、それを全て満たす実装を書いてください
// これがTDDの「テストが先、実装が後」の発想です
function calculateDiscount(price, memberType) {

}`,
              tests: [
                { description: 'premiumは20%割引', script: 'fn(1000, "premium")', expected: '800' },
                { description: 'regularは10%割引', script: 'fn(1000, "regular")', expected: '900' },
                { description: 'その他は割引なし', script: 'fn(1000, "guest")', expected: '1000' },
                { description: '価格0以下は0', script: 'fn(-100, "premium")', expected: '0' },
                { description: '小数点以下はfloor', script: 'fn(333, "regular")', expected: '299' },
                { description: 'premium+小数', script: 'fn(150, "premium")', expected: '120' },
              ],
              hints: [
                'if (price <= 0) return 0 を最初に書く',
                'memberTypeによってrateを決め（premium:0.8, regular:0.9, 他:1.0）、Math.floor(price * rate) を返す',
                'switch文やオブジェクトマップで書くと読みやすい',
              ],
              solution: `function calculateDiscount(price, memberType) {
  if (price <= 0) return 0
  const rateMap = { premium: 0.8, regular: 0.9 }
  const rate = rateMap[memberType] ?? 1.0
  return Math.floor(price * rate)
}`,
            },
          },
          {
            id: 'test-1-2',
            title: 'TDDのサイクルとリファクタリング: Red-Green-Refactor',
            minutes: 20,
            intro:
              'TDD（テスト駆動開発）の本質は「先にテストを書いて失敗させ（Red）、最小限の実装でパスさせ（Green）、コードを整理する（Refactor）」サイクルです。このリズムに乗ると、設計が自然に改善されていきます。',
            content: [
              '**Red-Green-Refactor サイクル**: ①まず失敗するテストを書く（Red）→ ②テストを通す最小限の実装を書く（Green）→ ③テストを壊さずにコードを整理する（Refactor）→ ①に戻る。',
              'TDDのポイントは「一度に1つのことだけ考える」ことです。Redでは「何をすべきか」だけ考える。Greenでは「どうやって通すか」だけ考える。Refactorでは「どうすれば読みやすいか」だけ考える。',
              '**リファクタリング** は「外から見た動作を変えずに内部構造を改善する」ことです。テストがあれば「変わっていないこと」が自動で保証されるため、安心してリファクタリングできます。',
              'テストの「粒度」も重要です。1テスト=1アサーション（1つのことだけ確認）を目指すと、テストが失敗した時に「何が壊れたか」がすぐわかります。',
              '**モック（Mock）** は外部依存（DBアクセス・API通信・時刻取得など）を偽物に置き換える技術です。テストが外部状態に依存しなくなり、高速かつ安定したテストが書けます。この道場のコーディング演習でmockFetchを渡す形式もモックの一種です。',
            ],
            points: [
              'Red→Green→Refactor を小さく高速に回す',
              'リファクタリングはテストがあって初めて安全にできる',
              'モックで外部依存を切り離し、テストを安定させる',
            ],
            quiz: {
              question: 'TDDのRefactorフェーズで守るべき絶対のルールは？',
              hint: 'リファクタリングの定義は「外から見た動作を変えずに内部を整理する」です。これを保証する仕組みは何ですか？',
              options: [
                { text: '新しいテストを追加してからリファクタリングする', correct: false, why: 'Refactorフェーズでは新しいテストは不要です。既存テストがすべてGreenのまま通ることを確認しながら改善します。' },
                { text: 'テストがすべて通っている（Green）状態を維持しながらコードを変更する', correct: true, why: '正解！これがリファクタリングの唯一のルールです。テストが保護してくれているから、安心して内部を変えられます。もしテストが失敗したら、そのリファクタリングは「外から見た動作を変えてしまった」ことになります。' },
                { text: 'パフォーマンスを必ず改善する変更だけを行う', correct: false, why: 'リファクタリングの目的は可読性・保守性の改善であり、必ずしもパフォーマンス改善ではありません。' },
              ],
            },
            codingChallenge: {
              prompt:
                'リファクタリング演習です。以下の「動くが汚いコード」と同じテストを全てパスする、より読みやすい実装を書いてください。入力: 数値の配列。出力: { sum: 合計, avg: 平均(小数点2位まで), max: 最大値, min: 最小値 }。空配列の場合は { sum: 0, avg: 0, max: null, min: null }。',
              functionName: 'analyzeNumbers',
              signature: 'function analyzeNumbers(nums)',
              starterCode: `// 元のコード（動くが読みにくい）:
// function analyzeNumbers(n){if(!n||n.length===0)return{sum:0,avg:0,max:null,min:null};
// let s=0;for(let i=0;i<n.length;i++){s+=n[i];}
// let mx=n[0];let mn=n[0];for(let i=1;i<n.length;i++){if(n[i]>mx)mx=n[i];if(n[i]<mn)mn=n[i];}
// return{sum:s,avg:parseFloat((s/n.length).toFixed(2)),max:mx,min:mn};}

// 上と同じ動作を、読みやすく書き直してください:
function analyzeNumbers(nums) {

}`,
              tests: [
                { description: '[1,2,3] の合計', script: 'fn([1,2,3]).sum', expected: '6' },
                { description: '[1,2,3] の平均', script: 'fn([1,2,3]).avg', expected: '2' },
                { description: '[5,1,3] の最大値', script: 'fn([5,1,3]).max', expected: '5' },
                { description: '[5,1,3] の最小値', script: 'fn([5,1,3]).min', expected: '1' },
                { description: '空配列はゼロ/null', script: 'JSON.stringify(fn([]))', expected: '{"sum":0,"avg":0,"max":null,"min":null}' },
                { description: '小数点2位まで', script: 'fn([1,2]).avg', expected: '1.5' },
              ],
              hints: [
                '空チェック: if (!nums || nums.length === 0) return {...}',
                'sum: nums.reduce((a, b) => a + b, 0)',
                'max: Math.max(...nums), min: Math.min(...nums)',
                'avg: parseFloat((sum / nums.length).toFixed(2))',
              ],
              solution: `function analyzeNumbers(nums) {
  if (!nums || nums.length === 0) {
    return { sum: 0, avg: 0, max: null, min: null }
  }
  const sum = nums.reduce((a, b) => a + b, 0)
  const avg = parseFloat((sum / nums.length).toFixed(2))
  const max = Math.max(...nums)
  const min = Math.min(...nums)
  return { sum, avg, max, min }
}`,
            },
          },
        ],
      },
    ],
  },
]
