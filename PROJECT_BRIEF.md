# 一人前エンジニア道場 — 実装ブリーフ（Claude Code向け）

## 0. 重要な経緯（必ず読むこと）

Gensparkのエージェントから最終的な「アーキテクチャ仕様書」（`ARCHITECTURE.md`）が届き、実際のGitHubリポジトリ https://github.com/nixon1140-cpu/engineer-dojo-app のルートに**コミット済み**（`b681a05`）であることを確認した。

**最重要の確定事項**: このリポジトリには`ARCHITECTURE.md`だけでなく、**動作する実ソースコード一式が既にpush済み**（`src/`・`public/static/app.js`・`package.json`等）。以前のブリーフにあった「ゼロから再構築する」という前提は誤りであり、破棄する。**Claude Codeはこのリポジトリをclone/pullし、既存の実ファイルに対して直接パッチを当てる**（新規セットアップ・再実装は不要）。

`git clone`した上で`npm install && npm run build`まで実行し、正常にビルドが通ること（`dist/_worker.js` 523.86kB / gzip 166.70kB）を確認してから着手すること。

## 1. 確定した技術スタック（`package.json`実物より）

> **注**: 以下は初回handoff時点（Cloudflare Pages/Workers向け）のスナップショット。7章 Stage B（Cloudflare関連の完全撤去）以降の最新構成は13章末尾の実装結果を参照。

```json
{
  "name": "webapp",
  "type": "module",
  "dependencies": { "hono": "^4.13.3" },
  "devDependencies": {
    "@hono/vite-build": "^1.11.1",
    "@hono/vite-dev-server": "^0.26.1",
    "vite": "^8.1.4",
    "wrangler": "^4.110.0"
  }
}
```

- **フレームワーク**: Hono 4.13.3 + TypeScript（Next.jsではない）
- **レンダリング**: `hono/jsx-renderer` によるSSR（SPA不使用、クライアントは`public/static/app.js`の素のJS）
- **デプロイ先**: Cloudflare Pages / Workers（`hono/cloudflare-workers`からのimportが必須）※Stage B以降はGitHub Pages一本化・撤去済み
- **状態管理**: サーバー状態・外部API一切なし。全て`localStorage`
- **ビルド**: Vite 8.1.4 + `@hono/vite-build/cloudflare-pages`
- **スタイル**: Tailwind CSS CDN（JITビルド時生成なし。動的クラス名`` `bg-${color}-400` ``は機能しないため、`colorMap`で全色を静的に列挙する方式を踏襲する）
- **アイコン**: Font Awesome 6.4.0（CDN）
- **SQL演習**: `sql.js` 1.10.2（WASM、CDN動的ロード）
- **コーディング演習の実行**: Web Worker（5秒タイムアウト）でサンドボックス実行
- **インタラクション**: `public/static/app.js` 1447行（IIFEでセクション分割）

## 2. ディレクトリ構造（実ファイル確認済み）

```
src/
├── types.ts                   ← 全型定義
├── index.tsx                  ← ルーティング（Honoのapp.get全集約）
├── renderer.tsx                ← 共通レイアウト（<head>, ナビ, フッター）※ヘッダーはここ
├── data/
│   ├── index.ts               ← 全トラック結合・getTrack/getScenario/findLesson等
│   ├── scenarios.ts           ← 15シナリオを1ファイルに全集約
│   ├── daily-quiz-pool.ts
│   └── tracks/
│       ├── beginner.ts   （Track 1個: beginner）
│       ├── tech.ts       （★Track 4個: frontend / backend / infrastructure / database）
│       ├── git.ts        （Track 1個: git）
│       ├── http.ts       （Track 1個: http-api）
│       ├── testing.ts    （Track 1個: testing）
│       ├── practice.ts   （Track 1個: practice）
│       ├── ai-dev.ts     （Track 1個: ai-dev）
│       ├── portfolio.ts  （Track 1個: portfolio）
│       ├── business.ts   （★Track 3個: marketing / management / sales）
│       ├── dx-scenario.ts（Track 1個: dx-scenario）
│       ├── ai-era.ts     （Track 1個: ai-engineering）
│       ├── career-strategy.ts（Track 1個: career-strategy）
│       └── linux-docker.ts（★新規・8章参照／Track 1個: linux-docker）
└── pages/
    ├── home.tsx, tracks.tsx, lesson.tsx, scenarios.tsx
    ├── dashboard.tsx, glossary.tsx, daily-quiz.tsx
    ├── weakness-map.tsx, self-analysis.tsx

public/static/
├── app.js       ← 全インタラクション（1447行）
├── styles.css   ← 実際にrenderer.tsxから参照されている本体CSS
└── style.css    ← renderer.tsxからは未参照（削除候補、9-7参照）
```

**★重要な訂正**: データファイルは12本だが、`tech.ts`が4個（frontend/backend/infrastructure/database）、`business.ts`が3個（marketing/management/sales）のTrackオブジェクトを1ファイルにまとめているため、**実際のトラック数（`tracks`配列の要素数）は17個**。ダッシュボードの進捗バーが17本表示されるのはこのため（以前のブリーフで「12トラックのはずが17本表示される」としていた不整合、および直前のドラフトで`tech.ts`を3個と誤記していた点はこれで解消）。

## 3. コンテンツ規模（実ファイルから実測・確定値／8章のLinux&Docker追加後の見込み値も併記）

| 項目 | 現状 | 8章追加後 |
|---|---|---|
| トラック数（Track配列要素） | 17 | 18 |
| データファイル数 | 12 | 13 |
| レッスン総数 | 58 | 62 |
| 実践シナリオ数 | 15 | 15（変更なし） |
| 用語集 | 56語★ | 60語 |
| ビルドサイズ | 523.86kB（gzip 166.70kB） | 実装後に再計測 |

