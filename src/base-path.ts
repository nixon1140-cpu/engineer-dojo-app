// GitHub Pages（プロジェクトサイト）向けのサブディレクトリ配信に対応するためのベースパス。
// ローカル開発時（npm run dev）は __BASE_PATH__ が未定義のため常に空文字列となり、
// ルート直下で動作しているかのようにパスが解決される。
// scripts/generate-static.mjs が静的サイト生成（npm run build:pages）時のみ
// esbuild の define でこの値を注入する。
declare const __BASE_PATH__: string | undefined

export const BASE_PATH: string = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : ''

export function withBase(path: string): string {
  return BASE_PATH + path
}
