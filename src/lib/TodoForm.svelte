<script>
  import { createEventDispatcher, tick } from 'svelte';
  import { PRIORITY_OPTIONS, STATUS_OPTIONS, CATEGORY_OPTIONS, ASSIGNEE_OPTIONS } from './constants.js';

  export let editingTodo = null;
  export let show = false;

  const dispatch = createEventDispatcher();
  let overlayEl;

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

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleOverlayKey(event) {
    if (['Escape', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      handleClose();
    }
  }

  $: if (show) {
    tick().then(() => overlayEl?.focus());
  }
</script>

{#if show}
  <div
    class="modal-overlay"
    role="presentation"
    tabindex="-1"
    bind:this={overlayEl}
    on:click={handleOverlayClick}
    on:keydown={handleOverlayKey}
  >
    <div
      class="modal-content"
      role="dialog"
      aria-modal="true"
      aria-label={editingTodo ? '작업 수정' : '새 작업 추가'}
    >
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
    inset: 0;
    background: rgba(4, 7, 15, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: var(--surface-strong);
    border-radius: 28px;
    width: 100%;
    max-width: 780px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--panel-border);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    padding: clamp(20px, 3vw, 32px);
    border-bottom: 1px solid var(--panel-border);
  }

  .modal-heading {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .modal-heading h2 {
    margin: 0;
    font-size: clamp(22px, 3vw, 28px);
  }

  .modal-subtitle {
    margin: 0;
    color: var(--muted-text);
    font-size: 14px;
  }

  .mode-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 999px;
    background: var(--chip-bg);
    color: var(--chip-text);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: var(--muted-text);
    line-height: 1;
    padding: 0;
  }

  .todo-form {
    padding: clamp(20px, 3vw, 32px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .form-section {
    border: 1px solid var(--panel-border);
    border-radius: 22px;
    padding: 20px;
    background: var(--surface);
  }

  .section-header h3 {
    margin: 0;
    font-size: 18px;
  }

  .section-header p {
    margin: 6px 0 16px;
    color: var(--muted-text);
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
    font-weight: 600;
    font-size: 14px;
  }

  .required {
    color: var(--danger);
  }

  .helper-text {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--muted-text);
  }

  input[type="text"],
  input[type="date"],
  textarea,
  select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--control-border);
    border-radius: 14px;
    font-size: 14px;
    font-family: inherit;
    background: var(--control-bg);
    color: var(--text-primary);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus,
  input[type="date"]:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--control-focus);
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .btn-cancel,
  .btn-submit {
    padding: 12px 24px;
    border: none;
    border-radius: 16px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .btn-cancel {
    background: var(--surface-muted);
    color: var(--text-primary);
  }

  .btn-submit {
    background: linear-gradient(120deg, var(--accent), var(--accent-strong));
    color: #fff;
    box-shadow: 0 18px 30px rgba(0, 0, 0, 0.25);
  }

  .btn-submit:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    .modal-content {
      max-height: 100vh;
      border-radius: 16px;
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
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
