# 一人前エンジニア道場 — 実装ブリーフ（Claude Code向け）

## 0. 重要な経緯（必ず読むこと）

Gensparkのエージェントから最終的な「アーキテクチャ仕様書」（`ARCHITECTURE.md`）が届き、実際のGitHubリポジトリ https://github.com/nixon1140-cpu/engineer-dojo-app のルートに**コミット済み**（`b681a05`）であることを確認した。

**最重要の確定事項**: このリポジトリには`ARCHITECTURE.md`だけでなく、**動作する実ソースコード一式が既にpush済み**（`src/`・`public/static/app.js`・`package.json`等）。以前のブリーフにあった「ゼロから再構築する」という前提は誤りであり、破棄する。**Claude Codeはこのリポジトリをclone/pullし、既存の実ファイルに対して直接パッチを当てる**（新規セットアップ・再実装は不要）。

`git clone`した上で`npm install && npm run build`まで実行し、正常にビルドが通ること（`dist/_worker.js` 523.86kB / gzip 166.70kB）を確認してから着手すること。

## 1. 確定した技術スタック（`package.json`実物より）

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
- **デプロイ先**: Cloudflare Pages / Workers（`hono/cloudflare-workers`からのimportが必須）
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
└── style.css    ← renderer.tsxからは未参照（削除候補、13章参照）
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

## 9. 改修時に必ず守る規約（既存コードのパターンを壊さないため）

- **新トラック追加**: `src/data/tracks/{name}.ts`作成→`data/index.ts`にspread→`tracks.tsx`の`colorMap`に新色を静的追加→`app.js`の`prefixes`辞書に`trackId: 'prefix-'`を追加（忘れるとダッシュボードの進捗バーが壊れる）
- **新シナリオ追加**: `scenarios.ts`配列末尾に追記。`Scenario`型の必須フィールドは`id/title/skill/difficulty/minutes/situation/steps/debrief`（`intro`ではなく`situation`。7章の修正後は全シナリオがこの型に統一される）
- **新ページ追加**: `src/pages/{name}.tsx`作成→`src/index.tsx`にルート追加→`renderer.tsx`のナビに追加（モバイル幅注意）→`app.js`に対応セクション追記（IIFEで囲む）
- **SSR→クライアントJSのデータ受け渡し**: data属性／`<script type="application/json">`／`id="scenario-data"`の3方式。`<`は`&lt;`にエスケープ済み（`lesson.tsx`/`scenarios.tsx`のmd()関数）。このパターンを壊さないこと

## 10. ビルド・確認コマンド

```bash
git clone https://github.com/nixon1140-cpu/engineer-dojo-app.git
cd engineer-dojo-app
npm install
npm run build            # 所要 ~700ms、dist/_worker.js 523.86kB(gzip 166.70kB)であることを確認
npx tsc --noEmit          # 7章の型エラー修正後、0件になることを確認
```

## 11. 進め方（全て承認済み・今回ラウンドで実施）

1. リポジトリをclone、`npm install && npm run build`で現状のビルドが通ることを確認
2. 7章の型エラー9件（＋#10のcolorMap lime不足）を一括修正 → `tsc --noEmit`が0件になることを確認
3. 8章のLinux & Dockerトラックを追加（8-1〜8-4）→ `tracks.length`が18、`totalLessonCount()`が62になることを確認
4. 6章の3タスク（レスポンシブヘッダー／進捗エクスポート・インポート／textareaモバイル属性）を実装
5. `README.md`の数値表記を更新（3章・8-4参照）
6. 各ステップ完了ごとにTomitaさんの確認を取ってから次に進み、区切りの良いところで`git add`→コミット（pushはTomitaさんの承認後）
