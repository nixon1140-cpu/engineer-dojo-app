import type { Track } from '../../types'

export const gitTracks: Track[] = [
  {
    id: 'git',
    title: 'バージョン管理とGit',
    category: 'tech',
    icon: 'fa-code-branch',
    color: 'orange',
    tagline: '変更履歴が「財産」になる、Gitの基本',
    description:
      'git init/add/commit/log からブランチ・マージ・コンフリクト解消・GitHubフローまで。チーム開発の共通言語であるGitを「なぜそうするか」から理解する。',
    outcomes: [
      'コミットの粒度と「なぜコミットするか」を説明できる',
      'ブランチを切る意味とマージの仕組みを理解している',
      'コンフリクトが起きる原因と解消の考え方を説明できる',
      'GitHubフロー（PR → レビュー → マージ）の全体像を把握している',
    ],
    chapters: [
      {
        id: 'git-basics',
        title: '第1章: Gitの基本操作',
        description: 'コミットの仕組みから始め、ローカルでの操作フローを体得する。',
        lessons: [
          {
            id: 'git-1-1',
            title: 'なぜバージョン管理が必要か: git init / add / commit / log',
            minutes: 20,
            intro:
              '「最終版_20240301_修正2.js」というファイル名でコードを管理したことはありませんか？ Gitはその混乱を解決し、「誰が・いつ・何を・なぜ変えたか」を永遠に記録します。',
            content: [
              '**バージョン管理** とは、ファイルの変更履歴を記録・追跡する仕組みです。Gitはその事実上の業界標準で、ほぼすべての現場で使われています。',
              '`git init` でリポジトリを初期化し、`git add ファイル名`（または `git add .` で全変更）をステージング（記録候補に追加）し、`git commit -m "メッセージ"` で確定（スナップショット）します。',
              '**コミットメッセージ** は「なぜ変えたか」を書くのが鉄則。`fix bug` より `fix: ログイン失敗時にリダイレクトループが発生するバグを修正` の方が、1年後の自分や他人に伝わります。',
              '`git log` で履歴を確認できます。`git log --oneline` は1行表示で見やすく、`git log --graph` はブランチの分岐も視覚化します。',
              '**ステージングエリア** の存在がGitの重要な特徴です。変更ファイルの中から「今回のコミットに入れるものだけ」を選べる。これにより、1つの作業で複数のコミットを分けて整理できます。',
            ],
            points: [
              'init → add → commit の3ステップが基本',
              'コミットメッセージは「なぜ」を書く',
              'ステージングで「今コミットする変更」を選別できる',
            ],
            quiz: {
              question: '`git add .` を実行した後、まだ `git commit` していない。この状態を正しく説明しているのは？',
              hint: 'Gitには「作業ディレクトリ → ステージング → リポジトリ」の3段階があります。addはどこまでの操作でしょうか。',
              options: [
                { text: '変更がリポジトリに記録（コミット）された', correct: false, why: 'add はリポジトリには記録されません。次の commit で初めて履歴に残ります。' },
                { text: '変更がステージングエリアに追加され、次のcommitに含まれる準備ができた', correct: true, why: '正解！add はステージングへの移動です。まだコミットはされておらず、commit を実行してはじめて履歴に記録されます。' },
                { text: 'ファイルがGitHubにプッシュされた', correct: false, why: 'add はローカルのステージング操作です。GitHubへの送信は push コマンドです。' },
              ],
            },
            codingChallenge: {
              prompt:
                'Gitのコミット操作を理解するため、「コミット情報を解析する関数」を作成してください。コミットメッセージ文字列を受け取り、`{ type, description }` オブジェクトを返します。形式: `"feat: ユーザー登録機能を追加"` → `{ type: "feat", description: "ユーザー登録機能を追加" }`。コロン+スペースで分割し、形式が不正な場合（コロンなし）は `{ type: "unknown", description: メッセージ全体 }` を返します。',
              functionName: 'parseCommitMessage',
              signature: 'function parseCommitMessage(msg)',
              starterCode: `function parseCommitMessage(msg) {
  // "feat: 説明文" → { type: "feat", description: "説明文" }
  // コロン+スペース(": ")で分割する
  // 見つからない場合は type: "unknown"

}`,
              tests: [
                { description: 'feat: で始まるコミット', script: 'JSON.stringify(fn("feat: ユーザー登録機能を追加"))', expected: '{"type":"feat","description":"ユーザー登録機能を追加"}' },
                { description: 'fix: で始まるコミット', script: 'JSON.stringify(fn("fix: ログインバグを修正"))', expected: '{"type":"fix","description":"ログインバグを修正"}' },
                { description: '不正形式はunknown', script: 'JSON.stringify(fn("単なる説明文"))', expected: '{"type":"unknown","description":"単なる説明文"}' },
                { description: 'docs: 形式', script: 'fn("docs: READMEを更新").type', expected: '"docs"' },
              ],
              hints: [
                'msg.includes(": ") で形式チェックできる',
                'msg.indexOf(": ") でコロン位置を見つけ、substring で分割する',
                '別の方法: msg.split(": ") で分割し、parts[0] が type、残りが description',
              ],
              solution: `function parseCommitMessage(msg) {
  const sep = ': '
  const idx = msg.indexOf(sep)
  if (idx === -1) return { type: 'unknown', description: msg }
  return {
    type: msg.substring(0, idx),
    description: msg.substring(idx + sep.length),
  }
}`,
            },
          },
          {
            id: 'git-1-2',
            title: 'ブランチとマージ: 並行作業の分離と統合',
            minutes: 20,
            intro:
              'ブランチがなければ、機能追加中に緊急バグ修正ができません。ブランチは「安全な実験場」であり、チーム全員が独立して作業できる仕組みの核心です。',
            content: [
              '**ブランチ** は現在の状態からの「分岐点」です。`git checkout -b feature/login` で新ブランチを作成＆移動。`main` ブランチを汚さずに開発できます。',
              '`git merge ブランチ名` でブランチを統合します。**Fast-forward** は直線的な統合（ブランチを単純に前進させる）、**3-way merge** は分岐した2つを共通祖先と合わせて統合します。',
              '**コンフリクト（競合）** は、同じファイルの同じ行を2ブランチで異なる変更した場合に発生します。Gitは自動解決できないため、`<<<<<<` `=======` `>>>>>>` マーカーが挿入され、人間が正しい内容を選んで解消します。',
              'コンフリクトを減らすには①こまめにコミットしてブランチの寿命を短くする②共有ファイルを触る前に最新の main をマージする、が実務での定石です。',
              '`git stash` は「作業を一時退避」するコマンド。未コミットの変更を棚上げして他の作業に切り替え、後から `git stash pop` で復元できます。',
            ],
            points: [
              '機能ごとにブランチを切り、main を常にクリーンに保つ',
              'コンフリクトは同じ行への並行変更で発生する',
              'ブランチは短命に（長生きするほどコンフリクトリスクが増える）',
            ],
            quiz: {
              question: '`main` ブランチで作業中に緊急バグ対応が必要になった。今の作業は未完成でコミットしたくない。最善の手順は？',
              hint: '未コミットの変更を一時的に「退避」できるGitコマンドがあります。退避後に新しいブランチで対応するのが安全です。',
              options: [
                { text: '未完成のまま main にコミットしてからhotfixブランチを作る', correct: false, why: '未完成コードを main に入れるとチーム全員に影響します。緊急修正とは無関係な変更が混入してしまいます。' },
                { text: 'git stash で作業を退避 → hotfixブランチで修正 → mainにマージ → git stash pop で復元', correct: true, why: '正解！stash は未コミット変更の一時退避に最適です。緊急対応後に pop で戻せます。' },
                { text: '変更ファイルを別名で保存してから作業する', correct: false, why: 'それは「最終版2.js」方式に戻ってしまいます。Gitの機能を使いましょう。' },
              ],
            },
            codeExercise: {
              prompt: '以下はGitのコンフリクト発生時にファイルに挿入されるマーカーです。',
              code: `<<<<<<< HEAD
const greeting = 'こんにちは'
=======
const greeting = 'Hello'
>>>>>>> feature/english`,
              question: 'このコンフリクトについて正しい説明は？',
              hint: '`HEAD` は現在のブランチの状態、`feature/english` はマージしようとしているブランチです。`=======` は何を区切っていますか？',
              options: [
                { text: 'HEADブランチの変更を優先して、`<<<` `===` `>>>` 行を含めてそのままにする', correct: false, why: 'マーカー行（`<<<`, `===`, `>>>`）は必ず削除します。残しておくとコードが壊れます。' },
                { text: '`=======` を挟んで上がHEAD（現ブランチ）の変更、下がfeature/englishの変更。どちらを残すか（または両方修正するか）を手動で決めてマーカーを削除する', correct: true, why: '正解！コンフリクト解消は「どの変更が正しいか」を人間が判断してマーカーを消す作業です。両方を活かす形に書き直すこともあります。' },
                { text: 'Gitが自動でHEAD側を選ぶので何もしなくていい', correct: false, why: 'コンフリクトは人間の判断が必要なため、Gitは自動選択しません。だからこそマーカーを挿入して教えてくれています。' },
              ],
            },
          },
          {
            id: 'git-1-3',
            title: 'GitHubフロー: リモート・PR・チーム開発',
            minutes: 25,
            intro:
              'ローカルのGit操作を覚えたら、次はチームと共有するリモートリポジトリとプルリクエスト（PR）です。GitHubフローはすべての現代的チームの標準です。',
            content: [
              '**リモートリポジトリ** はGitHubなどのサーバー上のリポジトリです。`git remote add origin URL` で接続し、`git push origin ブランチ名` でアップロード、`git pull origin main` で最新変更を取得します。',
              '**プルリクエスト（PR）** は「このブランチをmainにマージしてください」という提案です。コードレビューの場として機能し、問題を本番に届ける前にキャッチできます。',
              'GitHubフローの流れ: ①mainから`feature/xxx`ブランチを作る → ②コミットを積む → ③PRを出す → ④レビュー（コメント・修正）→ ⑤mainにマージ → ⑥ブランチを削除。',
              '`git fetch` はリモートの変更を「ダウンロードだけ」します。`git pull` は fetch + merge の組み合わせです。「まず確認してからマージ」の習慣のために fetch を使う人もいます。',
              '**.gitignore** はGitの管理対象から除外するファイルを指定するファイルです。APIキー・パスワードを含む `.env`、ビルド成果物の `node_modules/`、IDEの設定ファイルなどを必ず除外します。**秘密情報をコミットするのは最大のアンチパターン**です。',
            ],
            points: [
              'push/pull でローカルとリモートを同期する',
              'PRはコードレビューの場であり、品質ゲートの役割を担う',
              '.gitignore に秘密情報を含むファイルを登録する',
            ],
            quiz: {
              question: '自分のfeatureブランチをGitHubにプッシュしたのに、チームメンバーのPCに変更が反映されていない。原因は？',
              hint: 'GitHubにあるコードを他のメンバーが自分のPCに持ってくるには、どのコマンドが必要ですか？',
              options: [
                { text: 'pushしたのにリモートに届いていないので、もう一度pushする', correct: false, why: 'pushは正しく機能しています。問題は受け取り側にあります。' },
                { text: 'チームメンバーが git pull（またはfetch）を実行していないため', correct: true, why: '正解！pushでリモートに送っても、相手が pull しなければ自動では同期されません。GitはGoogleドキュメントのようなリアルタイム共有ではありません。' },
                { text: 'featureブランチをmainにマージしないと他のPCに届かない', correct: false, why: 'featureブランチのままでも、相手が `git fetch && git checkout feature/xxx` でそのブランチを見ることはできます。' },
              ],
            },
            codingChallenge: {
              prompt:
                'GitHubフローの理解を確認するコーディング演習です。コミット配列とブランチ名から「このブランチのPR説明文」を自動生成する関数を書いてください。形式: タイトル行「feat(ブランチ名): N件の変更」、空行、コミット一覧を「- コミットメッセージ」形式で連結して返す。',
              functionName: 'generatePRDescription',
              signature: 'function generatePRDescription(branchName, commits)',
              starterCode: `// commits: ["feat: XXXを追加", "fix: YYYを修正", ...] の配列
function generatePRDescription(branchName, commits) {
  // 1行目: "feat(ブランチ名): N件の変更"
  // 空行
  // "- コミット1\n- コミット2\n..."

}`,
              tests: [
                {
                  description: 'タイトル行の形式',
                  script: 'fn("feature/login", ["feat: ログインUI追加", "fix: バリデーション修正"]).split("\\n")[0]',
                  expected: '"feat(feature/login): 2件の変更"',
                },
                {
                  description: '2行目は空行',
                  script: 'fn("feature/login", ["feat: ログインUI追加"]).split("\\n")[1]',
                  expected: '""',
                },
                {
                  description: 'コミット一覧が正しい',
                  script: 'fn("feature/x", ["feat: A", "fix: B"]).split("\\n").slice(2).join("\\n")',
                  expected: '"- feat: A\\n- fix: B"',
                },
                {
                  description: '1コミットでも動作する',
                  script: 'fn("fix/typo", ["fix: タイポ修正"]).startsWith("feat(fix/typo): 1件の変更")',
                  expected: 'true',
                },
              ],
              hints: [
                'タイトル: `feat(${branchName}): ${commits.length}件の変更`',
                'コミット一覧: commits.map(c => `- ${c}`).join("\\n")',
                '3つの部分を "\\n\\n" で繋ぐか、配列で組み立てて join する',
              ],
              solution: `function generatePRDescription(branchName, commits) {
  const title = \`feat(\${branchName}): \${commits.length}件の変更\`
  const list = commits.map(c => \`- \${c}\`).join('\\n')
  return \`\${title}\\n\\n\${list}\`
}`,
            },
          },
        ],
      },
    ],
  },
]
