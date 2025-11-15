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
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .todo-item:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .todo-item.completed {
    opacity: 0.7;
    background: #f9fafb;
  }

  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .todo-title-section {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  .completed h3 {
    text-decoration: line-through;
    color: #6b7280;
  }

  .category-badge {
    padding: 4px 8px;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .todo-actions {
    display: flex;
    gap: 8px;
  }

  .btn-edit, .btn-delete {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .btn-edit {
    background: #3b82f6;
    color: white;
  }

  .btn-edit:hover {
    background: #2563eb;
  }

  .btn-delete {
    background: #ef4444;
    color: white;
  }

  .btn-delete:hover {
    background: #dc2626;
  }

  .description {
    color: #4b5563;
    margin: 0 0 12px 0;
    line-height: 1.5;
  }

  .todo-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
  }

  .assignee {
    font-weight: 600;
    color: #111827;
  }

  .priority-badge {
    padding: 4px 12px;
    color: white;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
  }

  .status-select {
    padding: 4px 8px;
    border: 2px solid;
    border-radius: 4px;
    background: white;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
  }

  .due-date {
    font-size: 14px;
    font-weight: 500;
  }

  .due-date.overdue {
    color: #dc2626;
    font-weight: 700;
  }

  .due-date.due-today {
    color: #f59e0b;
    font-weight: 700;
  }

  .due-date.due-soon {
    color: #ea580c;
    font-weight: 600;
  }

  .todo-footer {
    display: flex;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
    font-size: 13px;
    color: #6b7280;
  }

  .created-at, .completed-at {
    display: flex;
    align-items: center;
  }

  .completed-at {
    color: #10b981;
    font-weight: 500;
  }
</style>
