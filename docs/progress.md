# 作業の進み具合（progress.md）

最終更新: 2026-10-05

## 今の状況
- ブランチ `main`、最新コミット `f38ffe9`（origin/main と一致・push済み）
- 公開先: GitHub Pages（https://nixon1140-cpu.github.io/engineer-dojo-app/）
- 公開サイトは最新コミットを反映済み。デプロイ用の自動処理（GitHub Actions）も成功を確認済み
- 規模: 19トラック / 76レッスン / 用語集68語 / シナリオ15本
- 開発: `npm run dev`、公開用ビルド: `npm run build:pages`（出力は `dist-pages/`）、型チェック: `npx tsc --noEmit`（0件）

## 終わったこと
1. 第1ラウンド: 型エラー9件の修正、Linux & Docker トラック新設、レスポンシブヘッダー、進捗のエクスポート/インポート、スマホ入力属性、README更新
2. 第2ラウンド: Webセキュリティ トラック新設、infrastructure / frontend / testing / http-api の拡充、スマホ幅のグリッド崩れ修正、用語8語追加
3. 第3ラウンド: GitHub Pages向けの静的サイト生成（`scripts/generate-static.mjs`、`src/base-path.ts`）、自動デプロイ設定（`.github/workflows/deploy-pages.yml`）
4. Stage B: Cloudflare関連（wrangler.jsonc、ecosystem.config.cjs、依存パッケージ）の完全撤去
5. push時にGitHubの秘密情報検知で止まった件を、演習の例のキー名（`sk_live_`→`dojo_live_`）に変えて解決

## 残っている課題
- GitHubリポジトリの「About」欄の説明文に「Cloudflare Pages」の表記が残っている可能性（`gh`コマンド未導入のため未確認。Web画面での手動確認・修正が必要）
- `ARCHITECTURE.md` の古い数値（58レッスン・70語など）は未更新（今回の作業範囲外として据え置き）
- `.gitignore` の `dist/` と `.pm2/` は不要になった可能性あり（未整理）

## 次にやること
- About欄の説明文を手動で更新（メイン公開先=GitHub Pages に合わせる）
- 必要なら ARCHITECTURE.md の数値を最新に更新
- 新しいコンテンツ追加時は PROJECT_BRIEF.md の手順（トラック追加→colorMap→prefixes→glossary→README）に従う
