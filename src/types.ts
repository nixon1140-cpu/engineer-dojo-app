// カリキュラムの型定義

export type QuizOption = {
  text: string
  correct: boolean
  why: string // その選択肢に対する解説
}

export type Quiz = {
  question: string
  options: QuizOption[]
}

// コード読解・修正の演習（AIや他人が書いたコードを読む練習）
export type CodeExercise = {
  prompt: string // 状況説明
  code: string // 読む対象のコード
  question: string
  options: QuizOption[]
}

export type Lesson = {
  id: string
  title: string
  minutes: number // 想定学習時間
  intro: string // 導入（なぜこれを学ぶか）
  content: string[] // 本文段落（簡易マークダウン: **太字**, `コード`）
  points: string[] // 重要ポイントのまとめ
  quiz?: Quiz
  codeExercise?: CodeExercise
}

export type Chapter = {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export type TrackCategory = 'tech' | 'business' | 'ai'

export type Track = {
  id: string
  title: string
  category: TrackCategory
  icon: string // FontAwesome クラス
  color: string // Tailwind カラー名 (e.g. 'blue')
  tagline: string
  description: string
  outcomes: string[] // このトラックで身につくこと
  chapters: Chapter[]
}

// 実践シナリオ（ロールプレイ型シミュレーション）
export type ScenarioChoice = {
  text: string
  feedback: string
  score: number // 0-2: 0=悪手, 1=及第点, 2=最善
}

export type ScenarioStep = {
  speaker: string // 話者（役割）
  speakerRole: string
  text: string
  code?: string // 提示されるコード（任意）
  choices: ScenarioChoice[]
}

export type Scenario = {
  id: string
  title: string
  skill: string // 鍛えるスキル名
  difficulty: 1 | 2 | 3
  minutes: number
  situation: string // 導入ストーリー
  steps: ScenarioStep[]
  debrief: string[] // 学びのまとめ
}