トラック数・レッスン総数・シナリオ数は`home.tsx`/`tracks.tsx`/`dashboard.tsx`いずれも`tracks.length`・`totalLessonCount()`・`scenarios.length`から動的算出しており、**ハードコードされた数値は存在しない**（実ファイル確認済み）。したがってトラック追加時にUI側の数値を手動修正する必要はない。ただし`README.md`本文中の「17トラック／58レッスン」等の記述は静的テキストのため、8章の追加後は手動更新が必要。

★用語集の56語は、`README.md`/`ARCHITECTURE.md`側の自己申告（「70語」）を実際に`glossary.tsx`を数えて訂正した値（旧ブリーフ・実装指示書に記載していた「70語→74語」は誤りだったため本版で修正）。8章の新規4語を足した実装後の正しい目標値は60語。

## 4. localStorageキー一覧（確定・全5種）

| キー | 型 | 内容 |
|---|---|---|
| `dojo-progress-v1` | `{lessons:{[id]:timestamp}, quiz:{[id]:true}, scenarios:{[id]:{score,max,at}}}` | メイン進捗 |
| `dojo-skills-v1` | `{[lessonId]: 'ok' \| 'partial' \| 'ng'}` | スキルチェック |
| `dojo-daily-quiz-v1` | `{history:{[dateKey]:{answers,correct}}, streak, lastDate}` | デイリークイズ |
| `dojo-reviews-v1` | `[{id,nextReview,intervals}]` | 忘却曲線復習キュー |
| `dojo-self-analysis-v1` | `{occupation, industry, skills, summary, updatedAt}` | 自己分析WS |

`window.Dojo`API（`app.js`内）: `completeLesson(id)` / `isLessonDone(id)` / `recordQuiz(id,correct)` / `recordScenario(id,score,max)` / `get()` / `reset()`

## 5. Lesson型の演習フィールド（`types.ts`実物・4種）

| フィールド | 説明 |
|---|---|
| `quiz?` | 4択クイズ |
| `codeExercise?` | コード読解→4択（textareaなし） |
| `codingChallenge?` | 実装演習（Web Worker実行）← textareaあり |
| `sqlChallenge?` | ブラウザ内SQLite演習（sql.js WASM）← textareaあり |

## 6. 承認済み改善タスク（対象ファイル確定済み）

### 6-1. レスポンシブヘッダー（優先度: 高）
- **対象**: `src/renderer.tsx`
- `md`未満でハンバーガーメニューに切替。リンク構成・順序・遷移先は変更しない。

### 6-2. 進捗エクスポート／インポート（優先度: 中）
- **対象**: `src/pages/dashboard.tsx`（UI）＋`public/static/app.js`のダッシュボード描画セクション
- `dojo-`プレフィックス一致の**5キー全て**を1JSONにまとめてダウンロード／復元する。
- 不正なJSON（構文エラー・`data`欠如・プレフィックス不一致）はエラー表示のみで既存データを変更しない。

### 6-3. コード演習欄のモバイル入力属性（優先度: 低）
- **対象**: `src/pages/lesson.tsx`の`codingChallenge`・`sqlChallenge`描画ブロック
- `autocapitalize="off" autocorrect="off" autocomplete="off"`を追加
- `codeExercise`（textareaなし）には適用しない

## 7. 【新規】実機`tsc --noEmit`で検出した型エラー（要修正・優先度: 中〜低）

`ARCHITECTURE.md`の「13. 既知の問題」には`domain-dx-proposal`シナリオの1件のみ記載されていたが、実際に`npm install && npx tsc --noEmit`を実行したところ、**ビルド（`vite build`）は通るが型チェックでは以下9件がエラーになる**ことを確認した（`vite build`はesbuildによるトランスパイルのみで型チェックをしないため、これまで気づかれずに残っていたと考えられる）。DX品質（保守性）の観点から、着手前に一括修正することを推奨する。

| # | ファイル | エラー内容 | 修正方針 |
|---|---|---|---|
| 1 | `src/data/scenarios.ts` (L880) | `interview-intro`が`intro:`使用（正しくは`situation:`） | `intro:`→`situation:`に変更 |
| 2 | `src/data/scenarios.ts` (L974) | `tech-interview`が`intro:`使用 | 同上 |
| 3 | `src/data/scenarios.ts` (L1093) | `reverse-questions`が`intro:`使用 | 同上 |
| 4 | `src/data/scenarios.ts` (L1187) | `domain-dx-proposal`が`intro:`使用＋未定義の`personas:`使用 | `intro:`→`situation:`、`personas:`は削除（`steps[].speaker`等で代替済みのため実害なし） |
| 5 | `src/data/tracks/portfolio.ts` (L176) | `SqlChallenge`型に存在しない`schema`プロパティを使用（`schemaSql`と重複） | 未使用の`schema:`キーを削除 |
| 6 | `src/data/tracks/practice.ts` (L6) | `practice`Trackが`tagline`・`outcomes`（型必須）を欠落 | 他トラックに倣い2フィールドを追加 |
| 7 | `src/index.tsx`（複数箇所）＋`src/renderer.tsx` (L3) | `c.render(<X/>, {title})`の第2引数が型エラー（`hono`モジュールの`ContextRenderer`拡張宣言が未実装） | `renderer.tsx`に`declare module 'hono' { interface ContextRenderer { (content, props?: {title?: string}): Response } }`を追加 |
| 8 | `src/pages/lesson.tsx` (L149) | `spellcheck="false"`が文字列でboolean型と不一致 | `spellcheck={false}`に変更 |
| 9 | `src/pages/lesson.tsx` (L225) | 同上（sql-editor側） | 同上 |

**この7件（#4以外）は`domain-dx-proposal`以外の3シナリオにも同じ`intro`/`situation`不整合が波及していたことを含め、Genspark側の自己申告には出てこなかった実測ベースの追加検出**。修正は型定義との整合を取るだけで、UI・データ内容・挙動には影響しない見込み。

