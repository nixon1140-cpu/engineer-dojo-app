# 作業の進み具合（progress.md）

最終更新: 2026-10-06

## 今の状況
- ブランチ `main`、最新コミット `a0b252a`（origin/main と一致・push済み）
- 公開先: GitHub Pages（https://nixon1140-cpu.github.io/engineer-dojo-app/）
- 公開サイトは最新コミットを反映済み。デプロイ用の自動処理（GitHub Actions）も成功を確認済み
- 規模: 19トラック / 76レッスン / 用語集68語 / シナリオ15本
- 開発: `npm run dev`、公開用ビルド: `npm run build:pages`（出力は `dist-pages/`）、型チェック: `npx tsc --noEmit`（0件）

## 終わったこと
1. 第1ラウンド: 型エラー9件の修正、Linux & Docker トラック新設、レスポンシブヘッダー、進捗のエクスポート/インポート、スマホ入力属性、README更新
2. 第2ラウンド: Webセキュリティ トラック新設、infrastructure / frontend / testing / http-api の拡充、スマホ幅のグリッド崩れ修正、用語8語追加
3. 第3ラウンド: GitHub Pages向けの静的サイト生成（`scripts/generate-static.mjs`、`src/base-path.ts`）、自動デプロイ設定（`.github/workflows/deploy-pages.yml`）
4. Stage B: Cloudflare関連（wrangler.jsonc、ecosystem.config.cjs、依存パッケージ）の完全撤去
5. GitHubのAbout欄は更新済み（説明文は「Hono + TypeScript + GitHub Pages」、WebsiteはGitHub PagesのURL）を確認
6. push時にGitHubの秘密情報検知で止まった件を、演習の例のキー名（`sk_live_`→`dojo_live_`）に変えて解決
7. ARCHITECTURE.md を最新の構成・数値（19トラック/76レッスン/68語）に更新
8. 「全トラック到達」バッジの判定を全19トラック対応に修正（画面で動作確認済み）
9. .gitignore を整理（不要になった `dist/`・`.dev.vars`・`.pm2/` を削除）

## 残っている課題
- 記録している課題はなし

## 次にやること
- 新しいコンテンツ追加時は PROJECT_BRIEF.md の手順（トラック追加→colorMap→prefixes→glossary→README）に従う
- 追加の依頼があれば対応する
