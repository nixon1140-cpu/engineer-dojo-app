import type { Track, Scenario, Lesson } from '../types'
import { techTracks } from './tracks/tech'
import { businessTracks } from './tracks/business'
import { aiTracks } from './tracks/ai-era'
import { scenarios } from './scenarios'

export const tracks: Track[] = [...techTracks, ...businessTracks, ...aiTracks]
export { scenarios }

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id)
}

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id)
}

export type LessonLocation = {
  track: Track
  chapterTitle: string
  lesson: Lesson
  prev: { trackId: string; lessonId: string } | null
  next: { trackId: string; lessonId: string } | null
}

export function findLesson(lessonId: string): LessonLocation | null {
  const flat: { trackId: string; chapterTitle: string; lesson: Lesson }[] = []
  for (const t of tracks) {
    for (const ch of t.chapters) {
      for (const l of ch.lessons) {
        flat.push({ trackId: t.id, chapterTitle: ch.title, lesson: l })
      }
    }
  }
  const idx = flat.findIndex((f) => f.lesson.id === lessonId)
  if (idx === -1) return null
  const cur = flat[idx]
  return {
    track: getTrack(cur.trackId)!,
    chapterTitle: cur.chapterTitle,
    lesson: cur.lesson,
    prev: idx > 0 ? { trackId: flat[idx - 1].trackId, lessonId: flat[idx - 1].lesson.id } : null,
    next:
      idx < flat.length - 1
        ? { trackId: flat[idx + 1].trackId, lessonId: flat[idx + 1].lesson.id }
        : null,
  }
}

export function totalLessonCount(): number {
  return tracks.reduce(
    (sum, t) => sum + t.chapters.reduce((s, ch) => s + ch.lessons.length, 0),
    0
  )
}