**【新規・型エラーではないが実害あり】#10 `beginner`トラックの配色が意図通り表示されていない**：`src/data/tracks/beginner.ts`は`color: 'lime'`を指定しているが、`src/pages/tracks.tsx`の`colorMap`には`lime`のエントリが無い（`sky/emerald/orange/purple/pink/amber/teal/violet/rose/indigo/cyan`の11色のみ定義）。`getColor()`は未定義色を`amber`にフォールバックする実装のため、**入門トラックはlime（意図した配色）ではなく実際にはamberで表示されている**。TypeScriptの型（`color: string`）では検出できないため`tsc`エラーには出ないが、実装時に`colorMap`へ`lime`を追加して修正することを推奨する（8章の新規トラックでも新色が必要なため、あわせて追加する）。

## 8. 【承認済み・今回ラウンドで実装】新規トラック追加：Linux & Docker基礎

RUNTEQのスキルチェックリストとの突合の結果、Linux／コマンドライン／OS基礎概念、Docker／コンテナ技術は全17トラック・58レッスンに一切ヒットせず完全に欠落していることを確認した（Webセキュリティは独立トラックではないが`tech.ts`/`ai-dev.ts`に演習付きで分散実装済みのため対象外）。Tomitaさんの回答により、**新規トラックとして追加し、今回の実装ラウンドに含める**ことが確定。以下がそのまま実装できる設計。

### 8-1. Track定義

- **ファイル**: `src/data/tracks/linux-docker.ts`（新規）
- **id**: `linux-docker` / **category**: `tech` / **icon**: `fa-terminal` / **color**: `fuchsia`（新規追加、8-4参照）
- **title**: 「開発環境とインフラ基礎（Linux・Docker）」
- **tagline**: 「『動かないコード』から『どこでも動くコード』へ——OSとコンテナの基礎体力」
- **description**: 「ターミナル操作・権限・プロセスの基本から、コンテナ技術（Docker）の考え方までを扱う。サーバーの多くがLinuxで動き、環境差異を無くす手段としてコンテナが標準になった今、避けて通れない基礎体力を身につける。」
- **outcomes**:
  - ターミナルでのファイル操作・権限管理を一人でこなせる
  - プロセスと環境変数の役割を説明できる
  - コンテナとイメージの違い、Dockerを使う理由を説明できる
  - Dockerfile / docker-compose.ymlを読んで何が起きるか説明できる
- **配置**: `data/index.ts`のtracks配列で`testingTracks`の後・`practiceTracks`の前に挿入（STEP2の技術トラック群内、既存のインフラ系トラックに近い位置）
- **レッスンIDプレフィックス**: `ld-`（1トラック1プレフィックスの既存規約を厳守。Linux/Dockerの2チャプターをまたいでも`ld-1-1`〜`ld-2-2`と通し番号にする）

### 8-2. 第1章: Linuxの基本操作（chapter id: `linux-basics`）

**レッスン `ld-1-1`「なぜCLIを使うのか：ファイル・ディレクトリ操作の基本」**（20分）
- intro: GUIで一つずつクリックする作業は100台のサーバーには通用しない。エンジニアが最初に身につけるべき共通言語がコマンドライン。
- content: ①クラウドの裏側はほぼLinuxで動きGUIを持たないためCLIが唯一の操作手段 ②`pwd`/`ls -la`/`cd`/`mkdir`/`cp`/`mv`/`rm`の基本 ③絶対パス（`/`から）と相対パス（`./` `../` `~`）の違い ④`man`/`--help`をAIより先に自分で引く習慣
- points: pwd/ls/cd/mkdir/cp/mv/rmの7つで実務の8割は動く／相対パスの`./`と`../`の違いを常に意識する／man/--helpをまず自分で引く
- quiz: 「`/home/user/project`にいる状態で`cd ../data`を実行するとどこに移動するか」→ 正解「`/home/user/data`」（`../`で1つ上の`/home/user`に上がりそこから`data`へ）。誤答2種：「`/home/user/project/data`」（それは`./data`の場合）「`/data`」（絶対パス指定が必要）をwhy付きで用意。

**レッスン `ld-1-2`「権限・プロセス・環境変数」**（20分）
- intro: 「Permission denied」に一度もぶつからずにLinuxを使うエンジニアはいない。権限の仕組みを理解すればこのエラーは怖くなくなる。
- content: ①owner/group/otherそれぞれのr/w/x権限、`ls -l`の`-rwxr-xr--`表示、`chmod 755`のような数値指定（r=4,w=2,x=1の合計）②`ps`でプロセス一覧、`kill プロセスID`で終了、`kill -9`は最終手段 ③環境変数と`PATH`、APIキーやパスワードをコードに直書きせず`.env`に置く理由（`ai-dev`トラックのセキュリティ内容と接続）
- points: rwx権限とchmodの数値指定を読み解ける／psでプロセス確認・killで終了できる／秘密情報を環境変数に置く理由を説明できる
- quiz: 「権限`-rw-r--r--`（644）の正しい説明は」→ 正解「所有者は読み書き可能、グループとその他は読み取りのみ」。誤答2種（「全員が読み書き実行可能＝777の話」「誰もアクセスできない＝r--が3箇所ともあり全員読み取り可能」）をwhy付きで用意。

### 8-3. 第2章: コンテナ技術入門（chapter id: `docker-basics`）

**レッスン `ld-2-1`「なぜコンテナか：VMとの違い、イメージとコンテナ」**（20分）
- intro: 「私の環境では動くのに本番では動かない」を終わらせたのがDocker。
- content: ①コンテナはアプリと実行環境をまとめてパッケージ化、VMはOSごと仮想化するのに対しコンテナはホストOSのカーネルを共有し軽量 ②イメージ＝設計図（読み取り専用）、コンテナ＝そこから起動された実行中インスタンス ③Docker Hub等のレジストリから`docker pull`、自作イメージは`Dockerfile`から`docker build` ④環境構築手順書ではなく実行可能なコードとして共有できることがDX上の本質的価値
- points: VMとの違い＝ホストOSカーネル共有で軽量／イメージ＝設計図、コンテナ＝実行中インスタンス／環境構築を「コード」として共有できることがDXの本質
- codeExercise: 新メンバーが「READMEの手順通りでもNode.jsのバージョンが違ってエラーが出る」と相談。`FROM node:20-alpine`から始まる簡単なDockerfile（WORKDIR/COPY/RUN npm install/COPY ./CMD npm start）を提示し「この問題はどうなるか」を問う→ 正解「解決される。誰が`docker build`しても同じベースイメージからNode.jsのバージョンが統一される」。誤答2種（「Dockerを使ってもローカルのNode.jsが使われる」「COPYの順序を変えないと解決しない＝キャッシュ効率の話で無関係」）をwhy付きで用意。

