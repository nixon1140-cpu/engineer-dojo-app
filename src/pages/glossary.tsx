import type { FC } from 'hono/jsx'

// 初学者がつまずきやすい用語を、カリキュラム内の登場頻度順に集約
// term: 用語 / kana: 読み / category: 分野 / desc: 一言説明 / example: 具体例や関連レッスン
type GlossaryTerm = {
  term: string
  kana: string
  category: '基礎' | '技術' | 'DB' | 'Git' | 'ビジネス' | 'AI時代'
  desc: string
  example?: string
}

const categories = ['基礎', '技術', 'DB', 'Git', 'ビジネス', 'AI時代'] as const

const terms: GlossaryTerm[] = [
  // 基礎
  { term: '変数', kana: 'へんすう', category: '基礎', desc: 'データに名前を付けて保存する「箱」。JavaScriptでは const（変更しない）か let（変更する）で宣言する。', example: 'const price = 100' },
  { term: '条件分岐', kana: 'じょうけんぶんき', category: '基礎', desc: '「もし〜なら、こうする」という処理の切り替え。if / else if / else で書く。', example: 'if (age >= 18) { ... }' },
  { term: '関数', kana: 'かんすう', category: '基礎', desc: '処理に名前を付けて再利用する仕組み。入力（引数）を受け取り、結果（戻り値）を返す。', example: 'function add(a, b) { return a + b }' },
  { term: '配列', kana: 'はいれつ', category: '基礎', desc: '複数のデータを順番に格納する入れ物。添字は0から始まる。map / filter / find で加工するのが定石。', example: 'const scores = [80, 92, 67]' },
  { term: '早期リターン', kana: 'そうきりたーん', category: '基礎', desc: '「ダメな条件」を先に if で弾いて return する書き方。ネストが浅くなり可読性が上がる。コードレビューでも推奨される定石。' },
  { term: 'デバッグ', kana: 'でばっぐ', category: '基礎', desc: 'プログラムの不具合（バグ）を見つけて直す作業。基本は「ここまでは動く/ここから動かない」の二分探索。' },
  { term: 'SyntaxError / TypeError / ReferenceError', kana: 'しんたっくすえらー 他', category: '基礎', desc: '代表的なエラーの3種。文法ミス / 型の誤用（undefinedへのメソッド呼出等）/ 未定義変数の使用。エラーは「種類→場所→内容」の順で読む。' },
  // 技術
  { term: 'API', kana: 'えーぴーあい', category: '技術', desc: 'ソフトウェア同士がやり取りするための窓口。Webでは「HTTPでJSONを返すURL」という形が多い。' },
  { term: 'フロントエンド / バックエンド', kana: 'ふろんとえんど / ばっくえんど', category: '技術', desc: 'ユーザーの画面側（ブラウザで動く部分）と、サーバー側（データ処理・保存を担う部分）。' },
  { term: 'ORM', kana: 'おーあーるえむ', category: '技術', desc: 'DBをSQLではなくプログラムのオブジェクトとして操作する仕組み。便利だが、意識しないとN+1問題を踏む。' },
  { term: 'N+1問題', kana: 'えぬぷらすいちもんだい', category: '技術', desc: '一覧取得（1回）の後、各レコードごとに追加クエリ（N回）を発行してしまう性能問題。JOINやIN句での一括取得（Eager Loading）で解決する。' },
  { term: '認証 / 認可', kana: 'にんしょう / にんか', category: '技術', desc: '認証=「あなたは誰？」の確認（ログイン）。認可=「あなたは何をしていい？」の判定（権限）。混同しやすいが別物。' },
  { term: '環境構築', kana: 'かんきょうこうちく', category: '技術', desc: '開発に必要なソフト（言語・エディタ・Git等）をPCにセットアップすること。初学者の最初の壁。道場ではブラウザ演習でこれを後回しにできる。' },
  // DB
  { term: '正規化', kana: 'せいきか', category: 'DB', desc: '「同じ情報を1か所にのみ持つ」ようテーブルを分割する設計手法。更新時の不整合を防ぐ。' },
  { term: 'スナップショット', kana: 'すなっぷしょっと', category: 'DB', desc: '「その時点の値」をコピーして保存すること。例: 注文時の商品価格は、商品マスタの価格が変わっても注文側に残す。' },
  { term: 'インデックス', kana: 'いんでっくす', category: 'DB', desc: '検索を高速化するための「索引」。WHERE や JOIN でよく使う列に貼る。ただし書き込みは少し遅くなるトレードオフあり。' },
  { term: 'トランザクション', kana: 'とらんざくしょん', category: 'DB', desc: '複数の更新を「全部成功 or 全部取り消し」の1単位にまとめる仕組み。在庫引当と注文作成のように、中途半端だと困る処理に必須。' },
  { term: 'JOIN / LEFT JOIN', kana: 'じょいん / れふとじょいん', category: 'DB', desc: 'テーブル同士を結合して取り出す。JOINは両方にある行のみ、LEFT JOINは左側の全行を保持（対応なしはNULL）。' },
  { term: 'GROUP BY / HAVING', kana: 'ぐるーぷばい / はびんぐ', category: 'DB', desc: 'グループごとの集計と、集計「後」の絞り込み。WHEREは集計「前」の行を絞る、と対で覚える。' },
  // Git
  { term: 'コミット', kana: 'こみっと', category: 'Git', desc: '変更をリポジトリに記録する操作。スナップショットとして保存され、いつでも過去の状態に戻れる。メッセージで「何を変えたか」を記録する。', example: 'git commit -m "ログイン機能を追加"' },
  { term: 'ブランチ', kana: 'ぶらんち', category: 'Git', desc: 'メインの開発ラインから分岐した作業空間。「どのコミットを指しているか」のポインタ。feature/〇〇 のように機能名をつけるのが慣例。', example: 'git branch feature/login' },
  { term: 'マージ', kana: 'まーじ', category: 'Git', desc: '2つのブランチを統合する操作。変更を取り込まれる側（main など）に向けて実行する。コンフリクトがあれば手動解消が必要。', example: 'git merge feature/login' },
  { term: 'リモート', kana: 'りもーと', category: 'Git', desc: 'GitHub など、ネット上に置いたリポジトリの別名。通常 `origin` という名前を付ける。`git push` で送信、`git pull` で取り込む。', example: 'git remote add origin https://github.com/...' },
  { term: 'コンフリクト', kana: 'こんふりくと', category: 'Git', desc: '2つのブランチで同じファイルの同じ行を変えたとき、Gitが「どちらを採用すべきか」判断できない状態。`<<<<<<` `=======` `>>>>>>` のマーカーで表示される。手動で正しい内容に書き換えてから `git add` と `git commit` で解消する。' },
  { term: 'プルリクエスト（PR）', kana: 'ぷるりくえすと', category: 'Git', desc: 'GitHubなどで「このブランチをマージしてください」と提案しコードレビューを受ける仕組み。チーム開発での品質確保の要。レビュー→承認→マージの流れが標準。' },
  { term: 'stash', kana: 'すたっしゅ', category: 'Git', desc: '作業途中の変更を一時退避させるコマンド。`git stash` で隠し、`git stash pop` で復元する。別ブランチに切り替える前に変更を中断したい場合に便利。', example: 'git stash / git stash pop' },
  { term: '.gitignore', kana: 'ぎっといぐのあ', category: 'Git', desc: 'Gitで管理しないファイル・フォルダを指定するファイル。node_modules/ や .env（秘密鍵）などを除外する。プロジェクトのルートに配置する。', example: 'node_modules/\n.env\n*.log' },
  // ビジネス
  { term: 'ファネル', kana: 'ふぁねる', category: 'ビジネス', desc: '認知→訪問→登録→購入のように、ユーザーが段階を経るごとに減っていく漏斗（ろうと）状のモデル。どこで離脱するか分析する。' },
  { term: '技術的負債', kana: 'ぎじゅつてきふさい', category: 'ビジネス', desc: '「急いで作った歪み」の蓄積。放置すると開発速度が下がる。経営には「将来の利息が増える借金」として説明する。' },
  { term: 'Build vs Buy', kana: 'びるどばーすばい', category: 'ビジネス', desc: '「自作するか、既製品/SaaSを買うか」の判断軸。中核の強みは自作、それ以外は買うが原則。' },
  { term: '要件定義', kana: 'ようけんていぎ', category: 'ビジネス', desc: '「何を作るか」を明文化する工程。「言われたもの」をそのまま作るのではなく、背景の課題まで深掘りするのが一人前。' },
  { term: '見積もり', kana: 'みつもり', category: 'ビジネス', desc: '作業の工数・納期の予測。不確実性を隠さず「幅」で伝えるのが誠実。' },
  // AI時代
  { term: 'プロンプト', kana: 'ぷろんぷと', category: 'AI時代', desc: 'AIへの指示文。「なんとなく」ではなく、要件を言語化して渡すほど出力の質が上がる。' },
  { term: 'ハルシネーション', kana: 'はるしねーしょん', category: 'AI時代', desc: 'AIが「もっともらしい嘘」を生成すること。AIの出力は鵜呑みにせず、必ず検証する姿勢が求められる。' },
  { term: '検証（ベリファイ）', kana: 'けんしょう', category: 'AI時代', desc: 'AIが書いたコードが正しいか、テスト実行・コード読解・エラー解析で確認すること。AI時代のエンジニアの中核スキル。' },
  { term: 'トレードオフ', kana: 'とれーどおふ', category: 'AI時代', desc: '「何かを得ると何かを失う」という設計上の両立しなさ。速度 vs 安全性など。「正解」ではなく「判断」が問われる領域。' },
]

