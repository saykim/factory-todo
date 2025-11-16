<script>
import { todos, filterOptions, sortOption } from './lib/store.js';
import TodoItem from './lib/TodoItem.svelte';
import TodoForm from './lib/TodoForm.svelte';
import FilterBar from './lib/FilterBar.svelte';

  const designModes = [
    {
      id: 'pro',
      title: '전문 상용프로그램',
      subtitle: '관제 센터처럼 안정적인 뷰',
      tone: '안정적인 네이비와 글래스 효과로 정밀한 인상을 줍니다.',
      highlights: [
        '모듈형 레이아웃과 고정 폭 카드로 정보가 흔들리지 않음',
        '숫자 카드와 탭에 대비를 주어 즉시 상태 확인',
        '글래스 모피즘 효과로 최신 상용 솔루션 감성 구현'
      ]
    },
    {
      id: 'bento',
      title: '벤토 스타일',
      subtitle: '쿨하고 감각적인 인터페이스',
      tone: '네온 포인트와 라운드 그리드로 트렌디하게 정리했습니다.',
      highlights: [
        '카드마다 톤이 다른 벤토 그리드 구성',
        '도형 아이콘과 색상 태그로 정보 분류 강화',
        '모션이 느껴지는 그라디언트와 그림자로 존재감 확보'
      ]
    },
    {
      id: 'industrial',
      title: '산업 현장형',
      subtitle: '전통적인 공정 감성',
      tone: '거친 텍스처와 강한 색 대비로 현장 친화적인 무드를 냈습니다.',
      highlights: [
        '검은 철판 배경에 주황색 안전 컬러를 포인트로 사용',
        '격자 분할과 굵은 구분선으로 명령 체계 표현',
        '큰 숫자와 라벨로 장갑 착용 상태에서도 가독성 확보'
      ]
    }
  ];

  let selectedDesign = designModes[0];
  let showForm = false;
  let editingTodo = null;
