import type { Track } from '../../types'

export const linuxDockerTracks: Track[] = [
  {
    id: 'linux-docker',
    title: '開発環境とインフラ基礎（Linux・Docker）',
    category: 'tech',
    icon: 'fa-terminal',
    color: 'fuchsia',
    tagline: '「動かないコード」から「どこでも動くコード」へ——OSとコンテナの基礎体力',
    description:
      'ターミナル操作・権限・プロセスの基本から、コンテナ技術（Docker）の考え方までを扱う。サーバーの多くがLinuxで動き、環境差異を無くす手段としてコンテナが標準になった今、避けて通れない基礎体力を身につける。',
    outcomes: [
      'ターミナルでのファイル操作・権限管理を一人でこなせる',
      'プロセスと環境変数の役割を説明できる',
      'コンテナとイメージの違い、Dockerを使う理由を説明できる',
      'Dockerfile / docker-compose.ymlを読んで何が起きるか説明できる',
    ],
    chapters: [
      {
        id: 'linux-basics',
        title: '第1章: Linuxの基本操作',
        description: 'ターミナル操作・ファイル権限・プロセス管理の基礎を身につける。',
        lessons: [
          {
            id: 'ld-1-1',
            title: 'なぜCLIを使うのか：ファイル・ディレクトリ操作の基本',
            minutes: 20,
            intro:
              'GUIで一つずつクリックする作業は100台のサーバーには通用しない。エンジニアが最初に身につけるべき共通言語がコマンドラインです。',
            content: [
              'クラウドの裏側はほぼLinuxで動いており、GUIを持たないサーバーではCLI（コマンドライン）が唯一の操作手段になります。',
              '基本コマンド: `pwd`（現在地確認）/ `ls -la`（一覧表示）/ `cd`（移動）/ `mkdir`（作成）/ `cp`（コピー）/ `mv`（移動・リネーム）/ `rm`（削除）。この7つで実務の8割は動きます。',
              '**絶対パス**（`/`から始まる、常にルートからの位置）と**相対パス**（`./`は現在地、`../`は1つ上、`~`はホームディレクトリ）の違いを常に意識しましょう。',
              'わからないコマンドに出会ったら、AIに聞く前に `man コマンド名` や `コマンド名 --help` を自分で引く習慣をつけると、公式のオプション一覧に強くなります。',
            ],
            points: [
              'pwd/ls/cd/mkdir/cp/mv/rmの7つで実務の8割は動く',
              '相対パスの`./`と`../`の違いを常に意識する',
              'man/--helpをまず自分で引く',
            ],
            quiz: {
              question: '`/home/user/project`にいる状態で`cd ../data`を実行するとどこに移動するか？',
              hint: '`../`は「1つ上のディレクトリ」を意味します。まず1つ上に上がってから`data`を探しましょう。',
              options: [
                {
                  text: '`/home/user/data`',
                  correct: true,
                  why: '正解です！`../`で1つ上の`/home/user`に上がり、そこから`data`へ移動するため`/home/user/data`になります。',
                },
                {
                  text: '`/home/user/project/data`',
                  correct: false,
                  why: 'それは`./data`（現在地の中の`data`）を実行した場合の移動先です。`../`は1つ上に上がる点に注意してください。',
                },
                {
                  text: '`/data`',
                  correct: false,
                  why: 'ルート直下の`/data`に行くには絶対パス`cd /data`の指定が必要です。`../`は相対パスなので現在地基準で1つ上に上がるだけです。',
                },
              ],
            },
          },
          {
            id: 'ld-1-2',
            title: '権限・プロセス・環境変数',
            minutes: 20,
            intro:
              '「Permission denied」に一度もぶつからずにLinuxを使うエンジニアはいません。権限の仕組みを理解すればこのエラーは怖くなくなります。',
            content: [
              'ファイル権限は owner（所有者）/ group（グループ）/ other（その他）の3者それぞれに r（読み取り）/ w（書き込み）/ x（実行）が設定されます。`ls -l`で表示される`-rwxr-xr--`はこの3者×3権限を表しています。`chmod 755`のような数値指定は r=4, w=2, x=1 の合計で表現します。',
              'プロセス管理は `ps` で一覧を確認し、`kill プロセスID` で終了させます。`kill -9`は強制終了のため最終手段として使いましょう。',
              '**環境変数**と`PATH`はプログラムの実行環境を左右する重要な仕組みです。APIキーやパスワードをコードに直書きせず`.env`ファイルの環境変数に置くのは、コードをGit等で共有してもシークレットが漏れないようにするためです（AI活用開発トラックのセキュリティ内容とも直結します）。',
            ],
            points: [
              'rwx権限とchmodの数値指定を読み解ける',
              'psでプロセス確認・killで終了できる',
              '秘密情報を環境変数に置く理由を説明できる',
            ],
            quiz: {
              question: '権限`-rw-r--r--`（644）の正しい説明はどれか？',
              hint: '3文字ずつ「owner」「group」「other」に分けて読みます。`rw-`はread+write、`r--`はreadのみです。',
              options: [
                {
                  text: '所有者は読み書き可能、グループとその他は読み取りのみ',
                  correct: true,
                  why: '正解です！先頭3文字`rw-`が所有者（読み書き可）、次の3文字`r--`がグループ（読み取りのみ）、最後の3文字`r--`がその他（読み取りのみ）を表します。',
                },
                {
                  text: '全員が読み書き実行可能',
                  correct: false,
                  why: 'それは`777`（`rwxrwxrwx`）の説明です。`644`にはx（実行権限）が一つも含まれていません。',
                },
                {
                  text: '誰もアクセスできない',
                  correct: false,
                  why: '`r--`が3箇所とも含まれているため、実際には全員が読み取り可能です。「誰もアクセスできない」のは`000`の場合です。',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'docker-basics',
        title: '第2章: コンテナ技術入門',
        description: 'VMとの違いからDockerfile・docker-composeの読み書きまでを扱う。',
        lessons: [
          {
            id: 'ld-2-1',
            title: 'なぜコンテナか：VMとの違い、イメージとコンテナ',
            minutes: 20,
            intro: '「私の環境では動くのに本番では動かない」を終わらせたのがDockerです。',
            content: [
              '**コンテナ**はアプリケーションと実行環境をまとめてパッケージ化する技術です。VM（仮想マシン）がOSごと仮想化するのに対し、コンテナはホストOSのカーネルを共有するため軽量に動作します。',
              '**イメージ**は設計図（読み取り専用）、**コンテナ**はそのイメージから起動された実行中のインスタンスです。同じイメージから何個でも同じ環境のコンテナを作れます。',
              'Docker Hub等のレジストリから既存イメージを`docker pull`で取得できます。自作のイメージは`Dockerfile`というテキストファイルから`docker build`で作成します。',
              '環境構築を「手順書（人が読んで再現する）」ではなく「実行可能なコード（誰が実行しても同じ結果になる）」として共有できることが、DX上の本質的な価値です。',
            ],
            points: [
              'VMとの違い＝ホストOSカーネル共有で軽量',
              'イメージ＝設計図、コンテナ＝実行中インスタンス',
              '環境構築を「コード」として共有できることがDXの本質',
            ],
            codeExercise: {
              prompt:
                '新メンバーから「READMEの手順通りに進めてもNode.jsのバージョンが違ってエラーが出る」と相談されました。そこで以下のような`Dockerfile`を用意することにしました。この場合、バージョン不一致の問題はどうなるでしょうか？',
              code: `FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]`,
              question: 'このDockerfileを使うことで、Node.jsのバージョン不一致問題はどうなるか？',
              hint: '`FROM node:20-alpine`はベースイメージにNode.js 20系を固定しています。誰が`docker build`しても同じイメージから始まります。',
              options: [
                {
                  text: '解決される。誰が`docker build`してもNode.js 20系のベースイメージから統一される',
                  correct: true,
                  why: '正解です！`FROM node:20-alpine`によってコンテナ内のNode.jsバージョンが固定されるため、開発者のローカル環境のNode.jsバージョンに関係なく、常に同じバージョンでアプリが実行されます。',
                },
                {
                  text: 'Dockerを使ってもローカルにインストールされたNode.jsがそのまま使われるので解決しない',
                  correct: false,
                  why: 'コンテナはホストOSのカーネルは共有しますが、コンテナ内のNode.jsはイメージに含まれるものが独立して使われます。ローカルのNode.jsバージョンには影響されません。',
                },
                {
                  text: 'COPYの順序を変えない限り解決しない',
                  correct: false,
                  why: 'COPYの順序はDockerのビルドキャッシュ効率（再ビルド時の速度）に関わる話であり、Node.jsのバージョン問題とは無関係です。',
                },
              ],
            },
          },
          {
            id: 'ld-2-2',
            title: 'Dockerfile・docker-composeの読み書き',
            minutes: 25,
            intro:
              'Dockerfileの1行1行が読めれば、他人（やAI）が書いた環境構築コードのレビューができるようになります。',
            content: [
              '**Dockerfile**の主要命令: `FROM`（ベースイメージ指定）/ `WORKDIR`（作業ディレクトリ設定）/ `COPY`（ファイルをコンテナ内にコピー）/ `RUN`（ビルド時にコマンド実行）/ `CMD`（コンテナ起動時に実行するコマンド）。',
              '`docker build -t myapp .`でイメージを作成し、`docker run -p ホスト:コンテナ myapp`で起動します。`-p`のポートマッピングは「ホスト側の待受ポート:コンテナ内のポート」という対応関係を表します。',
              '複数コンテナで構成するアプリは`docker-compose.yml`にまとめます。`services:`配下の各サービスに`image`（使うイメージ）/ `build`（自前ビルド）/ `ports`（ポート）/ `volumes`（永続化）/ `environment`（環境変数）を書き、`docker compose up`で一括起動できます。',
              '`volumes`はコンテナを削除してもデータを残すための仕組みです。コンテナ自体は使い捨てが基本のため、DBのデータなど残したい情報は必ずvolumeに置くのが実務での鉄則です。',
            ],
            points: [
              'FROM/WORKDIR/COPY/RUN/CMDの役割を説明できる',
              'ポートマッピング（ホスト:コンテナ）の意味を理解している',
              'docker-composeで複数コンテナ・volumesの必要性を説明できる',
            ],
            codingChallenge: {
              prompt:
                'docker-composeの`ports`設定（`["8080:80", "5432:5432"]`のような文字列配列）を、`{ host, container }`オブジェクトの配列に変換する関数`parsePortMappings`を実装してください。',
              functionName: 'parsePortMappings',
              signature: 'function parsePortMappings(ports)',
              starterCode: `function parsePortMappings(ports) {
  // ports: ["8080:80", "5432:5432"] のような文字列配列
  // 戻り値: [{ host: "8080", container: "80" }, ...]
  // ":" で分割する
}`,
              tests: [
                { description: '1件のマッピング', script: 'JSON.stringify(fn(["8080:80"]))', expected: '"[{\\"host\\":\\"8080\\",\\"container\\":\\"80\\"}]"' },
                { description: '2件のマッピング', script: 'fn(["8080:80","5432:5432"]).length', expected: '2' },
                { description: '空配列', script: 'JSON.stringify(fn([]))', expected: '"[]"' },
              ],
              hints: [
                '`port.split(\':\')`で`[host, container]`の配列になります',
                '`ports.map(p => {...})`で各要素を変換します',
                'JSON.stringifyでの比較なのでキー順序（host→container）に注意してください',
              ],
              solution: `function parsePortMappings(ports) {
  return ports.map((p) => {
    const [host, container] = p.split(':')
    return { host, container }
  })
}`,
            },
          },
        ],
      },
    ],
  },
]
