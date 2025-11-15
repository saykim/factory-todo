// 우선순위 옵션
export const PRIORITY_OPTIONS = ['낮음', '보통', '높음', '긴급'];

// 우선순위별 색상
export const PRIORITY_COLORS = {
  '낮음': '#6b7280',
  '보통': '#3b82f6',
  '높음': '#f59e0b',
  '긴급': '#ef4444'
};

// 상태 옵션
export const STATUS_OPTIONS = ['대기', '진행중', '완료'];

// 상태별 색상
export const STATUS_COLORS = {
  '대기': '#6b7280',
  '진행중': '#3b82f6',
  '완료': '#10b981'
};

// 카테고리 옵션 (공장 설비 관련)
export const CATEGORY_OPTIONS = [
  '일반',
  '전기설비',
  '기계설비',
  '안전점검',
  '예방보전',
  '긴급수리',
  '청소/정리',
  '기타'
];

// 작업자 목록 (예시 - 실제로는 DB나 설정에서 가져올 수 있음)
export const ASSIGNEE_OPTIONS = [
  '미할당',
  '김철수',
  '이영희',
  '박민수',
  '정수진',
  '최동훈'
];