const statusTabs = ['전체', '대기', '진행중', '완료'];

  // 필터링 및 정렬된 작업 목록
  $: filteredAndSortedTodos = filterAndSort($todos, $filterOptions, $sortOption);

  function filterAndSort(todoList, filters, sortBy) {
    // 필터링
    let filtered = todoList.filter(todo => {
      if (filters.status !== '전체' && todo.status !== filters.status) return false;
      if (filters.priority !== '전체' && todo.priority !== filters.priority) return false;
      if (filters.assignee !== '전체' && todo.assignee !== filters.assignee) return false;
      if (filters.category !== '전체' && todo.category !== filters.category) return false;
      return true;
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          // 마감일 없는 항목은 맨 뒤로
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);

        case 'priority':
          const priorityOrder = { '긴급': 0, '높음': 1, '보통': 2, '낮음': 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];

        case 'status':
          const statusOrder = { '진행중': 0, '대기': 1, '완료': 2 };
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
    pending: $todos.filter(t => t.status === '대기').length,
    inProgress: $todos.filter(t => t.status === '진행중').length,
    completed: $todos.filter(t => t.status === '완료').length,
    overdue: $todos.filter(t => {
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

function selectDesign(mode) {
  selectedDesign = mode;
}

function setStatusFilter(status) {
  filterOptions.update(options => ({ ...options, status }));
}

$: if (typeof document !== 'undefined') {
  document.body.dataset.design = selectedDesign.id;
}
</script>

<main class={`design-shell design-${selectedDesign.id}`}>
  <div class="container">
    <section class="design-intro">
      <div>
        <p class="eyebrow">디자인 실험실</p>
        <h1>🏭 공장 유지보수 관리</h1>
        <p class="intro-text">
          요구 조건(시인성 · 쉬운 사용법 · 명확한 선)을 모두 만족시키도록 세 가지 콘셉트를 적용했습니다.
          아래에서 원하는 타입을 선택해 실제 화면에 입혀보세요.
        </p>
      </div>
      <div class="design-pill">현재 선택: {selectedDesign.title}</div>
    </section>

    <section class="design-selector" aria-label="디자인 타입 선택">
      {#each designModes as mode}
        <button
          type="button"
          class="design-card"
          class:active={mode.id === selectedDesign.id}
          on:click={() => selectDesign(mode)}
          aria-pressed={mode.id === selectedDesign.id}
        >
          <div class="card-head">
            <span class="card-title">{mode.title}</span>
            <span class="card-chip">{mode.subtitle}</span>
          </div>
          <p class="card-copy">{mode.tone}</p>
        </button>
      {/each}
    </section>

    <section class="design-brief">
      <div class="brief-card">
        <p class="brief-label">스타일 핵심</p>
        <ul>
          {#each selectedDesign.highlights as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      </div>
      <div class="brief-card">
        <p class="brief-label">공통 가이드</p>
        <ul>
          <li>확실한 시인성을 위해 대비가 높은 색상과 큼직한 숫자를 유지합니다.</li>
          <li>사용 흐름은 기존과 동일하게 두어 학습비용을 줄였습니다.</li>
          <li>명확한 선과 구분선을 강조해 작업 분리 감각을 줍니다.</li>
        </ul>
      </div>
    </section>

    <header>
      <div class="header-grid">
        <div class="header-main">
          <div class="header-content">
            <h2>실시간 작업 현황</h2>
            <button class="btn-add" on:click={openForm}>
              + 새 작업 추가
            </button>
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
        </div>

        <div class="stats-panel">
          <div class="stats-bar">
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
        </div>
      </div>
    </header>

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
          <TodoItem
            {todo}
            on:edit={handleEdit}
            on:update={handleUpdate}
            on:delete={handleDelete}
          />
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
    background: #0f172a;
    color: #f8fafc;
    transition: background 0.4s ease;
  }

  :global(body[data-design='bento']) {
    background: #fdf2ff;
    color: #0f172a;
  }

  :global(body[data-design='industrial']) {
    background: #050709;
    color: #f8fafc;
  }

  .design-shell {
    --page-bg: #f4f6fb;
    --surface: rgba(255, 255, 255, 0.9);
    --surface-strong: #ffffff;
    --surface-muted: rgba(255, 255, 255, 0.6);
    --panel-border: rgba(15, 23, 42, 0.08);
    --text-primary: #0f172a;
    --muted-text: #6b7280;
    --accent: #2563eb;
    --accent-strong: #22d3ee;
    --chip-bg: rgba(37, 99, 235, 0.12);
    --chip-text: #1d4ed8;
    --shadow-soft: 0 20px 40px rgba(15, 23, 42, 0.16);
    --control-bg: rgba(255, 255, 255, 0.85);
    --control-border: rgba(15, 23, 42, 0.12);
    --control-focus: rgba(37, 99, 235, 0.35);
    --card-radius: 22px;
    --status-pending: #94a3b8;
    --status-progress: #2563eb;
    --status-completed: #10b981;
    --status-overdue: #dc2626;
    --danger: #ef4444;
    --warning: #f97316;
    --safe: #10b981;
    min-height: 100vh;
    padding: clamp(20px, 4vw, 56px);
    background: var(--page-bg);
    color: var(--text-primary);
    transition: background 0.4s ease, color 0.2s ease;
  }

  .design-shell.design-pro {
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

  .design-shell.design-bento {
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

  .design-shell.design-industrial {
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
    --status-pending: #cbd5f5;
    --status-progress: #f97316;
    --status-completed: #22c55e;
    --status-overdue: #fbbf24;
    --danger: #f87171;
    --warning: #fbbf24;
    --safe: #22c55e;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .design-intro {
    background: var(--surface);
    border: 1px solid var(--panel-border);
    border-radius: 28px;
    padding: clamp(20px, 4vw, 40px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: var(--shadow-soft);
  }

  .design-shell.design-pro .design-intro {
    backdrop-filter: blur(20px);
  }

  .design-intro h1 {
    margin: 0;
    font-size: clamp(28px, 4vw, 40px);
  }

  .design-intro .intro-text {
    margin: 0;
    color: var(--muted-text);
  }

  .eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 12px;
    color: var(--accent-strong);
    font-weight: 700;
  }

  .design-pill {
    align-self: flex-start;
    padding: 10px 20px;
    border-radius: 999px;
    border: 1px solid var(--panel-border);
    background: var(--surface-muted);
    font-weight: 600;
  }

  .design-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .design-card {
    border-radius: 20px;
    border: 1px solid var(--panel-border);
    padding: 20px;
    text-align: left;
    cursor: pointer;
    background: var(--surface);
    color: inherit;
    box-shadow: var(--shadow-soft);
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .design-card .card-title {
    font-size: 16px;
    font-weight: 700;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .card-chip {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    background: var(--chip-bg);
    color: var(--chip-text);
    font-weight: 600;
  }

  .card-copy {
    margin: 0;
    color: var(--muted-text);
  }

  .design-card.active {
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  }

  .design-brief {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  .brief-card {
    background: var(--surface);
    border: 1px solid var(--panel-border);
    border-radius: 24px;
    padding: 20px;
    box-shadow: var(--shadow-soft);
  }

  .brief-card ul {
    margin: 12px 0 0 0;
    padding-left: 18px;
    color: var(--muted-text);
    line-height: 1.6;
  }

  .brief-label {
    margin: 0;
    font-size: 14px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
  }

  header {
    background: var(--surface-strong);
    border-radius: 28px;
    padding: clamp(20px, 3vw, 36px);
    border: 1px solid var(--panel-border);
    box-shadow: var(--shadow-soft);
  }

  .header-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .header-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .header-content h2 {
    margin: 0;
    font-size: clamp(22px, 3vw, 28px);
  }

  .btn-add {
    align-self: flex-start;
    padding: 12px 28px;
    border-radius: 999px;
    border: none;
    font-size: 15px;
    font-weight: 700;
    background: linear-gradient(120deg, var(--accent), var(--accent-strong));
    color: #fff;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .design-shell.design-industrial .btn-add {
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .btn-add:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
  }

  .status-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .status-tab {
    border-radius: 16px;
    border: 1px solid var(--panel-border);
    background: var(--surface-muted);
    color: var(--muted-text);
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .status-tab.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.25);
  }

  .stats-panel {
    padding-top: 12px;
  }

  .stats-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--panel-border);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .stat-label {
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted-text);
  }

  .stat-value {
    font-size: clamp(22px, 4vw, 32px);
    font-weight: 700;
  }

  .status-pending { color: var(--status-pending); }
  .status-progress { color: var(--status-progress); }
  .status-completed { color: var(--status-completed); }
  .status-overdue { color: var(--status-overdue); }

  .todo-list {
    margin-top: 8px;
  }

  .empty-state {
    background: var(--surface);
    border: 2px dashed var(--panel-border);
    border-radius: 24px;
    padding: 60px 20px;
    text-align: center;
    color: var(--muted-text);
  }

  .empty-state .hint {
    margin-top: 8px;
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    .design-intro {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .header-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);
      align-items: center;
      gap: 32px;
    }

    .stats-panel {
      padding-left: 24px;
      border-left: 1px solid var(--panel-border);
    }

    .stats-bar {
      border-top: none;
      padding-top: 0;
    }
  }

  @media (max-width: 640px) {
    .design-intro {
      border-radius: 20px;
    }

    .btn-add {
      width: 100%;
      text-align: center;
    }
  }
</style>