**レッスン `ld-2-2`「Dockerfile・docker-composeの読み書き」**（25分）
- intro: Dockerfileの1行1行が読めれば、他人（やAI）が書いた環境構築コードのレビューができるようになる。
- content: ①`FROM`/`WORKDIR`/`COPY`/`RUN`/`CMD`各命令の役割 ②`docker build -t myapp .`→`docker run -p ホスト:コンテナ myapp`のポートマッピング ③複数コンテナ構成は`docker-compose.yml`の`services:`配下に`image`/`build`/`ports`/`volumes`/`environment`を書き`docker compose up`で一括起動 ④`volumes`はコンテナ削除後もデータを残す仕組みで実務では必須
- points: FROM/WORKDIR/COPY/RUN/CMDの役割を説明できる／ポートマッピング（ホスト:コンテナ）の意味を理解している／docker-composeで複数コンテナ・volumesの必要性を説明できる
- codingChallenge: `parsePortMappings` — docker-composeの`ports`設定（`["8080:80","5432:5432"]`のような文字列配列）を`{host,container}`オブジェクトの配列に変換する関数。
  ```js
  // starterCode
  function parsePortMappings(ports) {
    // ports: ["8080:80", "5432:5432"] のような文字列配列
    // 戻り値: [{ host: "8080", container: "80" }, ...]
    // ":" で分割する
  }
  // solution
  function parsePortMappings(ports) {
    return ports.map((p) => {
      const [host, container] = p.split(':')
      return { host, container }
    })
  }
  ```
  tests: `fn(["8080:80"])`→`[{"host":"8080","container":"80"}]` ／ `fn(["8080:80","5432:5432"])`→2要素 ／ `fn([])`→`[]`
  hints: `port.split(':')`で`[host, container]`になる／`ports.map(p => {...})`／JSON.stringifyでの比較なのでキー順序（host→container）に注意

### 8-4. 実装時に追加で必要な変更（既存規約どおり・忘れると壊れる）

- `src/data/index.ts`: `linuxDockerTracks`をimportし、`testingTracks`の後・`practiceTracks`の前にspread
- `src/pages/tracks.tsx`の`colorMap`: `fuchsia`エントリを新規追加（例: `{ text: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'hover:border-fuchsia-400/60' }`）。ついでに7章#10の`lime`エントリも追加して`beginner`トラックの配色バグを解消する
- `public/static/app.js`の`prefixes`辞書: `'linux-docker': 'ld-'`を追加（進捗バー計算に必須）
- `src/pages/glossary.tsx`: 用語集に4語追加（カテゴリ「技術」）
  - コンテナ／Dockerイメージ／chmod／環境変数（内容例は当セクションの各レッスン説明を参照。「環境変数」は既存の用語と重複しないか確認し、重複する場合は既存側を活かして本レッスンからの追加はスキップする）
- `README.md`の「17トラック／58レッスン／70語」等の静的記述を「18トラック／62レッスン／60語」に更新（3章参照。用語集の元の「70語」自体がREADME側の誤記だった点に注意）

## 9. 【承認済み・第2ラウンド】RUNTEQ未充足4項目＋残ギャップ3点を全て解消

8章までの実装（第1ラウンド）はGitHub上のmainに反映済み。「道場レビュー」で『十分』と判定されなかったRUNTEQ4項目（Webセキュリティ／インフラ・クラウド／デザイン・コーディング／テスト手法）と、残った小さなギャップ3点（薄い3トラック／UI・UXデザイン原則の欠如／モバイル全体監査）を、この第2ラウンドで全て解消する。

### 9-1. 新規トラック: Webセキュリティ（RUNTEQ「Webセキュリティ」を独立トラック化）

- **ファイル**: `src/data/tracks/web-security.ts`（新規）
- **id**: `web-security` / **category**: `tech` / **icon**: `fa-shield-halved` / **color**: `red`（新規追加）
- **title**: 「Webセキュリティの基礎」
- **tagline**: 「なんとなく動くコードから、狙われても壊れないコードへ」
- **outcomes**: 認証と認可を区別して設計できる／CSRF・セッション管理の基本を説明できる／OWASP的な視点でコードをレビューできる／秘密情報とAPIを安全に扱える
- **配置**: `data/index.ts`で`practiceTracks`の後・`aiDevTracks`の前にspread（tech系トラック群の末尾）
- **レッスンIDプレフィックス**: `sec-`

**第1章: 認証・認可とセッション管理（chapter id: `security-auth`）**

`sec-1-1`「認証(Authentication)と認可(Authorization)を区別する」（20分）
- content: ①認証＝本人確認、認可＝権限確認の違い ②セッション管理・CookieのhttpOnly/secure属性 ③JWTの仕組みと失効の難しさ ④「認証だけ確認して認可を忘れる」事故パターン
- quiz: 「ログイン済みユーザーがURLの投稿IDを書き換えて他人の投稿を削除できてしまった。何が抜けていたか」→正解「認可の確認」（誤答2種にwhy付き）

`sec-1-2`「CSRF対策とHTTPS」（20分）
- content: ①CSRFはCookieの自動送信を悪用する攻撃 ②CSRFトークンと`SameSite`Cookieの組み合わせが基本対策 ③HTTPSが必須である理由（盗聴・改ざん防止）④`secure`属性とCSRF対策はセットで考える
- codeExercise: CSRFトークンの無い送金フォームを提示し問題点を問う→正解「意図しない送金を実行される危険がある（CSRF）」（誤答2種にwhy付き）

