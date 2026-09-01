import type { Track } from '../../types'

// 実務型コーディング演習トラック
// バグ修正・DOM操作・非同期処理を実践的に学ぶ
export const practiceTracks: Track[] = [
  {
    id: 'practice',
    title: '実務型コーディング演習',
    category: 'tech',
    color: 'rose',
    icon: 'fa-bug',
    description:
      'バグ修正・DOM操作・非同期処理の3テーマで、現場で即使えるコーディングスキルを鍛える。壊れたコードを直す体験から「なぜそうなるか」を学ぶ。',
    chapters: [
      {
        id: 'practice-bugs',
        title: '第1章: バグ修正演習',
        description: 'よくあるバグパターンを直す体験から、デバッグの思考法を身につける。',
        lessons: [
          {
            id: 'pr-1-1',
            title: 'バグ修正①: オフバイワンエラー',
            minutes: 15,
            intro:
              '「1つズレる」バグは初心者から上級者まで誰もが踏むバグの代表格です。配列の添字・ループ回数の境界を正確に把握する訓練をしましょう。',
            content: [
              '**オフバイワン（Off-by-one）エラー** とは、ループや配列アクセスで「1だけズレる」バグの総称です。例えば `for (let i = 0; i <= arr.length; i++)` は最後に `arr[arr.length]`（= undefined）にアクセスしてしまいます。',
              '配列のインデックスは **0始まり** です。長さ3の配列の最後の要素は `arr[2]`（= `arr[arr.length - 1]`）。`arr[3]` は範囲外で `undefined` になります。',
              'ループ条件は **`< arr.length`** が安全です。`<= arr.length` は1回多く回ります。「最後の要素まで処理する」には `i < arr.length`、「最後の要素を除く」には `i < arr.length - 1` です。',
              '**デバッグの手順**: ①ループ変数 i の値をコンソールに出力して確認 ②境界（最初・最後）だけを手動で追う ③テストケースに「空配列」「1要素」「境界値」を必ず含める。',
            ],
            points: [
              '配列インデックスは0始まり。長さNの配列の最後は `arr[N-1]`',
              'ループは `i < arr.length`（`<=` は1回多い）',
              'テストには空配列・1要素・境界値を必ず含める',
            ],
            quiz: {
              question: '`for (let i = 0; i <= arr.length; i++)` のバグはどれ？',
              hint: '`arr.length` が3のとき、i は 0, 1, 2, 3 と変化します。`arr[3]` は何でしょうか？',
              options: [
                {
                  text: '`i <= arr.length` → `i < arr.length` にすべき',
                  correct: true,
                  why: '正解！`i === arr.length` のとき `arr[arr.length]` にアクセスしますが、これは範囲外で undefined です。`<=` を `<` に変えると正しくなります。',
                },
                {
                  text: 'i の初期値を1にすべき',
                  correct: false,
                  why: '初期値0は正しいです（配列の最初は arr[0]）。初期値1にすると最初の要素が処理されません。',
                },
                {
                  text: 'ループを逆順（i--）にすべき',
                  correct: false,
                  why: '逆順にしても境界の問題は解決しません。問題は `<=` と `<` の違いです。',
                },
              ],
            },
            codingChallenge: {
              prompt:
                '以下の `sumArray` 関数にはオフバイワンエラーがあります。バグを見つけて修正し、配列の全要素の合計を正しく返す関数を完成させてください。',
              functionName: 'sumArray',
              signature: 'function sumArray(arr)',
              starterCode: `// バグあり: オフバイワンエラーが含まれています
// 修正して、配列の全要素の合計を返してください
function sumArray(arr) {
  let total = 0
  // ↓ ここにバグがある！
  for (let i = 1; i <= arr.length; i++) {
    total += arr[i]
  }
  return total
}`,
              tests: [
                {
                  description: '[1, 2, 3] の合計は 6',
                  script: 'fn([1, 2, 3])',
                  expected: '6',
                },
                {
                  description: '[10, 20, 30, 40] の合計は 100',
                  script: 'fn([10, 20, 30, 40])',
                  expected: '100',
                },
                {
                  description: '空配列は 0',
                  script: 'fn([])',
                  expected: '0',
                },
                {
                  description: '[5] は 5',
                  script: 'fn([5])',
                  expected: '5',
                },
              ],
              hints: [
                'i の初期値と条件の両方を確認してください',
                '配列の最初の要素は arr[0] です（arr[1] ではない）',
                'ループ条件は `i < arr.length`（`<=` ではなく）にしてください',
              ],
              solution: `function sumArray(arr) {
  let total = 0
  // 修正1: i = 0 から始める（arr[0] が最初の要素）
  // 修正2: i < arr.length（<= だと arr.length 番目 = undefined を足す）
  for (let i = 0; i < arr.length; i++) {
    total += arr[i]
  }
  return total
}`,
            },
          },
          {
            id: 'pr-1-2',
            title: 'バグ修正②: 未初期化変数とスコープ',
            minutes: 15,
            intro:
              '「変数を使う前に初期化していない」「スコープが思ったと違う」バグは、エラーメッセージが分かりにくく原因特定が難しいです。代表パターンを体で覚えましょう。',
            content: [
              '**未初期化変数**: JavaScript では宣言したが値を代入していない変数は `undefined` です。`undefined` に対して算術演算すると `NaN`（Not a Number）になります。`NaN + 1 = NaN` のように、一度 NaN が混入すると計算結果が全て NaN になる「NaN汚染」が起きます。',
              '`let count` は `let count = 0` と同じではありません。合計・カウントなどの累積変数は **必ず初期値を設定** しましょう（`let sum = 0`、`let count = 0`）。',
              '**スコープの落とし穴**: `if` や `for` の中で `let` / `const` で宣言した変数は、そのブロック（`{}`）の外からは見えません。ブロックの外でも使いたい変数は、外側で宣言してください。',
              '**var は使わない**: `var` は関数スコープで巻き上げ（hoisting）が起きるため、意図しない動作の原因になります。現代のJavaScriptでは `let` / `const` を使いましょう。',
            ],
            points: [
              '累積変数は必ず初期値を設定（sum = 0、count = 0）',
              'NaN が混入すると全計算結果が NaN になる',
              '`let`/`const` はブロックスコープ。ブロック外で使う変数は外で宣言',
            ],
            quiz: {
              question: '`let result; result += 5;` を実行すると result の値は？',
              hint: '`let result` で宣言した直後、result の値は何でしょう？ その値に 5 を足すとどうなりますか？',
              options: [
                { text: '5', correct: false, why: '`let result` で宣言した result は `undefined` です。`undefined + 5` は `NaN` になります。' },
                { text: 'NaN', correct: true, why: '正解！`let result` は値が undefined のままです。`undefined += 5` は `undefined + 5 = NaN` になります。累積変数は `let result = 0` と初期化しましょう。' },
                { text: 'undefined', correct: false, why: '`undefined` に数値を足すと `undefined` ではなく `NaN` になります。' },
              ],
            },
            codingChallenge: {
              prompt:
                '以下の `getStats` 関数には「未初期化変数」のバグがあります。数値配列の合計（sum）と平均（avg）を正しく計算して返すよう修正してください。',
              functionName: 'getStats',
              signature: 'function getStats(nums)',
              starterCode: `// バグあり: 未初期化変数によりNaNが返る
// 修正して、{sum, avg} を正しく返してください
function getStats(nums) {
  let sum  // ← バグ: 初期化していない！
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
  }
  const avg = nums.length > 0 ? sum / nums.length : 0
  return { sum, avg }
}`,
              tests: [
                {
                  description: '[1, 2, 3] の sum は 6',
                  script: 'fn([1, 2, 3]).sum',
                  expected: '6',
                },
                {
                  description: '[1, 2, 3] の avg は 2',
                  script: 'fn([1, 2, 3]).avg',
                  expected: '2',
                },
                {
                  description: '[10, 20] の sum は 30',
                  script: 'fn([10, 20]).sum',
                  expected: '30',
                },
                {
                  description: '空配列は {sum: 0, avg: 0}',
                  script: 'JSON.stringify(fn([]))',
                  expected: '{"sum":0,"avg":0}',
                },
              ],
              hints: [
                '`let sum` を `let sum = 0` に変更してください',
                '初期値を 0 にすることで、ループで正しく累積できます',
                '空配列のケースも考慮すると、sum の初期値 0 が役立ちます',
              ],
              solution: `function getStats(nums) {
  let sum = 0  // 修正: 初期値を 0 に設定
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
  }
  const avg = nums.length > 0 ? sum / nums.length : 0
  return { sum, avg }
}`,
            },
          },
          {
            id: 'pr-1-3',
            title: 'バグ修正③: 比較演算子の誤用（=== vs ==）',
            minutes: 15,
            intro:
              '`==`（緩い等値比較）と `===`（厳密等値比較）の違いは、JavaScriptの有名な落とし穴です。型変換が暗黙に起きる `==` は、予測不能な動作の温床です。',
            content: [
              '`==`（緩い等値比較）は、型が違っても自動的に型変換してから比較します。例えば `0 == false` は `true`、`"1" == 1` も `true` です。',
              '`===`（厳密等値比較）は、型も値も同じ場合のみ `true` です。`0 === false` は `false`、`"1" === 1` も `false`。これが推奨されます。',
              'よくある落とし穴: ユーザー入力やAPIレスポンスは文字列になりがちです。`input.value` は常に文字列なので、`input.value == 0` は予想外の動作をすることがあります。',
              'JavaScriptでは **`===` と `!==` を常に使う** ことがベストプラクティスです。`==` を使う理由はほぼありません。ESLintルールの `eqeqeq` も同様のルールです。',
            ],
            points: [
              '`===`（厳密比較）を常に使う。`==` は型変換が起きて予測不能',
              '`"1" == 1` は true だが `"1" === 1` は false',
              'ユーザー入力は常に文字列。数値比較前に `Number()` や `parseInt()` で変換',
            ],
            quiz: {
              question: '`"0" == false` の結果は？',
              hint: '`==` は型変換を行います。`"0"` → 数値 → `false` への変換が起きます。',
              options: [
                { text: 'true', correct: true, why: '正解（かつ罠！）。`"0" == false` では: false → 0、"0" → 0 と変換され、0 == 0 で true になります。このような直感に反する動作が `==` の問題です。`===` を使えば "0" === false は false になります。' },
                { text: 'false', correct: false, why: '直感的にはそう思えますが、`==` は型変換を行います。"0" と false はどちらも 0 に変換されるため true になります。`===` を使えば false になります。' },
                { text: 'エラーが発生する', correct: false, why: 'エラーにはなりません。`==` は暗黙の型変換を行って比較を試みます。' },
              ],
            },
            codingChallenge: {
              prompt:
                '以下の `checkStatus` 関数には比較演算子のバグがあります。`status` が文字列 `"1"` のとき active、`"0"` のとき inactive、それ以外は unknown を返すよう正しく修正してください。',
              functionName: 'checkStatus',
              signature: 'function checkStatus(status)',
              starterCode: `// バグあり: == を使っているため型変換の罠がある
// 修正して、文字列の "1"/"0" を正しく判定してください
function checkStatus(status) {
  if (status == 1) {    // ← バグ: == を使っている
    return 'active'
  } else if (status == 0) {  // ← バグ: == を使っている
    return 'inactive'
  } else {
    return 'unknown'
  }
}`,
              tests: [
                {
                  description: '"1"（文字列）は active',
                  script: 'fn("1")',
                  expected: '"active"',
                },
                {
                  description: '"0"（文字列）は inactive',
                  script: 'fn("0")',
                  expected: '"inactive"',
                },
                {
                  description: 'true（真偽値）は unknown（"1" とは別物）',
                  script: 'fn(true)',
                  expected: '"unknown"',
                },
                {
                  description: 'false（真偽値）は unknown（"0" とは別物）',
                  script: 'fn(false)',
                  expected: '"unknown"',
                },
                {
                  description: '"2" は unknown',
                  script: 'fn("2")',
                  expected: '"unknown"',
                },
              ],
              hints: [
                '`==` を `===` に変更すれば型変換が起きなくなります',
                '`"1" === 1` は false（文字列と数値は別の型）',
                '`status === "1"` で文字列の "1" だけに一致します',
              ],
              solution: `function checkStatus(status) {
  // 修正: == → === に変更。型変換が起きず、文字列だけに一致する
  if (status === '1') {
    return 'active'
  } else if (status === '0') {
    return 'inactive'
  } else {
    return 'unknown'
  }
}`,
            },
          },
        ],
      },
      {
        id: 'practice-dom',
        title: '第2章: DOM操作演習',
        description: 'JavaScriptでHTMLを動的に操作するスキルを演習で習得する。',
        lessons: [
          {
            id: 'pr-2-1',
            title: 'DOM操作の基本: 要素の追加・削除・更新',
            minutes: 20,
            intro:
              'JavaScriptからHTMLを操作する「DOM API」は、フロントエンド開発の基礎です。要素の取得・追加・削除・イベント処理のパターンを覚えましょう。',
            content: [
              '**DOMとは**: HTML文書をJavaScriptから操作できるツリー状のオブジェクト（Document Object Model）です。`document.querySelector()` で要素を取得し、プロパティ・メソッドで操作します。',
              '**要素の取得**: `document.querySelector("#id")` でID指定、`document.querySelector(".class")` でクラス指定、`document.querySelectorAll("li")` で複数取得（NodeList）。',
              '**要素の作成と追加**: `document.createElement("div")` で要素を作り、`parent.appendChild(child)` で子要素として追加します。テキストは `element.textContent = "テキスト"` で設定。',
              '**要素の削除**: `element.remove()` でその要素ごと削除、または `parent.removeChild(child)` で親要素から子を削除します。',
              '**イベント処理**: `element.addEventListener("click", function(event) { ... })` でクリックイベントを設定。`event.target` は実際にクリックされた要素です。フォームの送信は `event.preventDefault()` でデフォルト動作（ページ再読み込み）を止めます。',
            ],
            points: [
              'querySelector でCSS同様のセレクタで要素取得',
              'createElement + appendChild で動的に要素追加',
              'addEventListener でクリックなどのイベントに反応',
            ],
            quiz: {
              question: 'フォーム送信時に `event.preventDefault()` を呼ぶ目的は？',
              hint: 'フォームの `submit` イベントのデフォルト動作は何でしょうか？',
              options: [
                {
                  text: 'ページのリロード（フォームのデフォルト送信動作）を止めるため',
                  correct: true,
                  why: '正解！フォームの `submit` イベントのデフォルト動作はページの再読み込みです。SPAやAJAX送信では `preventDefault()` でこれを止めてから、JavaScript側で処理します。',
                },
                {
                  text: 'イベントリスナーを削除するため',
                  correct: false,
                  why: 'イベントリスナーの削除は `removeEventListener()` で行います。`preventDefault()` はデフォルト動作の抑止です。',
                },
                {
                  text: '他の要素にイベントが伝播するのを止めるため',
                  correct: false,
                  why: 'イベントの伝播（バブリング）を止めるのは `event.stopPropagation()` です。`preventDefault()` はブラウザのデフォルト動作を止めます。',
                },
              ],
            },
            codingChallenge: {
              prompt:
                'テキスト入力からアイテムを追加し、追加したアイテムをクリックで削除できるリストを管理する関数を実装してください。仮想DOM環境で動作確認します（実際のDOM APIと同じインターフェース）。',
              functionName: 'manageList',
              signature: 'function manageList(items)',
              starterCode: `// items: string[] の配列を受け取り、管理操作の結果を返す
// addItem(text): テキストを配列に追加
// removeItem(index): 指定インデックスの要素を削除
// getItems(): 現在の配列を返す
function manageList(items) {
  let list = [...items]  // コピーして管理

  function addItem(text) {
    // TODO: list に text を追加
  }

  function removeItem(index) {
    // TODO: 指定インデックスの要素を削除（splice を使う）
  }

  function getItems() {
    return list
  }

  return { addItem, removeItem, getItems }
}`,
              tests: [
                {
                  description: 'addItem で要素を追加できる',
                  script: '(() => { const m = fn([]); m.addItem("りんご"); return m.getItems()[0] })()',
                  expected: '"りんご"',
                },
                {
                  description: '複数追加できる',
                  script: '(() => { const m = fn([]); m.addItem("A"); m.addItem("B"); return m.getItems().length })()',
                  expected: '2',
                },
                {
                  description: 'removeItem でインデックス指定削除',
                  script: '(() => { const m = fn(["A","B","C"]); m.removeItem(1); return JSON.stringify(m.getItems()) })()',
                  expected: '["A","C"]',
                },
                {
                  description: '初期配列を変更しない',
                  script: '(() => { const orig = ["X"]; const m = fn(orig); m.addItem("Y"); return orig.length })()',
                  expected: '1',
                },
              ],
              hints: [
                'addItem: `list.push(text)` で末尾に追加',
                'removeItem: `list.splice(index, 1)` で1要素削除',
                '`[...items]` で元の配列をコピーして操作することが副作用防止のポイント',
              ],
              solution: `function manageList(items) {
  let list = [...items]  // コピーして管理（元の配列を変更しない）

  function addItem(text) {
    list.push(text)  // 末尾に追加
  }

  function removeItem(index) {
    list.splice(index, 1)  // 指定インデックスから1要素削除
  }

  function getItems() {
    return list
  }

  return { addItem, removeItem, getItems }
}`,
            },
          },
        ],
      },
      {
        id: 'practice-async',
        title: '第3章: 非同期処理演習',
        description: 'async/await とエラーハンドリングを実践的なモック演習で習得する。',
        lessons: [
          {
            id: 'pr-3-1',
            title: 'async/await: 非同期処理を「同期的に」書く',
            minutes: 20,
            intro:
              'Promiseをさらに読みやすく書ける `async/await` 構文は、現代のJavaScript開発に必須です。エラーハンドリングを含めた正しい使い方を学びましょう。',
            content: [
              '`async function` は必ず Promise を返します。関数内で `await` を使うと、Promiseが解決するまで「待ってから次へ進む」ように書けます。コールバックのネストが消えてスッキリ書けます。',
              '`await` は `async` 関数の中でのみ使えます。トップレベルでは使えません（ESモジュールのトップレベルawaitは例外）。',
              '**エラーハンドリング**: `await` した処理がエラー（reject）になると例外が投げられます。`try { ... } catch (error) { ... }` で捕捉します。fetchのエラーは2種類: ①ネットワークエラー（例外が投げられる）②HTTPエラー（例外は投げられず `response.ok` が false になる）。',
              '**複数の非同期処理を並列実行**: 互いに依存しない複数のAPIを順番に `await` すると遅くなります。`Promise.all([fetch1, fetch2])` で並列実行すると最長の処理時間で済みます。',
              'よくあるミス: `await` を忘れると Promise オブジェクトそのものが返ります。`const data = fetch(url)` は Promise、`const data = await fetch(url)` はResponseです。',
            ],
            points: [
              'async 関数内でのみ await が使える',
              'エラーは try/catch で捕捉（fetch は HTTPエラーで例外を投げない点に注意）',
              '並列処理は Promise.all で同時実行',
            ],
            quiz: {
              question: 'fetch でHTTPステータス 404 が返ってきた場合、例外は投げられる？',
              hint: 'fetchのドキュメントでは「ネットワーク障害が発生したときのみ reject する」と書かれています。404は「通信は成功した」と言えるでしょうか？',
              options: [
                {
                  text: '投げられない。response.ok を確認する必要がある',
                  correct: true,
                  why: '正解！fetch はネットワーク障害（接続失敗など）のみで reject します。404・500などのHTTPエラーは「通信は成功」なので例外になりません。`if (!response.ok) throw new Error(...)` で明示的にチェックが必要です。',
                },
                {
                  text: '投げられる。catch で捕捉できる',
                  correct: false,
                  why: 'fetch の Promise は、404や500などHTTPエラーコードでは reject しません。ネットワーク障害のみです。HTTPエラーは `response.ok` や `response.status` で確認します。',
                },
                {
                  text: '自動的に再試行される',
                  correct: false,
                  why: 'fetchに自動再試行の仕組みはありません。再試行が必要な場合は自分で実装するか、axios などのライブラリを使います。',
                },
              ],
            },
            codingChallenge: {
              prompt:
                'モックAPIを使った非同期関数を実装してください。`mockFetch(url)` はURLに応じてPromiseを返します（"/users"は{users:[{id:1,name:"田中"},{id:2,name:"佐藤"}]}、存在しないURLは{error:"Not Found"}）。`fetchUsers()` 関数を実装して、ユーザー一覧を取得・返してください。エラー時は空配列を返します。',
              functionName: 'fetchUsers',
              signature: 'async function fetchUsers(mockFetch)',
              starterCode: `// mockFetch はテスト用の模擬fetch関数（引数として渡されます）
// mockFetch(url) は Promise<{users: [...]}> を返す
// エラー時やデータなし時は空配列を返すこと

async function fetchUsers(mockFetch) {
  try {
    // TODO: mockFetch('/users') を await して呼び出す
    // TODO: レスポンスの users 配列を返す
    // TODO: エラーや users がない場合は [] を返す
  } catch (error) {
    return []
  }
}`,
              tests: [
                {
                  description: '正常系: ユーザー配列を返す',
                  script: `(async () => {
  const mock = (url) => Promise.resolve(url === '/users' ? {users:[{id:1,name:'田中'},{id:2,name:'佐藤'}]} : {error:'Not Found'})
  const result = await fn(mock)
  return result.length
})()`,
                  expected: '2',
                },
                {
                  description: '正常系: 最初のユーザー名が正しい',
                  script: `(async () => {
  const mock = (url) => Promise.resolve(url === '/users' ? {users:[{id:1,name:'田中'}]} : {error:'Not Found'})
  const result = await fn(mock)
  return result[0].name
})()`,
                  expected: '"田中"',
                },
                {
                  description: 'エラー時は空配列',
                  script: `(async () => {
  const mock = (url) => Promise.reject(new Error('Network Error'))
  const result = await fn(mock)
  return Array.isArray(result) && result.length === 0
})()`,
                  expected: 'true',
                },
                {
                  description: 'users フィールドがない場合も空配列',
                  script: `(async () => {
  const mock = (url) => Promise.resolve({error:'Not Found'})
  const result = await fn(mock)
  return Array.isArray(result)
})()`,
                  expected: 'true',
                },
              ],
              hints: [
                '`const data = await mockFetch("/users")` でデータを取得',
                '`data.users` が存在するか確認: `data.users || []`',
                'catch ブロックで例外を捕捉して `[]` を返す',
              ],
              solution: `async function fetchUsers(mockFetch) {
  try {
    const data = await mockFetch('/users')
    // users フィールドがない場合は空配列にフォールバック
    return data.users || []
  } catch (error) {
    // ネットワークエラーなどの例外時は空配列を返す
    return []
  }
}`,
            },
          },
        ],
      },
    ],
  },
]
