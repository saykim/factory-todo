import { writable } from 'svelte/store';

// 로컬 스토리지에서 데이터 불러오기
function createTodoStore() {
  const storedTodos = localStorage.getItem('factoryTodos');
  const initialTodos = storedTodos ? JSON.parse(storedTodos) : [];

  const { subscribe, set, update } = writable(initialTodos);

  return {
    subscribe,

    // 새 작업 추가
    addTodo: (todo) => {
      const newTodo = {
        id: Date.now().toString(),
        title: todo.title,
        description: todo.description || '',
        assignee: todo.assignee || '미할당',
        priority: todo.priority || '보통',
        status: todo.status || '대기',
        dueDate: todo.dueDate || null,
        category: todo.category || '일반',
        createdAt: new Date().toISOString(),
        completedAt: null
      };

      update(todos => {
        const updated = [...todos, newTodo];
        localStorage.setItem('factoryTodos', JSON.stringify(updated));
        return updated;
      });
    },

    // 작업 수정
    updateTodo: (id, updates) => {
      update(todos => {
        const updated = todos.map(todo => {
          if (todo.id === id) {
            const updatedTodo = { ...todo, ...updates };
            // 상태가 '완료'로 변경되면 완료 시간 기록
            if (updates.status === '완료' && todo.status !== '완료') {
              updatedTodo.completedAt = new Date().toISOString();
            }
            // 상태가 '완료'에서 다른 것으로 변경되면 완료 시간 제거
            if (updates.status && updates.status !== '완료') {
              updatedTodo.completedAt = null;
            }
            return updatedTodo;
          }
          return todo;
        });
        localStorage.setItem('factoryTodos', JSON.stringify(updated));
        return updated;
      });
    },

    // 작업 삭제
    deleteTodo: (id) => {
      update(todos => {
        const updated = todos.filter(todo => todo.id !== id);
        localStorage.setItem('factoryTodos', JSON.stringify(updated));
        return updated;
      });
    },

    // 모든 작업 삭제
    clearAll: () => {
      set([]);
      localStorage.setItem('factoryTodos', JSON.stringify([]));
    }
  };
}

export const todos = createTodoStore();

// 필터 및 정렬 옵션
export const filterOptions = writable({
  status: '전체',
  priority: '전체',
  assignee: '전체',
  category: '전체'
});

export const sortOption = writable('dueDate'); // dueDate, priority, createdAt
