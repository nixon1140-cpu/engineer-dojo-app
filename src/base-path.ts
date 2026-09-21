// GitHub Pages（プロジェクトサイト）向けのサブディレクトリ配信に対応するためのベースパス。
// 通常のCloudflare向けビルド（npm run dev / npm run build）では __BASE_PATH__ は未定義のため
// 常に空文字列となり、既存の挙動には一切影響しない。
// scripts/generate-static.mjs が静的サイト生成時のみ esbuild の define でこの値を注入する。
declare const __BASE_PATH__: string | undefined

export const BASE_PATH: string = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : ''

export function withBase(path: string): string {
  return BASE_PATH + path
}