**第2章: 実践的なセキュアコーディング（chapter id: `security-practice`）**

`sec-2-1`「セキュリティレビューの視点（OWASP的な考え方）」（20分）
- content: ①OWASP Top10という共通言語 ②パストラバーサル・安全でないデシリアライゼーションの概要 ③「入力→検証→利用」を辿るレビューの視点 ④完璧より「明らかに危険なパターンを見逃さない」現実的なゴール
- quiz: 「`fs.readFile(userInput)`のようにユーザー入力をそのままファイルパスに使っている。最も警戒すべき攻撃は」→正解「パストラバーサル」（誤答2種にwhy付き）

`sec-2-2`「秘密情報管理と安全なAPI設計」（25分）
- content: ①秘密情報は環境変数で管理（Linux&Dockerトラックと接続）②レート制限の目的 ③サーバー側検証が必須な理由 ④最小権限の原則
- codingChallenge: `isValidApiKeyFormat` — `sk_live_`/`sk_test_`+32文字英数字の形式を検証する関数（正規表現`/^(sk_live_|sk_test_)[a-zA-Z0-9]{32}$/`、starterCode/tests4件/hints/solution完備）

### 9-2. 既存`infrastructure`トラックの拡充（RUNTEQ「インフラ・クラウド」を十分な水準に）

`src/data/tracks/tech.ts`の`infrastructure`Trackに第3章を追加（既存3レッスン→6レッスンに拡充。「薄いトラック」の解消も兼ねる）。

**第3章: クラウドの基礎（chapter id: `infra-cloud`）**

`infra-3-1`「クラウドの基本概念（IaaS/PaaS/SaaS）」（20分）
- content: ①IaaS/PaaS/SaaSの違い ②PaaS/SaaSの利点（スケーリング・トイル削減）③責任共有モデル ④このアプリ自体がCloudflare Pages/Workersで動いている実例
- quiz: 「このアプリはCloudflare Pages/Workers上で動いている。どの分類に近いか」→正解「PaaS」（誤答2種にwhy付き）

`infra-3-2`「主要クラウドサービスの使い分け」（20分）
- content: ①サーバー型とサーバーレス型のコンピュート ②オブジェクトストレージとDBの違い ③CDNの役割 ④マネージドサービスとトイル削減
- quiz: 「アクセスの少ない個人開発APIをコストを抑えて動かしたい」→正解「サーバーレス型」（誤答2種にwhy付き）

`infra-3-3`「CI/CDの基礎」（20分）
- content: ①CI（push毎の自動ビルド・テスト、今回の実装作業と同じ発想）②CD（テスト通過後の自動デプロイ）③パイプラインの流れ ④CI/CDがトイル削減の代表例である理由
- codeExercise: 手動SSH+手動デプロイ運用を提示し問題点を問う→正解「手順が属人化し打ち忘れ・打ち間違いが起きやすい」（誤答2種にwhy付き）

### 9-3. 既存`frontend`トラックの拡充（RUNTEQ「デザイン・コーディング」のデザイン面を追加）

`src/data/tracks/tech.ts`の`frontend`Trackに第3章を追加（既存4レッスン→7レッスンに拡充）。

**第3章: UI/UXデザインの基礎（chapter id: `fe-design`）**

`fe-3-1`「配色・タイポグラフィ・余白の原則」（20分）
- content: ①配色は「メイン+アクセント+グレースケール」の最小構成（この道場自体がdojo-900系+amber-400の実例）②見出しと本文のサイズ差で情報階層を伝える ③余白は情報を区切る道具 ④コントラスト比の目安（WCAG推奨4.5:1）
- quiz: 「文字色#999999・背景色#FFFFFFの本文」→正解「コントラスト比が低く読みにくい」（誤答2種にwhy付き）

`fe-3-2`「アクセシビリティの基礎」（20分）
- content: ①アクセシビリティ(a11y)の考え方 ②alt属性・label要素・キーボード操作対応 ③色だけで情報を伝えない（道場のスキルチェックの◎/○/△+テキスト併用が好例）④一時的な制約も含めた全ユーザーの使いやすさ
- quiz: 「`<img src="delete.png">`にaltが無い」→正解「スクリーンリーダー利用者に意味が伝わらない」（誤答2種にwhy付き）

`fe-3-3`「一貫性のあるUIコンポーネント設計」（20分）
- content: ①デザインシステムの考え方（`colorMap`もその一例）②コンポーネントの再利用性 ③ボタンの状態（通常/ホバー/押下/無効化）の視覚化 ④コンポーネント設計はUIとAPI設計の両面を持つ
- codeExercise: 同じ「削除」ボタンが画面ごとに違う見た目で実装されている例を提示し問題点を問う→正解「一貫性の欠如」（誤答2種にwhy付き）

### 9-4. 既存`testing`トラックの拡充（RUNTEQ「テスト手法」を十分な水準に）

`src/data/tracks/testing.ts`に1レッスン追加＋新規第2章を追加（既存2レッスン→4レッスンに拡充）。

`test-1-3`「結合テストとE2Eテスト」（20分、既存`testing-basics`章に追加）
- content: ①テストピラミッド（単体→結合→E2E）②結合テストが確認する対象 ③E2Eテストを重要導線に絞る理由 ④「全部E2Eで書く」のアンチパターン
- quiz: 「E2Eテストばかり増やして実行に30分以上かかるようになった」→正解「テストピラミッドが逆転している」（誤答2種にwhy付き）

**第2章: テスト戦略と自動化（chapter id: `testing-strategy`）**

`test-2-1`「モック・スタブとテストの自動化」（25分）
- content: ①モックとスタブの違い ②外部依存をモック化する理由（テストの不安定さ解消）③CIでのテスト自動化（9-2のCI/CDと接続）④テスト自動化がAI生成コードの検証を仕組み化する
- codingChallenge: `createMockFetch` — 指定したJSONを常に返す偽の`fetch`関数を作る（starterCode/tests/hints/solution完備）

