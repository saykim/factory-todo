<script>
  import { createEventDispatcher } from 'svelte';
  import { PRIORITY_OPTIONS, STATUS_OPTIONS, CATEGORY_OPTIONS, ASSIGNEE_OPTIONS } from './constants.js';

  export let editingTodo = null;
  export let show = false;

  const dispatch = createEventDispatcher();

  let formData = {
    title: '',
    description: '',
    assignee: '미할당',
    priority: '보통',
    status: '대기',
    dueDate: '',
    category: '일반'
  };

  // 수정 모드일 때 폼 데이터 채우기
  $: if (editingTodo) {
    formData = {
      title: editingTodo.title,
      description: editingTodo.description,
      assignee: editingTodo.assignee,
      priority: editingTodo.priority,
      status: editingTodo.status,
      dueDate: editingTodo.dueDate || '',
      category: editingTodo.category
    };
  }

  function handleSubmit() {
    if (!formData.title.trim()) {
      alert('작업 제목을 입력해주세요.');
      return;
    }

    const todoData = {
      ...formData,
      dueDate: formData.dueDate || null
    };

    if (editingTodo) {
      dispatch('update', { id: editingTodo.id, updates: todoData });
    } else {
      dispatch('add', todoData);
    }

    handleClose();
  }

  function handleClose() {
    formData = {
      title: '',
      description: '',
      assignee: '미할당',
      priority: '보통',
      status: '대기',
      dueDate: '',
      category: '일반'
    };
    dispatch('close');
  }
</script>

{#if show}
  <div class="modal-overlay" on:click={handleClose}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <div class="modal-heading">
          <span class="mode-chip">{editingTodo ? '수정 모드' : '신규 작업'}</span>
          <h2>{editingTodo ? '작업 수정' : '새 작업 추가'}</h2>
          <p class="modal-subtitle">
            {editingTodo
              ? '기존 작업 정보를 최신 상태로 정리하세요.'
              : '필요한 정보를 입력해 유지보수 작업을 등록하세요.'}
          </p>
        </div>
        <button class="btn-close" on:click={handleClose}>&times;</button>
      </div>

      <form class="todo-form" on:submit|preventDefault={handleSubmit}>
        <section class="form-section">
          <div class="section-header">
            <h3>기본 정보</h3>
            <p>작업의 개요와 상세 설명을 입력하세요.</p>
          </div>
          <div class="form-group">
            <label for="title">작업 제목 <span class="required">*</span></label>
            <input
              type="text"
              id="title"
              bind:value={formData.title}
              placeholder="예: 컨베이어 벨트 정기 점검"
              required
            />
          </div>
          <div class="form-group">
            <label for="description">작업 상세</label>
            <textarea
              id="description"
              bind:value={formData.description}
              placeholder="작업에 대한 상세 내용을 입력하세요"
              rows="3"
            ></textarea>
          </div>
        </section>

        <section class="form-section">
          <div class="section-header">
            <h3>분류 및 담당</h3>
            <p>카테고리와 담당자를 지정해 협업을 명확히 합니다.</p>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label for="category">카테고리</label>
              <select id="category" bind:value={formData.category}>
                {#each CATEGORY_OPTIONS as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <label for="assignee">작업자</label>
              <select id="assignee" bind:value={formData.assignee}>
                {#each ASSIGNEE_OPTIONS as assignee}
                  <option value={assignee}>{assignee}</option>
                {/each}
              </select>
            </div>
          </div>
        </section>

        <section class="form-section">
          <div class="section-header">
            <h3>진행 정보</h3>
            <p>우선순위, 상태, 마감일을 지정해 스케줄을 관리하세요.</p>
          </div>
          <div class="form-grid form-grid-3">
            <div class="form-group">
              <label for="priority">우선순위</label>
              <select id="priority" bind:value={formData.priority}>
                {#each PRIORITY_OPTIONS as priority}
                  <option value={priority}>{priority}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <label for="status">상태</label>
              <select id="status" bind:value={formData.status}>
                {#each STATUS_OPTIONS as status}
                  <option value={status}>{status}</option>
                {/each}
              </select>
            </div>
            <div class="form-group span-2">
              <label for="dueDate">마감일</label>
              <input
                type="date"
                id="dueDate"
                bind:value={formData.dueDate}
              />
              <p class="helper-text">미입력 시 마감일 없이 저장됩니다.</p>
            </div>
          </div>
        </section>

        <div class="form-actions">
          <button type="button" class="btn-cancel" on:click={handleClose}>
            취소
          </button>
          <button type="submit" class="btn-submit">
            {editingTodo ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 720px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.35);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-heading h2 {
    margin: 6px 0 0;
    font-size: 22px;
    color: #0f172a;
  }

  .modal-heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .modal-subtitle {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 14px;
  }

  .mode-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 999px;
    background: #eef2ff;
    color: #4338ca;
    font-size: 13px;
    font-weight: 600;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: #6b7280;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
  }

  .btn-close:hover {
    color: #111827;
  }

  .todo-form {
    padding: 24px;
    overflow-y: auto;
  }

  .form-section {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    background: #f9fafb;
  }

  .section-header h3 {
    margin: 0;
    font-size: 16px;
    color: #111827;
  }

  .section-header p {
    margin: 6px 0 16px;
    color: #6b7280;
    font-size: 13px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .form-grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .span-2 {
    grid-column: span 2;
  }

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
  }

  .required {
    color: #ef4444;
  }

  .helper-text {
    margin: 4px 0 0;
    font-size: 12px;
    color: #9ca3af;
  }

  input[type="text"],
  input[type="date"],
  textarea,
  select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  input[type="text"]:focus,
  input[type="date"]:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    position: sticky;
    bottom: 0;
    background: white;
  }

  .btn-cancel,
  .btn-submit {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel {
    background: #f3f4f6;
    color: #374151;
  }

  .btn-cancel:hover {
    background: #e5e7eb;
  }

  .btn-submit {
    background: #3b82f6;
    color: white;
  }

  .btn-submit:hover {
    background: #2563eb;
  }

  @media (max-width: 640px) {
    .modal-content {
      max-height: 100vh;
    }

    .modal-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .todo-form {
      padding: 20px;
    }

    .form-section {
      padding: 16px;
    }

    .span-2 {
      grid-column: span 1;
    }

    .form-actions {
      flex-direction: column-reverse;
      align-items: stretch;
      position: static;
    }
  }
</style>