export const GlossaryPage: FC = () => {
  return (
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-book text-amber-400 mr-2"></i>用語集
      </h1>
      <p class="text-gray-400 mb-10 leading-relaxed">
        レッスンで出てくる専門用語を、初学者向けの一言説明つきでまとめました。
        分からない言葉に出会ったら、ここに戻って確認してください。
      </p>

      {categories.map((cat) => {
        const list = terms.filter((t) => t.category === cat)
        if (list.length === 0) return null
        return (
          <section class="mb-12">
            <h2 class="text-xl font-bold mb-4 pb-2 border-b border-dojo-700">
              <i class="fa-solid fa-tag text-amber-400 mr-2 text-sm"></i>
              {cat}
              <span class="text-sm font-normal text-gray-500 ml-2">{list.length}語</span>
            </h2>
            <div class="space-y-3">
              {list.map((t) => (
                <div class="bg-dojo-800 border border-dojo-700 rounded-xl p-5 hover:border-amber-400/40 transition">
                  <div class="flex flex-wrap items-baseline gap-x-3 mb-2">
                    <h3 class="font-bold text-amber-300">{t.term}</h3>
                    <span class="text-xs text-gray-500">{t.kana}</span>
                  </div>
                  <p class="text-sm text-gray-300 leading-relaxed">{t.desc}</p>
                  {t.example && (
                    <pre class="mt-3 bg-dojo-950 border border-dojo-700 rounded-lg px-3 py-2 text-xs text-amber-200 overflow-x-auto">
                      <code>{t.example}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <div class="bg-amber-400/10 border border-amber-400/30 rounded-xl p-6 text-center">
        <p class="text-sm text-gray-200 mb-4">
          用語の意味が分かったら、レッスンで「手を動かして」定着させましょう。
        </p>
        <a
          href="/tracks"
          class="inline-block bg-amber-400 text-dojo-950 font-bold px-6 py-2 rounded-lg hover:bg-amber-300 transition text-sm"
        >
          <i class="fa-solid fa-book-open mr-2"></i>カリキュラムへ戻る
        </a>
      </div>
    </div>
  )
}