### 9-5. 既存`http-api`トラックの拡充（薄いトラックの解消）

`src/data/tracks/http.ts`に1レッスン追加＋新規第2章を追加（既存2レッスン→4レッスンに拡充）。

`http-1-3`「RESTfulなAPI設計の原則」（20分、既存`http-basics`章に追加）
- content: ①URLはリソース、メソッドは操作 ②冪等性とHTTPメソッドごとの冪等性 ③ネストしたリソースは2階層程度に ④APIバージョニングの目的
- quiz: 「決済APIが`POST /payments`で、ネットワーク不安定により同じリクエストが2回送られた」→正解「POSTは冪等でないため決済が2回実行される可能性がある」（誤答2種にwhy付き）

**第2章: API認証と実践（chapter id: `http-auth`）**

`http-2-1`「認証方式の使い分け」（20分）
- content: ①APIキー（実装は簡単だが漏洩リスク）②OAuth（認可の委譲、セキュリティトラックと接続）③JWT（署名付きトークン）④用途による選び方の目安
- quiz: 「『Googleでログイン』機能を追加したい」→正解「OAuth」（誤答2種にwhy付き）

### 9-6. モバイル全体監査（実ファイル確認済み・修正箇所を特定済み）

grep調査により、`md`/`sm`等のレスポンシブ切替クラスが無い固定`grid-cols-3`を4箇所発見（375px幅で3列に長い日本語ラベルが詰め込まれ窮屈になる）。以下の通り修正する。

| ファイル | 行 | 現状 | 修正後 |
|---|---|---|---|
| `src/pages/dashboard.tsx` | 96 | `grid grid-cols-3 gap-4 mb-6`（全体サマリー） | `grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6` |
| `src/pages/dashboard.tsx` | 112 | `grid grid-cols-3 gap-4 mb-6`（スキルチェック統計） | `grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6` |
| `src/pages/dashboard.tsx` | 134 | `grid grid-cols-3 gap-4 mb-10`（学習時間・ストリーク） | `grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10` |
| `src/pages/weakness-map.tsx` | 32 | `grid grid-cols-3 gap-4 mb-10`（サマリーカード） | `grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10` |

`<table>`要素は全ページ中に存在せず、他ページの`overflow-x-auto`は既に適切に使われているため、上記4箇所以外の追加修正は不要（実ファイル確認済み）。修正後、375px幅で4ページ（`/dashboard`, `/weakness-map`）を実機確認すること。

### 9-7. 実装時に追加で必要な変更（既存規約どおり・忘れると壊れる）

- `src/data/index.ts`: `webSecurityTracks`をimportし、`practiceTracks`の後・`aiDevTracks`の前にspread
- `src/pages/tracks.tsx`の`colorMap`: `red`エントリを新規追加（例: `{ text: 'text-red-400', bg: 'bg-red-400/10', border: 'hover:border-red-400/60' }`）
- `public/static/app.js`の`prefixes`辞書: `'web-security': 'sec-'`を追加
- `src/pages/glossary.tsx`: 用語集に8語追加（カテゴリは内容に応じて「技術」または「AI時代」）
  - CSRF／JWT／IaaS・PaaS・SaaS／CI/CD／アクセシビリティ／モック／冪等性／OAuth（内容例は9-1〜9-5の各レッスン説明を参照。既存用語との重複は確認の上スキップ可）
- `README.md`の「18トラック／62レッスン／60語」等の記述を「19トラック／76レッスン／68語」に更新
- `public/static/style.css`を削除する（`src/`配下のどこからも参照されておらず、中身も`h1 { font-family: Arial... }`のみの死んだファイルであることを実ファイルで確認済み。実際に使われているのは`renderer.tsx`が参照する`styles.css`の方）

### 9-8. 第2ラウンド後のコンテンツ規模（見込み値）

| 項目 | 第1ラウンド後 | 第2ラウンド後 |
|---|---|---|
| トラック数 | 18 | 19 |
| レッスン総数 | 62 | 76 |
| 実践シナリオ数 | 15 | 15（変更なし） |
| 用語集 | 60語 | 68語 |

## 10. 改修時に必ず守る規約（既存コードのパターンを壊さないため）

- **新トラック追加**: `src/data/tracks/{name}.ts`作成→`data/index.ts`にspread→`tracks.tsx`の`colorMap`に新色を静的追加→`app.js`の`prefixes`辞書に`trackId: 'prefix-'`を追加（忘れるとダッシュボードの進捗バーが壊れる）
- **新シナリオ追加**: `scenarios.ts`配列末尾に追記。`Scenario`型の必須フィールドは`id/title/skill/difficulty/minutes/situation/steps/debrief`（`intro`ではなく`situation`。7章の修正後は全シナリオがこの型に統一される）
- **新ページ追加**: `src/pages/{name}.tsx`作成→`src/index.tsx`にルート追加→`renderer.tsx`のナビに追加（モバイル幅注意）→`app.js`に対応セクション追記（IIFEで囲む）
- **SSR→クライアントJSのデータ受け渡し**: data属性／`<script type="application/json">`／`id="scenario-data"`の3方式。`<`は`&lt;`にエスケープ済み（`lesson.tsx`/`scenarios.tsx`のmd()関数）。このパターンを壊さないこと

## 11. ビルド・確認コマンド

```bash
git clone https://github.com/nixon1140-cpu/engineer-dojo-app.git
cd engineer-dojo-app
npm install
npm run build            # dist/_worker.jsのサイズを確認（第1ラウンド後538.01kB/gzip 171.46kB、第2ラウンドで増加見込み）
npx tsc --noEmit          # 0件であることを確認
```

## 12. 進め方（第2ラウンド・全て承認済み）

