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
      <label>상태</label>
      <select bind:value={localFilters.status} on:change={updateFilters}>
        <option value="전체">전체</option>
        {#each STATUS_OPTIONS as status}
          <option value={status}>{status}</option>
        {/each}
      </select>
    </div>

    <div class="filter-item">
      <label>우선순위</label>
      <select bind:value={localFilters.priority} on:change={updateFilters}>
        <option value="전체">전체</option>
        {#each PRIORITY_OPTIONS as priority}
          <option value={priority}>{priority}</option>
        {/each}
      </select>
    </div>

    <div class="filter-item">
      <label>작업자</label>
      <select bind:value={localFilters.assignee} on:change={updateFilters}>
        <option value="전체">전체</option>
        {#each ASSIGNEE_OPTIONS as assignee}
          <option value={assignee}>{assignee}</option>
        {/each}
      </select>
    </div>

    <div class="filter-item">
      <label>카테고리</label>
      <select bind:value={localFilters.category} on:change={updateFilters}>
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
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .bar-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bar-eyebrow {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: #4f46e5;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .bar-header h2 {
    margin: 0;
    font-size: 18px;
    color: #111827;
    font-weight: 600;
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
    font-weight: 500;
    color: #374151;
  }

  select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .btn-reset {
    align-self: flex-start;
    padding: 8px 18px;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #f8fafc;
    color: #1f2937;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .btn-reset:hover {
    background: #eef2ff;
    border-color: #c7d2fe;
  }

  .sort-row {
    border-top: 1px solid #eef2f7;
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
    color: #6b7280;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    .filter-bar {
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
