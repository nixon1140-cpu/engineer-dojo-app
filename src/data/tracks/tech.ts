import type { Track } from '../../types'

// 技術系トラック: フロントエンド / バックエンド / インフラ / DB設計
export const techTracks: Track[] = [
  {
    id: 'frontend',
    title: 'フロントエンド開発',
    category: 'tech',
    icon: 'fa-display',
    color: 'sky',
    tagline: 'ユーザーに価値を届ける最後の1マイル',
    description:
      'HTML/CSS/JavaScriptの基礎から、React系のモダン開発、状態管理、パフォーマンス、アクセシビリティまで。「動く」ではなく「使いやすく・速く・壊れにくい」UIを設計できるようになる。',
    outcomes: [
      '画面をコンポーネント単位で設計できる',
      '状態管理の選択肢と判断基準を説明できる',
      'Core Web Vitals を意識したパフォーマンス改善ができる',
      'AIが書いたUIコードの問題点（a11y・再レンダリング等）を指摘できる',
    ],
    chapters: [
      {
        id: 'fe-basics',
        title: '第1章: Webの仕組みと基礎',
        description: 'ブラウザがどう画面を描くか。ここを押さえるとフレームワークの挙動が理解できる。',
        lessons: [
          {
            id: 'fe-1-1',
            title: 'ブラウザレンダリングの仕組み',
            minutes: 20,
            intro:
              '「Reactが遅い」「CSSが効かない」といった問題の9割は、ブラウザの仕組みを知れば原因にたどり着けます。AIにデバッグを任せる前に、自分が地図を持ちましょう。',
            content: [
              'ブラウザはHTMLを受け取ると **DOMツリー** を構築し、CSSから **CSSOM** を作り、両者を合体させて **レンダーツリー** を生成します。これを **クリティカルレンダリングパス** と呼びます。',
              '重要なのは、CSSは **レンダリングをブロック** するという点です。巨大なCSSファイルを先頭で読み込むと、画面が真っ白な時間が長くなります。',
              'JavaScriptは **パーサーをブロック** します。`<script>` タグに `defer` や `async` を付けないと、HTML解析が止まります。',
              'レイアウト（リフロー）と再ペイントの違いも重要です。`width` を変えると再レイアウトが走りますが、`transform` や `opacity` なら合成のみで済み、高速です。',
              'DevToolsのPerformanceタブで実際に計測してみましょう。「推測するな、計測せよ」はパフォーマンス改善の鉄則です。',
            ],
            points: [
              'DOM → CSSOM → レンダーツリー → レイアウト → ペイントの流れ',
              'CSSはレンダリングブロック、JSはパーサーブロック',
              'transform/opacity は合成のみで高速',
            ],
            quiz: {
              question: 'アニメーションを滑らかにしたい場合、最も避けるべきプロパティの変更はどれ？',
              hint: 'ブラウザの描画工程「レイアウト → ペイント → 合成」のうち、最もコストが高いのは「レイアウト（リフロー）」の再計算です。どのプロパティがレイアウトを引き起こすかを考えましょう。',
              options: [
                { text: 'transform: translateX()', correct: false, why: 'transformは合成レイヤーで処理され、レイアウトを再計算しないため高速です。' },
                { text: 'opacity', correct: false, why: 'opacityも合成のみで処理されるため高速です。' },
                { text: 'top / left の直接変更', correct: true, why: '正解！top/leftの変更はレイアウト（リフロー）を引き起こし、全要素の位置再計算が走るため高コストです。' },
                { text: 'filter: blur()', correct: false, why: 'filterはペイントコストが高いですが、リフローほど重くはありません。最も避けるべきはレイアウト変更です。' },
              ],
            },
            codingChallenge: {
              prompt:
                'CSSプロパティをブラウザの描画コストで分類する関数を書いてください。プロパティ名を受け取り、レイアウト再計算が必要なもの（width, height, top, left, margin, padding）は \'layout\'、ペイントのみのもの（color, background, box-shadow）は \'paint\'、合成のみで済むもの（transform, opacity）は \'composite\' を返します。それ以外は \'unknown\' です。',
              functionName: 'classifyCssProperty',
              signature: 'function classifyCssProperty(property)',
              starterCode: `function classifyCssProperty(property) {
  // 配列にまとめて includes() で判定すると簡潔

}`,
              tests: [
                { description: "'width' → 'layout'", script: "fn('width')", expected: '"layout"' },
                { description: "'top' → 'layout'", script: "fn('top')", expected: '"layout"' },
                { description: "'transform' → 'composite'", script: "fn('transform')", expected: '"composite"' },
                { description: "'opacity' → 'composite'", script: "fn('opacity')", expected: '"composite"' },
                { description: "'color' → 'paint'", script: "fn('color')", expected: '"paint"' },
                { description: "'font-size' → 'unknown'", script: "fn('font-size')", expected: '"unknown"' },
              ],
              hints: [
                "const layoutProps = ['width','height','top','left','margin','padding'] のように3つの配列を定義",
                'if (layoutProps.includes(property)) return \'layout\' の順に判定し、最後に \'unknown\' を返す',
              ],
              solution: `function classifyCssProperty(property) {
  const layoutProps = ['width', 'height', 'top', 'left', 'margin', 'padding']
  const paintProps = ['color', 'background', 'box-shadow']
  const compositeProps = ['transform', 'opacity']

  if (layoutProps.includes(property)) return 'layout'
  if (paintProps.includes(property)) return 'paint'
  if (compositeProps.includes(property)) return 'composite'
  return 'unknown'
}`,
            },
          },
          {
            id: 'fe-1-2',
            title: 'AIが書いたコンポーネントをレビューする',
            minutes: 25,
            intro:
              'AIに「ボタンコンポーネント作って」と頼むと、一見動くコードが返ってきます。しかし本番で使える品質かは、あなたが判断しなければなりません。',
            content: [
              'AI生成コードによくある問題: **アクセシビリティの欠如**、**不要な再レンダリング**、**エラー処理の欠如**、**ハードコードされた値** です。',
              '例えば `<div onClick={...}>` は動きますが、キーボード操作できず、スクリーンリーダーにも認識されません。`<button>` を使うべきです。',
              '再レンダリング問題では、インラインのオブジェクトや関数が毎回新しい参照を作り、子コンポーネントの `memo` を無効化するパターンが典型です。',
              'レビューのコツは「動くか」ではなく「**壊れる条件を列挙する**」こと。ネットワークが遅い時は？ 空データの時は？ 日本語と英語が混ざった長いテキストは？',
            ],
            points: [
              'div onClick → button を使う（a11y）',
              'インラインオブジェクトは毎回新しい参照を作る',
              'レビューは「壊れる条件の列挙」から',
            ],
            codeExercise: {
              prompt: 'AIに「ユーザー一覧を表示するコンポーネント」を書かせたところ、以下のコードが返ってきました。本番投入前にあなたが指摘すべき最も重大な問題はどれ？',
              code: `function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <div>
      {users.map(u => (
        <div onClick={() => alert(u.name)}>
          {u.name}
        </div>
      ))}
    </div>
  )
}`,
              question: 'このコードの最も重大な問題は？',
              hint: '「動くか」ではなく「壊れる条件」を列挙してみましょう。APIが失敗したら？ ネットワークが遅かったら？ 結果が0件だったら？ — 画面はユーザーに何を伝えるでしょうか。',
              options: [
                { text: 'key prop がない', correct: false, why: '確かに指摘事項ですが「最も重大」ではありません。警告レベルの問題です。' },
                { text: 'フェッチのエラー処理とローディング状態がない', correct: true, why: '正解！APIが失敗すると画面は永遠に空のまま、ユーザーには何も伝わりません。エラー・ローディング・空状態の3状態設計はUIの基本です。' },
                { text: 'div onClick でボタンを作っている', correct: false, why: 'アクセシビリティ上の重要な指摘ですが、機能的には動作します。エラー処理欠如は機能が壊れる問題なのでより重大です。' },
                { text: 'useStateの型指定がない', correct: false, why: 'TypeScriptでは推論が効くため致命的ではありません。' },
              ],
            },
            codingChallenge: {
              prompt:
                'XSS対策の基礎であるHTMLエスケープ関数を書いてください。文字列中の & < > " をそれぞれ &amp; &lt; &gt; &quot; に置換して返します。重要: & は最初に置換しないと、後で置換した &lt; 等の & が二重エスケープされます。',
              functionName: 'escapeHtml',
              signature: 'function escapeHtml(str)',
              starterCode: `function escapeHtml(str) {
  // replace() をチェーンする。& の置換が最優先！

}`,
              tests: [
                { description: "'<b>' → '&lt;b&gt;'", script: "fn('<b>')", expected: '"&lt;b&gt;"' },
                { description: "'a & b' → 'a &amp; b'", script: "fn('a & b')", expected: '"a &amp; b"' },
                { description: '二重エスケープされない', script: "fn('&lt;')", expected: '"&amp;lt;"' },
                { description: '引用符も変換', script: 'fn(\'say "hi"\')', expected: '"say &quot;hi&quot;"' },
              ],
              hints: [
                "return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')... の順にチェーン",
                '& を最初に置換する理由: 後から &lt; を置換すると、その中の & が再度変換されてしまう',
              ],
              solution: `function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}`,
            },
          },
        ],
      },
      {
        id: 'fe-state',
        title: '第2章: 状態管理の設計',
        description: 'useState、Context、外部ライブラリ…何をいつ使うかの判断基準。',
        lessons: [
          {
            id: 'fe-2-1',
            title: '状態の置き場所を設計する',
            minutes: 25,
            intro:
              '「状態をどこに置くか」はフロントエンド設計の最重要テーマです。場所を間違えると、バグの温床になります。',
            content: [
              '状態は **スコープの最小化** が原則です。1つのコンポーネントでしか使わないなら `useState`、兄弟間で共有なら共通の親へ **リフトアップ**、ページをまたぐならURL・Context・外部ストアを検討します。',
              '実は多くの「状態」は **サーバーのデータのキャッシュ** に過ぎません。これを `useEffect + useState` で手管理するのはアンチパターンです。TanStack Query などの **サーバー状態管理ライブラリ** を使いましょう。',
              'URLに状態を持たせると、**共有・ブックマーク・戻るボタン** が無料で手に入ります。検索条件やタブの選択はURLに置くのが鉄則です。',
              '判断フロー: ①URLで表現できる？ ②サーバーのデータ？ ③どの範囲で共有？ この順で問うと迷いません。',
            ],
            points: [
              '状態はスコープ最小化の原則',
              'サーバーデータはキャッシュとして管理（useEffect手管理は非推奨）',
              '検索条件・タブ選択はURLに置く',
            ],
            quiz: {
              question: '商品検索画面の「絞り込み条件」を管理する最適な場所は？',
              hint: '判断フローを思い出しましょう: ①URLで表現できる？ ②サーバーのデータ？ ③どの範囲で共有？ 「検索結果を同僚にURLで送りたい」という場面を想像すると答えが見えます。',
              options: [
                { text: 'グローバルストア（Redux等）', correct: false, why: 'グローバル化すると画面を離れても残り続け、予期せぬ動作の原因になります。' },
                { text: 'URLクエリパラメータ', correct: true, why: '正解！検索条件をURLに置けば、結果の共有・ブックマーク・ブラウザの戻るボタンがすべて自然に動きます。' },
                { text: 'localStorage', correct: false, why: '永続化には便利ですが、URLを共有しても条件が伝わらず、タブ間で不整合が起きます。' },
                { text: 'コンポーネントのuseState', correct: false, why: '画面内では動きますが、リロードや共有で状態が消え、UXを損ないます。' },
              ],
            },
            codingChallenge: {
              prompt:
                '検索条件をURLに持たせる練習です。条件オブジェクトからクエリ文字列を組み立てる関数を書いてください。params = { q, category, page } を受け取り \'/search?q=...&category=...&page=...\' の形式で返します。値が undefined/null/空文字 のキーは除外し、値は encodeURIComponent でエンコードしてください。キーの順番はオブジェクトの定義順（Object.entries）とします。',
              functionName: 'buildSearchUrl',
              signature: 'function buildSearchUrl(params)',
              starterCode: `function buildSearchUrl(params) {
  // Object.entries(params) で [キー, 値] のペアをループ
  // 値が falsy なものは除外し、key=value を & で連結

}`,
              tests: [
                { description: '全パラメータあり', script: "fn({q:'shoes',category:'sports',page:2})", expected: '"/search?q=shoes&category=sports&page=2"' },
                { description: '空文字とundefinedは除外', script: "fn({q:'',category:'books',page:undefined})", expected: '"/search?category=books"' },
                { description: '日本語はエンコード', script: "fn({q:'靴'})", expected: '"/search?q=%E9%9D%B4"' },
                { description: '条件なしならパスのみ', script: 'fn({})', expected: '"/search"' },
              ],
              hints: [
                'const pairs = Object.entries(params).filter(([k, v]) => v) で有効なものだけ残す',
                'pairs.map(([k, v]) => k + \'=\' + encodeURIComponent(v)).join(\'&\') でクエリ部分を作る',
                'クエリが空なら \'/search\' だけを返し、あれば \'/search?\' + query',
              ],
              solution: `function buildSearchUrl(params) {
  const query = Object.entries(params)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => key + '=' + encodeURIComponent(value))
    .join('&')
  return query ? '/search?' + query : '/search'
}`,
            },
          },
          {
            id: 'fe-2-2',
            title: 'フォームとバリデーションの設計',
            minutes: 20,
            intro:
              'フォームは「入力を受け取る」だけに見えて、実はエラー表示のタイミング、送信中の二重送信防止、楽観的更新など設計論点が最も詰まったUIです。',
            content: [
              'バリデーションのタイミングには流派があります: **onBlur**（フォーカスアウト時）が最もバランスが良く、onChange（入力毎）はうるさくなりがち、onSubmitのみは不親切です。',
              '送信中は必ずボタンを **disabled** に。二重送信は決済システムでは致命的なバグになります。',
              'サーバーエラーの表示設計も重要です。「エラーが発生しました」だけではユーザーは直せません。**どのフィールドが、なぜダメか** をフィールドの近くに表示します。',
              'AIにフォームを書かせると「happy path」しか実装されません。異常系（ネットワーク断、バリデーションエラー、セッション切れ）のチェックリストを持ちましょう。',
            ],
            points: [
              'バリデーションはonBlur基準がバランス良し',
              '送信中はdisabledで二重送信防止',
              '異常系のチェックリストを持つ',
            ],
            codingChallenge: {
              prompt:
                '学んだ知識を使って、実際にバリデーション関数を書いてみましょう。要件: ①nameは必須・50文字以内 ②emailは必須・「@」を含むこと ③passwordは必須・8文字以上・英字と数字を両方含むこと。戻り値は { valid: boolean, errors: オブジェクト } で、エラーメッセージはフィールド名をキーにして格納します（例: errors.name = \'名前は必須です\'）。',
              functionName: 'validateSignup',
              signature: 'function validateSignup(values)  // values = { name, email, password }',
              starterCode: `function validateSignup(values) {
  const errors = {}

  // ここにバリデーションを実装

  return {
    valid: Object.keys(errors).length === 0,
    errors: errors,
  }
}`,
              tests: [
                {
                  description: '正常な入力は valid: true を返す',
                  script: "fn({name:'田中太郎',email:'tanaka@example.com',password:'abcd1234'}).valid",
                  expected: 'true',
                },
                {
                  description: '正常な入力は errors が空オブジェクト',
                  script: "Object.keys(fn({name:'田中太郎',email:'tanaka@example.com',password:'abcd1234'}).errors).length",
                  expected: '0',
                },
                {
                  description: '名前が空なら valid: false',
                  script: "fn({name:'',email:'t@example.com',password:'abcd1234'}).valid",
                  expected: 'false',
                },
                {
                  description: '名前が空なら errors.name にメッセージが入る',
                  script: "typeof fn({name:'',email:'t@example.com',password:'abcd1234'}).errors.name === 'string'",
                  expected: 'true',
                },
                {
                  description: '「@」のないメールアドレスは errors.email が入る',
                  script: "'email' in fn({name:'田中',email:'invalid-email',password:'abcd1234'}).errors",
                  expected: 'true',
                },
                {
                  description: '7文字のパスワードはエラー（8文字以上が必要）',
                  script: "'password' in fn({name:'田中',email:'t@example.com',password:'abc1234'}).errors",
                  expected: 'true',
                },
                {
                  description: '数字のみ8文字のパスワードもエラー（英字が必要）',
                  script: "'password' in fn({name:'田中',email:'t@example.com',password:'12345678'}).errors",
                  expected: 'true',
                },
              ],
              hints: [
                '空チェックは if (!values.name) のように書ける。空文字列は falsy であることを利用する',
                '英字を含むかの判定: /[a-zA-Z]/.test(values.password)、数字は /[0-9]/',
                'エラーメッセージは日本語で具体的に。「何が」「どう」ダメかを書くのがこのレッスンの肝',
              ],
              solution: `function validateSignup(values) {
  const errors = {}

  if (!values.name) {
    errors.name = '名前は必須です'
  } else if (values.name.length > 50) {
    errors.name = '名前は50文字以内で入力してください'
  }

  if (!values.email) {
    errors.email = 'メールアドレスは必須です'
  } else if (!values.email.includes('@')) {
    errors.email = 'メールアドレスの形式が正しくありません'
  }

  if (!values.password) {
    errors.password = 'パスワードは必須です'
  } else if (values.password.length < 8) {
    errors.password = 'パスワードは8文字以上で設定してください'
  } else if (!/[a-zA-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    errors.password = 'パスワードは英字と数字を両方含めてください'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: errors,
  }
}`,
            },
          },
        ],
      },
      {
        id: 'fe-design',
        title: '第3章: UI/UXデザインの基礎',
        description: '配色・タイポグラフィからアクセシビリティ、一貫性のあるコンポーネント設計まで。',
        lessons: [
          {
            id: 'fe-3-1',
            title: '配色・タイポグラフィ・余白の原則',
            minutes: 20,
            intro:
              '「デザインセンスがない」と諦める前に、いくつかの原則を知るだけで見た目は大きく改善します。この道場自体のデザインも、その原則の実例です。',
            content: [
              '**配色** は「メイン+アクセント+グレースケール」の最小構成から始めると失敗しません。この道場も背景は`dojo-900`系のダーク基調（グレースケール）に、`amber-400`（アクセント）を要所に使う構成です。',
              '**タイポグラフィ** では、見出しと本文のサイズ差で情報の階層を伝えます。全て同じ大きさの文字では、どこが重要か伝わりません。',
              '**余白（ホワイトスペース）** は「何も無い部分」ではなく「情報を区切る道具」です。詰め込みすぎた画面より、適度な余白がある画面の方が理解しやすくなります。',
              '**コントラスト比** も重要な指標です。WCAG（Web Content Accessibility Guidelines）は本文で4.5:1以上を推奨しています。薄いグレー文字を白背景に置くと、読みにくいだけでなく一部のユーザーには読めません。',
            ],
            points: [
              '配色は「メイン+アクセント+グレースケール」の最小構成',
              '見出しと本文のサイズ差で情報階層を伝える',
              'コントラスト比はWCAG推奨の4.5:1を目安に',
            ],
            quiz: {
              question: '文字色#999999・背景色#FFFFFFの本文がある。このデザインの問題点は？',
              hint: '薄いグレー文字を白背景に置くと、コントラスト比はどうなるでしょうか。WCAGが推奨する目安（4.5:1）と比較して考えてみましょう。',
              options: [
                { text: 'コントラスト比が低く読みにくい', correct: true, why: '正解！#999999と#FFFFFFのコントラスト比はおよそ2.8:1で、WCAG推奨の4.5:1を大きく下回ります。視力の弱いユーザーや強い光の下では文字が読めなくなります。' },
                { text: 'グレーはアクセントカラーとして不適切', correct: false, why: 'グレーは本文やグレースケールの一部として適切な色です。問題はコントラスト比の低さです。' },
                { text: 'フォントサイズが小さすぎる', correct: false, why: '文字色と背景色の組み合わせの話であり、フォントサイズについては言及されていません。' },
              ],
            },
          },
          {
            id: 'fe-3-2',
            title: 'アクセシビリティの基礎',
            minutes: 20,
            intro:
              '「見た目が良い」と「使いやすい」は別物です。アクセシビリティは、あらゆる状況のユーザーが使えるようにする設計思想です。',
            content: [
              '**アクセシビリティ（a11y）** とは、視覚・聴覚・運動機能などに制約があるユーザーも含めて、誰もが使えるようにする考え方です。',
              '画像には **alt属性** を、フォーム部品には **label要素** を必ず紐付けます。スクリーンリーダーはこれらの情報を読み上げてユーザーに伝えます。',
              '**キーボード操作** だけで全ての機能を使えるようにすることも重要です。マウスを使えない・使わないユーザーは想像以上に多くいます。',
              '**色だけで情報を伝えない** ことも原則の一つです。この道場のスキルチェックが「◎/○/△」の記号とテキストを併用しているのは、色覚特性のあるユーザーにも伝わるようにするための好例です。',
              'アクセシビリティは特別な少数派のためだけではなく、**一時的な制約**（腕を怪我してマウスが使えない、屋外で画面が見えにくい等）を含めた全ユーザーの使いやすさに繋がります。',
            ],
            points: [
              '画像にはalt属性、フォームにはlabel要素を付ける',
              'キーボード操作だけで機能を使えるようにする',
              '色だけで情報を伝えない（テキストや記号も併用）',
            ],
            quiz: {
              question: '`<img src="delete.png">` にalt属性が無い。何が問題か？',
              hint: 'スクリーンリーダーを使っているユーザーは、画像そのものを見ることができません。alt属性が無いと、その画像が何を意味するのかどう伝わるでしょうか。',
              options: [
                { text: 'スクリーンリーダー利用者に画像の意味が伝わらない', correct: true, why: '正解！alt属性が無いと、スクリーンリーダーは画像の内容を読み上げられず、視覚に障害のあるユーザーには「削除ボタン」であることが伝わりません。' },
                { text: '画像の読み込みが遅くなる', correct: false, why: 'alt属性の有無は画像の読み込み速度には影響しません。' },
                { text: 'SEOには関係ない', correct: false, why: '実際にはaltはSEOにも影響しますが、この設問における「最も重大な問題」はアクセシビリティの欠如です。' },
              ],
            },
          },
          {
            id: 'fe-3-3',
            title: '一貫性のあるUIコンポーネント設計',
            minutes: 20,
            intro:
              '同じ「削除」でも画面ごとに見た目が違うアプリは、ユーザーを混乱させます。一貫性のあるコンポーネント設計は、使いやすさと開発効率の両方を支えます。',
            content: [
              '**デザインシステム** とは、色・フォント・コンポーネントのルールを一箇所にまとめる考え方です。このコードベースの`colorMap`（トラックごとの色を静的に列挙する仕組み）も、小さなデザインシステムの一例です。',
              '**コンポーネントの再利用性** を意識すると、同じボタンやカードを何度も作り直さずに済み、見た目の一貫性も自然に保たれます。',
              'ボタンには **状態（通常/ホバー/押下/無効化）** があります。これらの見た目の違いをきちんと設計すると、ユーザーは「今何ができるか」を直感的に理解できます。',
              'コンポーネント設計は見た目の話だけではありません。**「どんなpropsを受け取るか」というAPI設計の側面** も持ちます。UIとAPI設計、両方の視点が必要です。',
            ],
            points: [
              'デザインシステムは色・フォント・コンポーネントのルールをまとめる',
              'ボタンの状態（通常/ホバー/押下/無効化）を視覚化する',
              'コンポーネント設計はUIとAPI設計の両面を持つ',
            ],
            codeExercise: {
              prompt: 'あるアプリの3つの画面で、それぞれ別々に実装された「削除」ボタンです。',
              code: `// 画面A
<button style="background:red;color:white;padding:8px">削除</button>

// 画面B
<button class="btn-danger" style="border-radius:20px">削除する</button>

// 画面C
<a href="#" onClick={handleDelete}>削除</a>`,
              question: 'これら3つの実装に共通する最も重大な問題は？',
              hint: '同じ「削除」という操作なのに、色・形・タグ（button vs a）がバラバラです。ユーザーがアプリのどの画面を見ても同じように振る舞ってほしい操作について、これは何を引き起こすでしょうか。',
              options: [
                { text: '一貫性の欠如', correct: true, why: '正解！同じ操作なのに見た目もマークアップも画面ごとにバラバラで、ユーザーは「これは同じ操作なのか」と混乱します。共通の削除ボタンコンポーネントとして1つにまとめるべきです。また画面Cは`<a>`タグでボタンの役割を担っており、アクセシビリティの観点でも問題があります。' },
                { text: '色が全て赤系統で統一されすぎている', correct: false, why: '危険な操作を赤系統の色で統一すること自体はむしろ良い実践です。問題は形・タグ・ラベルがバラバラなことです。' },
                { text: 'コメントが日本語と英語混在', correct: false, why: 'コード中のコメント言語は今回の問題とは無関係です。' },
              ],
            },
          },
        ],
      },
    ],
  },

  {
    id: 'backend',
    title: 'バックエンド開発',
    category: 'tech',
    icon: 'fa-server',
    color: 'emerald',
    tagline: 'ビジネスロジックと信頼性の砦',
    description:
      'API設計、認証・認可、トランザクション、エラーハンドリング。バックエンドは「壊れたらビジネスが止まる」領域。堅牢性の設計思想を学ぶ。',
    outcomes: [
      'REST APIを一貫性のある規約で設計できる',
      '認証と認可の違いを説明し、実装できる',
      '冪等性・トランザクションを考慮したAPIが書ける',
      'エラーレスポンスを利用者視点で設計できる',
    ],
    chapters: [
      {
        id: 'be-api',
        title: '第1章: API設計',
        description: '変更に強く、使いやすいAPIの設計原則。',
        lessons: [
          {
            id: 'be-1-1',
            title: 'REST APIの一貫性設計',
            minutes: 25,
            intro:
              'APIは「一度公開したら簡単には変えられない」契約です。場当たり的な命名は後の開発者（未来の自分含む）を苦しめます。',
            content: [
              'URLは **名詞の複数形** でリソースを表します: `/users/123/orders` 。動詞（`/getUser`）は使いません。操作はHTTPメソッド（GET/POST/PATCH/DELETE）で表現します。',
              'HTTPステータスコードを正しく使いましょう。`200` で `{success: false, error: ...}` を返すAPIは監視ツールと相性が悪く、クライアント側の処理も複雑になります。',
              'よく使うコード: `200` 成功、`201` 作成、`400` リクエスト不正、`401` 未認証、`403` 権限なし、`404` 存在しない、`409` 競合、`422` バリデーションエラー、`500` サーバーエラー。',
              'ページネーションは最初から設計に入れましょう。`GET /users?cursor=abc&limit=20` のような **カーソル方式** は、データ追加があっても重複・欠落が起きにくい方式です。',
              '破壊的変更が必要な時は **バージョニング**（`/v1/users`）や後方互換の維持戦略が必要です。「追加は安全、削除・変更は危険」と覚えましょう。',
            ],
            points: [
              'URLは名詞、操作はHTTPメソッド',
              'ステータスコードを正しく使う（200でエラーを返さない）',
              '追加は安全、削除・変更は危険（後方互換）',
            ],
            quiz: {
              question: '注文APIで「在庫不足で注文を作成できなかった」場合、返すべきステータスコードは？',
              hint: 'まず大分類を考えます: リクエスト自体は正しい（4xx系）？ サーバーの障害（5xx系）？ 成功（2xx系）？ その上で「現在のリソース状態と矛盾している」ことを表すコードはどれでしょう。',
              options: [
                { text: '200 OK + エラーメッセージ', correct: false, why: '成功を示す200で失敗を返すと、監視・リトライ・クライアント実装のすべてが壊れます。' },
                { text: '500 Internal Server Error', correct: false, why: '500はサーバー側の予期せぬ障害用です。在庫不足は正常なビジネスルールの結果です。' },
                { text: '409 Conflict または 422 Unprocessable Entity', correct: true, why: '正解！リクエスト自体は正しいが、現在のリソース状態と矛盾するため409/422が適切です。クライアントは「在庫を確認して再表示」という適切な対処ができます。' },
                { text: '404 Not Found', correct: false, why: '404はリソースが存在しない場合です。商品は存在するが在庫がない、という状態とは異なります。' },
              ],
            },
            codingChallenge: {
              prompt:
                'ステータスコードの対応表をコードで実装してください。状況を表す文字列を受け取り、適切なHTTPステータスコード（数値）を返します。対応: \'success\'→200, \'created\'→201, \'bad_request\'→400, \'unauthorized\'→401, \'forbidden\'→403, \'not_found\'→404, \'conflict\'→409。未定義の状況は 500 を返してください。',
              functionName: 'httpStatusFor',
              signature: 'function httpStatusFor(situation)',
              starterCode: `function httpStatusFor(situation) {
  // オブジェクトの対応表（マップ）を使うと if 文の羅列より簡潔

}`,
              tests: [
                { description: "'success' → 200", script: "fn('success')", expected: '200' },
                { description: "'created' → 201", script: "fn('created')", expected: '201' },
                { description: "'not_found' → 404", script: "fn('not_found')", expected: '404' },
                { description: "'conflict' → 409", script: "fn('conflict')", expected: '409' },
                { description: '未定義 → 500', script: "fn('unknown_thing')", expected: '500' },
              ],
              hints: [
                'const table = { success: 200, created: 201, ... } のように定義',
                'return table[situation] ?? 500 — ?? は「左が undefined/null なら右」を返す演算子',
              ],
              solution: `function httpStatusFor(situation) {
  const table = {
    success: 200,
    created: 201,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    conflict: 409,
  }
  return table[situation] ?? 500
}`,
            },
          },
          {
            id: 'be-1-2',
            title: '冪等性: 二重送信・リトライに耐える設計',
            minutes: 25,
            intro:
              'ネットワークは不安定です。ユーザーは連打します。決済APIが「2回呼ばれたら2回課金される」設計だと、事故になります。',
            content: [
              '**冪等性（べきとうせい）** とは「同じ操作を何度実行しても結果が同じ」になる性質です。GETやDELETEは本来冪等ですが、POSTは冪等ではありません。',
              '解決策の代表例が **冪等キー（Idempotency Key）** です。クライアントが一意のキーを付けて送信し、サーバーは「このキーは処理済み」を記録して、2回目以降は最初の結果を返します。Stripeなどの決済APIはすべてこの方式です。',
              'データベースレベルでは **ユニーク制約** が最後の砦です。「アプリ側でチェックしてからINSERT」はレースコンディションで必ずすり抜けます。制約に頼りましょう。',
              '「支払い」「注文」「予約」など、重複が許されない処理を見つけたら、冪等性の設計を必ず問う癖をつけましょう。',
            ],
            points: [
              '冪等性 = 何度実行しても同じ結果',
              '冪等キーでリトライを安全にする',
              'ユニーク制約がレースコンディションの最後の砦',
            ],
            codeExercise: {
              prompt: '後輩が書いた注文APIのコードをレビューしています。決済を含む重要なエンドポイントです。',
              code: `app.post('/api/orders', async (c) => {
  const { userId, itemId } = await c.req.json()

  // 在庫チェック
  const item = await db.getItem(itemId)
  if (item.stock <= 0) {
    return c.json({ error: 'out of stock' }, 400)
  }

  // 在庫を減らす
  await db.updateItem(itemId, { stock: item.stock - 1 })

  // 注文作成
  const order = await db.createOrder({ userId, itemId })

  return c.json(order, 201)
})`,
              question: 'このコードの最も危険な問題は？',
              hint: '2人のユーザーが「在庫1」の商品に同時に注文したら何が起きるか、コードを1行ずつ頭の中で実行してみましょう。チェックと更新の間に別のリクエストが割り込めないかがポイントです。',
              options: [
                { text: '変数名が省略されていて読みにくい', correct: false, why: '命名は改善点ですが、危険度は低いです。' },
                { text: 'チェックと更新の分離により、同時リクエストで在庫がマイナスになる', correct: true, why: '正解！2つのリクエストが同時に stock=1 を読むと、両方とも注文が作成され在庫が-1に。これは「TOCTOU競合」と呼ばれ、トランザクション+排他制御（SELECT ... FOR UPDATEや原子的UPDATE）で防ぎます。' },
                { text: 'エラーメッセージが英語である', correct: false, why: 'APIのエラーメッセージは英語でも実用上問題ありません。' },
                { text: 'バリデーションがない', correct: false, why: '確かに指摘事項ですが、在庫競合はビジネス損害に直結するため優先度が上です。' },
              ],
            },
            codingChallenge: {
              prompt:
                '冪等キーを使った決済処理の判定関数を実装してください。processedKeys（処理済み冪等キーの配列）と今回のキーを受け取り、処理済みなら \'duplicate\'、未処理なら \'charged\' を返してください。',
              functionName: 'checkPayment',
              signature: 'function checkPayment(processedKeys, key)',
              starterCode: `function checkPayment(processedKeys, key) {
  // processedKeys に key が含まれるかで分岐

}`,
              tests: [
                { description: '処理済みキー → duplicate', script: "fn(['k1','k2'], 'k1')", expected: '"duplicate"' },
                { description: '新規キー → charged', script: "fn(['k1','k2'], 'k3')", expected: '"charged"' },
                { description: '空の履歴 → charged', script: "fn([], 'k1')", expected: '"charged"' },
              ],
              hints: [
                'processedKeys.includes(key) で処理済みか判定できる',
                "return processedKeys.includes(key) ? 'duplicate' : 'charged' の1行でも書ける",
              ],
              solution: `function checkPayment(processedKeys, key) {
  return processedKeys.includes(key) ? 'duplicate' : 'charged'
}`,
            },
          },
        ],
      },
      {
        id: 'be-auth',
        title: '第2章: 認証と認可',
        description: '「誰であるか」と「何をしてよいか」を分けて設計する。',
        lessons: [
          {
            id: 'be-2-1',
            title: '認証(Authentication)と認可(Authorization)の違い',
            minutes: 20,
            intro:
              'セキュリティ事故の多くは、認証はあるのに認可チェックが抜けているケースです。この2つを明確に区別しましょう。',
            content: [
              '**認証** = 「あなたは誰か」を確認する（ログイン）。**認可** = 「あなたはこれをしてよいか」を判定する（権限）。',
              '典型的な脆弱性が **IDOR**（直接的なオブジェクト参照の脆弱性）です。`/api/orders/123` の `123` を `124` に変えたら他人の注文が見える…という事故は、認可チェックの欠如が原因です。',
              '対策はシンプル: **すべてのリソースアクセスで「このリソースはこのユーザーのものか」を検証する**。URLにIDがあるだけでは何の保証にもなりません。',
              '「フロントでボタンを非表示にしているから安全」は間違いです。悪意あるユーザーはcurlで直接APIを叩けます。**認可は必ずサーバー側で** 行います。',
            ],
            points: [
              '認証=誰か、認可=何をしてよいか',
              'IDOR: URLのIDを変えるだけで他人のデータが見える事故',
              '認可は必ずサーバー側で検証する',
            ],
            codingChallenge: {
              prompt:
                '認可チェック関数を実装してください。要件: ①管理者（role が \'admin\'）は全ての注文を閲覧できる ②一般ユーザーは自分の注文（order.userId と user.id が一致）のみ閲覧できる ③未ログイン（user が null）の場合は一切閲覧できない。戻り値は boolean（閲覧可: true / 不可: false）。',
              functionName: 'canViewOrder',
              signature: 'function canViewOrder(user, order)',
              starterCode: `// user: { id: number, role: 'admin' | 'user' } または null
// order: { userId: number, total: number }
function canViewOrder(user, order) {
  // ここに実装

}`,
              tests: [
                {
                  description: '管理者は他人の注文も閲覧できる',
                  script: "fn({id:99,role:'admin'},{userId:1,total:500})",
                  expected: 'true',
                },
                {
                  description: '一般ユーザーは自分の注文を閲覧できる',
                  script: "fn({id:1,role:'user'},{userId:1,total:500})",
                  expected: 'true',
                },
                {
                  description: '一般ユーザーは他人の注文を閲覧できない（IDOR防止）',
                  script: "fn({id:1,role:'user'},{userId:2,total:500})",
                  expected: 'false',
                },
                {
                  description: '未ログイン（null）は自分の注文にも見えるIDでも閲覧不可',
                  script: "fn(null,{userId:1,total:500})",
                  expected: 'false',
                },
                {
                  description: 'admin 以外の文字列（例: \'manager\'）は管理者扱いしない',
                  script: "fn({id:1,role:'manager'},{userId:2,total:500})",
                  expected: 'false',
                },
              ],
              hints: [
                '最初に user が null の場合を早期リターンで弾くと、以降の処理が安全になる',
                '管理者チェックは所有者チェックより「先」に書く（順序が重要）',
                '最後は return order.userId === user.id の1行で書ける',
              ],
              solution: `function canViewOrder(user, order) {
  // 未ログインは一切不可
  if (!user) return false

  // 管理者は全件OK
  if (user.role === 'admin') return true

  // 一般ユーザーは自分の注文のみ
  return order.userId === user.id
}`,
            },
            quiz: {
              question: '「マイページ画面では自分の注文へのリンクしか表示していない。API側の認可チェックは省略した」という設計の問題点は？',
              hint: '悪意あるユーザーはブラウザの画面だけを使うとは限りません。curl や DevTools で API を直接呼んだらどうなるか、IDOR（URLのID書き換え）の観点で考えてみましょう。',
              options: [
                { text: '問題ない。UIで制御できているため', correct: false, why: 'UIの非表示はセキュリティ対策ではありません。' },
                { text: 'APIを直接叩かれると他人の注文にアクセスできる', correct: true, why: '正解！curlやブラウザのDevToolsで誰でもAPIを直接呼べます。UIの制御は「利便性」であり「防御」ではありません。認可は必ずサーバー側で。' },
                { text: '画面の表示速度が遅くなる', correct: false, why: 'パフォーマンスの話ではなく、セキュリティの根本的な問題です。' },
                { text: '保守性が下がる', correct: false, why: '保守性以前に、セキュリティホールとして即座に修正が必要な問題です。' },
              ],
            },
          },
          {
            id: 'be-2-2',
            title: '他人のコードのセキュリティを読む',
            minutes: 25,
            intro:
              '実務では、他人（またはAI）が書いたコードのセキュリティを評価する場面が頻繁にあります。典型的な脆弱性パターンを「見つける目」を養いましょう。',
            content: [
              'コードレビューでまず見るべき箇所: **SQLの組み立て**（文字列連結があれば即NG）、**認可チェックの有無**、**機密情報のハードコード**、**ユーザー入力の信頼**。',
              'SQLインジェクションは今も上位の脆弱性です。`"SELECT * FROM users WHERE id = " + userId` というコードを見たら、即座にストップをかけましょう。プレースホルダ（`?` や `$1`）を使います。',
              'パスワードの平文保存、APIキーのコード直書きも典型的な事故です。秘密情報は環境変数・シークレット管理サービスへ。',
              'レビュー指摘の際は「このコードはダメ」ではなく「**どう攻撃されるか**」を説明すると、相手に伝わり、チームの学びにもなります。',
            ],
            points: [
              'SQLの文字列連結を見たら即指摘',
              '秘密情報のハードコードは絶対NG',
              '指摘は「攻撃シナリオ」で説明する',
            ],
            codeExercise: {
              prompt: 'チームの既存コードを読んでいます。ログイン機能の一部です。',
              code: `app.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  const user = await db.query(
    "SELECT * FROM users WHERE email = '" + email + "'"
  )

  if (user && user.password === password) {
    const token = createToken(user.id)
    return c.json({ token })
  }
  return c.json({ error: 'invalid' }, 401)
})`,
              question: 'このコードに含まれる脆弱性の組み合わせとして正しいものは？',
              hint: '2箇所に注目してください: ①SQL文を「文字列連結」で組み立てている部分（emailに攻撃用文字列が入ったら？）②パスワードを「そのまま === で比較」している部分（DBに平文で保存されているという意味です）。',
              options: [
                { text: 'SQLインジェクション + パスワード平文比較', correct: true, why: '正解！emailの文字列連結はSQLインジェクションを許し（例: emailに \' OR \'1\'=\'1 を入力）、passwordの平文比較はDBに平文保存されていることを意味します。bcrypt等のハッシュ比較が必須です。' },
                { text: 'XSS + CSRF', correct: false, why: 'このコード片にはHTML出力（XSS）やフォーム送信（CSRF）の要素が含まれていません。' },
                { text: '問題なし。正しく動作する', correct: false, why: '動作はしますが、2つの重大な脆弱性があります。本番には絶対に出せません。' },
                { text: 'レースコンディションのみ', correct: false, why: 'ログイン処理にレースコンディションの問題はほぼありません。もっと根本的な問題があります。' },
              ],
            },
            codingChallenge: {
              prompt:
                'SQLインジェクションの「兆候」を検出する関数を書いてください。ユーザー入力の文字列を受け取り、シングルクォート(\')、ダブルハイフン(--)、セミコロン(;) のいずれかを含む場合は true（危険）、含まない場合は false を返します。',
              functionName: 'detectSqlInjection',
              signature: 'function detectSqlInjection(input)',
              starterCode: `function detectSqlInjection(input) {
  // ' と -- と ; のいずれかを含むか判定

}`,
              tests: [
                { description: "' OR '1'='1 → true", script: "fn(\"' OR '1'='1\")", expected: 'true' },
                { description: 'admin\'-- → true', script: 'fn("admin\'--")', expected: 'true' },
                { description: '1; DROP TABLE → true', script: "fn('1; DROP TABLE users')", expected: 'true' },
                { description: '普通の文字列 → false', script: "fn('tanaka@example.com')", expected: 'false' },
              ],
              hints: [
                "input.includes(\"'\") || input.includes('--') || input.includes(';') を返す",
                '「いずれかを含む」は ||（OR）でつなぐ。some() を使っても書ける',
              ],
              solution: `function detectSqlInjection(input) {
  return input.includes("'") || input.includes('--') || input.includes(';')
}`,
            },
          },
        ],
      },
    ],
  },

  {
    id: 'infrastructure',
    title: 'インフラ・運用',
    category: 'tech',
    icon: 'fa-cloud',
    color: 'orange',
    tagline: '「動く」から「動き続ける」へ',
    description:
      'デプロイ、監視、ログ、障害対応、安全な変更。本番環境を「壊さずに変え続ける」ための技術と文化を学ぶ。',
    outcomes: [
      'デプロイ戦略（ローリング/カナリア等）を説明できる',
      'ログ・メトリクス・トレースの使い分けができる',
      '障害時の初動（切り分けとエスカレーション）ができる',
      '変更の影響範囲を事前に洗い出せる',
    ],
    chapters: [
      {
        id: 'infra-deploy',
        title: '第1章: 安全なデプロイと変更管理',
        description: '本番環境を安全に変更するための設計と手順。',
        lessons: [
          {
            id: 'infra-1-1',
            title: '本番変更の安全設計',
            minutes: 25,
            intro:
              '「他人が利用する本番環境を安全に変更する」はエンジニアの信頼の土台です。一度の障害で失われる信頼は、積み上げに何倍もの時間がかかります。',
            content: [
              '安全な変更の原則は **小さく、可逆的に、観測可能に** です。大きな変更は分割し、いつでも元に戻せる状態を保ち、変更後はメトリクスを監視します。',
              'デプロイ戦略: **ローリング**（順次入替）、**Blue-Green**（環境を2つ用意して切替）、**カナリア**（1%のユーザーにだけ新バージョンを出す）。リスクに応じて選びます。',
              'DBのスキーマ変更は特に危険です。カラム削除は「コードがまだ参照している」事故の元。安全な手順: ①新カラム追加 → ②両方に書くコードをデプロイ → ③移行 → ④旧カラム参照を削除 → ⑤旧カラム削除。これを **expand & contract** と呼びます。',
              '**ロールバック計画はデプロイ前に** 書きましょう。「戻せる」自信がない変更は、そもそもデプロイしてはいけません。',
            ],
            points: [
              '変更は小さく・可逆的に・観測可能に',
              'DBスキーマ変更はexpand & contract',
              'ロールバック計画はデプロイ前に作る',
            ],
            quiz: {
              question: '本番DBのカラム名を変更したい。最も安全な手順は？',
              hint: '「新旧どちらのコードが動いていても壊れない状態」を各ステップで維持できる手順を選びましょう。expand & contract（拡張してから縮小する）パターンがキーワードです。',
              options: [
                { text: 'ALTER TABLEで直接リネームし、同時にコードもデプロイする', correct: false, why: 'デプロイの瞬間、旧コードと新スキーマ（またはその逆）が混在する時間が生まれ、エラーが発生します。' },
                { text: '新カラム追加→両方書き込み→データ移行→コード切替→旧カラム削除、を段階的に行う', correct: true, why: '正解！expand & contractパターンです。各ステップが互換性を保つため、どの時点でもロールバック可能です。' },
                { text: '深夜のメンテナンス時間にサービスを止めて一括変更する', correct: false, why: 'サービス停止はユーザー体験を損ないます。無停止で移行できる設計が現代の標準です。' },
                { text: 'カラム名は変えず、コード側で別名として扱う', correct: false, why: '一時的な回避策としてはありですが、根本解決ではなく、技術的負債が残ります。' },
              ],
            },
            codingChallenge: {
              prompt:
                'expand & contract の移行手順をコードで表現します。現在のステップ名を受け取り、次のステップ名を返す関数を書いてください。順序: \'start\' → \'add-column\' → \'dual-write\' → \'backfill\' → \'switch-read\' → \'drop-column\' → \'done\'。\'done\' の次は \'done\' を返してください。',
              functionName: 'nextMigrationStep',
              signature: 'function nextMigrationStep(current)',
              starterCode: `function nextMigrationStep(current) {
  // ステップの配列を定義し、indexOf で現在地を調べて次を返す

}`,
              tests: [
                { description: "'start' → 'add-column'", script: "fn('start')", expected: '"add-column"' },
                { description: "'dual-write' → 'backfill'", script: "fn('dual-write')", expected: '"backfill"' },
                { description: "'drop-column' → 'done'", script: "fn('drop-column')", expected: '"done"' },
                { description: "'done' → 'done'", script: "fn('done')", expected: '"done"' },
              ],
              hints: [
                "const steps = ['start','add-column','dual-write','backfill','switch-read','drop-column','done']",
                'const i = steps.indexOf(current); return steps[i + 1] ?? \'done\'',
              ],
              solution: `function nextMigrationStep(current) {
  const steps = ['start', 'add-column', 'dual-write', 'backfill', 'switch-read', 'drop-column', 'done']
  const i = steps.indexOf(current)
  if (i === -1) return 'start'
  return steps[i + 1] ?? 'done'
}`,
            },
          },
          {
            id: 'infra-1-2',
            title: '障害対応の初動: 切り分けとエスカレーション',
            minutes: 20,
            intro:
              '障害時に求められるのは「すぐ直す」ことより「正しく状況を把握し、適切に連携する」ことです。パニックは最大の敵です。',
            content: [
              '初動の型: ①**影響の特定**（誰に・どの機能に・どれくらいの規模か）→ ②**直近の変更の確認**（障害の8割は変更が起点）→ ③**暫定対応**（ロールバック等）→ ④**根本原因の調査**。',
              '「まず直す」の罠: 原因不明のまま場当たり的に直すと、証拠が消えて再発します。**再現性と証拠（ログ）の確保** が先です。',
              'エスカレーションは「負け」ではありません。判断基準を予め決めておきます: 「30分調べて分からなければ上長に報告」「顧客影響があれば即共有」など。',
              '障害報告のテンプレ: **何が**（症状）・**いつから**（開始時刻）・**誰に影響**（範囲）・**今どういう状態**（対応状況）。この4点があれば関係者は動けます。',
            ],
            points: [
              '障害の8割は直近の変更が起点',
              '証拠（ログ）確保が先、修正は後',
              'エスカレーション基準を予め決めておく',
            ],
            quiz: {
              question: '本番で障害アラートが発火。あなたの最初の行動として最も適切なものは？',
              hint: '「まず直す」の罠を思い出してください。原因不明のまま修正を試みると、証拠（ログ）が消えて再発します。初動の型の①は何でしたか？',
              options: [
                { text: 'すぐにサーバーを再起動する', correct: false, why: '原因不明のまま再起動すると、ログやメモリダンプ等の証拠が失われ、根本原因の調査が不可能になります。' },
                { text: '影響範囲（誰に・どの機能に・どの程度）を特定し、直近の変更（デプロイ等）を確認する', correct: true, why: '正解！障害の8割は直近の変更が起点です。影響の特定と変更の確認が最初の2手。証拠を確保してから暫定対応（ロールバック等）に進みます。' },
                { text: '原因が分かるまで誰にも連絡せず調査に集中する', correct: false, why: '顧客影響がある障害で連絡を後回しにすると、被害が拡大します。エスカレーションは早いほど価値があります。' },
                { text: 'コードの怪しい部分をその場で修正してデプロイする', correct: false, why: '検証なしの本番デプロイは二次障害を招きます。まず暫定対応で被害を止め、根本原因は落ち着いて調査します。' },
              ],
            },
            codingChallenge: {
              prompt:
                '障害報告のテンプレ（何が・いつから・誰に影響・今の状態）を組み立てる関数を書いてください。引数は info = { what, since, impact, status }。戻り値は \'【障害報告】{what}が{since}から発生。影響: {impact}。現在: {status}\' の形式の文字列です。',
              functionName: 'formatIncidentReport',
              signature: 'function formatIncidentReport(info)',
              starterCode: `function formatIncidentReport(info) {
  // info.what / info.since / info.impact / info.status を埋め込む

}`,
              tests: [
                { description: '基本的な組み立て', script: "fn({what:'決済エラー',since:'14:05',impact:'全ユーザーの約3割',status:'ロールバック実施中'})", expected: '"【障害報告】決済エラーが14:05から発生。影響: 全ユーザーの約3割。現在: ロールバック実施中"' },
                { description: '別の内容でも組み立てられる', script: "fn({what:'ログイン失敗',since:'09:00',impact:'一部ユーザー',status:'調査中'})", expected: '"【障害報告】ログイン失敗が09:00から発生。影響: 一部ユーザー。現在: 調査中"' },
              ],
              hints: [
                'テンプレートリテラル: return \`【障害報告】\${info.what}が\${info.since}から発生。...\`',
                '文字列連結でも可: \'【障害報告】\' + info.what + \'が\' + ...',
              ],
              solution: `function formatIncidentReport(info) {
  return \`【障害報告】\${info.what}が\${info.since}から発生。影響: \${info.impact}。現在: \${info.status}\`
}`,
            },
          },
        ],
      },
      {
        id: 'infra-observe',
        title: '第2章: 観測可能性（Observability）',
        description: '「今何が起きているか」を把握するためのログ・メトリクス設計。',
        lessons: [
          {
            id: 'infra-2-1',
            title: 'ログ設計: 未来の自分を助ける記録',
            minutes: 20,
            intro:
              '障害の深夜、あなたの頼みはログだけです。「あの時どうなっていたか」を再現できるログ設計を学びます。',
            content: [
              '良いログの条件: **構造化**（JSON形式）、**追跡可能**（リクエストID等の相関ID）、**適切なレベル**（ERROR/WARN/INFO/DEBUG）の3点です。',
              'ログに書くべきでないもの: **パスワード、トークン、個人情報**。ログは多くの人がアクセスできる場所に保管されます。マスキングは必須です。',
              '「エラーが起きた」だけのログは役に立ちません。**何をしようとして**（操作）、**何が入力で**（パラメータ）、**何が起きた**（エラー）の3点セットで記録します。',
              'メトリクス（数値の集計）はアラートに、ログは詳細調査に、トレースは分散システムの流れの追跡に使います。役割の違いを理解しましょう。',
            ],
            points: [
              '構造化ログ + 相関ID + 適切なログレベル',
              '機密情報はログに書かない',
              '操作・入力・結果の3点セットで記録',
            ],
            codeExercise: {
              prompt: 'AIに「決済処理にログを追加して」と頼んだ結果です。',
              code: `app.post('/api/payment', async (c) => {
  const { userId, amount, cardToken } = await c.req.json()
  console.log('payment start', userId, amount, cardToken)

  try {
    const result = await charge(userId, amount, cardToken)
    console.log('ok')
    return c.json(result)
  } catch (e) {
    console.log('error happened')
    return c.json({ error: 'failed' }, 500)
  }
})`,
              question: 'このログ実装の問題として、最も重大なものは？',
              hint: '2つの観点で見てみましょう: ①ログに「書いてはいけないもの」が書かれていないか（決済情報・秘密情報）②障害調査に「必要な情報」が足りているか（エラーの内容）。',
              options: [
                { text: 'ログが日本語でない', correct: false, why: '言語は運用チームの慣習次第であり、重大な問題ではありません。' },
                { text: 'カードトークンをログに出力している + エラーの内容を記録していない', correct: true, why: '正解！決済情報のログ出力はPCI DSS違反になり得る重大インシデントです。また「error happened」では原因調査が不可能。エラーオブジェクトの内容（e.message等）を記録する必要があります。' },
                { text: 'console.logではなく専用ライブラリを使うべき', correct: false, why: '確かに改善点ですが、機密情報の漏洩リスクと比較すれば優先度は低いです。' },
                { text: 'okというログが簡素すぎる', correct: false, why: '改善点ではありますが、致命的ではありません。' },
              ],
            },
            codingChallenge: {
              prompt:
                'ログのマスキング関数を実装してください。オブジェクトを受け取り、password / token / cardToken / secret というキーの値を \'***\' に置き換えた「新しいオブジェクト」を返してください。それ以外のキーはそのままコピーし、元のオブジェクトは変更しないでください。',
              functionName: 'maskSecrets',
              signature: 'function maskSecrets(logData)',
              starterCode: `function maskSecrets(logData) {
  // 秘密キーのリストを定義し、新しいオブジェクトにコピーしながら置き換える

}`,
              tests: [
                { description: 'password がマスクされる', script: "fn({user:'taro',password:'abc123'}).password", expected: '"***"' },
                { description: '秘密以外はそのまま', script: "fn({user:'taro',password:'abc123'}).user", expected: '"taro"' },
                { description: 'cardToken もマスク', script: "fn({cardToken:'tok_123'}).cardToken", expected: '"***"' },
                { description: '元オブジェクトを変更しない', script: "(() => { const d={password:'abc'}; fn(d); return d.password === 'abc' })()", expected: 'true' },
              ],
              hints: [
                "const secretKeys = ['password', 'token', 'cardToken', 'secret']",
                'const result = { ...logData } でコピーしてから、secretKeys をループして result[key] が存在すれば \'***\' に',
              ],
              solution: `function maskSecrets(logData) {
  const secretKeys = ['password', 'token', 'cardToken', 'secret']
  const result = { ...logData }
  for (const key of secretKeys) {
    if (key in result) result[key] = '***'
  }
  return result
}`,
            },
          },
        ],
      },
      {
        id: 'infra-cloud',
        title: '第3章: クラウドの基礎',
        description: 'IaaS/PaaS/SaaSの違いから、サービスの使い分け、CI/CDの基礎まで。',
        lessons: [
          {
            id: 'infra-3-1',
            title: 'クラウドの基本概念（IaaS/PaaS/SaaS）',
            minutes: 20,
            intro:
              '「クラウドを使っている」と一言で言っても、その中身は大きく違います。IaaS/PaaS/SaaSの違いを理解すると、責任範囲や運用コストの見積もりが正確になります。',
            content: [
              '**IaaS（Infrastructure as a Service）** はサーバー・ネットワークなどのインフラをそのまま貸してくれる形態です（例: AWS EC2）。OSの設定・ミドルウェアの管理は自分で行います。',
              '**PaaS（Platform as a Service）** は実行環境ごと提供され、コードをデプロイするだけで動きます（例: Cloudflare Pages/Workers、Heroku）。サーバー管理から解放される分、自由度は下がります。',
              '**SaaS（Software as a Service）** は完成されたソフトウェアをそのまま使う形態です（例: Gmail、Slack）。開発者ではなく利用者向けの分類です。',
              'この3つには **責任共有モデル** という考え方があります。クラウド事業者が「どこまで」を保証し、利用者が「どこから」を責任持つかの境界線で、IaaSに近いほど利用者の責任範囲が広がります。',
              'PaaS/SaaSを使う利点は、スケーリングやサーバーの保守といった **トイル（繰り返しの定型作業）を削減** できることです。個人開発や小規模チームほど、この恩恵は大きくなります。',
            ],
            points: [
              'IaaS=インフラ貸し、PaaS=実行環境ごと、SaaS=完成品',
              '責任共有モデル: IaaSに近いほど自分の責任範囲が広い',
              'PaaS/SaaSはスケーリング等のトイルを削減できる',
            ],
            quiz: {
              question: '「コードをデプロイするだけで実行環境やスケーリングまで提供され、サーバーのOS管理は不要」なサービスは、どの分類に近いか？',
              hint: 'サーバーのOS設定やスケーリングの仕組みを自分で構築する必要がありますか？ それとも「コードをデプロイするだけ」で動きますか？',
              options: [
                { text: 'IaaS', correct: false, why: 'IaaSであれば、サーバーのOSやミドルウェアの管理を自分で行う必要があります。設問のサービスはそこまでの管理を求めていません。' },
                { text: 'PaaS', correct: true, why: '正解！コードをデプロイするだけで実行環境・スケーリングが提供されるのが、典型的なPaaSの特徴です（例: Heroku、Cloudflare Pages/Workers等）。' },
                { text: 'SaaS', correct: false, why: 'SaaSは完成されたソフトウェアを利用者として使う形態です。自分でコードを書いてデプロイしている時点でSaaSの利用とは異なります。' },
              ],
            },
          },
          {
            id: 'infra-3-2',
            title: '主要クラウドサービスの使い分け',
            minutes: 20,
            intro:
              'クラウドには無数のサービスがありますが、「コンピュート」「ストレージ」「CDN」という基本カテゴリを押さえれば、初見のサービスでも役割を推測できます。',
            content: [
              '**コンピュート（計算資源）** には大きく2種類あります。**サーバー型**（常時起動しているインスタンス）と **サーバーレス型**（リクエストが来た時だけ実行される関数）です。',
              'サーバーレス型はアクセスが少ない間は課金されない・スケーリングを意識しなくてよいという利点がある一方、常時大量アクセスがある場合はサーバー型の方がコスト効率が良いことがあります。',
              '**オブジェクトストレージ**（画像・動画などのファイル保存、例: S3）と **DB（データベース）**（構造化データの検索・更新）は役割が異なります。ファイルをDBに直接保存するのはアンチパターンです。',
              '**CDN（Content Delivery Network）** は世界中に配置されたサーバーがコンテンツをキャッシュし、ユーザーに近い場所から配信することで表示を高速化します。',
              'これらの **マネージドサービス**（クラウド事業者が保守してくれるサービス）を使うことで、サーバーの保守作業（トイル）を大きく削減できます。',
            ],
            points: [
              'コンピュートはサーバー型とサーバーレス型に大別される',
              'ファイルはオブジェクトストレージ、構造化データはDB',
              'CDNはユーザーに近い場所からの配信で高速化する',
            ],
            quiz: {
              question: 'アクセスの少ない個人開発APIを、コストを抑えて動かしたい。どちらが向いているか？',
              hint: '「常時起動して待機している」ことにコストがかかるのはどちらのコンピュート形態でしたか。アクセスが少ない時間はどうなってほしいでしょうか。',
              options: [
                { text: 'サーバー型（常時起動インスタンス）', correct: false, why: 'サーバー型はアクセスが無くても起動し続けるため、常時稼働分の費用がかかります。アクセスが少ないAPIには非効率です。' },
                { text: 'サーバーレス型', correct: true, why: '正解！サーバーレス型はリクエストが来た時だけ実行されるため、アクセスが少ない間は費用がほぼ発生しません。個人開発の小規模APIに向いています。' },
                { text: 'オブジェクトストレージ', correct: false, why: 'オブジェクトストレージはファイル保存のためのサービスであり、APIの実行環境（コンピュート）ではありません。' },
              ],
            },
          },
          {
            id: 'infra-3-3',
            title: 'CI/CDの基礎',
            minutes: 20,
            intro:
              '「手動でビルドしてサーバーにアップロード」という運用は、ミスと属人化の温床です。CI/CDはその手間と危険を仕組みで解決します。',
            content: [
              '**CI（Continuous Integration）** は、コードをpushするたびに自動でビルド・テストを実行する仕組みです。この道場自体の実装作業でも `npm run build` や `tsc --noEmit` を都度実行しているのと同じ発想です。',
              '**CD（Continuous Delivery/Deployment）** は、テストを通過したコードを自動的に本番環境へデプロイする仕組みです。',
              '典型的なパイプラインの流れ: ①コードをpush → ②CIが自動テスト実行 → ③テスト通過でビルド → ④CDが自動デプロイ。人手の介在を最小限にします。',
              'CI/CDは **トイル削減** の代表例です。手動デプロイは「毎回同じ手順を人間が繰り返す」典型的なトイルであり、自動化によって時間の節約だけでなく、手順のミス（打ち忘れ・打ち間違い）も防げます。',
            ],
            points: [
              'CI=push毎の自動テスト、CD=自動デプロイ',
              'パイプラインは push→テスト→ビルド→デプロイの流れ',
              'CI/CDはトイル削減とヒューマンエラー防止の代表例',
            ],
            codeExercise: {
              prompt: 'あるチームのリリース手順です。新機能をリリースするたびに、この手順を手動で実行しています。',
              code: `1. 開発者がSlackで「デプロイします」と宣言
2. 本番サーバーにSSHでログイン
3. git pull で最新コードを取得
4. npm install を手動実行
5. npm run build を手動実行
6. サーバープロセスを手動で再起動`,
              question: 'この運用の最も大きな問題点は？',
              hint: '「毎回人間が同じ手順を繰り返す」ことで起きやすい問題は何でしょうか。手順の一部を飛ばしてしまったら、あるいは担当者が不在だったらどうなるか考えてみましょう。',
              options: [
                { text: '手順が属人化し、打ち忘れ・打ち間違いが起きやすい', correct: true, why: '正解！手動の繰り返し作業は再現性が低く、手順の飛ばしや入力ミスが起きやすいうえ、「デプロイできる人」が属人化してしまいます。CI/CDによる自動化で解決できます。' },
                { text: 'Slackで宣言しているので特に問題ない', correct: false, why: '宣言は情報共有として有用ですが、手順そのものの属人化・ミスのリスクは解決されません。' },
                { text: 'SSHでログインすること自体が問題', correct: false, why: 'SSH自体は正当な運用手段です。問題は「手動で毎回同じ手順を繰り返している」ことです。' },
              ],
            },
          },
        ],
      },
    ],
  },

  {
    id: 'database',
    title: 'データベース設計',
    category: 'tech',
    icon: 'fa-database',
    color: 'purple',
    tagline: 'データの形が、システムの寿命を決める',
    description:
      '正規化、インデックス、N+1問題、トランザクション。DB設計の失敗は後から直すのが最も難しい。初期設計で勘所を押さえる力をつける。',
    outcomes: [
      '要件からテーブル設計（ER図）を起こせる',
      'N+1問題を検出・修正できる',
      'インデックスが効く条件を説明できる',
      'トランザクション分離レベルの基礎を理解している',
    ],
    chapters: [
      {
        id: 'db-design',
        title: '第1章: テーブル設計の基礎',
        description: '要件をデータの構造に落とし込む。',
        lessons: [
          {
            id: 'db-1-1',
            title: '要件からテーブルを設計する',
            minutes: 30,
            intro:
              'DB設計は「後から直せない」システムの骨格です。設計ミスは数年単位でチームを苦しめます。逆に言えば、ここで価値を出せるエンジニアは重宝されます。',
            content: [
              '手順: ①**登場人物（エンティティ）を洗い出す** → ②**関係（リレーション）を定義する** → ③**属性を各テーブルに配置する**。「注文」には誰が・何を・いつ・いくらで、が必要です。',
              '**正規化** の基本は「同じ情報を1か所にのみ持つ」こと。ユーザーの名前を注文テーブルにもコピーすると、改名した時に不整合が起きます。',
              'ただし正規化しすぎも問題です。注文時の **商品価格は注文テーブルにコピーする** のが正解。商品マスタの価格が後で変わっても、過去の注文金額は変わってはいけないからです。これを「**スナップショット**」と呼びます。',
              '`status` を文字列で持つか、フラグで持つかも重要な設計判断です。「有効/無効」の2値で将来足りるか？ 「休止中」が後から追加される可能性は？ **enum的な状態遷移は最初に設計** しましょう。',
              '削除は **論理削除**（deleted_atフラグ）か **物理削除**（本当に消す）か。監査要件・復元可能性・パフォーマンスのトレードオフで決めます。',
            ],
            points: [
              '同じ情報は1か所に（正規化）',
              '注文時価格など「その時点の値」はスナップショット保存',
              '状態遷移は将来の拡張を見越して設計',
            ],
            quiz: {
              question: 'ECサイトで「注文時の商品価格」を保存する正しい設計は？',
              hint: '「商品価格は将来変わるか？」を考えてみましょう。変わるなら、注文と価格をどう結びつけると「過去の注文金額」が壊れずに済むでしょうか。',
              options: [
                { text: '注文から商品マスタを参照し、価格は常に商品マスタから取得する', correct: false, why: '商品価格が改定されると、過去の注文の金額まで変わってしまい、請求額と一致しなくなります。' },
                { text: '注文明細テーブルに注文時点の価格をコピーして保存する', correct: true, why: '正解！「その時点の事実」はスナップショットとして保存します。正規化の原則よりも「ビジネス上の事実の保存」が優先される代表例です。' },
                { text: '価格の履歴テーブルを作り、注文日時で価格を引く', correct: false, why: '理論上は可能ですが、クエリが複雑になり、バグの温床になります。スナップショットの方がシンプルで確実です。' },
                { text: '価格は変更しない運用ルールにする', correct: false, why: 'ビジネス要件を技術で縛るのは本末転倒です。価格変更は当然に発生します。' },
              ],
            },
            sqlChallenge: {
              prompt:
                'ユーザーごとの注文合計金額を求めるSQLを書いてください。要件: ユーザー名(name)と注文合計(total)を、合計金額の大きい順に取得します。users テーブルと orders テーブルを JOIN し、GROUP BY でユーザーごとに集計してください。',
              schemaSql: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER);`,
              seedSql: `INSERT INTO users VALUES (1, '田中'), (2, '佐藤'), (3, '鈴木');
INSERT INTO orders VALUES (1, 1, 3000), (2, 2, 1500), (3, 1, 2000), (4, 2, 4500), (5, 3, 800);`,
              solutionSql: `SELECT u.name AS name, SUM(o.amount) AS total
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY total DESC;`,
              hints: [
                'JOIN で users と orders を o.user_id = u.id で結合する',
                'SUM(o.amount) で金額を合計し、GROUP BY でユーザーごとにまとめる',
                '並び順は ORDER BY total DESC（DESC = 大きい順）',
              ],
            },
          },
          {
            id: 'db-1-2',
            title: 'N+1問題を読み解く',
            minutes: 20,
            intro:
              '「開発環境では速かったのに本番で遅い」の代表格がN+1問題です。ORMを使うと意識せず踏むため、コードを読んで検出できるようになりましょう。',
            content: [
              'N+1問題とは: 一覧取得で1回クエリ（N件）を発行した後、**各レコードごとに追加クエリ** を発行してしまい、合計N+1回のクエリが走る問題です。100件なら101回。',
              'ORMのコードで `for` ループ内に `await` 付きのDBアクセス（や関連オブジェクトへのアクセス）があったら要注意です。',
              '解決策は **Eager Loading**（JOINやINで一括取得）です。SQLなら `WHERE user_id IN (1,2,3,...)`、ORMなら `include` / `preload` 等の機能を使います。',
              '検出方法: 開発時に **クエリログを有効化** して、1画面で何本のクエリが走っているか確認する習慣をつけましょう。',
            ],
            points: [
              'ループ内のDBアクセスはN+1の兆候',
              'Eager Loading（一括取得）で解決',
              '開発時にクエリログを見る習慣',
            ],
            codingChallenge: {
              prompt:
                'N+1を回避する結合処理を実装してください。posts 配列の各要素に、users 配列から対応する著者オブジェクトを author プロパティとして付けた「新しい配列」を返します。条件: ①ユーザー検索はO(1)にすること（Mapの使用推奨。find をループ内で使うとO(n×m)で本末転倒）②元の posts/users を変更しない ③対応するユーザーがいない場合は author を null にする。',
              functionName: 'attachAuthors',
              signature: 'function attachAuthors(posts, users)',
              starterCode: `// posts: [{ id, user_id, title }, ...]
// users: [{ id, name }, ...]
function attachAuthors(posts, users) {
  // ヒント: まず users から id => user の Map を作る

}`,
              tests: [
                {
                  description: '著者名が正しく結合される',
                  script: "fn([{id:1,user_id:10,title:'Hello'}],[{id:10,name:'Taro'}])[0].author.name",
                  expected: '"Taro"',
                },
                {
                  description: '対応ユーザーがいない場合は author が null',
                  script: "fn([{id:1,user_id:99,title:'X'}],[{id:10,name:'Taro'}])[0].author",
                  expected: 'null',
                },
                {
                  description: '件数が保持される',
                  script: "fn([{id:1,user_id:10},{id:2,user_id:10}],[{id:10,name:'T'}]).length",
                  expected: '2',
                },
                {
                  description: '複数ユーザーも正しく結合される',
                  script: "fn([{id:1,user_id:10},{id:2,user_id:11}],[{id:10,name:'A'},{id:11,name:'B'}])[1].author.name",
                  expected: '"B"',
                },
                {
                  description: '元の posts 配列を変更していない（副作用なし）',
                  script: "(() => { const p=[{id:1,user_id:10}]; fn(p,[{id:10,name:'T'}]); return !('author' in p[0]) })()",
                  expected: 'true',
                },
              ],
              hints: [
                'Map の作り方: new Map(users.map(u => [u.id, u]))',
                'map.get(post.user_id) で O(1) の検索になる',
                '返却は posts.map(post => ({ ...post, author: ... })) の形。見つからない時は ?? null',
              ],
              solution: `function attachAuthors(posts, users) {
  // ID => ユーザーの Map を作り、検索をO(1)にする
  const userMap = new Map(users.map(u => [u.id, u]))

  // 元の配列は変更せず、新しいオブジェクトの配列を返す
  return posts.map(post => ({
    ...post,
    author: userMap.get(post.user_id) ?? null,
  }))
}`,
            },
            codeExercise: {
              prompt: 'チームメンバーが書いたコードです。「投稿一覧に著者名を表示する」機能です。',
              code: `// 投稿を全件取得
const posts = await db.query('SELECT * FROM posts LIMIT 50')

// 各投稿の著者情報を取得
for (const post of posts) {
  post.author = await db.query(
    'SELECT * FROM users WHERE id = ?', [post.user_id]
  )
}

return c.json(posts)`,
              question: 'このコードの問題と適切な修正は？',
              hint: 'クエリが「何回」実行されるか数えてみましょう。最初の1回（投稿50件）に加えて、ループ内で何回走りますか？ 「1本あたりの速さ」と「本数」のどちらが問題かがポイントです。',
              options: [
                { text: '問題ない。50件なら許容範囲', correct: false, why: '51回のクエリは明確にN+1問題です。ユーザー増加時にDBへ線形に負荷がかかります。' },
                { text: 'N+1問題。JOINまたはIN句で一括取得すべき', correct: true, why: '正解！例えば SELECT * FROM posts JOIN users ON posts.user_id = users.id で1回のクエリで取得できます。または投稿のuser_idを集めてIN句で一括取得します。' },
                { text: 'キャッシュを使うべき', correct: false, why: 'キャッシュは根本解決ではありません。まずクエリ自体を最適化しましょう。' },
                { text: 'インデックスを貼るべき', correct: false, why: 'インデックスはクエリ「1本あたり」の速度を改善しますが、クエリ「本数」の問題は解決しません。' },
              ],
            },
            sqlChallenge: {
              prompt:
                'N+1問題をSQLで解決しましょう。要件: 「すべての投稿のタイトルと著者名を、1回のクエリ（JOIN）で取得する」SELECT文を書いてください。投稿IDの昇順で並べてください。',
              schemaSql: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT);`,
              seedSql: `INSERT INTO users VALUES (1, '田中'), (2, '佐藤');
INSERT INTO posts VALUES (1, 1, 'はじめての投稿'), (2, 2, 'SQL入門'), (3, 1, 'N+1とは');`,
              solutionSql: `SELECT p.title AS title, u.name AS author
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.id;`,
              hints: [
                'FROM posts p JOIN users u ON p.user_id = u.id で結合（ループ不要・1クエリで済む）',
                '取得列は p.title と u.name。別名（AS）を付けると結果が読みやすい',
                '並び順は ORDER BY p.id（昇順は ASC で、省略すると昇順）',
              ],
            },
          },
        ],
      },
      {
        id: 'db-sql',
        title: '第2章: SQL実践ステップ（ブラウザで書ける）',
        description:
          'SELECT → 集計 → JOIN の順に、ブラウザ内SQLiteで手を動かして覚える。環境構築は不要です。',
        lessons: [
          {
            id: 'db-2-1',
            title: 'SELECTの基本: 絞り込み・並び替え・上限',
            minutes: 15,
            intro:
              'SQLの仕事の8割は「必要な行だけを、必要な順番で取り出す」ことです。WHERE・ORDER BY・LIMIT の3つだけで、実務のクエリの土台が組めます。',
            content: [
              '**SELECT** は「どの列を取るか」、**FROM** は「どのテーブルから取るか」、**WHERE** は「どの行に絞るか」を指定します: `SELECT name, price FROM products WHERE price >= 1000`。',
              '**ORDER BY** で並び替えます: `ORDER BY price DESC` は価格の大きい順（DESC）。小さい順は ASC で、省略すると ASC になります。',
              '**LIMIT** で件数の上限を決めます: `LIMIT 3` で先頭3件だけ。「ランキング上位3件」のような要件は ORDER BY + LIMIT の組み合わせです。',
              '書く順番は決まっています: `SELECT → FROM → WHERE → ORDER BY → LIMIT`。この順番を入れ替えると構文エラーになる、初学者が最初にハマるポイントです。',
              '条件の組み合わせは AND / OR が使えます: `WHERE price >= 1000 AND stock > 0`。文字列の比較はシングルクォートで囲みます: `WHERE category = \'food\'`。',
            ],
            points: [
              'SELECT（列）→ FROM（表）→ WHERE（行）の順で考える',
              '並び替えは ORDER BY ... DESC/ASC、上位N件は LIMIT',
              '句の書く順番は固定（SELECT→FROM→WHERE→ORDER BY→LIMIT）',
            ],
            quiz: {
              question: '「価格1000円以上の商品を、価格の高い順に3件」取得したい。正しい句の順番は？',
              hint: 'SQLの句には決まった書き順があります。「どの表から → どの行に絞って → どう並べて → 何件取るか」の流れです。',
              options: [
                { text: 'FROM → WHERE → ORDER BY → LIMIT', correct: true, why: '正解！SELECT の後は FROM（表）→ WHERE（絞込）→ ORDER BY（並替）→ LIMIT（件数）の順が決まりです。この順番は「SQLの実行の論理的な流れ」とも対応しています。' },
                { text: 'WHERE → FROM → LIMIT → ORDER BY', correct: false, why: 'FROM（どの表か）より先に WHERE は書けません。また LIMIT は最後です。' },
                { text: 'FROM → ORDER BY → WHERE → LIMIT', correct: false, why: 'ORDER BY は WHERE の後です。先に行を絞ってから並び替える、という順番です。' },
              ],
            },
            sqlChallenge: {
              prompt:
                'はじめてのSQL演習です。products テーブルから「価格が1000円以上の商品」を、価格の高い順に3件まで取得してください。取得する列は商品名（name）と価格（price）の2列です。',
              schemaSql: `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER, stock INTEGER);`,
              seedSql: `INSERT INTO products VALUES
  (1, 'りんご', 'food', 150, 50),
  (2, 'ノートPC', 'electronics', 89800, 5),
  (3, 'マウス', 'electronics', 2980, 30),
  (4, 'コーヒー豆', 'food', 1200, 20),
  (5, 'キーボード', 'electronics', 5500, 15),
  (6, 'お茶', 'food', 800, 40),
  (7, 'モニター', 'electronics', 24800, 8);`,
              solutionSql: `SELECT name, price
FROM products
WHERE price >= 1000
ORDER BY price DESC
LIMIT 3;`,
              hints: [
                'WHERE price >= 1000 で価格1000円以上に絞り込む',
                'ORDER BY price DESC で価格の高い順に並べる（DESC = 降順）',
                '最後に LIMIT 3 で先頭3件に絞る。句の順番は SELECT → FROM → WHERE → ORDER BY → LIMIT',
              ],
            },
          },
          {
            id: 'db-2-2',
            title: '集計とGROUP BY: データを「まとめて」見る',
            minutes: 20,
            intro:
              '「ステータスごとの注文数は？」「月ごとの売上は？」——ビジネスの問いの多くは「まとめて数える」処理です。GROUP BY と集計関数は、エンジニアがビジネス側と対話するための共通言語です。',
            content: [
              '**集計関数**: `COUNT(*)`（件数）、`SUM(列)`（合計）、`AVG(列)`（平均）、`MAX/MIN`（最大/最小）。`SELECT COUNT(*) FROM orders` で全件数が取れます。',
              '**GROUP BY** は「グループごとに集計する」指示です: `SELECT status, COUNT(*) FROM orders GROUP BY status` で「ステータスごとの件数」になります。',
              'SELECT に書けるのは「GROUP BY に指定した列」か「集計関数」だけです。グループ化していない列（例: 個々の amount）を混ぜると、意味が曖昧になりエラーになるDBがほとんどです。',
              '**WHERE と HAVING の違い**が重要です: WHERE は「グループ化する前の行」を絞り、HAVING は「グループ化した後の結果」を絞ります。「注文数2件以上のステータスだけ」は HAVING の仕事です。',
              '実行の論理順序を意識しましょう: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY。WHERE に集計関数は書けない、と覚えると間違いが減ります。',
            ],
            points: [
              'COUNT / SUM / AVG / MAX / MIN が集計の基本5本',
              'GROUP BY でグループごとに集計',
              '絞込は「前」ならWHERE、「集計後」ならHAVING',
            ],
            quiz: {
              question: '「注文数が2件以上のステータスだけ」を取得したい。条件はどこに書く？',
              hint: '「注文数（COUNT）」はグループ化した「後」に分かる値です。グループ化後の結果を絞る専用の句があります。',
              options: [
                { text: 'WHERE count >= 2', correct: false, why: 'WHERE はグループ化「前」の行を絞る場所なので、COUNT(*) のような集計結果は使えません（エラーになります）。' },
                { text: 'HAVING COUNT(*) >= 2', correct: true, why: '正解！HAVING は GROUP BY で集計した「後」の結果を絞る句です。「集計値で絞りたい」ときは HAVING、と覚えましょう。' },
                { text: 'ORDER BY count >= 2', correct: false, why: 'ORDER BY は並び替え専用で、絞り込みはできません。' },
              ],
            },
            sqlChallenge: {
              prompt:
                'orders テーブルから「ステータス（status）ごとの注文数」を、注文数の多い順に取得してください。ただし注文数が2件以上のステータスのみ対象とします（HAVING を使用）。列は status と注文数（count）です。',
              schemaSql: `CREATE TABLE orders (id INTEGER PRIMARY KEY, status TEXT, amount INTEGER);`,
              seedSql: `INSERT INTO orders VALUES
  (1, 'shipped', 3000), (2, 'pending', 1500), (3, 'shipped', 2000),
  (4, 'cancelled', 4500), (5, 'shipped', 800), (6, 'pending', 2300),
  (7, 'shipped', 1200), (8, 'pending', 900);`,
              solutionSql: `SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status
HAVING COUNT(*) >= 2
ORDER BY count DESC;`,
              hints: [
                'GROUP BY status でステータスごとにグループ化し、COUNT(*) で件数を数える',
                '「2件以上のみ」は集計後の条件なので WHERE ではなく HAVING COUNT(*) >= 2',
                'ORDER BY count DESC で多い順（count は AS で付けた別名）',
              ],
            },
          },
          {
            id: 'db-2-3',
            title: 'JOINとLEFT JOIN: テーブルをまたいで集計する',
            minutes: 20,
            intro:
              '実務のデータは複数テーブルに分かれています。「ユーザー名つきの売上一覧」のように、テーブルを「繋ぐ」JOIN は、SQLの実用度を一気に引き上げる最重要トピックです。',
            content: [
              '**JOIN（内部結合）** は、両方のテーブルに対応する行がある組み合わせだけを取り出します: `FROM users u JOIN orders o ON o.user_id = u.id`。ON に書くのが「結合条件」です。',
              '**LEFT JOIN（左外部結合）** は、左側のテーブルの行を「すべて」残します。右側に対応行がなければ NULL になります。「注文が0件のユーザーも一覧に出したい」ときに必須です。',
              'テーブルには **別名（エイリアス）** を付けるのが実務標準です: `users u` のように短くすると、`u.name` `o.amount` と書けてクエリが読みやすくなります。',
              'JOIN と GROUP BY の組み合わせが定番です: 「ユーザーごとの注文数」= users と orders を結合 → ユーザーでグループ化 → COUNT。第1章の演習もこの形でした。',
              'LEFT JOIN で「件数」を数えるときは `COUNT(*)` ではなく `COUNT(o.id)` を使います。COUNT(*) は行そのものを数えるため注文0件でも1と数えてしまい、COUNT(列) は NULL を数えないため正しく0になります。',
            ],
            points: [
              'JOIN = 両方にある行だけ、LEFT JOIN = 左の全行を保持',
              'テーブル別名（users u）でクエリを短く読みやすく',
              'LEFT JOIN の件数は COUNT(o.id)（COUNT(*) だと0件が1になる）',
            ],
            quiz: {
              question: '「注文が0件のユーザーも含めて、全ユーザーの注文数」を出したい。適切な結合は？',
              hint: '「0件の人も残す」= 片方のテーブルに対応行がなくても行を消さない結合方式が必要です。',
              options: [
                { text: 'JOIN（内部結合）で結び、COUNT(*) で数える', correct: false, why: '内部結合は「両方に存在する行」しか残らないため、注文0件のユーザーが一覧から消えてしまいます。' },
                { text: 'LEFT JOIN で結び、COUNT(o.id) で数える', correct: true, why: '正解！LEFT JOIN は左（users）の全行を保持し、注文がないユーザーは o.id が NULL になります。COUNT(o.id) は NULL を数えないので、正しく 0 件になります。' },
                { text: 'LEFT JOIN で結び、COUNT(*) で数える', correct: false, why: 'LEFT JOIN は正しいですが、COUNT(*) は「行」を数えるため、注文0件のユーザーも 1 と数えてしまいます。COUNT(o.id) を使いましょう。' },
              ],
            },
            sqlChallenge: {
              prompt:
                '最終演習です。users テーブルと orders テーブルを LEFT JOIN して、「全ユーザーの注文数」を取得してください。要件: ①注文が0件のユーザーも結果に含める ②列はユーザー名（name）と注文数（order_count） ③注文数の多い順、同数ならユーザーIDの昇順。',
              schemaSql: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER);`,
              seedSql: `INSERT INTO users VALUES (1, '田中'), (2, '佐藤'), (3, '鈴木'), (4, '高橋');
INSERT INTO orders VALUES
  (1, 1, 3000), (2, 2, 1500), (3, 1, 2000),
  (4, 2, 4500), (5, 1, 800), (6, 3, 1200);`,
              solutionSql: `SELECT u.name AS name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY order_count DESC, u.id;`,
              hints: [
                'FROM users u LEFT JOIN orders o ON o.user_id = u.id で「ユーザー全員」を残す',
                '件数は COUNT(*) ではなく COUNT(o.id)（注文なし= NULL を0件にするため）',
                'GROUP BY u.id, u.name でユーザーごとに集計。並び順は ORDER BY order_count DESC, u.id',
              ],
            },
          },
        ],
      },
      {
        id: 'db-sql-advanced',
        title: '第3章: SQL応用（サブクエリ・複合JOIN）',
        description:
          '「平均以上を絞り込む」「3テーブルを一度に結合する」など、実務でよく見るSQL応用パターンを習得する。',
        lessons: [
          {
            id: 'db-3-1',
            title: 'サブクエリ: SQLの中にSQLを入れる',
            minutes: 20,
            intro:
              '「平均より高い商品だけを取り出したい」——この条件、WHERE に直接 AVG() は書けません。サブクエリ（副問い合わせ）で解決するパターンは実務で頻出です。',
            content: [
              '**サブクエリ** とは、SQLの中に書いた別のSELECT文のことです。`WHERE amount > (SELECT AVG(amount) FROM orders)` のように、括弧の中にSELECTを書きます。',
              'WHERE に集計関数（AVG・SUM など）を直接書けない理由: WHERE は行を1行ずつ評価しますが、AVG は全行をまとめて計算するため、評価のタイミングが合いません。HAVING も使えますが、サブクエリの方が柔軟に使えます。',
              'サブクエリは **スカラーサブクエリ**（1値を返す）と **テーブルサブクエリ**（複数行を返し IN 句などで使う）の2種類があります。`WHERE id IN (SELECT id FROM ...)` もよく使うパターンです。',
              '**パフォーマンス**: サブクエリは毎行評価されることがあるため、大きなテーブルでは遅くなることがあります。同じ結果をJOINで書けることが多く、JOINのほうが高速な場合があります。まず動くクエリを書き、必要に応じて最適化しましょう。',
            ],
            points: [
              'WHERE 節の中に `(SELECT ...)` で計算結果を使える',
              'スカラーサブクエリ（1値）と IN 用サブクエリ（複数値）の2パターン',
              '大きなテーブルでは JOIN の書き換えを検討する',
            ],
            quiz: {
              question: '`WHERE price > (SELECT AVG(price) FROM products)` はどんな行を取り出す？',
              hint: 'サブクエリ部分 `(SELECT AVG(price) FROM products)` は何を返しますか？',
              options: [
                {
                  text: '全商品の平均価格より高い価格の商品',
                  correct: true,
                  why: '正解！`(SELECT AVG(price) FROM products)` は全商品の平均価格（スカラー値）を返します。WHERE 節でその値より大きい行だけに絞ります。',
                },
                {
                  text: '最も高い価格の商品1件',
                  correct: false,
                  why: '最も高い価格の1件を取るなら `ORDER BY price DESC LIMIT 1` です。サブクエリで平均を計算して比較するのは、平均「以上」の全件取得です。',
                },
                {
                  text: 'エラーになる（WHERE に集計関数は使えない）',
                  correct: false,
                  why: 'WHERE 節に集計関数（AVG）を **直接** 書くのはエラーですが、サブクエリで括弧に包めば使えます。サブクエリの評価結果はスカラー値として使えます。',
                },
              ],
            },
            sqlChallenge: {
              prompt:
                'orders テーブルから「平均注文金額より高い注文」を取り出してください。要件: ①列は id, user_id, amount ②金額の大きい順 ③サブクエリ（`WHERE amount > (SELECT AVG(amount) ...)`）を使うこと。',
              schemaSql: `CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER);`,
              seedSql: `INSERT INTO orders VALUES (1, 1, 3000), (2, 2, 1500), (3, 3, 5000), (4, 1, 2000), (5, 2, 4000), (6, 3, 800);`,
              solutionSql: `SELECT id, user_id, amount
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders)
ORDER BY amount DESC;`,
              hints: [
                '`WHERE amount > (SELECT AVG(amount) FROM orders)` の形で書く',
                '全体平均は約2716円。これより高い注文は3000, 4000, 5000 の3件',
                '並び順は ORDER BY amount DESC（大きい順）',
              ],
            },
          },
          {
            id: 'db-3-2',
            title: 'GROUP BY応用: HAVING で集計後に絞り込む',
            minutes: 20,
            intro:
              '「カテゴリ別の平均価格が1000円以上のカテゴリだけ」——これは集計「後」の絞り込みで、HAVINGが必要です。COUNT以外の集計関数をHAVINGで使うパターンを習得しましょう。',
            content: [
              'HAVING は GROUP BY でグループ化した後の集計結果に条件を付けます。WHERE が「グループ化前」、HAVING が「グループ化後」と明確に区別して覚えましょう。',
              '`HAVING AVG(price) >= 1000` のように、AVG・SUM・MAXなど任意の集計関数を条件に使えます。`WHERE AVG(price) >= 1000` はエラーになります。',
              'SELECT 節で集計列に **別名（AS）** を付けると、ORDER BY でその別名が使えます: `SELECT AVG(price) AS avg_price ... ORDER BY avg_price DESC`。ただし SQLite では HAVING 節でも別名が使えますが、他のDBでは使えないことがあります。',
              '複数の集計関数を同時に取得できます: `SELECT category, COUNT(*) AS cnt, AVG(price) AS avg` のように1クエリで複数の集計値を出力できます。',
            ],
            points: [
              'HAVING は GROUP BY 後の集計結果を絞る（WHERE は集計前）',
              'AVG・SUM・MAX などどの集計関数でも HAVING に書ける',
              '集計列に AS で別名を付けると ORDER BY で使いやすくなる',
            ],
            quiz: {
              question: 'カテゴリ別の件数を取得し、「件数が3以上のカテゴリ」だけ出すSQLの正しい書き方は？',
              hint: '「件数が3以上」という条件は、グループ化の前と後どちらの絞り込みでしょうか？',
              options: [
                {
                  text: 'GROUP BY category HAVING COUNT(*) >= 3',
                  correct: true,
                  why: '正解！COUNT(*) は集計関数なので GROUP BY の後でしか分かりません。集計後の絞り込みは HAVING を使います。',
                },
                {
                  text: 'WHERE COUNT(*) >= 3 GROUP BY category',
                  correct: false,
                  why: 'WHERE 節に集計関数 COUNT(*) は書けません（エラー）。WHERE はグループ化前の行を絞るため、集計結果はまだ計算されていません。',
                },
                {
                  text: 'GROUP BY category ORDER BY COUNT(*) >= 3',
                  correct: false,
                  why: 'ORDER BY は並び替えの指定で、条件絞り込みには使えません。条件絞り込みに HAVING を使います。',
                },
              ],
            },
            sqlChallenge: {
              prompt:
                'products テーブルから「カテゴリ別の商品数と平均価格」を、平均価格1000円以上のカテゴリのみ、平均価格の高い順で取得してください。列は category, item_count（商品数）, avg_price（平均価格）です。',
              schemaSql: `CREATE TABLE products (id INTEGER PRIMARY KEY, category TEXT, price INTEGER);`,
              seedSql: `INSERT INTO products VALUES
  (1, 'food', 150), (2, 'food', 1200), (3, 'food', 800),
  (4, 'electronics', 89800), (5, 'electronics', 2980), (6, 'electronics', 5500),
  (7, 'book', 1500), (8, 'book', 2000);`,
              solutionSql: `SELECT category, COUNT(*) AS item_count, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) >= 1000
ORDER BY avg_price DESC;`,
              hints: [
                'GROUP BY category でカテゴリごとに集計',
                '「平均価格1000円以上」は HAVING AVG(price) >= 1000（WHERE ではなく HAVING）',
                'COUNT(*) AS item_count, AVG(price) AS avg_price で2つの集計値を同時に取得',
              ],
            },
          },
          {
            id: 'db-3-3',
            title: '3テーブル結合: 複数テーブルをまたぐ集計',
            minutes: 25,
            intro:
              '実務のDBは「顧客・注文・商品」のように3テーブル以上に分かれています。複数のJOINを連鎖させるパターンを習得すると、実務クエリの幅が一気に広がります。',
            content: [
              '**複数JOINの書き方**: `FROM A JOIN B ON ... JOIN C ON ...` のように JOIN を連鎖させます。追加するJOINごとに ON 条件を書きます。',
              '3テーブル結合の読み方: まず `FROM orders o` でベーステーブルを決め、`JOIN customers c ON o.customer_id = c.id` で顧客を結合、`JOIN products p ON o.product_id = p.id` で商品を結合します。「注文」を中心に放射状に繋げるイメージです。',
              '**列の計算**: SELECT 節で `(o.quantity * p.price) AS subtotal` のように演算式を書けます。これが集計なしで「各行の小計」を出す方法です。',
              'テーブルの別名（エイリアス）が特に重要になります。`c.name`（顧客名）と `p.name`（商品名）のように同じ列名が複数テーブルに存在するとき、エイリアスなしでは `ambiguous column name` エラーになります。',
            ],
            points: [
              'JOIN を連鎖させて複数テーブルを結合: `JOIN A ON ... JOIN B ON ...`',
              'SELECT で演算式（`qty * price`）を書いて派生列を作れる',
              '同名列が複数テーブルにある場合は `table.column` で明示',
            ],
            quiz: {
              question: '3テーブル（orders, customers, products）を結合するとき、JOINの個数は？',
              hint: '「N個のテーブルを全て結合するのに必要なJOINの数」を考えてください。',
              options: [
                { text: '1つ（JOIN 1回で3テーブルを繋げる）', correct: false, why: '1つのJOINは2テーブルの結合です。3テーブルを結合するには2つのJOINが必要です。' },
                { text: '2つ（JOIN を2回書く）', correct: true, why: '正解！N テーブルを結合するには N-1 個の JOIN が必要です。3テーブルなら2つの JOIN を連鎖させます: `FROM orders o JOIN customers c ON ... JOIN products p ON ...`' },
                { text: '3つ（各テーブルに1つずつ）', correct: false, why: 'ベーステーブル（FROM）は JOIN を使いません。3テーブルなら FROM 1個 + JOIN 2個です。' },
              ],
            },
            sqlChallenge: {
              prompt:
                '3つのテーブル（customers, orders, products）を結合して、「顧客名・商品名・数量・小計（数量×単価）」の一覧を小計の大きい順で取得してください。列は customer（顧客名）, product（商品名）, quantity（数量）, subtotal（小計）です。',
              schemaSql: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, quantity INTEGER);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER);`,
              seedSql: `INSERT INTO customers VALUES (1, '田中', '東京'), (2, '佐藤', '大阪'), (3, '鈴木', '名古屋');
INSERT INTO products VALUES (1, 'ノートPC', 89800), (2, 'マウス', 2980), (3, 'キーボード', 5500);
INSERT INTO orders VALUES (1, 1, 1, 1), (2, 1, 2, 2), (3, 2, 3, 1), (4, 3, 1, 2), (5, 2, 1, 1);`,
              solutionSql: `SELECT c.name AS customer, p.name AS product, o.quantity, (o.quantity * p.price) AS subtotal
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id
ORDER BY subtotal DESC;`,
              hints: [
                'FROM orders o を起点に JOIN customers c ON o.customer_id = c.id → JOIN products p ON o.product_id = p.id と連鎖する',
                '小計（subtotal）は `o.quantity * p.price` の演算式で計算',
                '顧客名は c.name、商品名は p.name（エイリアスで区別）',
              ],
            },
          },
        ],
      },
    ],
  },
]