1. リポジトリをclone（既に第1ラウンドの変更を含むmainブランチ）、`npm install && npm run build`で現状のビルドが通ることを確認
2. 9-1のWebセキュリティトラックを新設 → `tracks.length`が19になることを確認
3. 9-2〜9-5の既存4トラック拡充（infrastructure/frontend/testing/http-api）→ `totalLessonCount()`が76になることを確認
4. 9-6のモバイル対応4箇所を修正 → 375px幅で`/dashboard`・`/weakness-map`を実機確認
5. 9-7の関連ファイル変更（colorMap/prefixes/glossary/README）を漏れなく実施
6. `npx tsc --noEmit`が0件、`npm run build`が正常に通ることを最終確認
7. 各ステップ完了ごとにTomitaさんの確認を取ってから次に進み、区切りの良いところで`git add`→コミット（pushはTomitaさんの承認後）
6. 各ステップ完了ごとにTomitaさんの確認を取ってから次に進み、区切りの良いところで`git add`→コミット（pushはTomitaさんの承認後）

## 13. 【承認済み・第3ラウンド】GitHub Pagesへの静的サイト化（SSG化）

> **注**: 本章で採用した「Cloudflare向けSSR構成を並行して保持する」方針は、後続の7章 Stage B（14章参照）でCloudflare関連が完全撤去されたことにより終了している。本章は当時の設計判断の記録として残す。

### 13-1. 背景・目的

公開先をCloudflare Pagesではなく**GitHub Pages**にする（新規アカウント登録を増やしたくないため。GitHubは既存アカウントで完結する）。GitHub Pagesは静的ファイルのみ配信するため、現状のHono SSR（Cloudflare Workers向け）構成を、**ビルド時に全ページを静的HTMLとして書き出す方式（SSG）**に変換する。

このアプリは全ページがサーバー側の動的データ（DB・外部API・ユーザーセッション）を持たず、`src/data/tracks/*.ts`等の静的配列のみで構成されている（進捗はブラウザのlocalStorageのみ）ため、SSG化しても機能的な後退は無い想定。**既存のCloudflare向けSSR構成（`npm run dev`／`npm run build`／`wrangler`関連）は壊さず残す**（並行して両対応にする）。

### 13-2. 実装内容（着手前に必ず実ファイルで確認すること。行番号・ファイル内容を断定しない）

**a) 静的生成スクリプトの新設**（例: `scripts/generate-static.mts`）

- Honoアプリの`app.request()`（または`app.fetch()`）を使い、ビルド時に全ルートを列挙してHTML文字列を取得し、ファイルに書き出す
- 列挙すべきルート（`src/index.tsx`の`app.get`定義を実ファイルで確認の上、過不足なく列挙すること）:
  - `/`、`/tracks`、`/scenarios`、`/dashboard`、`/glossary`、`/daily-quiz`、`/weakness-map`、`/self-analysis`
  - `/tracks/:id` — `tracks`配列の全`id`分
  - `/lessons/:id` — 全トラック×全チャプター×全レッスンの`lesson.id`分（`findLesson`等の既存ロジックを参考に列挙方法を作る）
  - `/scenarios/:id` — `scenarios`配列の全`id`分
  - `/api/curriculum` — 静的JSONとして書き出す（例: `api/curriculum.json`）
- 出力先はディレクトリ形式（例: `/tracks/web-security` → `dist-pages/tracks/web-security/index.html`）とし、拡張子なしURLでアクセスできるようにする
- `public/static/`配下の既存アセット（`app.js`等）を出力先にそのままコピーする

**b) ベースパス対応（最重要・最も見落としやすい）**

GitHub Pagesのプロジェクトサイトは`https://nixon1140-cpu.github.io/engineer-dojo-app/`のようにサブディレクトリ配信になる。現状のコードは`href="/tracks"`のようなルート絶対パスで書かれている可能性が高く、これらは全てサブディレクトリ配信では壊れる。

- 着手前に必ず `grep -rn 'href="/\|src="/\|fetch("/\|from "/\|"/static/' src/ public/` を実行し、絶対ルートパス参照が実際に何箇所・どのファイルにあるか洗い出してから対応方針を決めること
- 対応方法はViteの`base`設定（`vite.config.ts`の`base`オプション）を使う方法と、Hono側で共通のパスヘルパー関数を作り全リンク生成をそこに通す方法のどちらでもよいが、**どちらか一方の方式に統一**し、混在させないこと
- 既存のCloudflare向けSSR構成（ベースパスが常に`/`のルート配信）には影響を与えないこと（SSG用ビルドとSSR用ビルドで環境変数等により出し分ける）

**c) package.jsonへのスクリプト追加**

- 既存の`dev`／`build`／`preview`／`deploy`（Cloudflare/wrangler用）はそのまま残す
- 新規に静的生成込みのビルドコマンドを追加する（例: `"build:pages": "vite build && node scripts/generate-static.mjs"`）

**d) GitHub Actionsワークフローの新設**（`.github/workflows/deploy-pages.yml`）

- `main`ブランチへのpushをトリガーに、`npm install` → 静的生成ビルド実行 → 出力ディレクトリをGitHub Pagesへデプロイ
- 公式の`actions/configure-pages`・`actions/upload-pages-artifact`・`actions/deploy-pages`の組み合わせを使うこと（サードパーティのデプロイActionは使わない）

**e) 動作確認**

- ローカルで静的生成ビルドを実行し、出力ディレクトリに全ページのHTMLが生成されていることを確認
- `npx serve <出力ディレクトリ>`等でローカルの静的サーバーから確認し、内部リンク・画像・`app.js`の読み込みに404が無いことを確認（ベースパスを設定した場合は、そのサブパス構成を再現して確認すること）
- 既存の`npm run dev`／`npm run build`／`npx tsc --noEmit`が今回の変更後も引き続き正常動作することを確認（Cloudflare向け構成への影響が無いこと）

### 13-3. 受け入れ基準（Definition of Done）

