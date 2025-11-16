<script>
  import { createEventDispatcher } from 'svelte';
  import { PRIORITY_COLORS, STATUS_COLORS } from './constants.js';

  export let todo;

  const dispatch = createEventDispatcher();

  // 마감일까지 남은 일수 계산
  function getDaysUntilDue(dueDate) {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // 마감일 상태 표시
  function getDueDateClass(dueDate) {
    const days = getDaysUntilDue(dueDate);
    if (days === null) return '';
    if (days < 0) return 'overdue';
    if (days === 0) return 'due-today';
    if (days <= 3) return 'due-soon';
    return '';
  }

  // 마감일 텍스트
  function getDueDateText(dueDate) {
    const days = getDaysUntilDue(dueDate);
    if (days === null) return '마감일 없음';
    if (days < 0) return `${Math.abs(days)}일 지연`;
    if (days === 0) return '오늘 마감';
    if (days === 1) return '내일 마감';
    return `${days}일 남음`;
  }

  function handleStatusChange(newStatus) {
    dispatch('update', { id: todo.id, updates: { status: newStatus } });
  }

  function handleEdit() {
    dispatch('edit', todo);
  }

  function handleDelete() {
    if (confirm('이 작업을 삭제하시겠습니까?')) {
      dispatch('delete', todo.id);
    }
  }
</script>

<div class="todo-item" class:completed={todo.status === '완료'}>
  <div class="todo-header">
    <div class="todo-title-section">
      <h3>{todo.title}</h3>
      <span class="category-badge">{todo.category}</span>
    </div>
    <div class="todo-actions">
      <button class="btn-edit" on:click={handleEdit}>수정</button>
      <button class="btn-delete" on:click={handleDelete}>삭제</button>
    </div>
  </div>

  {#if todo.description}
    <p class="description">{todo.description}</p>
  {/if}

  <div class="todo-meta">
    <div class="meta-item">
      <span class="label">작업자:</span>
      <span class="assignee">{todo.assignee}</span>
    </div>

    <div class="meta-item">
      <span class="label">우선순위:</span>
      <span
        class="priority-badge"
        style="background-color: {PRIORITY_COLORS[todo.priority]}">
        {todo.priority}
      </span>
    </div>

    <div class="meta-item">
      <span class="label">상태:</span>
      <select
        class="status-select"
        value={todo.status}
        on:change={(e) => handleStatusChange(e.target.value)}
        style="border-color: {STATUS_COLORS[todo.status]}">
        <option value="대기">대기</option>
        <option value="진행중">진행중</option>
        <option value="완료">완료</option>
      </select>
    </div>

    <div class="meta-item">
      <span class="label">마감일:</span>
      <span class="due-date {getDueDateClass(todo.dueDate)}">
        {#if todo.dueDate}
          {new Date(todo.dueDate).toLocaleDateString('ko-KR')} ({getDueDateText(todo.dueDate)})
        {:else}
          마감일 없음
        {/if}
      </span>
    </div>
  </div>

  <div class="todo-footer">
    <span class="created-at">
      생성: {new Date(todo.createdAt).toLocaleDateString('ko-KR')}
    </span>
    {#if todo.completedAt}
      <span class="completed-at">
        완료: {new Date(todo.completedAt).toLocaleDateString('ko-KR')}
      </span>
    {/if}
  </div>
</div>

<style>
  .todo-item {
    background: var(--surface-strong);
    border: 1px solid var(--panel-border);
    border-radius: var(--card-radius);
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-soft);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .todo-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 40px rgba(0, 0, 0, 0.2);
  }

  .todo-item.completed {
    border-style: dashed;
    opacity: 0.9;
  }

  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 12px;
  }

  .todo-title-section {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  h3 {
    margin: 0;
    font-size: 20px;
  }

  .completed h3 {
    text-decoration: line-through;
    opacity: 0.8;
  }

  .category-badge {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    background: var(--chip-bg);
    color: var(--chip-text);
  }

  .todo-actions {
    display: flex;
    gap: 8px;
  }

  .btn-edit,
  .btn-delete {
    padding: 6px 12px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  .btn-edit {
    background: var(--accent);
    color: #fff;
  }

  .btn-delete {
    background: var(--danger);
    color: #fff;
  }

  .btn-edit:hover,
  .btn-delete:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  .description {
    color: var(--muted-text);
    margin: 0 0 16px 0;
    line-height: 1.6;
  }

  .todo-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .label {
    color: var(--muted-text);
    font-weight: 600;
  }

  .assignee {
    font-weight: 700;
  }

  .priority-badge {
    padding: 4px 14px;
    color: #fff;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
  }

  .status-select {
    padding: 6px 10px;
    border: 2px solid;
    border-radius: 12px;
    background: transparent;
    color: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .due-date {
    font-size: 14px;
    font-weight: 600;
  }

  .due-date.overdue {
    color: var(--danger);
  }

  .due-date.due-today {
    color: var(--warning);
  }

  .due-date.due-soon {
    color: var(--status-progress);
  }

  .todo-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px dashed var(--panel-border);
    font-size: 13px;
    color: var(--muted-text);
  }

  .completed-at {
    color: var(--safe);
    font-weight: 600;
  }
</style>
