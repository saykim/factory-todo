<script>
import { todos, filterOptions, sortOption } from './lib/store.js';
import TodoItem from './lib/TodoItem.svelte';
import TodoForm from './lib/TodoForm.svelte';
import FilterBar from './lib/FilterBar.svelte';

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

function setStatusFilter(status) {
  filterOptions.update(options => ({ ...options, status }));
}
</script>

<main>
  <div class="container">
    <header>
      <div class="header-grid">
        <div class="header-main">
          <div class="header-content">
            <h1>🏭 공장 유지보수 관리</h1>
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
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #f9fafb;
  }

  main {
    min-height: 100vh;
    padding: clamp(16px, 4vw, 40px);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  header {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    color: #111827;
    font-weight: 700;
  }

  .btn-add {
    padding: 12px 24px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    align-self: flex-start;
  }
  .status-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
  }

  .status-tab {
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    background: #f3f4f6;
    color: #374151;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .status-tab:hover {
    background: #e5e7eb;
  }

  .status-tab.active {
    background: #1d4ed8;
    border-color: #1d4ed8;
    color: white;
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
  }


  .btn-add:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.4);
  }

  .stats-panel {
    padding-top: 12px;
  }

  .stats-bar {
    display: grid;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
  }

  .status-pending {
    color: #6b7280;
  }

  .status-progress {
    color: #3b82f6;
  }

  .status-completed {
    color: #10b981;
  }

  .status-overdue {
    color: #ef4444;
  }

  .todo-list {
    margin-top: 24px;
  }

  .empty-state {
    background: white;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 60px 20px;
    text-align: center;
  }

  .empty-state p {
    margin: 0;
    font-size: 18px;
    color: #6b7280;
  }

  .empty-state .hint {
    margin-top: 8px;
    font-size: 14px;
    color: #9ca3af;
  }

  @media (min-width: 768px) {
    header {
      padding: 28px 32px;
    }

    .status-tabs {
      gap: 16px;
    }
  }

  @media (min-width: 1024px) {
    .container {
      max-width: 1280px;
    }

    .header-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);
      gap: 32px;
      align-items: stretch;
    }

    .stats-panel {
      padding: 0 0 0 32px;
      border-left: 1px solid #e5e7eb;
    }

    .stats-bar {
      padding-top: 0;
      border-top: none;
    }
  }
</style>
