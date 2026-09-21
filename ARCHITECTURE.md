# 一人前エンジニア道場 — アーキテクチャ仕様書・設計書

> **対象読者**: Claude Code など AI コーディングアシスタント  
> **バージョン**: フェーズ4完了版（コミット `ce13780`）  
> **最終更新**: 2026-09-21

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [技術スタック](#2-技術スタック)
3. [ディレクトリ構造](#3-ディレクトリ構造)
4. [ルーティング一覧](#4-ルーティング一覧)
5. [コンテンツアーキテクチャ](#5-コンテンツアーキテクチャ)
6. [型定義（types.ts）](#6-型定義typests)
7. [データフロー](#7-データフロー)
8. [localStorage 管理](#8-localstorage-管理)
9. [app.js セクション構造](#9-appjs-セクション構造)
10. [コアパターン — コンテンツ追加手順](#10-コアパターン--コンテンツ追加手順)
11. [UI 共通パターン](#11-ui-共通パターン)
12. [制約・注意事項](#12-制約注意事項)
13. [既知の問題・修正候補](#13-既知の問題修正候補)
14. [ビルドと確認コマンド](#14-ビルドと確認コマンド)
15. [フェーズ別変更履歴](#15-フェーズ別変更履歴)

---

## 1. プロジェクト概要

**名称**: 一人前エンジニア道場  
**コンセプト**: AI時代に「一人称で活躍する」ためのエンジニア学習プラットフォーム。技術×ビジネス×AI時代の判断力を体系的に身につける。  
**URL構造**: 静的SSR + クライアントJSの純粋なサーバーレス構成。外部API・データベース不使用。

### 現在のコンテンツ規模（フェーズ4）

| 指標 | 数値 |
|------|------|
| トラック数 | 12 |
| 総レッスン数 | 58 |
| 実践シナリオ数 | 15 |
| 用語集エントリ数 | 70 |
| localStorageキー数 | 5 |
| ビルドサイズ | 523.86 kB（gzip: 166.70 kB） |

---

## 2. 技術スタック

```
ランタイム:  Cloudflare Pages (Workers runtime)
フレームワーク: Hono 4.13.3
テンプレート: hono/jsx-renderer (SSR JSX, SPA不使用)
ビルド:     Vite 8.1.4 + @hono/vite-build/cloudflare-pages
型システム:  TypeScript
CSS:        Tailwind CSS CDN（JIT動的生成、カスタムdojoカラー込み）
アイコン:   Font Awesome 6.4.0 CDN
フロントJS: public/static/app.js（素のES5/ES6、フレームワーク不使用）
SQL演習:    sql.js 1.10.2 WASM（CDN動的ロード）
コーディング演習: Web Worker（ブラウザ内実行サンドボックス）
状態管理:   localStorage（サーバー側状態なし）
```

### 依存関係（package.json）

```json
"dependencies": {
  "hono": "^4.13.3"
},
"devDependencies": {
  "@hono/vite-build": "^1.11.1",
  "@hono/vite-dev-server": "^0.26.1",
  "vite": "^8.1.4",
  "wrangler": "^4.110.0"
}
```

---

## 3. ディレクトリ構造

```
/home/user/webapp/
├── src/
│   ├── index.tsx              # Honoアプリ本体（ルーティング定義）
│   ├── renderer.tsx           # jsxRenderer — 共通HTML shell・ナビ・フッター
│   ├── types.ts               # 全型定義（Track/Lesson/Scenario等）
│   ├── data/
│   │   ├── index.ts           # tracks[] の集約・エクスポート・ユーティリティ関数
│   │   ├── scenarios.ts       # 実践シナリオ15本（Scenario[]）
│   │   ├── daily-quiz-pool.ts # デイリークイズ問題プール（~40問）
│   │   └── tracks/
│   │       ├── beginner.ts        # プログラミング基礎（入門）- 4レッスン
│   │       ├── tech.ts            # フロントエンド/バックエンド/インフラ - 19レッスン
│   │       ├── git.ts             # バージョン管理とGit - 3レッスン
│   │       ├── http.ts            # HTTPとAPI基礎 - 2レッスン
│   │       ├── testing.ts         # テストと品質 - 2レッスン
│   │       ├── practice.ts        # 実務型コーディング演習 - 5レッスン
│   │       ├── ai-dev.ts          # AI活用開発演習 - 3レッスン
│   │       ├── portfolio.ts       # ポートフォリオ制作演習 - 4レッスン
│   │       ├── business.ts        # マーケティング視点 - 6レッスン
│   │       ├── dx-scenario.ts     # DX改善シナリオ演習 - 3レッスン
│   │       ├── ai-era.ts          # AI時代のエンジニアリング - 4レッスン
│   │       └── career-strategy.ts # AI時代のキャリア戦略 - 3レッスン ★フェーズ4新規
│   └── pages/
│       ├── home.tsx           # トップページ（ロードマップ・統計）
│       ├── tracks.tsx         # カリキュラム一覧・詳細ページ共用
│       ├── lesson.tsx         # レッスンページ（全演習UIをSSRで描画）
│       ├── scenarios.tsx      # シナリオ一覧・プレイページ共用
│       ├── dashboard.tsx      # 学習進捗・バッジ・統計
│       ├── glossary.tsx       # 用語集（70語）
│       ├── daily-quiz.tsx     # デイリークイズ（空シェル）
│       ├── weakness-map.tsx   # 弱点マップ（スキルチェックリスト）
│       └── self-analysis.tsx  # 自己分析ワークシート ★フェーズ4新規
├── public/
│   └── static/
│       ├── app.js         # フロントエンド共通JS（1447行）
│       ├── styles.css     # カスタムCSS（renderer.tsxで参照）
│       └── style.css      # ⚠️ 旧ファイル（未参照の可能性・要確認）
├── wrangler.jsonc         # Cloudflare Pages設定
├── vite.config.ts         # Viteビルド設定
├── tsconfig.json          # TypeScript設定
├── package.json           # 依存関係・スクリプト
├── README.md              # ユーザー向けドキュメント
└── ARCHITECTURE.md        # 本ファイル（Claude Code向け設計書）
```

---

## 4. ルーティング一覧

`src/index.tsx` で定義。全ルートはSSRで静的HTMLを返す。

| メソッド | パス | コンポーネント | 説明 |
|---------|------|---------------|------|
| GET | `/` | `HomePage` | トップ・ロードマップ |
| GET | `/tracks` | `TrackListPage` | カリキュラム一覧 |
| GET | `/tracks/:id` | `TrackDetailPage` | トラック詳細（チャプター・レッスン一覧） |
| GET | `/lessons/:id` | `LessonPage` | レッスン本文・演習UI |
| GET | `/scenarios` | `ScenarioListPage` | シナリオ一覧 |
| GET | `/scenarios/:id` | `ScenarioPlayPage` | シナリオプレイ |
| GET | `/dashboard` | `DashboardPage` | 進捗・バッジ |
| GET | `/glossary` | `GlossaryPage` | 用語集 |
| GET | `/daily-quiz` | `DailyQuizPage` | デイリークイズ |
| GET | `/weakness-map` | `WeaknessMapPage` | 弱点マップ |
| GET | `/self-analysis` | `SelfAnalysisPage` | 自己分析ワークシート |
| GET | `/api/curriculum` | — | カリキュラムメタ情報JSON |
| static | `/static/*` | `serveStatic` | `public/` 以下の静的ファイル |
| — | 404 | インラインJSX | 404ページ |

---

## 5. コンテンツアーキテクチャ

### 5-1. トラック構成（全12トラック）

| # | トラックID | タイトル | カテゴリ | カラー | レッスン数 |
|---|-----------|----------|---------|--------|----------|
| 1 | `beginner` | プログラミング基礎（入門） | tech | lime | 4 |
| 2 | `frontend` | フロントエンド開発 | tech | sky | 19 |
| 3 | `git` | バージョン管理とGit | tech | orange | 3 |
| 4 | `http-api` | HTTPとAPI基礎 | tech | sky | 2 |
| 5 | `testing` | テストと品質 | tech | teal | 2 |
| 6 | `practice` | 実務型コーディング演習 | tech | rose | 5 |
| 7 | `ai-dev` | AI活用開発演習 | tech | violet | 3 |
| 8 | `portfolio` | ポートフォリオ制作演習 | tech | indigo | 4 |
| 9 | `marketing` | マーケティング視点 | business | pink | 6 |
| 10 | `dx-scenario` | DX改善シナリオ演習 | business | teal | 3 |
| 11 | `ai-engineering` | AI時代のエンジニアリング | ai | violet | 4 |
| 12 | `career-strategy` | AI時代のキャリア戦略 | ai | cyan | 3 |

**カテゴリ**: `tech` / `business` / `ai`（`TrackCategory` 型）

### 5-2. レッスンID命名規則

```
{トラックプレフィックス}-{チャプター番号}-{レッスン番号}

例:
  bg-1-1   (beginner/第1章/第1レッスン)
  fe-2-1   (frontend/第2章/第1レッスン)
  cs-1-1   (career-strategy/第1章/第1レッスン)
```

#### プレフィックス辞書（app.js の `prefixes` 変数）

```javascript
const prefixes = {
  'beginner':        'bg-',
  'frontend':        'fe-',
  'backend':         'be-',
  'infrastructure':  'infra-',
  'git':             'git-',
  'http-api':        'http-',
  'testing':         'test-',
  'practice':        'pr-',
  'marketing':       'mkt-',
  'management':      'mgmt-',
  'sales':           'sales-',
  'ai-engineering':  'ai-',
  'ai-dev':          'aid-',
  'dx-scenario':     'dx-',
  'portfolio':       'pf-',
  'career-strategy': 'cs-',  // ★フェーズ4追加
}
```

### 5-3. 実践シナリオ一覧（全15本）

| # | シナリオID | タイトル | 難易度 | 時間 |
|---|-----------|----------|--------|------|
| 1 | `read-others-code` | 初日のコードリーディング | 1 | 10分 |
| 2 | `understand-requirements` | 要件が曖昧なタスクの整理 | 2 | 10分 |
| 3 | `follow-team-rules` | チームのルールを把握する | 1 | 10分 |
| 4 | `receive-review` | コードレビューを受け取る | 2 | 10分 |
| 5 | `negotiate-fix` | 修正交渉 | 2 | 10分 |
| 6 | `deadline-quality` | 納期vs品質のトレードオフ | 3 | 15分 |
| 7 | `safe-production-change` | 本番環境での安全な変更 | 2 | 10分 |
| 8 | `unchangeable-tech` | 変えられない技術スタック | 2 | 10分 |
| 9 | `incident-triage` | インシデントトリアージ | 3 | 15分 |
| 10 | `code-review` | コードレビューを行う | 2 | 10分 |
| 11 | `asking-questions` | 質問の仕方 | 1 | 10分 |
| 12 | `interview-intro` | 面接：自己紹介 | 2 | 15分 |
| 13 | `tech-interview` | 面接：技術質問 | 2 | 15分 |
| 14 | `reverse-questions` | 面接：逆質問 | 2 | 15分 |
| 15 | `domain-dx-proposal` | ドメインを活かしたDX改善提案 | 2 | 15分 |

### 5-4. 用語集（70語）

| カテゴリ | 語数 | 代表的な用語 |
|---------|------|------------|
| 基礎 | 約8語 | 変数・関数・条件分岐・配列・デバッグ等 |
| 技術 | 約10語 | フロントエンド/バックエンド・ORM・N+1問題等 |
| DB | 約6語 | トランザクション・正規化・インデックス等 |
| Git | 約7語 | コミット・ブランチ・マージ・stash等 |
| ビジネス | 約10語 | 要件定義・KPI・DX・技術的負債等 |
| AI時代 | 約15語 | LLM・RAG・ハルシネーション・T型人材・ドメイン知識等 |

---

## 6. 型定義（types.ts）

```typescript
// 選択肢（クイズ・コード演習で共用）
type QuizOption = {
  text: string
  correct: boolean
  why: string   // その選択肢への解説
}

// 確認クイズ（選択式）
type Quiz = {
  question: string
  hint?: string
  options: QuizOption[]
}

// コード読解演習（既存コードを読む）
type CodeExercise = {
  prompt: string    // 状況説明
  code: string      // 読む対象コード
  question: string
  hint?: string
  options: QuizOption[]
}

// テストケース（CodingChallenge用）
type CodingTest = {
  description: string
  script: string    // JS式（fn = 実装した関数として使える）
  expected: string  // 期待値のJSON文字列
}

// コーディング演習（実際にコードを書く・Web Worker実行）
type CodingChallenge = {
  prompt: string
  functionName: string  // 実装する関数名
  signature: string     // 'function foo(a, b)' 形式
  starterCode: string   // 骨組みコード
  tests: CodingTest[]
  hints: string[]
  solution: string      // 模範解答
}

// SQL演習（ブラウザ内sql.js WASM）
type SqlChallenge = {
  prompt: string
  schemaSql: string   // テーブル定義
  seedSql: string     // 投入データ
  solutionSql: string // 模範解答クエリ（採点基準）
  hints: string[]
}

// レッスン（1ページ分）
type Lesson = {
  id: string
  title: string
  minutes: number         // 想定学習時間
  intro: string           // 導入文（なぜ学ぶか）
  content: string[]       // 本文段落（簡易マークダウン対応）
  points: string[]        // 重要ポイントまとめ
  quiz?: Quiz             // 確認クイズ（任意）
  codeExercise?: CodeExercise  // コード読解演習（任意）
  codingChallenge?: CodingChallenge  // コーディング演習（任意）
  sqlChallenge?: SqlChallenge  // SQL演習（任意）
}

// チャプター（複数レッスンをグループ化）
type Chapter = {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

// トラック（学習コース単位）
type Track = {
  id: string
  title: string
  category: 'tech' | 'business' | 'ai'
  icon: string    // FontAwesome クラス名（'fa-code' 等）
  color: string   // Tailwindカラー名（colorMapに要追加）
  tagline: string
  description: string
  outcomes: string[]  // このトラックで身につくこと
  chapters: Chapter[]
}

// ロールプレイシナリオ
type ScenarioChoice = {
  text: string
  feedback: string
  score: number   // 0=悪手 / 1=及第点 / 2=最善
}

type ScenarioStep = {
  speaker: string
  speakerRole: string
  text: string
  code?: string   // 提示コード（任意）
  choices: ScenarioChoice[]
}

type Scenario = {
  id: string
  title: string
  skill: string
  difficulty: 1 | 2 | 3
  minutes: number
  situation: string   // ⚠️ introではなくsituation が正しいフィールド名
  steps: ScenarioStep[]
  debrief: string[]   // 学びのまとめ
}
```

---

## 7. データフロー

### 7-1. ビルド時（Vite）

```
TypeScriptソース（src/）
    ↓ Vite + @hono/vite-build/cloudflare-pages
    ↓ 全トラックデータを単一Workerバンドル（_worker.js）に静的包含
dist/
  ├── _worker.js       # 523.86 kB（全コンテンツ含む）
  ├── _routes.json     # Cloudflare Pages ルーティングルール
  └── static/          # public/static/ のコピー
```

### 7-2. リクエスト時（SSR）

```
ブラウザ GET /lessons/cs-1-1
    ↓
Cloudflare Workers (_worker.js)
    ↓ src/index.tsx の app.get('/lessons/:id')
    ↓ findLesson('cs-1-1') でレッスンデータ取得
    ↓ <LessonPage loc={loc} /> でJSXレンダリング
    ↓ renderer.tsx の jsxRenderer でHTMLシェル包装
    ↓ 演習データを <script type="application/json"> に埋め込み
HTML レスポンス（完全なHTML）
    ↓
ブラウザ: /static/app.js 読み込み
    ↓ DOMContentLoaded後に各セクション初期化
    ↓ localStorage から進捗データ読み込み
    ↓ UI状態を反映（チェックマーク・バッジ等）
```

### 7-3. SSR→クライアントJS データ受け渡し方式

**方式A: data-* 属性（単純値）**
```html
<!-- SSR側 (lesson.tsx) -->
<article data-lesson-id="cs-1-1" class="lesson-article">

<!-- JS側 (app.js) -->
const lessonId = article.dataset.lessonId
```

**方式B: script[type="application/json"]（構造体）**
```html
<!-- SSR側 (scenarios.tsx, daily-quiz.tsx) -->
<script type="application/json" id="scenario-data">
  {"id":"domain-dx-proposal", ...}  // XSSエスケープ済み（\u003c等）
</script>

<!-- JS側 (app.js) -->
const data = JSON.parse(document.getElementById('scenario-data').textContent)
```

---

## 8. localStorage 管理

| キー | 型 | 管理場所 | 説明 |
|------|------|---------|------|
| `dojo-progress-v1` | `{lessons:{[id]:timestamp}, quiz:{[id]:bool}, scenarios:{[id]:{score,max,at}}}` | app.js `window.Dojo` | レッスン完了・クイズ正解・シナリオスコア |
| `dojo-skills-v1` | `{[lessonId]: {[itemIndex]: boolean}}` | app.js `SKILLS_KEY` | スキルチェックリスト（弱点マップ用） |
| `dojo-daily-quiz-v1` | `{history:[{date,correct,total}], streak:number, lastDate:string}` | app.js `DAILY_KEY` | デイリークイズ履歴・ストリーク |
| `dojo-reviews-v1` | `{lessonId:string, reviewDate:string}[]` | app.js `REVIEWS_KEY` | スペースドリピティション復習スケジュール |
| `dojo-self-analysis-v1` | `{occupation:string, industry:string, skills:string, summary:string, updatedAt:number}` | app.js `WS_KEY` | 自己分析ワークシート（フェーズ4追加） |

### window.Dojo API（グローバル）

```javascript
window.Dojo.completeLesson(id)        // レッスン完了記録
window.Dojo.isLessonDone(id)          // 完了済み確認
window.Dojo.recordQuiz(id, correct)   // クイズ結果記録
window.Dojo.recordScenario(id, score, max)  // シナリオスコア記録
window.Dojo.get()                      // 進捗データ全取得
window.Dojo.reset()                    // 全データリセット（確認ダイアログ含む）
```

---

## 9. app.js セクション構造

`public/static/app.js`（1447行）は単一ファイル。全体が即時実行関数（IIFE）で囲まれ、各サブ機能もIIFEで独立。

```
(function () {   // ← 外側IIFE（行1）
  'use strict'

  /* ===== 進捗ストア（行6） ===== */
  // LS_KEY = 'dojo-progress-v1'
  // loadProgress / saveProgress / window.Dojo

  /* ===== クイズ（行48） ===== */
  // .quiz-block への click ハンドラ
  // 選択肢UI更新・正誤判定・Dojo.recordQuiz()

  /* ===== レッスン完了ボタン（行102） ===== */
  // #lesson-complete-btn
  // 完了記録・次レッスンへの遷移

  /* ===== ダッシュボード（行148） ===== */
  // #dashboard-root 存在チェック
  // 統計カウント（完了レッスン・スコア・時間・ストリーク）
  // 活動履歴（直近30日・バーグラフ）
  // バッジ判定・表示
  // トラック別進捗バー
  // シナリオ成績表示

  /* ===== シナリオエンジン（行582） ===== */
  // #scenario-root 存在チェック
  // script#scenario-data のJSONパース
  // ステップレンダリング・選択肢UI・スコア計算
  // デブリーフ表示・Dojo.recordScenario()

  /* ===== スキルチェックリスト（行720） ===== */
  // SKILLS_KEY = 'dojo-skills-v1'
  // .skill-checkbox への change ハンドラ
  // /weakness-map ページの弱点バッジ更新

  /* ===== 弱点マップ（行785） ===== */
  // #weakness-map-content 存在チェック
  // スキルデータを読み込んで .skill-map-item にバッジ追加

  /* ===== デイリークイズ（行870） ===== */
  // DAILY_KEY / REVIEWS_KEY
  // script#daily-quiz-pool-data のJSONパース
  // 問題表示・採点・ストリーク管理・スペースドリピティション

  /* ===== コーディング演習（行1095） ===== */
  // .coding-challenge-block への対応
  // Web Worker でユーザーコードをサンドボックス実行（5秒タイムアウト）
  // テスト結果表示・Dojo.recordQuiz()

  /* ===== SQL演習（行1167） ===== */
  // SQLJS_CDN = 'https://cdnjs.cloudflare.com/...'
  // sql.js WASM を動的ロード（Promise化・キャッシュ）
  // .sql-challenge-block へのクエリ実行
  // solutionSql との結果比較で採点

  /* ===== 自己分析ワークシート（行1357） ===== */
  ;(function () {
    // /self-analysis ページのみ動作（ws-occupation/industry/skills/summaryの存在チェック）
    // WS_KEY = 'dojo-self-analysis-v1'
    // loadWorksheet / saveWorksheet / showSaveIndicator
    // 保存ボタン・クリアボタン（confirm付き）・1.5秒デバウンス自動保存
  })()

})()`     // ← 外側IIFE閉じ（行1447）
```

---

## 10. コアパターン — コンテンツ追加手順

### 10-1. 新トラックを追加する

1. **`src/data/tracks/{new-id}.ts` を新規作成**
   ```typescript
   import type { Track } from '../../types'
   export const myNewTracks: Track[] = [{
     id: 'my-new-track',
     title: 'トラック名',
     category: 'tech',  // 'tech' | 'business' | 'ai'
     icon: 'fa-circle', // FontAwesome クラス名
     color: 'amber',    // ← colorMapに存在する色のみ（次項参照）
     tagline: '一言説明',
     description: '詳細説明',
     outcomes: ['習得できること1', '習得できること2'],
     chapters: [{ id: 'ch-1', title: '第1章', description: '...', lessons: [...] }]
   }]
   ```

2. **`src/pages/tracks.tsx` の `colorMap` に色を追加**（新色を使う場合のみ）
   ```typescript
   // Tailwind CDN はJIT生成のため動的クラス名不可
   // colorMapに静的列挙していない色は絶対に機能しない
   const colorMap = {
     // ...既存...
     lime: { text: 'text-lime-400', bg: 'bg-lime-400/10', border: 'hover:border-lime-400/60' },
   }
   ```
   
   **使用可能な色（現在）**: sky / emerald / orange / purple / pink / amber / teal / violet / rose / indigo / cyan / lime

3. **`src/data/index.ts` にインポートとspreadを追加**
   ```typescript
   import { myNewTracks } from './tracks/my-new'
   export const tracks: Track[] = [
     ...beginnerTracks,
     // ...（既存）...
     ...myNewTracks,  // 末尾に追加
   ]
   ```

4. **`public/static/app.js` の `prefixes` 辞書に追加**
   ```javascript
   const prefixes = {
     // ...既存...
     'my-new-track': 'mn-',  // ユニークな短縮プレフィックス
   }
   ```

5. **ビルド確認**: `npm run build`

### 10-2. 既存トラックにレッスンを追加する

対象の `src/data/tracks/*.ts` の `lessons` 配列に追記するだけ。
ID命名規則: `{prefix}{章番号}-{レッスン番号}`（例: `cs-1-4` は career-strategy の第1章第4レッスン）

```typescript
{
  id: 'cs-1-4',
  title: 'レッスンタイトル',
  minutes: 15,
  intro: '導入文（なぜこれを学ぶか）',
  content: [
    '**太字** と `コード` が使えるマークダウン',
    '段落ごとに配列要素として記述',
  ],
  points: ['重要ポイント1', '重要ポイント2'],
  quiz: { ... },              // 任意
  codeExercise: { ... },      // 任意
  codingChallenge: { ... },   // 任意
  sqlChallenge: { ... },      // 任意
}
```

演習は `quiz` → `codeExercise` → `codingChallenge` → `sqlChallenge` の優先順位で描画される（lesson.tsx）。複数指定可能。

### 10-3. シナリオを追加する

`src/data/scenarios.ts` の配列に追記:

```typescript
{
  id: 'my-scenario',
  title: 'シナリオタイトル',
  skill: '鍛えるスキル名',
  difficulty: 2,    // 1 | 2 | 3
  minutes: 15,
  situation: '導入ストーリー',  // ⚠️ intro: は型エラー！ situation: が正しい
  steps: [
    {
      speaker: '田中さん',
      speakerRole: '先輩エンジニア',
      text: 'セリフ',
      code: `// 任意のコード`,
      choices: [
        { text: '選択肢', feedback: '解説', score: 2 },  // score: 0|1|2
        { text: '選択肢', feedback: '解説', score: 0 },
      ]
    }
  ],
  debrief: ['学びのまとめ1', '学びのまとめ2'],
}
```

### 10-4. 新規ページを追加する

1. `src/pages/my-page.tsx` を作成（`FC` コンポーネント）
2. `src/index.tsx` にルートを追加:
   ```typescript
   import { MyPage } from './pages/my-page'
   app.get('/my-page', (c) => c.render(<MyPage />, { title: 'ページタイトル' }))
   ```
3. 必要ならナビゲーションを `src/renderer.tsx` の `<nav>` に追加
4. 対話型UIが必要なら `public/static/app.js` の末尾にIIFEで追記

### 10-5. 用語集に追加する

`src/pages/glossary.tsx` の `glossaryItems` 配列に追記:

```typescript
{
  term: '用語名',
  kana: 'よみがな',
  category: 'AI時代',  // '基礎' | '技術' | 'DB' | 'Git' | 'ビジネス' | 'AI時代'
  desc: '一言説明',
  example: '具体例（任意）',
}
```

---

## 11. UI 共通パターン

### 11-1. カラーテーマ

```
背景:
  dojo-950: #0f0e17  (最暗・ページ背景)
  dojo-900: #17161f  (カード内・コード背景)
  dojo-800: #211f2e  (カード・セクション)
  dojo-700: #2e2c3f  (ボーダー)

アクセント:
  amber-400: メイン強調色・アイコン・ホバー
  各トラックカラー: トラック固有のアクセント
```

### 11-2. 簡易マークダウン変換

`lesson.tsx` の `md()` 関数:
- `**テキスト**` → `<strong>テキスト</strong>`
- `` `コード` `` → `<code>コード</code>`
- XSSエスケープ後に変換（`&lt;` → `<` ではなく逆順）

### 11-3. XSSエスケープ（スクリプトタグ埋め込み）

```typescript
// scenarios.tsx / daily-quiz.tsx のパターン
const json = JSON.stringify(data).replace(/</g, '\\u003c')
// ↓ SSR出力
<script type="application/json" id="scenario-data">{json}</script>
```

### 11-4. lesson.tsx の演習描画順序

```
1. intro（導入文）
2. content[]（本文段落）
3. points[]（重要ポイント）
4. quiz（確認クイズ）← quiz? があれば
5. codeExercise（コード読解）← codeExercise? があれば
6. codingChallenge（コーディング演習）← codingChallenge? があれば
7. sqlChallenge（SQL演習）← sqlChallenge? があれば
8. 「レッスン完了」ボタン
```

---

## 12. 制約・注意事項

### 12-1. Tailwind CDN 制約（最重要）

**動的クラス名は機能しない**。Tailwind CDN はJITコンパイルでソースを静的スキャンするため、JS/TSで動的に組み立てたクラス名は認識されない。

```typescript
// ❌ NG: 動的組み立て（色が出ない）
const cls = `text-${color}-400`

// ✅ OK: colorMap に全クラスを静的列挙
const colorMap = {
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'hover:border-cyan-400/60' },
}
```

新しい色を追加するときは `src/pages/tracks.tsx` の `colorMap` に必ず追記すること。

### 12-2. Cloudflare Workers 制約

- `fs` / `path` / `child_process` 等 Node.js API は使用不可
- ファイルシステムへのアクセス不可（実行時）
- `serveStatic` は `hono/cloudflare-workers` から import（`@hono/node-server` ではない）

### 12-3. IIFE 構造の維持

`app.js` に機能を追加する際は必ず末尾の `})()` の**前**にIIFEブロックで追記する:

```javascript
// 末尾の })() の直前に挿入
;(function () {
  // 新機能 — ページ固有要素の存在チェックを必ず入れる
  var el = document.getElementById('my-element')
  if (!el) return
  // ...
})()

})()  // ← 外側IIFE の閉じ（最終行）
```

### 12-4. Scenario 型の注意点

`Scenario` 型の導入文フィールドは **`situation`** です。`intro` は存在しません。

```typescript
// ❌ 誤り（TypeScript エラーにはならないが型外）
{ intro: '...' }

// ✅ 正しい
{ situation: '...' }
```

---

## 13. 既知の問題・修正候補

| 優先度 | ファイル | 問題 | 修正方法 |
|--------|---------|------|---------|
| 中 | `src/data/scenarios.ts` | `domain-dx-proposal` に `intro:` フィールドを使用（`Scenario`型は `situation:` が正） | `intro:` → `situation:` に変更 |
| 中 | `src/data/scenarios.ts` | `domain-dx-proposal` に `personas:` フィールドを使用（`Scenario`型未定義） | `personas:` を削除、または `types.ts` に `personas?: {...}[]` を追加 |
| 低 | `src/pages/home.tsx` | ロードマップのフェーズバッジがPhase1〜3のみ（Phase4未追加） | フェーズバッジ配列にPhase4を追加 |
| 低 | `public/static/style.css` | `renderer.tsx` では `styles.css` を参照。`style.css` が未参照の可能性あり | 参照先を確認して不要なら削除 |

---

## 14. ビルドと確認コマンド

```bash
# ビルド
cd /home/user/webapp && npm run build

# ローカル開発サーバー起動（PM2経由）
cd /home/user/webapp && pm2 start ecosystem.config.cjs

# HTTP確認
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/tracks
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/lessons/cs-1-1
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/scenarios/domain-dx-proposal
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/self-analysis
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/tracks/career-strategy

# ログ確認（非ブロッキング）
pm2 logs --nostream

# Cloudflare Pages デプロイ
cd /home/user/webapp && npm run deploy

# Gitコミット
cd /home/user/webapp && git add . && git commit -m "feat: 説明"
```

---

## 15. フェーズ別変更履歴

### フェーズ1（コミット `9619516`）
- Git/HTTP/テスト/実務演習トラック新設
- SQL演習8題化
- デイリークイズ・スキルチェックリスト・弱点マップ追加
- 用語集 Git拡充

### フェーズ2（コミット `c5e0caf`）
- AI活用開発演習・DXシナリオ演習トラック新設
- ロールプレイシナリオ3本追加
- 用語集拡充

### フェーズ3（コミット `a3cfd28`）
- ポートフォリオ制作演習4レッスン追加
- 面接ロールプレイ3本追加
- ダッシュボード強化（バッジ・ストリーク・学習時間・活動履歴）
- ロードマップ全3フェーズ完了版

### フェーズ4（コミット `ce13780`）★現在
- **キャリア戦略トラック新設**（career-strategy, color: cyan, 3レッスン）
  - `cs-1-1`: T型人材モデル（CodingChallenge: calcMarketValue）
  - `cs-1-2`: 3段学習構造（CodingChallenge: avgPortability）
  - `cs-1-3`: 自分のドメイン設計ワーク（CodeExercise）
- **自己分析ワークシートページ追加**（`/self-analysis`）
  - 3軸テキストエリア（職能・業界・開発スキル）
  - T型まとめ欄・保存/クリアボタン・1.5秒デバウンス自動保存
  - localStorageキー: `dojo-self-analysis-v1`
- **シナリオ15本目追加**（domain-dx-proposal）
- **用語集7語追加**（63→70語、AI時代カテゴリ）
- tracks.tsx: colorMapに cyan 追加
- app.js: prefixesに `'career-strategy': 'cs-'` 追加

---

*このファイルはClaude Codeなどのコーディングアシスタントが本プロジェクトを理解・改修するための技術参照資料です。コンテンツを追加・変更するたびに更新してください。*
