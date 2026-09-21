import type { Track } from '../../types'

export const httpTracks: Track[] = [
  {
    id: 'http-api',
    title: 'HTTPとAPI基礎',
    category: 'tech',
    icon: 'fa-network-wired',
    color: 'sky',
    tagline: 'Webの「共通語」を理解して、サービスをつなぐ',
    description:
      'HTTPメソッド・ステータスコード・JSON・fetchの使い方を体系的に学ぶ。すべてのWebアプリの通信基盤となる知識を、ブラウザ内モックAPIで手を動かしながら習得する。',
    outcomes: [
      'GET/POST/PUT/DELETE の使い分けを説明できる',
      'ステータスコードの意味を見て即座に判断できる',
      'fetch でデータ取得・送信を非同期で行える',
      'APIエラーを適切にハンドリングできる',
    ],
    chapters: [
      {
        id: 'http-basics',
        title: '第1章: HTTPとRESTの基本',
        description: 'WebのすべてはHTTPから始まる。リクエスト/レスポンスの仕組みとRESTを理解する。',
        lessons: [
          {
            id: 'http-1-1',
            title: 'HTTPメソッドとステータスコード: Webの共通語',
            minutes: 20,
            intro:
              'ブラウザでURLを開く、フォームを送信する、APIを叩く——これらすべてはHTTPというプロトコルで動いています。HTTPの語彙を知ることは、Web開発の全領域に直結します。',
            content: [
              '**HTTP（HyperText Transfer Protocol）** はWeb通信の標準プロトコルです。**クライアント**（ブラウザ・アプリ）が**リクエスト**を送り、**サーバー**が**レスポンス**を返します。',
              '**HTTPメソッド** はリクエストの「意図」を示します: `GET`=読み取り（副作用なし）、`POST`=新規作成、`PUT`=全体更新、`PATCH`=部分更新、`DELETE`=削除。GETは何度実行しても同じ（冪等）ですが、POSTは重複実行に注意が必要です。',
              '**ステータスコード** はレスポンスの「結果」を示す3桁の数字です: `2xx`=成功（200 OK、201 Created）、`3xx`=リダイレクト、`4xx`=クライアントエラー（400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found）、`5xx`=サーバーエラー（500 Internal Server Error）。',
              '**REST（REpresentational State Transfer）** はAPIの設計スタイルです。URLがリソースを表し（`/users/123`）、HTTPメソッドが操作を示す（GET=取得、POST=作成）という原則です。',
              '**JSON（JavaScript Object Notation）** は最もよく使われるデータ形式です。`{"key": "value"}` の形式で、文字列はダブルクォートのみ、末尾カンマは不可、数値・真偽値・null も扱えます。',
            ],
            points: [
              'GET=読む、POST=作る、PUT=更新、DELETE=消す',
              '4xx=クライアントの問題、5xx=サーバーの問題',
              'RESTはURLがリソース、メソッドが操作を表す設計スタイル',
            ],
            quiz: {
              question: 'ユーザー情報を部分的に更新する（名前だけ変える）APIエンドポイントに使うべきメソッドは？',
              hint: '「全体を置き換える」か「一部だけ変える」か、HTTPメソッドにはその違いを表すものがあります。',
              options: [
                { text: 'PUT', correct: false, why: 'PUTはリソース全体の置き換えです。名前だけ送るとパスワードなど他のフィールドが消えるリスクがあります。' },
                { text: 'PATCH', correct: true, why: '正解！PATCHは部分的な更新専用です。送ったフィールドだけを更新し、他は変更しません。「パッチを当てる」というイメージが語源です。' },
                { text: 'POST', correct: false, why: 'POSTは新規作成です。更新には使いません（一部のAPIは使うこともありますが、REST原則ではPATCHを使います）。' },
              ],
            },
            codingChallenge: {
              prompt:
                'HTTPレスポンスを解析する関数を作成してください。ステータスコードと本文（JSON文字列 or 空文字）を受け取り、`{ ok, status, category, data }` を返します。`ok`=200-299、`category`は"success"/"redirect"/"clientError"/"serverError"のいずれか、`data`はJSON.parseした結果（失敗時はnull）。',
              functionName: 'parseHttpResponse',
              signature: 'function parseHttpResponse(status, body)',
              starterCode: `function parseHttpResponse(status, body) {
  // ok: 200-299 なら true
  // category: 2xx=success 3xx=redirect 4xx=clientError 5xx=serverError
  // data: bodyをJSON.parseした結果。失敗時はnull

}`,
              tests: [
                { description: '200はok=true, success', script: 'JSON.stringify(fn(200, \'{"name":"太郎"}\'))', expected: '{"ok":true,"status":200,"category":"success","data":{"name":"太郎"}}' },
                { description: '404はok=false, clientError', script: 'JSON.stringify(fn(404, ""))', expected: '{"ok":false,"status":404,"category":"clientError","data":null}' },
                { description: '500はok=false, serverError', script: 'fn(500, "").category', expected: '"serverError"' },
                { description: '301はredirect', script: 'fn(301, "").category', expected: '"redirect"' },
                { description: '201もok=true', script: 'fn(201, "{}").ok', expected: 'true' },
              ],
              hints: [
                'ok: status >= 200 && status < 300',
                'Math.floor(status / 100) で先頭桁を取れる（2→success, 3→redirect, ...）',
                'data: try{ JSON.parse(body) }catch(e){ null }',
              ],
              solution: `function parseHttpResponse(status, body) {
  const ok = status >= 200 && status < 300
  const hundred = Math.floor(status / 100)
  const catMap = { 2: 'success', 3: 'redirect', 4: 'clientError', 5: 'serverError' }
  const category = catMap[hundred] || 'unknown'
  let data = null
  try { data = JSON.parse(body) } catch (e) { data = null }
  return { ok, status, category, data }
}`,
            },
          },
          {
            id: 'http-1-2',
            title: 'fetchとasync/await: ブラウザからAPIを叩く',
            minutes: 25,
            intro:
              '「サーバーからデータを取ってきてページに表示する」は現代Webの基本パターンです。fetchとasync/awaitを使いこなすことで、あらゆるWebアプリの通信処理が書けるようになります。',
            content: [
              '**fetch()** はブラウザ標準のHTTP通信関数です。`fetch(url)` は Promise を返し、レスポンスが来ると解決されます。**async/await** はPromiseを同期的に書ける構文です。',
              '```\nasync function getData() {\n  const res = await fetch("/api/users");\n  const data = await res.json();\n  return data;\n}\n```\n`await res.json()` でレスポンスをJSONとして解析します。`res.text()` でテキスト取得、`res.ok` でステータス200-299か確認できます。',
              'POSTでデータを送る場合: `fetch(url, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data) })`。Content-Typeヘッダーを忘れるとサーバーがJSONと認識できません。',
              '**エラーハンドリング** が重要です。`fetch()` 自体はネットワークエラー以外ではrejectされません——`res.ok` が false でも then に進みます。`if (!res.ok) throw new Error(...)` で明示的にエラーを投げる必要があります。',
              '**try/catch** でエラーを受け取ります。ネットワーク断・JSON解析失敗・サーバーエラーを1か所でハンドリングできます。ユーザーへの適切なフィードバック（「通信エラーが発生しました」等）を忘れないこと。',
            ],
            points: [
              'res.ok チェックを忘れず、4xx/5xxを明示的にthrowする',
              'POST送信時は Content-Type: application/json ヘッダーが必要',
              'try/catch で通信エラー全体をキャッチする',
            ],
            quiz: {
              question: '以下のコードはAPIから404が返った時にどう振る舞うか？\n`const res = await fetch("/api/item/999");\nconst data = await res.json();`',
              hint: 'fetchはHTTPエラーコードを受け取っても例外を投げません。`res.ok` はどんな状態でしょうか。',
              options: [
                { text: '404なのでfetchがエラーをthrowし、catchに飛ぶ', correct: false, why: 'fetchはネットワーク自体のエラーしかthrowしません。404などのHTTPエラーコードではrejectされず、thenに進みます。' },
                { text: 'resが返り、res.ok === false だが res.json() の実行は試みられる。404レスポンスにJSONボディがなければ例外が発生することもある', correct: true, why: '正解！fetchは4xxでもrejectしません。明示的に if(!res.ok) throw new Error() を書かないと、エラーを無視して続行してしまいます。' },
                { text: '404のレスポンスは自動的にundefinedとして扱われる', correct: false, why: 'fetchはレスポンスオブジェクトをそのまま返します。undefinedにはなりません。' },
              ],
            },
            codingChallenge: {
              prompt:
                'APIクライアント関数を作成してください。モックfetch（引数に渡される）を使ってGETリクエストを送り、成功時は`{ok: true, data: レスポンスJSON}`、失敗時（HTTPエラー or 例外）は`{ok: false, error: エラーメッセージ文字列}`を返す async 関数。',
              functionName: 'fetchApi',
              signature: 'async function fetchApi(url, mockFetch)',
              starterCode: `async function fetchApi(url, mockFetch) {
  // mockFetch(url) でリクエストを送る（fetch と同じインターフェース）
  // res.ok が false なら { ok: false, error: "HTTP " + res.status } を返す
  // 例外が発生した場合は { ok: false, error: e.message } を返す
  // 成功時は { ok: true, data: await res.json() の結果 } を返す

}`,
              tests: [
                {
                  description: '200レスポンスで ok:true とデータ',
                  script: `(async()=>{
  const mock = async ()=>({ ok:true, status:200, json: async()=>({id:1,name:'太郎'}) })
  return JSON.stringify(await fn('/api/user', mock))
})()`,
                  expected: '{"ok":true,"data":{"id":1,"name":"太郎"}}',
                },
                {
                  description: '404レスポンスで ok:false',
                  script: `(async()=>{
  const mock = async ()=>({ ok:false, status:404, json: async()=>({}) })
  const r = await fn('/api/x', mock)
  return r.ok === false && r.error === 'HTTP 404'
})()`,
                  expected: 'true',
                },
                {
                  description: 'ネットワークエラーで ok:false',
                  script: `(async()=>{
  const mock = async ()=>{ throw new Error('Network Error') }
  const r = await fn('/api/y', mock)
  return r.ok === false && r.error === 'Network Error'
})()`,
                  expected: 'true',
                },
              ],
              hints: [
                'async function なので await が使える。try/catch で全体を囲む',
                'const res = await mockFetch(url) → if (!res.ok) return { ok: false, error: "HTTP " + res.status }',
                '成功時: return { ok: true, data: await res.json() }',
              ],
              solution: `async function fetchApi(url, mockFetch) {
  try {
    const res = await mockFetch(url)
    if (!res.ok) return { ok: false, error: 'HTTP ' + res.status }
    const data = await res.json()
    return { ok: true, data }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}`,
            },
          },
          {
            id: 'http-1-3',
            title: 'RESTfulなAPI設計の原則',
            minutes: 20,
            intro:
              '「動くAPI」と「変更に強いAPI」の差は、設計原則を知っているかどうかで決まります。RESTfulな設計は、多くのチームが共有できる共通言語です。',
            content: [
              'RESTの基本原則は **URLはリソース（名詞）、メソッドは操作（動詞）** を表すことです。`/getUsers`のような動詞入りのURLは避け、`GET /users`のように表現します。',
              '**冪等性** はHTTPメソッドごとに定義されています。GET・PUT・DELETEは本来何度実行しても結果が同じ（冪等）ですが、**POSTは冪等ではありません**。同じPOSTリクエストが2回届くと、2回分の処理が実行されてしまう可能性があります。',
              'ネストしたリソースの表現（`/users/1/orders/5`のような形）は便利ですが、**深くしすぎない（2階層程度まで）** のが実務上のバランスです。深すぎるネストはURL設計を複雑にします。',
              '**APIバージョニング**（`/v1/users`のような形）の目的は、既存のクライアントを壊さずにAPIを進化させることです。破壊的な変更が必要な時に、新バージョンとして併存させます。',
            ],
            points: [
              'URLは名詞（リソース）、操作はHTTPメソッドで表す',
              'POSTは冪等ではない（同じリクエストの重複実行に注意）',
              'ネストは2階層程度に、バージョニングで破壊的変更に備える',
            ],
            quiz: {
              question: '決済APIが `POST /payments` で実装されている。ネットワーク不安定により、同じリクエストが2回送信されてしまった。何が起きる可能性があるか？',
              hint: 'GET・PUT・DELETEは冪等ですが、POSTはどうだったでしょうか。「冪等でない」とは、同じリクエストを2回送るとどうなることを意味しますか。',
              options: [
                { text: 'POSTは冪等でないため、決済が2回実行される可能性がある', correct: true, why: '正解！POSTは本来冪等でないメソッドのため、同じリクエストが2回サーバーに届けば、2回分の決済処理が走る危険があります。この対策が「冪等キー」（バックエンドトラックで学習済み）です。' },
                { text: 'GETと同じ扱いなので問題ない', correct: false, why: 'POSTとGETは全く異なる性質を持ちます。GETは冪等ですが、POSTは冪等ではありません。' },
                { text: 'HTTPが自動的に重複を検出して防いでくれる', correct: false, why: 'HTTPプロトコル自体には重複リクエストを自動的に防ぐ仕組みはありません。アプリ側で対策する必要があります。' },
              ],
            },
          },
        ],
      },
      {
        id: 'http-auth',
        title: '第2章: API認証と実践',
        description: 'APIキー・OAuth・JWTなど、認証方式の使い分けを学ぶ。',
        lessons: [
          {
            id: 'http-2-1',
            title: '認証方式の使い分け',
            minutes: 20,
            intro:
              '「ログイン機能を作って」と一言で言っても、APIキー・OAuth・JWTなど選択肢は複数あります。それぞれの特性を知ると、用途に応じた適切な選択ができます。',
            content: [
              '**APIキー** は最もシンプルな認証方式です。発行されたキーをリクエストに付けるだけですが、キー自体が漏洩すると誰でもなりすませてしまう **漏洩リスク** があります（Webセキュリティトラックの秘密情報管理と直結します）。',
              '**OAuth** は「認可の委譲」を実現する仕組みです。「このアプリに、あなたのGoogleアカウントの情報へのアクセスを許可しますか？」というあの画面がOAuthです。パスワードそのものを渡さずに済みます。',
              '**JWT（JSON Web Token）** は署名付きのトークンで、改ざんを検出できます（認証・認可トラックで学んだ「失効の難しさ」という弱点も持ちます）。',
              '選び方の目安: 社内向けの単純なAPI連携なら **APIキー**、外部サービスとの連携で「ユーザーの代わりに操作する」なら **OAuth**、自前のログインシステムで状態を持たせたくないなら **JWT**、という具合に用途で選びます。',
            ],
            points: [
              'APIキーはシンプルだが漏洩リスクが高い',
              'OAuthはパスワードを渡さずに認可を委譲する仕組み',
              'JWTは署名付きトークンだが失効管理が難しい',
            ],
            quiz: {
              question: '自社アプリに「Googleでログイン」機能を追加したい。使うべき認証の仕組みは？',
              hint: '「ユーザーのGoogleアカウントの情報へのアクセスを、パスワードを渡さずに許可する」——このような「認可の委譲」を実現する仕組みは何でしたか。',
              options: [
                { text: 'APIキー', correct: false, why: 'APIキーは主に社内向けや単純なサービス間連携に使う方式で、ユーザーごとの第三者ログインには向きません。' },
                { text: 'OAuth', correct: true, why: '正解！「Googleでログイン」はOAuthの典型的な利用例です。ユーザーはGoogleのパスワードを自社アプリに渡すことなく、必要な情報へのアクセスだけを許可できます。' },
                { text: 'Basic認証', correct: false, why: 'Basic認証はID/パスワードを毎回送る単純な方式で、第三者ログインの仕組みではありません。' },
              ],
            },
          },
        ],
      },
    ],
  },
]
