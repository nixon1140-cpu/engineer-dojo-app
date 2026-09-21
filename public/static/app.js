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
        beginner: 'bg-',
        frontend: 'fe-',
        backend: 'be-',
        infrastructure: 'infra-',
        database: 'db-',
        git: 'git-',
        'http-api': 'http-',
        testing: 'test-',
        'linux-docker': 'ld-',
        practice: 'pr-',
        'ai-dev': 'aid-',
        'dx-scenario': 'dx-',
        portfolio: 'pf-',
        marketing: 'mkt-',
        management: 'mgmt-',
        sales: 'sales-',
        'ai-engineering': 'ai-',
        'career-strategy': 'cs-',
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

    // ========== 学習時間・ストリーク・活動日数 ==========
    var lessonTimestamps = Object.values(p.lessons).sort()
    // 推定学習時間: 1レッスン完了あたり平均20分と仮定
    var estimatedMinutes = Object.keys(p.lessons).length * 20
    var studyTimeEl = document.getElementById('stat-study-time')
    if (studyTimeEl) {
      if (estimatedMinutes >= 60) {
        studyTimeEl.innerHTML = Math.floor(estimatedMinutes / 60) + '<span class="text-base font-normal text-gray-400">時間</span>' + (estimatedMinutes % 60) + '<span class="text-base font-normal text-gray-400">分</span>'
      } else {
        studyTimeEl.innerHTML = estimatedMinutes + '<span class="text-base font-normal text-gray-400">分</span>'
      }
    }

    // 学習した日付を収集（レッスン完了タイムスタンプから）
    var activeDaySet = {}
    Object.values(p.lessons).forEach(function (ts) {
      if (!ts) return
      var d = new Date(ts)
      var dayKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
      activeDaySet[dayKey] = (activeDaySet[dayKey] || 0) + 1
    })
    // デイリークイズの日付も含める
    try {
      var dailyState2 = JSON.parse(localStorage.getItem('dojo-daily-quiz-v1')) || {}
      if (dailyState2.history) {
        dailyState2.history.forEach(function (h) { activeDaySet[h.date] = (activeDaySet[h.date] || 0) + 1 })
      }
    } catch (e) {}

    var activeDays = Object.keys(activeDaySet).sort()
    var activeDayCount = activeDays.length
    var activeDaysEl = document.getElementById('stat-active-days')
    if (activeDaysEl) activeDaysEl.innerHTML = activeDayCount + '<span class="text-base font-normal text-gray-400">日</span>'

    // ストリーク計算（連続学習日数）
    var streak = 0
    if (activeDays.length > 0) {
      var today = new Date()
      var todayStr2 = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
      var yesterday2 = new Date(today)
      yesterday2.setDate(yesterday2.getDate() - 1)
      var yesterdayStr2 = yesterday2.getFullYear() + '-' + String(yesterday2.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday2.getDate()).padStart(2, '0')

      var checkDate = activeDaySet[todayStr2] ? todayStr2 : (activeDaySet[yesterdayStr2] ? yesterdayStr2 : null)
      if (checkDate) {
        streak = 1
        var prev = new Date(checkDate)
        while (true) {
          prev.setDate(prev.getDate() - 1)
          var prevStr = prev.getFullYear() + '-' + String(prev.getMonth() + 1).padStart(2, '0') + '-' + String(prev.getDate()).padStart(2, '0')
          if (activeDaySet[prevStr]) { streak++ } else { break }
        }
      }
    }
    var streakEl2 = document.getElementById('stat-streak')
    if (streakEl2) streakEl2.innerHTML = streak + '<span class="text-base font-normal text-gray-400">日</span>'

    // ========== 活動履歴（日別サマリ・直近30日） ==========
    var historyEl = document.getElementById('activity-history')
    if (historyEl && activeDays.length > 0) {
      // 直近30日分を新しい順に表示
      var recentDays = activeDays.slice(-30).reverse()
      var html = '<div class="space-y-2">'
      recentDays.forEach(function (day) {
        var count = activeDaySet[day]
        var parts = day.split('-')
        var label = parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日'
        html += '<div class="flex items-center gap-3 bg-dojo-800 border border-dojo-700 rounded-lg px-4 py-3">' +
          '<span class="text-xs text-gray-400 w-20 shrink-0">' + label + '</span>' +
          '<div class="flex-1 h-2 bg-dojo-700 rounded-full overflow-hidden">' +
          '<div class="h-full bg-amber-400 rounded-full transition-all" style="width:' + Math.min(100, count * 20) + '%"></div>' +
          '</div>' +
          '<span class="text-xs text-amber-400 font-bold w-16 text-right shrink-0">' + count + ' アクション</span>' +
          '</div>'
      })
      html += '</div>'
      historyEl.innerHTML = html
    }

    // ========== バッジ判定 ==========
    var lessonsCount = Object.keys(p.lessons).length
    var scenariosCount = Object.keys(p.scenarios).length

    // 全トラック到達チェック（全トラックで1本以上完了）
    var trackPrefixes2 = {
      beginner: 'bg-', git: 'git-', 'http-api': 'http-', testing: 'test-',
      practice: 'pr-', 'ai-dev': 'aid-', 'dx-scenario': 'dx-', portfolio: 'pf-',
      marketing: 'mkt-', management: 'mgmt-', sales: 'sales-', 'ai-engineering': 'ai-'
    }
    var allTracksCovered = true
    Object.values(trackPrefixes2).forEach(function (prefix) {
      if (!Object.keys(p.lessons).some(function (id) { return id.startsWith(prefix) })) {
        allTracksCovered = false
      }
    })

    // シナリオ全制覇チェック（全シナリオを80%以上でクリア）
    var allScenariosAce = Object.values(p.scenarios).length >= 14 &&
      Object.values(p.scenarios).every(function (rec) {
        return rec && rec.max && Math.round((rec.score / rec.max) * 100) >= 80
      })

    // スキルチェック完走チェック（10レッスン以上にスキルチェック記録）
    var skillsCount = 0
    try {
      var skillsData = JSON.parse(localStorage.getItem('dojo-skills-v1')) || {}
      skillsCount = Object.keys(skillsData).length
    } catch (e) {}

    var badgeConditions = {
      'first-lesson': lessonsCount >= 1,
      'ten-lessons': lessonsCount >= 10,
      'twenty-lessons': lessonsCount >= 20,
      'all-tracks': allTracksCovered,
      'scenario-master': scenariosCount >= 5,
      'scenario-ace': allScenariosAce,
      'streak-three': streak >= 3,
      'skill-check': skillsCount >= 10,
    }

    var earnedBadges = 0
    document.querySelectorAll('.badge-card').forEach(function (card) {
      var badgeId = card.dataset.badgeId
      if (badgeConditions[badgeId]) {
        card.classList.remove('opacity-40')
        card.classList.add('ring-2', 'ring-amber-400/40')
        earnedBadges++
      }
    })
    var badgeCountEl = document.getElementById('badge-count')
    if (badgeCountEl) badgeCountEl.textContent = earnedBadges

    // リセットボタン
    const resetBtn = document.getElementById('progress-reset-btn')
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('すべての学習進捗をリセットしますか？')) window.Dojo.reset()
      })
    }
  }

  /* ========== コーディング演習（実際に書く→ブラウザ内でテスト実行） ========== */
  // ユーザーコードの評価 + テスト実行を行う純粋関数。
  // Web Worker 内でも同じロジックを使うため、外部の変数・関数を一切参照しない
  // 自己完結した実装にしてある（toString() でソース文字列化し Worker に埋め込む）。
  function evaluateCoding(code, fnName, testList) {
    let fn
    try {
      fn = new Function(code + '\nreturn ' + fnName + ';')()
    } catch (e) {
      return { type: 'syntaxError', message: String((e && e.message) || e) }
    }
    if (typeof fn !== 'function') {
      return { type: 'noFunction' }
    }
    const results = testList.map(function (t) {
      let actual
      let ok = false
      let error = null
      try {
        actual = new Function('fn', 'return (' + t.script + ');')(fn)
        ok = JSON.stringify(actual) === t.expected
      } catch (e) {
        error = String((e && e.message) || e)
      }
      let actualText = null
      if (!ok && !error) {
        if (actual === undefined) {
          actualText = 'undefined'
        } else {
          try {
            actualText = JSON.stringify(actual)
          } catch (e2) {
            actualText = String(actual)
          }
        }
      }
      return { description: t.description, ok: ok, error: error, expected: t.expected, actual: actualText }
    })
    return { type: 'done', results: results }
  }

  document.querySelectorAll('.coding-challenge').forEach(function (block) {
    const editor = block.querySelector('.coding-editor')
    const runBtn = block.querySelector('.coding-run-btn')
    const resetBtn = block.querySelector('.coding-reset-btn')
    const hintsBtn = block.querySelector('.coding-hints-btn')
    const solutionBtn = block.querySelector('.coding-solution-btn')
    const hintsEl = block.querySelector('.coding-hints')
    const solutionEl = block.querySelector('.coding-solution')
    const resultsEl = block.querySelector('.coding-results')
    const lessonId = block.dataset.lessonId
    const functionName = block.dataset.functionName
    const starterCode = editor.value
    let tests = []
    try {
      tests = JSON.parse(block.querySelector('.coding-tests-data').textContent)
    } catch (e) {
      console.error('テストデータの読み込みに失敗', e)
      return
    }

    // ヒント/解答のトグル
    hintsBtn.addEventListener('click', function () {
      hintsEl.classList.toggle('hidden')
    })
    solutionBtn.addEventListener('click', function () {
      if (
        solutionEl.classList.contains('hidden') &&
        !confirm('模範解答を表示します。先に自力で挑戦しましたか？')
      ) {
        return
      }
      solutionEl.classList.toggle('hidden')
    })
    resetBtn.addEventListener('click', function () {
      if (confirm('編集内容を破棄して初期コードに戻しますか？')) {
        editor.value = starterCode
        resultsEl.classList.add('hidden')
      }
    })

    // Tabキーでインデント（スマホ/PC共通で編集体験を向上）
    editor.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault()
        const start = this.selectionStart
        const end = this.selectionEnd
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end)
        this.selectionStart = this.selectionEnd = start + 2
      }
    })

    // --- 実行結果の描画 ---
    function renderSyntaxError(message) {
      resultsEl.innerHTML =
        '<div class="p-4 rounded-lg bg-red-400/10 border border-red-400/40 text-sm">' +
        '<p class="font-bold text-red-400 mb-1"><i class="fa-solid fa-bug mr-1"></i>構文エラー</p>' +
        '<p class="text-gray-300 font-mono text-xs">' + escapeHtml(message) + '</p>' +
        '<p class="text-gray-500 text-xs mt-2">コードの文法を確認してください（括弧の閉じ忘れ等）。</p></div>'
    }

    function renderNoFunctionError() {
      resultsEl.innerHTML =
        '<div class="p-4 rounded-lg bg-red-400/10 border border-red-400/40 text-sm text-gray-300">' +
        '関数 <code class="text-amber-300">' + escapeHtml(functionName) + '</code> が定義されていません。関数名を変更しないでください。</div>'
    }

    function renderTimeoutError() {
      resultsEl.innerHTML =
        '<div class="p-4 rounded-lg bg-red-400/10 border border-red-400/40 text-sm">' +
        '<p class="font-bold text-red-400 mb-1"><i class="fa-solid fa-hourglass-half mr-1"></i>実行がタイムアウトしました（5秒）</p>' +
        '<p class="text-gray-300">無限ループや非常に重い計算が原因の可能性があります。<strong class="text-red-300">実行は強制停止済みで、ブラウザは固まっていません。</strong>安心してコードを修正して再実行してください。</p>' +
        '<ul class="text-xs text-gray-500 mt-2 space-y-1">' +
        '<li>・while / for のループ条件が、いつかは成立しなくなるか確認する</li>' +
        '<li>・ループ内でカウンタ変数（i など）を更新し忘れていないか確認する</li>' +
        '</ul></div>'
    }

    function renderWorkerError(message) {
      resultsEl.innerHTML =
        '<div class="p-4 rounded-lg bg-red-400/10 border border-red-400/40 text-sm">' +
        '<p class="font-bold text-red-400 mb-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i>実行環境エラー</p>' +
        '<p class="text-gray-300 font-mono text-xs">' + escapeHtml(message) + '</p></div>'
    }

    function renderTestResults(results) {
      let passed = 0
      let rows = ''
      results.forEach(function (t, i) {
        if (t.ok) passed++
        rows +=
          '<li class="flex gap-2 text-sm ' + (t.ok ? 'text-gray-300' : 'text-red-300') + '">' +
          '<i class="fa-solid ' + (t.ok ? 'fa-circle-check text-emerald-400' : 'fa-circle-xmark text-red-400') + ' mt-1 shrink-0"></i>' +
          '<span>テスト' + (i + 1) + ': ' + escapeHtml(t.description) +
          (t.ok ? '' : '<br><span class="text-xs text-gray-500 font-mono">' +
            (t.error ? '実行エラー: ' + escapeHtml(t.error) : '期待値: ' + escapeHtml(t.expected) + ' / 実際: ' + escapeHtml(t.actual == null ? 'undefined' : t.actual)) +
            '</span>') +
          '</span></li>'
      })

      const allPassed = passed === results.length
      resultsEl.innerHTML =
        '<div class="p-4 rounded-lg border text-sm ' +
        (allPassed
          ? 'bg-emerald-400/10 border-emerald-400/40'
          : 'bg-dojo-800 border-dojo-700') +
        '">' +
        '<p class="font-bold mb-2 ' + (allPassed ? 'text-emerald-400' : 'text-amber-400') + '">' +
        (allPassed
          ? '<i class="fa-solid fa-trophy mr-1"></i>全テスト合格！ ' + passed + '/' + results.length
          : '<i class="fa-solid fa-flask mr-1"></i>' + passed + ' / ' + results.length + ' 件合格') +
        '</p>' +
        '<ul class="space-y-1.5">' + rows + '</ul>' +
        (allPassed
          ? '<p class="text-xs text-gray-400 mt-3">合格です。次は「模範解答」と見比べて、書き方の違いを確認しましょう。</p>'
          : '<p class="text-xs text-gray-400 mt-3">失敗したテストの期待値と実際の値を比較して、修正してみましょう。ヒントも活用できます。</p>') +
        '</div>'

      // 全合格は進捗に記録（quiz枠を流用）
      if (allPassed && lessonId && window.Dojo) {
        window.Dojo.recordQuiz(lessonId + '-coding', true)
      }
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }

    function handleResult(res) {
      if (!res) {
        renderWorkerError('実行結果を受け取れませんでした。')
      } else if (res.type === 'syntaxError') {
        renderSyntaxError(res.message)
      } else if (res.type === 'noFunction') {
        renderNoFunctionError()
      } else if (res.type === 'fatal') {
        renderWorkerError(res.message)
      } else {
        renderTestResults(res.results)
      }
    }

    // 無限ループ対策の実行タイムアウト
    const RUN_TIMEOUT_MS = 5000

    runBtn.addEventListener('click', function () {
      const code = editor.value
      resultsEl.classList.remove('hidden')

      // ユーザーコードは Web Worker（別スレッド）で実行する。
      // 無限ループが含まれていてもメインスレッド（画面）が固まらず、
      // タイムアウト時に worker.terminate() で強制停止できる。
      if (!window.Worker || !window.Blob || !window.URL || !window.URL.createObjectURL) {
        handleResult(evaluateCoding(code, functionName, tests))
        return
      }

      runBtn.disabled = true
      const originalLabel = runBtn.innerHTML
      runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>実行中…（最大5秒）'

      let worker = null
      let objectUrl = null
      let settled = false
      const timer = setTimeout(function () {
        finish('timeout')
      }, RUN_TIMEOUT_MS)

      function cleanup() {
        clearTimeout(timer)
        if (worker) worker.terminate()
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        runBtn.disabled = false
        runBtn.innerHTML = originalLabel
      }

      function finish(kind, payload) {
        if (settled) return
        settled = true
        cleanup()
        if (kind === 'timeout') renderTimeoutError()
        else if (kind === 'workerError') renderWorkerError(payload)
        else handleResult(payload)
      }

      try {
        // evaluateCoding のソースを文字列化して Worker に渡す（別ファイル不要）
        const source =
          'var evaluateCoding = ' + evaluateCoding.toString() + ';\n' +
          'self.onmessage = function (e) {\n' +
          '  var d = e.data;\n' +
          '  try {\n' +
          '    self.postMessage(evaluateCoding(d.code, d.fnName, d.tests));\n' +
          '  } catch (err) {\n' +
          '    self.postMessage({ type: "fatal", message: String((err && err.message) || err) });\n' +
          '  }\n' +
          '};'
        objectUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))
        worker = new Worker(objectUrl)
        worker.onmessage = function (e) { finish('result', e.data) }
        worker.onerror = function (e) { finish('workerError', String((e && e.message) || '不明なエラー')) }
        worker.postMessage({ code: code, fnName: functionName, tests: tests })
      } catch (e) {
        // Worker を起動できない環境では同期実行にフォールバック
        if (!settled) {
          settled = true
          cleanup()
        }
        handleResult(evaluateCoding(code, functionName, tests))
      }
    })
  })

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

  /* ========== スキルチェックリスト ========== */
  const SKILLS_KEY = 'dojo-skills-v1'

  function loadSkills() {
    try {
      return JSON.parse(localStorage.getItem(SKILLS_KEY)) || {}
    } catch (e) {
      return {}
    }
  }
  function saveSkills(s) {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(s))
  }

  // ダッシュボードのスキル統計を描画
  if (document.getElementById('stat-skill-ok')) {
    var skills = loadSkills()
    var okCount = 0, partialCount = 0, ngCount = 0
    Object.values(skills).forEach(function (v) {
      if (v === 'ok') okCount++
      else if (v === 'partial') partialCount++
      else if (v === 'ng') ngCount++
    })
    document.getElementById('stat-skill-ok').textContent = okCount
    document.getElementById('stat-skill-partial').textContent = partialCount
    document.getElementById('stat-skill-weakness').textContent = ngCount
  }

  // レッスンページのスキルチェックボタン
  document.querySelectorAll('.skill-check-section').forEach(function (section) {
    var lessonId = section.dataset.lessonId
    var skills = loadSkills()
    var current = skills[lessonId]
    var savedMsg = section.querySelector('.skill-check-saved')

    function updateButtons(level) {
      var btns = section.querySelectorAll('.skill-check-btn')
      btns.forEach(function (btn) {
        btn.classList.remove('border-emerald-400', 'bg-emerald-400/10', 'text-emerald-300',
          'border-amber-400', 'bg-amber-400/10', 'text-amber-300',
          'border-rose-400', 'bg-rose-400/10', 'text-rose-300')
        btn.classList.add('border-dojo-700')
        if (btn.dataset.level === level) {
          btn.classList.remove('border-dojo-700')
          if (level === 'ok') btn.classList.add('border-emerald-400', 'bg-emerald-400/10', 'text-emerald-300')
          else if (level === 'partial') btn.classList.add('border-amber-400', 'bg-amber-400/10', 'text-amber-300')
          else if (level === 'ng') btn.classList.add('border-rose-400', 'bg-rose-400/10', 'text-rose-300')
        }
      })
    }

    if (current) updateButtons(current)

    section.querySelectorAll('.skill-check-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var level = btn.dataset.level
        var skills = loadSkills()
        skills[lessonId] = level
        saveSkills(skills)
        updateButtons(level)
        if (savedMsg) savedMsg.classList.remove('hidden')
      })
    })
  })

  // 弱点マップページ
  var weaknessMapContent = document.getElementById('weakness-map-content')
  if (weaknessMapContent) {
    var skills = loadSkills()
    var okC = 0, partC = 0, ngC = 0

    // バッジを更新
    document.querySelectorAll('[data-skill-badge]').forEach(function (el) {
      var id = el.dataset.skillBadge
      var level = skills[id]
      if (level === 'ok') {
        el.innerHTML = '<span class="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-1 rounded-full"><i class="fa-solid fa-circle-check mr-1"></i>できる</span>'
        okC++
      } else if (level === 'partial') {
        el.innerHTML = '<span class="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-full"><i class="fa-solid fa-circle-half-stroke mr-1"></i>だいたいできる</span>'
        partC++
      } else if (level === 'ng') {
        el.innerHTML = '<span class="text-xs text-rose-400 bg-rose-400/10 border border-rose-400/30 px-2 py-1 rounded-full"><i class="fa-solid fa-circle-xmark mr-1"></i>できない</span>'
        ngC++
      }
    })

    // サマリーカード更新
    var okEl = document.getElementById('skill-achieved-count')
    var partEl = document.getElementById('skill-partial-count')
    var ngEl = document.getElementById('skill-weakness-count')
    if (okEl) okEl.textContent = okC
    if (partEl) partEl.textContent = partC
    if (ngEl) ngEl.textContent = ngC

    // トラック別サマリー
    document.querySelectorAll('[data-track-skill-summary]').forEach(function (el) {
      var trackId = el.dataset.trackSkillSummary
      var trackItems = document.querySelectorAll('.weakness-track-section[data-track-id="' + trackId + '"] [data-skill-badge]')
      var tOk = 0, tWeak = 0
      trackItems.forEach(function (item) {
        var lvl = skills[item.dataset.skillBadge]
        if (lvl === 'ok') tOk++
        else if (lvl === 'ng') tWeak++
      })
      if (tWeak > 0) {
        el.textContent = '弱点 ' + tWeak + ' 件'
        el.className = el.className.replace(/text-\w+-\d+/g, 'text-rose-400').replace(/bg-\w+-\d+\/\d+/g, 'bg-rose-400/10')
      } else if (tOk > 0) {
        el.textContent = '達成 ' + tOk + ' 件'
        el.className = el.className.replace(/text-\w+-\d+/g, 'text-emerald-400').replace(/bg-\w+-\d+\/\d+/g, 'bg-emerald-400/10')
      } else {
        el.textContent = '未チェック'
      }
    })

    // フィルタボタン
    var currentFilter = 'weakness'
    document.querySelectorAll('.skill-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = btn.dataset.filter
        document.querySelectorAll('.skill-filter-btn').forEach(function (b) {
          b.classList.remove('border-amber-400', 'text-amber-400')
          b.classList.add('border-dojo-700', 'text-gray-400')
        })
        btn.classList.remove('border-dojo-700', 'text-gray-400')
        btn.classList.add('border-amber-400', 'text-amber-400')

        document.querySelectorAll('.skill-map-item').forEach(function (item) {
          var id = item.dataset.lessonId
          var level = skills[id]
          if (currentFilter === 'weakness') {
            var isWeak = !level || level === 'ng'
            item.style.display = isWeak ? '' : 'none'
          } else {
            item.style.display = ''
          }
        })
      })
    })

    // 初期状態: 弱点フィルタを適用
    document.querySelectorAll('.skill-map-item').forEach(function (item) {
      var id = item.dataset.lessonId
      var level = skills[id]
      var isWeak = !level || level === 'ng'
      item.style.display = isWeak ? '' : 'none'
    })
  }

  /* ========== デイリークイズエンジン ========== */
  var DAILY_KEY = 'dojo-daily-quiz-v1'
  var REVIEWS_KEY = 'dojo-reviews-v1'

  function loadDailyState() {
    try {
      return JSON.parse(localStorage.getItem(DAILY_KEY)) || { history: [], streak: 0, lastDate: null }
    } catch (e) {
      return { history: [], streak: 0, lastDate: null }
    }
  }
  function saveDailyState(s) {
    localStorage.setItem(DAILY_KEY, JSON.stringify(s))
  }
  function loadReviews() {
    try {
      return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []
    } catch (e) {
      return []
    }
  }
  function saveReviews(r) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(r))
  }

  function getTodayStr() {
    var d = new Date()
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  }

  // 日付ベースのシード乱数（同じ日は同じ問題）
  function seededShuffle(arr, seed) {
    var a = arr.slice()
    var s = seed
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      var j = Math.abs(s) % (i + 1)
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp
    }
    return a
  }

  function dateSeed(dateStr) {
    var n = 0
    for (var i = 0; i < dateStr.length; i++) n = n * 31 + dateStr.charCodeAt(i)
    return n
  }

  var dailyQuizArea = document.getElementById('daily-quiz-area')
  if (dailyQuizArea) {
    var poolDataEl = document.getElementById('daily-quiz-pool-data')
    if (!poolDataEl) return

    var pool = []
    try {
      pool = JSON.parse(poolDataEl.textContent)
    } catch (e) {
      dailyQuizArea.innerHTML = '<p class="text-red-400 text-sm">クイズデータの読み込みに失敗しました。</p>'
      return
    }

    var today = getTodayStr()
    var dailyState = loadDailyState()

    // 日付表示
    var dateEl = document.getElementById('daily-date')
    if (dateEl) {
      var parts = today.split('-')
      dateEl.textContent = parts[0] + '年' + parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日'
    }

    // 今日すでに回答済みかチェック
    var todayRecord = dailyState.history.find(function (h) { return h.date === today })

    // ストリーク更新
    var yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    var yesterdayStr = yesterday.getFullYear() + '-' + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday.getDate()).padStart(2, '0')
    if (dailyState.lastDate !== today && dailyState.lastDate !== yesterdayStr) {
      dailyState.streak = 0
    }
    var streakEl = document.getElementById('daily-streak')
    if (streakEl) streakEl.textContent = (dailyState.streak || 0) + '日'

    // 今日の3問を選ぶ（シード付きシャッフル）
    var seed = dateSeed(today)
    var shuffled = seededShuffle(pool, seed)
    var todayQuestions = shuffled.slice(0, 3)

    if (todayRecord) {
      // 回答済みの場合は結果を表示
      renderDailyResult(todayRecord, todayQuestions)
    } else {
      // 未回答の場合はクイズを表示
      renderDailyQuiz(todayQuestions)
    }

    // 履歴を描画
    renderDailyHistory()
    // 復習リストを描画
    renderReviewList()

    function renderDailyQuiz(questions) {
      var currentQ = 0
      var answers = []

      function showQuestion(idx) {
        var q = questions[idx]
        var html =
          '<div class="mb-3">' +
          '<p class="text-xs text-gray-500 mb-1">' + (idx + 1) + ' / ' + questions.length + ' 問目</p>' +
          '<div class="h-1.5 bg-dojo-700 rounded-full mb-6"><div class="h-full bg-amber-400 rounded-full transition-all" style="width:' + Math.round((idx / questions.length) * 100) + '%"></div></div>' +
          '</div>' +
          '<p class="font-medium text-lg mb-6 leading-relaxed">' + escapeHtml(q.question) + '</p>' +
          '<div class="space-y-3" id="dq-options">'
        q.options.forEach(function (opt, i) {
          html += '<button class="dq-opt-btn w-full text-left px-5 py-3.5 rounded-xl border border-dojo-700 hover:border-amber-400/60 transition text-sm" data-index="' + i + '">' +
            '<span class="text-gray-500 mr-2">' + String.fromCharCode(65 + i) + '.</span>' + escapeHtml(opt) + '</button>'
        })
        html += '</div><div id="dq-feedback" class="hidden mt-5"></div>'
        dailyQuizArea.innerHTML = html

        document.querySelectorAll('.dq-opt-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var chosen = parseInt(btn.dataset.index)
            var correct = chosen === q.correctIndex
            answers.push({ questionId: q.id, chosen: chosen, correct: correct })

            document.querySelectorAll('.dq-opt-btn').forEach(function (b) {
              b.disabled = true
              b.classList.add('opacity-60')
              if (parseInt(b.dataset.index) === q.correctIndex) {
                b.classList.remove('opacity-60')
                b.classList.add('border-emerald-400', 'bg-emerald-400/10')
              }
            })
            if (!correct) btn.classList.add('border-red-400', 'bg-red-400/10')

            var fb = document.getElementById('dq-feedback')
            fb.classList.remove('hidden')
            fb.className = 'mt-5 p-4 rounded-xl text-sm leading-relaxed ' +
              (correct ? 'bg-emerald-400/10 border border-emerald-400/40' : 'bg-red-400/10 border border-red-400/40')
            fb.innerHTML =
              '<p class="font-bold mb-2">' +
              (correct ? '<i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i>正解！' : '<i class="fa-solid fa-circle-xmark text-red-400 mr-1"></i>不正解') +
              '</p><p class="text-gray-300">' + escapeHtml(q.explanation) + '</p>'

            // 不正解なら復習リストに追加
            if (!correct) {
              addToReviewList(q.id, today)
            }

            // 次ボタン or 完了
            var nextBtn = document.createElement('button')
            nextBtn.className = 'mt-4 bg-amber-400 text-dojo-950 font-bold px-6 py-2 rounded-lg hover:bg-amber-300 transition text-sm'
            if (currentQ < questions.length - 1) {
              nextBtn.textContent = '次の問題へ →'
              nextBtn.addEventListener('click', function () {
                currentQ++
                showQuestion(currentQ)
              })
            } else {
              nextBtn.innerHTML = '結果を見る <i class="fa-solid fa-flag-checkered ml-1"></i>'
              nextBtn.addEventListener('click', function () {
                finalizeDailyQuiz(answers, questions)
              })
            }
            fb.appendChild(nextBtn)
          })
        })
      }

      showQuestion(0)
    }

    function finalizeDailyQuiz(answers, questions) {
      var correct = answers.filter(function (a) { return a.correct }).length
      var record = {
        date: today,
        correct: correct,
        total: questions.length,
        answers: answers,
      }
      dailyState.history.unshift(record)
      if (dailyState.history.length > 30) dailyState.history = dailyState.history.slice(0, 30)
      if (dailyState.lastDate !== today) {
        dailyState.streak = (dailyState.lastDate === yesterdayStr ? (dailyState.streak || 0) + 1 : 1)
        dailyState.lastDate = today
      }
      saveDailyState(dailyState)
      renderDailyResult(record, questions)
      renderDailyHistory()
      renderReviewList()
      var streakEl = document.getElementById('daily-streak')
      if (streakEl) streakEl.textContent = (dailyState.streak || 0) + '日'
    }

    function renderDailyResult(record, questions) {
      var pct = Math.round((record.correct / record.total) * 100)
      var color = pct === 100 ? 'text-emerald-400' : pct >= 66 ? 'text-amber-400' : 'text-rose-400'
      dailyQuizArea.innerHTML =
        '<div class="bg-dojo-800 border border-dojo-700 rounded-2xl p-8 text-center">' +
        '<i class="fa-solid ' + (pct === 100 ? 'fa-trophy text-amber-400' : 'fa-circle-check ' + color) + ' text-5xl mb-4"></i>' +
        '<p class="text-3xl font-black ' + color + ' mb-1">' + record.correct + ' / ' + record.total + '</p>' +
        '<p class="text-gray-400 text-sm mb-4">正答率 ' + pct + '%</p>' +
        (pct === 100
          ? '<p class="text-emerald-400 text-sm font-bold mb-6">全問正解！素晴らしい！</p>'
          : '<p class="text-gray-300 text-sm mb-6">間違えた問題は復習リストに追加されました。</p>') +
        '<p class="text-xs text-gray-500">明日また3問出題されます。</p></div>'
    }

    function renderDailyHistory() {
      var histEl = document.getElementById('daily-history')
      if (!histEl) return
      var state = loadDailyState()
      if (!state.history || state.history.length === 0) {
        histEl.innerHTML = '<p class="text-gray-500 text-sm">履歴なし</p>'
        return
      }
      var html = '<div class="space-y-2">'
      state.history.slice(0, 7).forEach(function (h) {
        var pct = Math.round((h.correct / h.total) * 100)
        var color = pct === 100 ? 'text-emerald-400' : pct >= 66 ? 'text-amber-400' : 'text-rose-400'
        html += '<div class="flex items-center gap-4 bg-dojo-800 border border-dojo-700 rounded-xl px-4 py-3">' +
          '<p class="text-sm text-gray-400">' + h.date + '</p>' +
          '<div class="flex-1 h-2 bg-dojo-700 rounded-full"><div class="h-full bg-amber-400 rounded-full" style="width:' + pct + '%"></div></div>' +
          '<p class="text-sm font-bold ' + color + '">' + h.correct + '/' + h.total + '</p>' +
          '</div>'
      })
      html += '</div>'
      histEl.innerHTML = html
    }

    function addToReviewList(questionId, dateStr) {
      var reviews = loadReviews()
      var existing = reviews.find(function (r) { return r.id === questionId })
      if (!existing) {
        var intervals = [1, 3, 7, 30]
        var reviewDates = intervals.map(function (d) {
          var dt = new Date(dateStr)
          dt.setDate(dt.getDate() + d)
          return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0')
        })
        reviews.push({ id: questionId, addedDate: dateStr, reviewDates: reviewDates, completedDates: [] })
        saveReviews(reviews)
      }
    }

    function renderReviewList() {
      var listEl = document.getElementById('daily-review-list')
      if (!listEl) return
      var reviews = loadReviews()
      if (reviews.length === 0) {
        listEl.innerHTML = '<p class="text-gray-500 text-sm">復習待ちの問題なし</p>'
        return
      }
      var todayStr = getTodayStr()
      var due = reviews.filter(function (r) {
        return r.reviewDates.some(function (d) { return d <= todayStr && !r.completedDates.includes(d) })
      })
      var upcoming = reviews.filter(function (r) {
        return r.reviewDates.some(function (d) { return d > todayStr })
      })

      var html = ''
      if (due.length > 0) {
        html += '<p class="text-sm font-bold text-rose-400 mb-2"><i class="fa-solid fa-bell mr-1"></i>本日の復習（' + due.length + '件）</p>'
        html += '<div class="space-y-2 mb-4">'
        due.forEach(function (r) {
          var q = pool.find(function (p) { return p.id === r.id })
          if (!q) return
          html += '<div class="bg-rose-400/10 border border-rose-400/30 rounded-xl p-4">' +
            '<p class="text-sm font-medium text-rose-300 mb-1">' + escapeHtml(q.question) + '</p>' +
            '<p class="text-xs text-gray-400">正解: ' + escapeHtml(q.options[q.correctIndex]) + '</p>' +
            '<p class="text-xs text-gray-500 mt-1 leading-relaxed">' + escapeHtml(q.explanation) + '</p></div>'
        })
        html += '</div>'
      }
      if (upcoming.length > 0) {
        html += '<p class="text-sm text-gray-500 mb-2">今後の復習予定: ' + upcoming.length + '件</p>'
        html += '<div class="space-y-1">'
        upcoming.forEach(function (r) {
          var nextDate = r.reviewDates.filter(function (d) { return d > todayStr }).sort()[0]
          var q = pool.find(function (p) { return p.id === r.id })
          if (!q) return
          html += '<div class="flex items-center gap-3 text-xs text-gray-500 bg-dojo-800 border border-dojo-700 rounded-lg px-3 py-2">' +
            '<i class="fa-solid fa-calendar text-gray-600"></i>' +
            '<span class="flex-1 truncate">' + escapeHtml(q.question.substring(0, 40)) + '…</span>' +
            '<span class="text-amber-400">' + nextDate + '</span></div>'
        })
        html += '</div>'
      }
      if (!html) html = '<p class="text-gray-500 text-sm">復習待ちの問題なし</p>'
      listEl.innerHTML = html
    }
  }

  /* ========== SQL演習（ブラウザ内SQLite: sql.js） ========== */
  const SQLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/'
  let sqlJsPromise = null

  function loadSqlJs() {
    if (!sqlJsPromise) {
      sqlJsPromise = new Promise(function (resolve, reject) {
        if (window.initSqlJs) {
          resolve(window.initSqlJs({ locateFile: function (f) { return SQLJS_CDN + f } }))
          return
        }
        const s = document.createElement('script')
        s.src = SQLJS_CDN + 'sql-wasm.js'
        s.onload = function () {
          resolve(window.initSqlJs({ locateFile: function (f) { return SQLJS_CDN + f } }))
        }
        s.onerror = function () { reject(new Error('sql.js の読み込みに失敗しました（ネットワークを確認してください）')) }
        document.head.appendChild(s)
      })
    }
    return sqlJsPromise
  }

  function runQuery(db, sql) {
    // 最後のSELECT文の結果を取得（複数文対応）
    const results = db.exec(sql)
    if (results.length === 0) return { columns: [], values: [] }
    const last = results[results.length - 1]
    return { columns: last.columns, values: last.values }
  }

  function normalizeRows(res) {
    // 比較用に正規化: 行をJSON配列化して順序込みで比較
    return JSON.stringify(res.values)
  }

  function renderTable(res) {
    if (!res || res.columns.length === 0) {
      return '<p class="text-gray-500 text-xs">（結果行なし）</p>'
    }
    let html = '<div class="overflow-x-auto"><table class="text-xs border-collapse">'
    html += '<thead><tr>'
    res.columns.forEach(function (c) {
      html += '<th class="border border-dojo-700 bg-dojo-800 px-2 py-1 text-emerald-300 font-bold whitespace-nowrap">' + escapeHtml(c) + '</th>'
    })
    html += '</tr></thead><tbody>'
    res.values.forEach(function (row) {
      html += '<tr>'
      row.forEach(function (v) {
        html += '<td class="border border-dojo-700 px-2 py-1 text-gray-300 whitespace-nowrap">' + escapeHtml(v === null ? 'NULL' : String(v)) + '</td>'
      })
      html += '</tr>'
    })
    html += '</tbody></table></div>'
    return html
  }

  document.querySelectorAll('.sql-challenge').forEach(function (block) {
    const editor = block.querySelector('.sql-editor')
    const runBtn = block.querySelector('.sql-run-btn')
    const hintsBtn = block.querySelector('.sql-hints-btn')
    const solutionBtn = block.querySelector('.sql-solution-btn')
    const hintsEl = block.querySelector('.sql-hints')
    const solutionEl = block.querySelector('.sql-solution')
    const resultsEl = block.querySelector('.sql-results')
    const lessonId = block.dataset.lessonId

    let data
    try {
      data = JSON.parse(block.querySelector('.sql-challenge-data').textContent)
    } catch (e) {
      console.error('SQLチャレンジデータの読み込みに失敗', e)
      return
    }

    hintsBtn.addEventListener('click', function () {
      hintsEl.classList.toggle('hidden')
    })
    solutionBtn.addEventListener('click', function () {
      if (
        solutionEl.classList.contains('hidden') &&
        !confirm('模範解答を表示します。先に自力で挑戦しましたか？')
      ) {
        return
      }
      solutionEl.classList.toggle('hidden')
    })

    // Tabキーでインデント
    editor.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault()
        const start = this.selectionStart
        const end = this.selectionEnd
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end)
        this.selectionStart = this.selectionEnd = start + 2
      }
    })

    runBtn.addEventListener('click', function () {
      const sql = editor.value.trim()
      if (!sql) {
        resultsEl.classList.remove('hidden')
        resultsEl.innerHTML =
          '<div class="p-4 rounded-lg bg-amber-400/10 border border-amber-400/40 text-sm text-gray-300">SQLを入力してください。</div>'
        return
      }

      runBtn.disabled = true
      runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>SQLiteを準備中…'
      resultsEl.classList.remove('hidden')

      loadSqlJs()
        .then(function (SQL) {
          runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>実行中…'
          const db = new SQL.Database()
          try {
            db.run(data.schemaSql)
            db.run(data.seedSql)
          } catch (e) {
            throw new Error('問題データの準備に失敗: ' + e.message)
          }

          // ユーザーのSQLを実行
          let userRes
          try {
            userRes = runQuery(db, sql)
          } catch (e) {
            resultsEl.innerHTML =
              '<div class="p-4 rounded-lg bg-red-400/10 border border-red-400/40 text-sm">' +
              '<p class="font-bold text-red-400 mb-1"><i class="fa-solid fa-bug mr-1"></i>SQLエラー</p>' +
              '<p class="text-gray-300 font-mono text-xs">' + escapeHtml(String(e.message)) + '</p>' +
              '<p class="text-gray-500 text-xs mt-2">構文・テーブル名・カラム名を確認してください。テーブル定義は上の「テーブル定義と初期データを見る」で確認できます。</p></div>'
            db.close()
            return
          }

          // 模範解答の結果と比較
          let expectedRes
          try {
            expectedRes = runQuery(db, data.solutionSql)
          } catch (e) {
            throw new Error('模範解答の実行に失敗: ' + e.message)
          }

          const colsOk = JSON.stringify(userRes.columns) === JSON.stringify(expectedRes.columns)
          const rowsOk = normalizeRows(userRes) === normalizeRows(expectedRes)
          const passed = colsOk && rowsOk

          let html =
            '<div class="p-4 rounded-lg border text-sm ' +
            (passed ? 'bg-emerald-400/10 border-emerald-400/40' : 'bg-dojo-800 border-dojo-700') + '">'
          if (passed) {
            html +=
              '<p class="font-bold text-emerald-400 mb-2"><i class="fa-solid fa-trophy mr-1"></i>正解！模範解答と一致しました</p>'
          } else {
            html +=
              '<p class="font-bold text-amber-400 mb-2"><i class="fa-solid fa-flask mr-1"></i>結果が模範解答と一致しません</p>' +
              '<ul class="text-xs text-gray-400 space-y-1 mb-3">' +
              (!colsOk ? '<li>・カラム構成が異なります（取得する列・列名を確認）</li>' : '') +
              (!rowsOk ? '<li>・行の内容または順序が異なります（条件・並び順を確認）</li>' : '') +
              '</ul>'
          }
          html += '<p class="text-xs font-bold text-gray-400 mb-1">あなたの結果:</p>' + renderTable(userRes)
          if (!passed) {
            html += '<p class="text-xs font-bold text-gray-400 mt-3 mb-1">期待される結果:</p>' + renderTable(expectedRes)
          }
          html += passed
            ? '<p class="text-xs text-gray-400 mt-3">合格です。「模範解答」と見比べて、別の書き方も確認しましょう。</p>'
            : '<p class="text-xs text-gray-400 mt-3">期待結果との差分を確認して修正してみましょう。ヒントも活用できます。</p>'
          html += '</div>'
          resultsEl.innerHTML = html

          if (passed && lessonId && window.Dojo) {
            window.Dojo.recordQuiz(lessonId + '-sql', true)
          }
          db.close()
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
        .catch(function (e) {
          resultsEl.innerHTML =
            '<div class="p-4 rounded-lg bg-red-400/10 border border-red-400/40 text-sm text-gray-300">' +
            '<i class="fa-solid fa-triangle-exclamation text-red-400 mr-1"></i>' + escapeHtml(String(e.message)) + '</div>'
        })
        .finally(function () {
          runBtn.disabled = false
          runBtn.innerHTML = '<i class="fa-solid fa-play mr-1"></i>実行して採点'
        })
    })
  })

  // ========== 自己分析ワークシート (/self-analysis) ==========
  ;(function () {
    var WS_KEY = 'dojo-self-analysis-v1'
    var occupationEl = document.getElementById('ws-occupation')
    var industryEl = document.getElementById('ws-industry')
    var skillsEl = document.getElementById('ws-skills')
    var summaryEl = document.getElementById('ws-summary')
    var saveBtn = document.getElementById('ws-save-btn')
    var clearBtn = document.getElementById('ws-clear-btn')
    var indicator = document.getElementById('save-indicator')

    if (!occupationEl || !industryEl || !skillsEl || !summaryEl) return

    // localStorageから読み込んで textarea に反映
    function loadWorksheet() {
      try {
        var data = JSON.parse(localStorage.getItem(WS_KEY)) || {}
        occupationEl.value = data.occupation || ''
        industryEl.value = data.industry || ''
        skillsEl.value = data.skills || ''
        summaryEl.value = data.summary || ''
      } catch (e) {
        // パース失敗時は空のまま
      }
    }

    // localStorageに保存
    function saveWorksheet() {
      var data = {
        occupation: occupationEl.value,
        industry: industryEl.value,
        skills: skillsEl.value,
        summary: summaryEl.value,
        updatedAt: Date.now(),
      }
      try {
        localStorage.setItem(WS_KEY, JSON.stringify(data))
      } catch (e) {
        // ストレージが満杯の場合などは無視
      }
    }

    // 保存成功インジケーターを一時表示
    function showSaveIndicator() {
      if (!indicator) return
      indicator.classList.remove('hidden')
      clearTimeout(indicator._timer)
      indicator._timer = setTimeout(function () {
        indicator.classList.add('hidden')
      }, 2000)
    }

    // ページ読み込み時にデータを復元
    loadWorksheet()

    // 保存ボタン
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        saveWorksheet()
        showSaveIndicator()
      })
    }

    // クリアボタン（確認ダイアログ付き）
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (!confirm('入力内容をすべてクリアしますか？\n（この操作は元に戻せません）')) return
        occupationEl.value = ''
        industryEl.value = ''
        skillsEl.value = ''
        summaryEl.value = ''
        try {
          localStorage.removeItem(WS_KEY)
        } catch (e) {}
        showSaveIndicator()
      })
    }

    // テキストエリアが変更されたら自動保存（デバウンス 1.5秒）
    var autoSaveTimer = null
    function scheduleAutoSave() {
      clearTimeout(autoSaveTimer)
      autoSaveTimer = setTimeout(function () {
        saveWorksheet()
      }, 1500)
    }
    ;[occupationEl, industryEl, skillsEl, summaryEl].forEach(function (el) {
      if (el) el.addEventListener('input', scheduleAutoSave)
    })
  })()
})()
