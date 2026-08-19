/* 一人前エンジニア道場 - フロントエンド共通JS
   進捗管理(localStorage) + クイズ + シナリオエンジン */
(function () {
  'use strict'

  const LS_KEY = 'dojo-progress-v1'

  /* ========== 進捗ストア ========== */
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || { lessons: {}, quiz: {}, scenarios: {} }
    } catch (e) {
      return { lessons: {}, quiz: {}, scenarios: {} }
    }
  }
  function saveProgress(p) {
    localStorage.setItem(LS_KEY, JSON.stringify(p))
  }
  const progress = loadProgress()

  window.Dojo = {
    completeLesson(id) {
      progress.lessons[id] = Date.now()
      saveProgress(progress)
    },
    isLessonDone(id) {
      return !!progress.lessons[id]
    },
    recordQuiz(id, correct) {
      // 正解した演習のみ記録
      if (correct) progress.quiz[id] = true
      saveProgress(progress)
    },
    recordScenario(id, score, max) {
      const prev = progress.scenarios[id]
      if (!prev || score > prev.score) {
        progress.scenarios[id] = { score, max, at: Date.now() }
        saveProgress(progress)
      }
    },
    get() {
      return progress
    },
    reset() {
      localStorage.removeItem(LS_KEY)
      location.reload()
    },
  }

  /* ========== クイズ（レッスンページ） ========== */
  document.querySelectorAll('.quiz-block').forEach((block) => {
    const options = block.querySelectorAll('.quiz-option')
    const feedback = block.querySelector('.quiz-feedback')
    const article = block.closest('.lesson-article')
    const lessonId = article ? article.dataset.lessonId : null

    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (block.dataset.answered === '1') return
        block.dataset.answered = '1'
        const correct = btn.dataset.correct === '1'

        options.forEach((b) => {
          b.disabled = true
          b.classList.add('opacity-60')
          if (b.dataset.correct === '1') {
            b.classList.remove('opacity-60')
            b.classList.add('border-emerald-400', 'bg-emerald-400/10')
          }
        })
        if (!correct) {
          btn.classList.add('border-red-400', 'bg-red-400/10')
        }

        feedback.classList.remove('hidden')
        feedback.className =
          'quiz-feedback mt-4 p-4 rounded-lg text-sm leading-relaxed ' +
          (correct
            ? 'bg-emerald-400/10 border border-emerald-400/40'
            : 'bg-red-400/10 border border-red-400/40')
        feedback.innerHTML =
          '<p class="font-bold mb-1">' +
          (correct
            ? '<i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i>正解！'
            : '<i class="fa-solid fa-circle-xmark text-red-400 mr-1"></i>不正解。緑の選択肢が正解です。') +
          '</p><p class="text-gray-300">' + escapeHtml(btn.dataset.why) + '</p>'

        if (lessonId && window.Dojo) window.Dojo.recordQuiz(lessonId, correct)
      })
    })
  })

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  /* ========== レッスン完了ボタン ========== */
  const completeBtn = document.getElementById('lesson-complete-btn')
  if (completeBtn) {
    const article = document.querySelector('.lesson-article')
    const lessonId = article && article.dataset.lessonId
    if (lessonId && window.Dojo.isLessonDone(lessonId)) {
      markCompleted()
    }
    completeBtn.addEventListener('click', () => {
      window.Dojo.completeLesson(lessonId)
      markCompleted()
      completeBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>完了しました！'
    })
    function markCompleted() {
      completeBtn.classList.remove('bg-amber-400', 'hover:bg-amber-300')
      completeBtn.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border', 'border-emerald-400/40')
      completeBtn.innerHTML = '<i class="fa-solid fa-circle-check mr-2"></i>完了済み'
    }
  }

  /* ========== 進捗バッジ（トラック一覧・詳細） ========== */
  // レッスンチェックマーク
  document.querySelectorAll('.lesson-check').forEach((el) => {
    const id = el.dataset.lessonId
    if (window.Dojo.isLessonDone(id)) {
      el.classList.remove('border-dojo-700')
      el.classList.add('border-emerald-400', 'bg-emerald-400/20')
      el.querySelector('i').classList.remove('hidden')
      el.querySelector('i').classList.add('text-emerald-400')
    }
  })

  /* ========== ダッシュボード描画 ========== */
  if (document.getElementById('stat-lessons')) {
    const p = window.Dojo.get()
    document.getElementById('stat-lessons').textContent = Object.keys(p.lessons).length
    document.getElementById('stat-quiz').textContent = Object.keys(p.quiz).length
    document.getElementById('stat-scenarios').textContent = Object.keys(p.scenarios).length

    // トラック別進捗: data-track-progress-label と bar を埋める
    document.querySelectorAll('[data-track-progress-label]').forEach((label) => {
      const trackId = label.dataset.trackProgressLabel
      const bar = document.querySelector('[data-track-progress-bar="' + trackId + '"]')
      // トラックのレッスンIDはlessonデータ属性から収集できないため、
      // ページ側で各トラックの総数は表示済み。完了数は progress.lessons の前方一致で推定。
      // lesson ID はトラックごとのprefix（fe-, be-, infra-, db-, mkt-, mgmt-, sales-, ai-）を持つ
      const prefixes = {
        frontend: 'fe-',
        backend: 'be-',
        infrastructure: 'infra-',
        database: 'db-',
        marketing: 'mkt-',
        management: 'mgmt-',
        sales: 'sales-',
        'ai-engineering': 'ai-',
      }
      const prefix = prefixes[trackId]
      if (!prefix) return
      const done = Object.keys(p.lessons).filter((id) => id.startsWith(prefix)).length
      const totalMatch = label.textContent.match(/\/\s*(\d+)/)
      const total = totalMatch ? parseInt(totalMatch[1], 10) : 0
      label.textContent = done + ' / ' + total
      if (bar && total > 0) {
        bar.style.width = Math.round((done / total) * 100) + '%'
      }
    })

    // シナリオ成績
    document.querySelectorAll('[data-scenario-score]').forEach((el) => {
      const id = el.dataset.scenarioScore
      const rec = p.scenarios[id]
      if (rec) {
        const pct = Math.round((rec.score / rec.max) * 100)
        const color = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'
        el.innerHTML =
          '<span class="' + color + ' font-bold">' + rec.score + ' / ' + rec.max + '点</span>' +
          '<span class="text-gray-500 text-xs ml-2">(' + pct + '%)</span>'
      }
    })

    // リセットボタン
    const resetBtn = document.getElementById('progress-reset-btn')
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('すべての学習進捗をリセットしますか？')) window.Dojo.reset()
      })
    }
  }

  /* ========== シナリオエンジン ========== */
  const scenarioRoot = document.getElementById('scenario-root')
  if (scenarioRoot) {
    const dataEl = document.getElementById('scenario-data')
    const scenario = JSON.parse(dataEl.textContent)
    const thread = document.getElementById('scenario-thread')
    const resultEl = document.getElementById('scenario-result')
    let stepIndex = 0
    let totalScore = 0
    let maxScore = 0

    function renderStep() {
      if (stepIndex >= scenario.steps.length) {
        renderResult()
        return
      }
      const step = scenario.steps[stepIndex]
      maxScore += 2

      const wrap = document.createElement('div')
      wrap.className = 'scenario-step'
      let html =
        '<div class="flex gap-3 mb-4">' +
        '<div class="w-10 h-10 rounded-full bg-dojo-700 flex items-center justify-center shrink-0">' +
        '<i class="fa-solid fa-user text-amber-400"></i></div>' +
        '<div class="flex-1">' +
        '<p class="text-xs text-gray-500 mb-1">' + escapeHtml(step.speaker) + '（' + escapeHtml(step.speakerRole) + '）</p>' +
        '<div class="bg-dojo-800 border border-dojo-700 rounded-xl rounded-tl-none p-4 text-sm leading-relaxed">' +
        escapeHtml(step.text) + '</div></div></div>'
      if (step.code) {
        html +=
          '<pre class="bg-dojo-950 border border-dojo-700 rounded-lg p-4 text-xs overflow-x-auto mb-4 leading-relaxed"><code>' +
          escapeHtml(step.code) + '</code></pre>'
      }
      html += '<p class="text-sm font-bold text-amber-400 mb-2"><i class="fa-solid fa-reply mr-1"></i>あなたの返答は？</p>'
      html += '<div class="space-y-2 choices"></div>'
      wrap.innerHTML = html

      const choicesEl = wrap.querySelector('.choices')
      step.choices.forEach(function (choice) {
        const btn = document.createElement('button')
        btn.className =
          'w-full text-left px-4 py-3 rounded-lg border border-dojo-700 hover:border-amber-400/60 transition text-sm'
        btn.textContent = choice.text
        btn.addEventListener('click', function () {
          if (wrap.dataset.answered === '1') return
          wrap.dataset.answered = '1'
          totalScore += choice.score

          // 全ボタンを無効化し、選択を表示
          choicesEl.querySelectorAll('button').forEach(function (b) {
            b.disabled = true
            b.classList.add('opacity-50')
          })
          btn.classList.remove('opacity-50')
          const scoreColor =
            choice.score === 2 ? 'border-emerald-400 bg-emerald-400/10' : choice.score === 1 ? 'border-amber-400 bg-amber-400/10' : 'border-red-400 bg-red-400/10'
          scoreColor.split(' ').forEach(function (cls) { btn.classList.add(cls) })

          // あなたの発言として表示 + フィードバック
          const fb = document.createElement('div')
          const badge =
            choice.score === 2
              ? '<span class="text-emerald-400 font-bold">◎ 最善の選択</span>'
              : choice.score === 1
              ? '<span class="text-amber-400 font-bold">○ 及第点</span>'
              : '<span class="text-red-400 font-bold">△ 改善余地あり</span>'
          fb.className = 'mt-2 p-4 rounded-lg bg-dojo-800 border border-dojo-700 text-sm leading-relaxed'
          fb.innerHTML =
            '<p class="text-xs text-gray-500 mb-1"><i class="fa-solid fa-user-graduate mr-1"></i>あなたの返答</p>' +
            '<p class="mb-3 text-gray-200">' + escapeHtml(choice.text) + '</p>' +
            badge +
            '<p class="mt-2 text-gray-300">' + escapeHtml(choice.feedback) + '</p>'
          choicesEl.after(fb)

          // 次へボタン
          const nextBtn = document.createElement('button')
          nextBtn.className =
            'mt-4 bg-amber-400 text-dojo-950 font-bold px-6 py-2 rounded-lg hover:bg-amber-300 transition text-sm'
          nextBtn.innerHTML =
            stepIndex < scenario.steps.length - 1
              ? '次へ<i class="fa-solid fa-arrow-right ml-2"></i>'
              : '結果を見る<i class="fa-solid fa-flag-checkered ml-2"></i>'
          nextBtn.addEventListener('click', function () {
            nextBtn.remove()
            stepIndex++
            renderStep()
            // 新しいステップまでスクロール
            var steps = thread.querySelectorAll('.scenario-step')
            var last = steps[steps.length - 1]
            if (last) last.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
          fb.after(nextBtn)
        })
        choicesEl.appendChild(btn)
      })

      thread.appendChild(wrap)
    }

    function renderResult() {
      const pct = Math.round((totalScore / maxScore) * 100)
      const rank =
        pct >= 90 ? { label: '一人前', icon: 'fa-trophy', color: 'text-amber-400', msg: '素晴らしい判断力です。現場でも通用する水準に達しています。' }
        : pct >= 70 ? { label: '中堅', icon: 'fa-medal', color: 'text-emerald-400', msg: '十分実践的です。フィードバックを読み返して、最善手を復習しましょう。' }
        : pct >= 40 ? { label: '見習い', icon: 'fa-seedling', color: 'text-sky-400', msg: '基本は掴めています。各選択のフィードバックを読み、もう一度挑戦してみましょう。' }
        : { label: '入門', icon: 'fa-egg', color: 'text-gray-400', msg: 'まずはフィードバックをじっくり読んで、考え方の型を身につけましょう。' }

      window.Dojo.recordScenario(scenario.id, totalScore, maxScore)

      let html =
        '<div class="bg-dojo-800 border border-dojo-700 rounded-2xl p-8 text-center">' +
        '<p class="text-sm text-gray-400 mb-2">シナリオ結果</p>' +
        '<i class="fa-solid ' + rank.icon + ' text-5xl ' + rank.color + ' mb-4"></i>' +
        '<p class="text-2xl font-black ' + rank.color + ' mb-1">' + rank.label + '</p>' +
        '<p class="text-lg font-bold mb-4">' + totalScore + ' / ' + maxScore + '点（' + pct + '%）</p>' +
        '<p class="text-sm text-gray-300 mb-6">' + rank.msg + '</p>' +
        '<div class="text-left bg-dojo-900 border border-dojo-700 rounded-xl p-5 mb-6">' +
        '<p class="font-bold text-amber-400 text-sm mb-3"><i class="fa-solid fa-graduation-cap mr-1"></i>このシナリオの学び</p><ul class="space-y-2 text-sm text-gray-300">'
      scenario.debrief.forEach(function (d) {
        html += '<li class="flex gap-2"><i class="fa-solid fa-check text-amber-400 mt-1 shrink-0"></i><span>' + escapeHtml(d) + '</span></li>'
      })
      html +=
        '</ul></div>' +
        '<div class="flex flex-wrap justify-center gap-3">' +
        '<a href="/scenarios/' + scenario.id + '" class="border border-dojo-700 px-6 py-2 rounded-lg text-sm hover:border-amber-400 transition"><i class="fa-solid fa-rotate-right mr-1"></i>もう一度挑戦</a>' +
        '<a href="/scenarios" class="border border-dojo-700 px-6 py-2 rounded-lg text-sm hover:border-amber-400 transition"><i class="fa-solid fa-list mr-1"></i>シナリオ一覧</a>' +
        '<a href="/dashboard" class="bg-amber-400 text-dojo-950 font-bold px-6 py-2 rounded-lg text-sm hover:bg-amber-300 transition"><i class="fa-solid fa-chart-line mr-1"></i>進捗を見る</a>' +
        '</div></div>'

      resultEl.innerHTML = html
      resultEl.classList.remove('hidden')
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    renderStep()
  }
})()
