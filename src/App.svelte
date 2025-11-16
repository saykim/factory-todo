<script>
  import { todos, filterOptions, sortOption } from './lib/store.js';
  import TodoItem from './lib/TodoItem.svelte';
  import TodoForm from './lib/TodoForm.svelte';
  import FilterBar from './lib/FilterBar.svelte';

  const themeProfiles = {
    professional: {
      title: '전문 상용프로그램',
      subtitle: '관제 센터처럼 안정적인 뷰',
      tone: '정확한 선과 정제된 명암 대비로 높은 시인성을 보장합니다.',
      highlights: [
        '모듈형 카드와 일정한 여백으로 정보가 흔들리지 않음',
        '숫자 위주의 패널을 대비 높게 디자인해 즉시 상태 파악',
        '글래스 모피즘 느낌을 은은하게 적용해 최신 상용 감성 구현'
      ]
    },
    bento: {
      title: '벤토 스타일',
      subtitle: '쿨하고 감각적인 인터페이스',
      tone: '네온 포인트와 라운드 그리드로 정리된 정보를 제공합니다.',
      highlights: [
        '각 카드에 톤 변주를 주어 시선을 끌면서도 질서를 유지',
        '색상 태그와 아이콘 조합으로 분류를 직관적으로 표현',
        '그라데이션과 깊은 그림자로 입체감 확보'
      ]
    },
    industrial: {
      title: '산업 현장형',
      subtitle: '전통적인 공정 감성',
      tone: '굵은 구분선과 안전색 대비로 현장 친화적인 UI를 완성했습니다.',
      highlights: [
        '검정/회색 베이스에 안전 주황 포인트로 경고 인지 강화',
        '격자형 분할과 강한 라인으로 작업 단계를 명확히 표기',
        '큰 타이포와 라벨로 장갑 착용 시에도 가독성 확보'
      ]
    }
  };

  const themeOptions = [
    { id: 'professional-light', label: 'Professional · Light', group: 'professional', modeLabel: 'Light' },
    { id: 'professional-dark', label: 'Professional · Dark', group: 'professional', modeLabel: 'Dark' },
    { id: 'bento-light', label: 'Bento · Light', group: 'bento', modeLabel: 'Light' },
    { id: 'bento-dark', label: 'Bento · Dark', group: 'bento', modeLabel: 'Dark' },
    { id: 'industrial-light', label: 'Industrial · Light', group: 'industrial', modeLabel: 'Light' },
    { id: 'industrial-dark', label: 'Industrial · Dark', group: 'industrial', modeLabel: 'Dark' }
  ];

  let selectedThemeId = themeOptions[0].id;
  let showForm = false;
  let editingTodo = null;
  const statusTabs = ['전체', '대기', '진행중', '완료'];

  $: selectedThemeOption = themeOptions.find((option) => option.id === selectedThemeId) ?? themeOptions[0];
  $: selectedProfile = themeProfiles[selectedThemeOption.group];

  // 필터링 및 정렬된 작업 목록
  $: filteredAndSortedTodos = filterAndSort($todos, $filterOptions, $sortOption);

  function filterAndSort(todoList, filters, sortBy) {
    let filtered = todoList.filter((todo) => {
      if (filters.status !== '전체' && todo.status !== filters.status) return false;
      if (filters.priority !== '전체' && todo.priority !== filters.priority) return false;
      if (filters.assignee !== '전체' && todo.assignee !== filters.assignee) return false;
      if (filters.category !== '전체' && todo.category !== filters.category) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { 긴급: 0, 높음: 1, 보통: 2, 낮음: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          const statusOrder = { 진행중: 0, 대기: 1, 완료: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }

  // 통계 계산
  $: stats = {
    total: $todos.length,
    pending: $todos.filter((t) => t.status === '대기').length,
    inProgress: $todos.filter((t) => t.status === '진행중').length,
    completed: $todos.filter((t) => t.status === '완료').length,
    overdue: $todos.filter((t) => {
      if (!t.dueDate || t.status === '완료') return false;
      return new Date(t.dueDate) < new Date();
    }).length
  };

  function openForm() {
    editingTodo = null;
    showForm = true;
  }

  function handleEdit(event) {
    editingTodo = event.detail;
    showForm = true;
  }

  function handleAdd(event) {
    todos.addTodo(event.detail);
  }

  function handleUpdate(event) {
    const { id, updates } = event.detail;
    todos.updateTodo(id, updates);
  }

  function handleDelete(event) {
    todos.deleteTodo(event.detail);
  }

  function closeForm() {
    showForm = false;
    editingTodo = null;
  }

  function setStatusFilter(status) {
    filterOptions.update((options) => ({ ...options, status }));
  }

  $: if (typeof document !== 'undefined') {
    document.body.dataset.theme = selectedThemeId;
  }
</script>

<main class="app-shell" data-theme={selectedThemeId}>
  <div class="container">
    <header class="app-header">
      <div class="header-brand">
        <p class="eyebrow">디자인 실험실</p>
        <h1>🏭 공장 유지보수 관리</h1>
        <p class="brand-copy">{selectedProfile.tone}</p>
      </div>
      <div class="theme-switcher">
        <label for="themeSelect">테마 · 모드</label>
        <select id="themeSelect" bind:value={selectedThemeId} aria-label="디자인 테마 선택">
          {#each themeOptions as option}
            <option value={option.id}>{option.label}</option>
          {/each}
        </select>
        <p class="theme-chip">{selectedProfile.title} · {selectedThemeOption.modeLabel}</p>
      </div>
    </header>

    <section class="theme-brief" aria-label="테마 요약">
      <div class="brief-card">
        <p class="brief-label">설명</p>
        <p class="brief-copy">{selectedProfile.subtitle}</p>
      </div>
      <div class="brief-card highlights">
        <p class="brief-label">핵심 포인트</p>
        <ul>
          {#each selectedProfile.highlights as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      </div>
    </section>

    <section class="dashboard-header">
      <div class="header-main">
        <div class="header-content">
          <h2>실시간 작업 현황</h2>
          <p class="header-description">필터와 정렬로 즉시 상태를 확인하세요.</p>
        </div>
        <button class="btn-add" on:click={openForm}>+ 새 작업 추가</button>
      </div>

      <div class="status-tabs" role="tablist" aria-label="작업 상태 필터">
        {#each statusTabs as status}
          <button
            type="button"
            class="status-tab"
            class:active={$filterOptions.status === status}
            role="tab"
            aria-selected={$filterOptions.status === status}
            aria-controls="todo-list"
            on:click={() => setStatusFilter(status)}
          >
            {status}
          </button>
        {/each}
      </div>

      <div class="stats-panel">
        <div class="stat-item">
          <span class="stat-label">전체</span>
          <span class="stat-value">{stats.total}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">대기</span>
          <span class="stat-value status-pending">{stats.pending}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">진행중</span>
          <span class="stat-value status-progress">{stats.inProgress}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">완료</span>
          <span class="stat-value status-completed">{stats.completed}</span>
        </div>
        {#if stats.overdue > 0}
          <div class="stat-item">
            <span class="stat-label">지연</span>
            <span class="stat-value status-overdue">{stats.overdue}</span>
          </div>
        {/if}
      </div>
    </section>

    <FilterBar />

    <div id="todo-list" class="todo-list">
      {#if filteredAndSortedTodos.length === 0}
        <div class="empty-state">
          <p>표시할 작업이 없습니다.</p>
          {#if $todos.length > 0}
            <p class="hint">필터 조건을 변경해보세요.</p>
          {:else}
            <p class="hint">"새 작업 추가" 버튼을 클릭하여 작업을 등록하세요.</p>
          {/if}
        </div>
      {:else}
        {#each filteredAndSortedTodos as todo (todo.id)}
          <TodoItem {todo} on:edit={handleEdit} on:update={handleUpdate} on:delete={handleDelete} />
        {/each}
      {/if}
    </div>
  </div>

  <TodoForm
    bind:show={showForm}
    {editingTodo}
    on:add={handleAdd}
    on:update={handleUpdate}
    on:close={closeForm}
  />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
    background: var(--page-bg, #f4f6fb);
    color: var(--text-primary, #0f172a);
    transition: background 0.4s ease, color 0.2s ease;
  }

  :global(body[data-theme]) {
    min-height: 100vh;
  }

  :global(button, input, select, textarea) {
    font-family: inherit;
  }

  .app-shell {
    min-height: 100vh;
    padding: clamp(20px, 4vw, 56px);
    background: var(--page-bg);
    color: var(--text-primary);
    transition: background 0.4s ease, color 0.2s ease;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .app-header {
    display: flex;
    gap: clamp(16px, 3vw, 32px);
    align-items: flex-start;
    justify-content: space-between;
    padding: clamp(20px, 3vw, 36px);
    border-radius: 32px;
    border: 1px solid var(--panel-border);
    background: var(--surface);
    box-shadow: var(--shadow-soft);
    flex-wrap: wrap;
  }

  .header-brand {
    flex: 1;
    min-width: 240px;
  }

  .eyebrow {
    margin: 0 0 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .brand-copy {
    margin: 12px 0 0;
    color: var(--muted-text);
    max-width: 460px;
  }

  .theme-switcher {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 220px;
  }

  .theme-switcher label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted-text);
  }

  .theme-switcher select {
    padding: 12px 16px;
    border-radius: 16px;
    border: 1px solid var(--control-border);
    background: var(--control-bg);
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .theme-switcher select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--control-focus);
  }

  .theme-chip {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
  }

  .theme-brief {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .brief-card {
    background: var(--surface);
    border: 1px solid var(--panel-border);
    border-radius: 24px;
    padding: 20px;
    box-shadow: var(--shadow-soft);
  }

  .brief-label {
    margin: 0 0 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: var(--accent);
    text-transform: uppercase;
  }

  .brief-copy {
    margin: 0;
    color: var(--text-primary);
  }

  .highlights ul {
    margin: 0;
    padding-left: 18px;
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dashboard-header {
    background: var(--surface-strong);
    border: 1px solid var(--panel-border);
    border-radius: 32px;
    padding: clamp(20px, 3vw, 36px);
    box-shadow: var(--shadow-soft);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .header-main {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
  }

  .header-content h2 {
    margin: 0;
    font-size: clamp(20px, 3vw, 28px);
  }

  .header-description {
    margin: 6px 0 0;
    color: var(--muted-text);
    font-size: 14px;
  }

  .btn-add {
    padding: 12px 28px;
    border-radius: 999px;
    border: none;
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    background: linear-gradient(120deg, var(--accent), var(--accent-strong));
    cursor: pointer;
    box-shadow: 0 18px 30px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease;
  }

  .btn-add:hover {
    transform: translateY(-2px);
  }

  .status-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-tab {
    flex: 1;
    min-width: 120px;
    padding: 10px 14px;
    border-radius: 16px;
    border: 1px solid var(--panel-border);
    background: var(--surface);
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .status-tab.active {
    background: var(--accent);
    color: #fff;
    border-color: transparent;
  }

  .stats-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }

  .stat-item {
    border-radius: 18px;
    padding: 16px;
    background: var(--surface);
    border: 1px solid var(--panel-border);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--muted-text);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
  }

  .status-pending {
    color: var(--status-pending);
  }

  .status-progress {
    color: var(--status-progress);
  }

  .status-completed {
    color: var(--status-completed);
  }

  .status-overdue {
    color: var(--status-overdue);
  }

  .todo-list {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    border: 1px dashed var(--panel-border);
    border-radius: 20px;
    padding: 32px;
    text-align: center;
    background: var(--surface);
  }

  .empty-state p {
    margin: 0;
  }

  .hint {
    margin-top: 8px;
    color: var(--muted-text);
  }

  @media (max-width: 768px) {
    .status-tab {
      flex: 1 1 calc(50% - 8px);
    }

    .theme-switcher {
      width: 100%;
    }
  }

  :global(body[data-theme='professional-light']) {
    --page-bg: radial-gradient(circle at 20% 20%, #eef2ff 0%, #f8fafc 60%, #eef2ff 100%);
    --surface: rgba(255, 255, 255, 0.92);
    --surface-strong: #ffffff;
    --surface-muted: rgba(15, 23, 42, 0.04);
    --panel-border: rgba(15, 23, 42, 0.12);
    --text-primary: #0f172a;
    --muted-text: #4b5563;
    --accent: #2563eb;
    --accent-strong: #38bdf8;
    --chip-bg: rgba(37, 99, 235, 0.12);
    --chip-text: #1d4ed8;
    --shadow-soft: 0 20px 40px rgba(15, 23, 42, 0.12);
    --control-bg: rgba(255, 255, 255, 0.96);
    --control-border: rgba(15, 23, 42, 0.12);
    --control-focus: rgba(37, 99, 235, 0.25);
    --card-radius: 22px;
    --status-pending: #94a3b8;
    --status-progress: #2563eb;
    --status-completed: #0ea5e9;
    --status-overdue: #dc2626;
    --danger: #ef4444;
    --warning: #f97316;
    --safe: #10b981;
  }

  :global(body[data-theme='professional-dark']) {
    --page-bg: radial-gradient(circle at 20% 20%, #1b2545, #080d1a 70%);
    --surface: rgba(8, 13, 28, 0.85);
    --surface-strong: rgba(11, 18, 35, 0.85);
    --surface-muted: rgba(255, 255, 255, 0.08);
    --panel-border: rgba(148, 163, 184, 0.4);
    --text-primary: #f4f6ff;
    --muted-text: #a5b4d5;
    --accent: #4c8dff;
    --accent-strong: #6ee7ff;
    --chip-bg: rgba(96, 165, 250, 0.2);
    --chip-text: #dbeafe;
    --shadow-soft: 0 25px 70px rgba(2, 6, 23, 0.65);
    --control-bg: rgba(9, 13, 30, 0.65);
    --control-border: rgba(148, 163, 184, 0.45);
    --control-focus: rgba(99, 102, 241, 0.45);
    --card-radius: 18px;
    --status-pending: #94a3b8;
    --status-progress: #38bdf8;
    --status-completed: #34d399;
    --status-overdue: #fb7185;
    --danger: #fb7185;
    --warning: #fde047;
    --safe: #34d399;
  }

  :global(body[data-theme='bento-light']) {
    --page-bg: radial-gradient(circle at 20% 20%, #fdf2ff 0%, #e0f2fe 45%, #fef9c3 100%);
    --surface: rgba(255, 255, 255, 0.86);
    --surface-strong: rgba(255, 255, 255, 0.95);
    --surface-muted: rgba(255, 255, 255, 0.7);
    --panel-border: rgba(148, 163, 184, 0.25);
    --text-primary: #0f172a;
    --muted-text: #4b5563;
    --accent: #7c3aed;
    --accent-strong: #22d3ee;
    --chip-bg: rgba(124, 58, 237, 0.15);
    --chip-text: #6d28d9;
    --shadow-soft: 0 35px 60px rgba(15, 23, 42, 0.15);
    --control-bg: rgba(255, 255, 255, 0.95);
    --control-border: rgba(79, 70, 229, 0.25);
    --control-focus: rgba(124, 58, 237, 0.35);
    --card-radius: 30px;
    --status-pending: #94a3b8;
    --status-progress: #6366f1;
    --status-completed: #0ea5e9;
    --status-overdue: #f97316;
    --danger: #f97316;
    --warning: #fde047;
    --safe: #22d3ee;
  }

  :global(body[data-theme='bento-dark']) {
    --page-bg: radial-gradient(circle at 10% 20%, #160b2f 0%, #061a2d 55%, #010914 100%);
    --surface: rgba(13, 14, 28, 0.85);
    --surface-strong: rgba(18, 20, 40, 0.9);
    --surface-muted: rgba(255, 255, 255, 0.08);
    --panel-border: rgba(248, 250, 252, 0.08);
    --text-primary: #f8f7ff;
    --muted-text: #cbd5f5;
    --accent: #c084fc;
    --accent-strong: #22d3ee;
    --chip-bg: rgba(161, 98, 255, 0.25);
    --chip-text: #f5f3ff;
    --shadow-soft: 0 25px 70px rgba(0, 0, 0, 0.6);
    --control-bg: rgba(11, 13, 30, 0.8);
    --control-border: rgba(208, 191, 255, 0.4);
    --control-focus: rgba(34, 211, 238, 0.45);
    --card-radius: 28px;
    --status-pending: #a5b4fc;
    --status-progress: #818cf8;
    --status-completed: #34d399;
    --status-overdue: #fb7185;
    --danger: #fb7185;
    --warning: #facc15;
    --safe: #34d399;
  }

  :global(body[data-theme='industrial-light']) {
    --page-bg: linear-gradient(130deg, #fff8eb 0%, #f8fafc 65%, #e2e8f0 100%);
    --surface: rgba(255, 255, 255, 0.94);
    --surface-strong: #ffffff;
    --surface-muted: rgba(251, 146, 60, 0.08);
    --panel-border: rgba(30, 41, 59, 0.12);
    --text-primary: #111827;
    --muted-text: #4b5563;
    --accent: #c2410c;
    --accent-strong: #f97316;
    --chip-bg: rgba(234, 88, 12, 0.15);
    --chip-text: #b45309;
    --shadow-soft: 0 25px 50px rgba(15, 23, 42, 0.15);
    --control-bg: #fffdf9;
    --control-border: rgba(249, 115, 22, 0.35);
    --control-focus: rgba(249, 115, 22, 0.35);
    --card-radius: 18px;
    --status-pending: #78716c;
    --status-progress: #ea580c;
    --status-completed: #16a34a;
    --status-overdue: #b91c1c;
    --danger: #dc2626;
    --warning: #f59e0b;
    --safe: #16a34a;
  }

  :global(body[data-theme='industrial-dark']) {
    --page-bg: repeating-linear-gradient(135deg, #050709 0, #050709 20px, #090c12 20px, #090c12 40px);
    --surface: rgba(10, 12, 16, 0.92);
    --surface-strong: #111417;
    --surface-muted: rgba(255, 255, 255, 0.05);
    --panel-border: rgba(255, 255, 255, 0.08);
    --text-primary: #f8fafc;
    --muted-text: #e5e7eb;
    --accent: #f97316;
    --accent-strong: #facc15;
    --chip-bg: rgba(249, 115, 22, 0.25);
    --chip-text: #fef3c7;
    --shadow-soft: 0 25px 75px rgba(0, 0, 0, 0.65);
    --control-bg: rgba(8, 8, 10, 0.85);
    --control-border: rgba(249, 115, 22, 0.45);
    --control-focus: rgba(249, 115, 22, 0.55);
    --card-radius: 16px;
    --status-pending: #94a3b8;
    --status-progress: #f97316;
    --status-completed: #22d3ee;
    --status-overdue: #f43f5e;
    --danger: #f43f5e;
    --warning: #facc15;
    --safe: #22d3ee;
  }
</style>