- 静的生成ビルドを実行すると、全ページが静的HTMLとして出力される
- 出力されたHTMLをローカルの静的サーバーで確認し、内部リンク・画像・`app.js`読み込みが全て正常（404無し）
- 既存の`npm run dev`／`npm run build`／`npx tsc --noEmit`が引き続き正常動作する（Cloudflare向け構成を壊していない）
- `.github/workflows/deploy-pages.yml`が追加され、mainへのpushで自動ビルド・デプロイされる設定になっている
- コミット済み・push未実施（pushはTomitaさんの承認後）

### 13-4. Tomitaさん側の作業（Claude Codeでは実施不可）

- リポジトリの GitHub上の Settings → Pages → Source を「GitHub Actions」に変更する（Web UI操作のため、Claude Codeでは代行できない）
- 初回のpush・デプロイ後、実際に公開URL（`https://nixon1140-cpu.github.io/engineer-dojo-app/`）で表示・遷移を確認する

### 13-5. 実装結果（実ファイル確認の上で決定した詳細）

- **静的生成スクリプト**: `scripts/generate-static.mjs`（プレーンJSで実装。理由: `src/index.tsx`はNode ESMのネイティブ拡張子なし相対import解決に対応していないため、実行前にesbuildでNode向けに一時バンドルする方式を採用。TypeScriptの型チェックが不要な単純なビルドスクリプトのため`.mjs`とした）
- **依存追加**: `esbuild`（既にVite経由でnode_modulesに存在していたバージョン`0.28.1`を明示的にdevDependenciesへ追加。Tomitaさん承認済み）
- **ベースパス対応方式**: Hono側の共通パスヘルパー方式を採用（`src/base-path.ts`の`withBase()`）。理由: このコードベースはVite標準のHTML/アセットパイプラインを使わず、`href`はJSX内の文字列リテラルとして書かれているため、Viteの`base`設定だけでは自動的に書き換わらない。ビルド時定数`__BASE_PATH__`（esbuildの`define`で注入、通常ビルドでは未定義=空文字列）を介するため`vite.config.ts`は無改造で、既存Cloudflare向けビルドに一切影響しない。`public/static/app.js`内の3箇所の動的href生成のみ、`renderer.tsx`が埋め込む`window.__BASE_PATH__`をプレーンJSから参照する形で対応（Viteの処理が届かないプレーンJSファイルのため、同じ「ベースパスを一箇所から取得する」という考え方をランタイムで橋渡しする形。方式は統一）
- **出力先**: `dist-pages/`（`.gitignore`に追加）
- **ルート列挙方法**: `/api/curriculum`エンドポイントのレスポンス（`tracks[].lessons[]`・`scenarios[].id`）をそのまま使って`/tracks/:id`・`/lessons/:id`・`/scenarios/:id`を列挙。`findLesson`等と二重管理にならない
- **404対応**: ブリーフに明記はないが、GitHub Pages運用の定石として`dist-pages/404.html`も生成（存在しないパスへのアクセス時にGitHub Pages側が自動的に返す仕組み）
- **`build:pages`スクリプト**: `vite build`は前置せず`node scripts/generate-static.mjs`のみ（生成スクリプト自体がesbuildで独立にバンドルするため、Cloudflare向け`vite build`の実行は不要。実行するとdist/への副作用が生じるだけで静的生成には使われないため）

## 14. 【承認済み・7章 Stage B】Cloudflare関連の完全撤去

GitHub Pages一本化に伴い、13章で「並行保持」としていたCloudflare Pages/Workers・wrangler関連の構成・依存・記述を完全に撤去した。

### 14-1. 実装内容

- `package.json`: `preview`／`deploy`／`cf-typegen`スクリプトを削除。`build`（旧Cloudflare向け）を削除し`build:pages`を唯一の本番ビルドとした。`dev`は`@hono/vite-dev-server/node`（Nodeアダプタ）に変更。`devDependencies`から`wrangler`・`@hono/vite-build`を削除し、`@hono/node-server`を明示的に追加
- `vite.config.ts`: `@hono/vite-build/cloudflare-pages`のbuildプラグインと`@hono/vite-dev-server/cloudflare`アダプタを削除し、`@hono/vite-dev-server/node`アダプタに置き換え
- `wrangler.jsonc`・`ecosystem.config.cjs`を削除
- `src/index.tsx`: `serveStatic`のimportを`hono/cloudflare-workers`から`@hono/node-server/serve-static`に変更（配信ロジック・`root`オプションは変更なし）
- `src/base-path.ts`: コメントのみ実態（Cloudflareではなくローカル開発時の挙動）に合わせて更新。ロジックは無変更
- `README.md`: フレームワーク行・デプロイ節のCloudflare関連記述を削除
- `ARCHITECTURE.md`・`CLAUDE.md`・本ファイル: Cloudflare/wrangler関連記述を削除・簡素化（歴史的な設計判断の記録として残す部分は注記を付けて維持）
- `src/data/tracks/tech.ts`（`infra-3-1`レッスン）・`src/pages/glossary.tsx`（IaaS・PaaS・SaaS用語）: 「このアプリ自体がCloudflare Pages/Workersで動いている」という自己言及を削除し、一般的なPaaSの説明・設問に整理（レッスンID・トラック構成・選択肢の正誤構造は変更なし）
- `src/data/tracks/portfolio.ts`（学生自身のポートフォリオのデプロイ先候補としてのCloudflare Pages+Workers言及）は対象外として変更していない
- `.gitignore`: `.wrangler/`エントリを削除

### 14-2. 動作確認

- `npm install`でpackage-lock.jsonを更新
- `npm run dev`でローカル起動確認（トップ・任意のレッスン・`/tracks/tech`・`/glossary`）
- `npm run build:pages`が成功することを確認
- `npx tsc --noEmit`が0件であることを確認
- `grep -ril -i cloudflare .`（node_modules・dist・dist-pages・package-lock.json除く）で`src/data/tracks/portfolio.ts`以外に言及が残っていないことを確認
