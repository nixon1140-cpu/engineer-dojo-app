# 一人前エンジニア道場
AI時代の未経験エンジニア向け学習サイト。仕様は PROJECT_BRIEF.md（仕様書の役割）、構成は ARCHITECTURE.md、現況は docs/progress.md を見る。

## 技術
- Hono 4 + TypeScript（Next.jsではない）。SSRは hono/jsx-renderer、クライアントは public/static/app.js の素のJS
- 公開は GitHub Pages の静的サイト生成。ビルドは npm run build:pages（出力は dist-pages/）、main への push で .github/workflows/deploy-pages.yml が自動公開する
- 状態は localStorage のみ（キーは dojo-*-v1）。サーバー・外部API・DBはない
- Tailwind は CDN 版、アイコンは Font Awesome

## ルール
- 要件と全体設計は PROJECT_BRIEF.md が正。それと違う設計変更が必要なときは、実装の前に提案して承認を得る（設計の勝手な変更を防ぐため）
- 動いている既存コードは、許可なく削除や大改造をしない（壊れたとき原因を追えなくなるため）
- Tailwind のクラスを文字列連結で作らず、tracks.tsx の colorMap に全色を並べる（CDN版は動的クラスを拾えないため）
- トラック・シナリオ・ページの追加と、SSR→JS のデータ受け渡し（3方式）は PROJECT_BRIEF.md の手順に従う（追加漏れを防ぐため）
- Scenario 型のあらすじは situation を使う。intro・personas は型にない（型エラーになるため）
- serveStatic は @hono/node-server/serve-static から import する
- 演習の textarea には autocapitalize="off" autocorrect="off" autocomplete="off" を付ける（スマホの自動補正でコードが崩れるため）
- グリッドは grid-cols-1 sm:grid-cols-3 のように小さい画面から書く（スマホ幅で崩れるのを防ぐため）
- 変更後は npx tsc --noEmit（0件）と npm run build:pages が通ることを確認する（壊れた状態を残さないため）
- npm install などは、実行前に内容を説明して承認を得る
- 機能・トラック単位で区切り、確認を得てから次へ進む（大きく進めすぎないため）
