<script>
  import { filterOptions, sortOption } from './store.js';
  import { PRIORITY_OPTIONS, STATUS_OPTIONS, CATEGORY_OPTIONS, ASSIGNEE_OPTIONS } from './constants.js';

  let localFilters = { ...$filterOptions };
  let localSort = $sortOption;

  function updateFilters() {
    filterOptions.set(localFilters);
  }

  function updateSort() {
    sortOption.set(localSort);
  }

  function resetFilters() {
    localFilters = {
      status: '전체',
      priority: '전체',
      assignee: '전체',
      category: '전체'
    };
    updateFilters();
  }
</script>

<div class="filter-bar">
  <div class="bar-header">
    <div>
      <p class="bar-eyebrow">필터</p>
      <h2>조건을 선택해 작업 목록을 빠르게 좁혀보세요.</h2>
    </div>
    <button class="btn-reset" on:click={resetFilters}>
      필터 초기화
    </button>
  </div>

  <div class="filters">
    <div class="filter-item">
      <label for="statusFilter">상태</label>
      <select id="statusFilter" bind:value={localFilters.status} on:change={updateFilters}>
        <option value="전체">전체</option>
        {#each STATUS_OPTIONS as status}
          <option value={status}>{status}</option>
        {/each}
      </select>
    </div>

    <div class="filter-item">
      <label for="priorityFilter">우선순위</label>
      <select id="priorityFilter" bind:value={localFilters.priority} on:change={updateFilters}>
        <option value="전체">전체</option>
        {#each PRIORITY_OPTIONS as priority}
          <option value={priority}>{priority}</option>
        {/each}
      </select>
    </div>

    <div class="filter-item">
      <label for="assigneeFilter">작업자</label>
      <select id="assigneeFilter" bind:value={localFilters.assignee} on:change={updateFilters}>
        <option value="전체">전체</option>
        {#each ASSIGNEE_OPTIONS as assignee}
          <option value={assignee}>{assignee}</option>
        {/each}
      </select>
    </div>

    <div class="filter-item">
      <label for="categoryFilter">카테고리</label>
      <select id="categoryFilter" bind:value={localFilters.category} on:change={updateFilters}>
        <option value="전체">전체</option>
        {#each CATEGORY_OPTIONS as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="sort-row">
    <div class="sort-control">
      <label for="sortSelect">정렬</label>
      <select id="sortSelect" bind:value={localSort} on:change={updateSort}>
        <option value="dueDate">마감일 순</option>
        <option value="priority">우선순위 순</option>
        <option value="createdAt">생성일 순</option>
        <option value="status">상태 순</option>
      </select>
    </div>
  </div>
</div>

<style>
  .filter-bar {
    background: var(--surface-strong);
    border: 1px solid var(--panel-border);
    border-radius: 28px;
    padding: clamp(20px, 3vw, 32px);
    margin-bottom: 24px;
    box-shadow: var(--shadow-soft);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .bar-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .bar-eyebrow {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }

  .bar-header h2 {
    margin: 0;
    font-size: 18px;
    color: var(--text-primary);
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .filter-item label {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted-text);
  }

  select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--control-border);
    border-radius: 14px;
    font-size: 14px;
    background: var(--control-bg);
    color: var(--text-primary);
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--control-focus);
  }

  .btn-reset {
    align-self: flex-start;
    padding: 10px 22px;
    border-radius: 999px;
    border: 1px dashed var(--panel-border);
    background: transparent;
    color: var(--text-primary);
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }

  .btn-reset:hover {
    background: var(--surface-muted);
    transform: translateY(-1px);
  }

  .sort-row {
    border-top: 1px dashed var(--panel-border);
    padding-top: 14px;
    display: flex;
    justify-content: flex-end;
  }

  .sort-control {
    width: min(260px, 100%);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sort-control label {
    font-size: 12px;
    color: var(--muted-text);
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    .filter-bar {
      border-radius: 20px;
      padding: 20px;
    }

    .btn-reset {
      width: 100%;
      text-align: center;
    }

    .sort-row {
      justify-content: flex-start;
    }
  }

  @media (min-width: 768px) {
    .bar-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .btn-reset {
      margin-left: auto;
    }
  }
</style>
