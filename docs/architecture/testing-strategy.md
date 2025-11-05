# Testing Strategy

## Testing Pyramid
The testing strategy follows the standard pyramid model, with a large base of unit tests, fewer integration tests, and a small number of E2E tests. The PRD requires 95% coverage for unit and integration tests.

## Test Organization

### Frontend Tests
```text
frontend/src/features/tasks/
├── __tests__/
│   ├── KanbanBoard.test.tsx
│   └── useTasks.test.ts
├── KanbanBoard.tsx
└── useTasks.ts
```

### Backend Tests
```text
backend/src/test/java/com/taskflow/
├── controller/
│   └── TaskControllerTest.java
└── service/
    └── TaskServiceTest.java
```

### E2E Tests
E2E tests will be in a separate `e2e` directory at the root of the monorepo.

## Test Examples

### Frontend Component Test (Vitest/RTL)
```typescript
import { render, screen } from '@testing-library/react';
import TaskCard from '../TaskCard';

test('renders task title', () => {
  const task = { id: '1', title: 'Test Task', ... };
  render(<TaskCard task={task} />);
  expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
});
```

### Backend API Test (JUnit 5/Mockito)
```java
@WebMvcTest(TaskController.class)
class TaskControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Test
    void shouldReturnTaskWhenFound() throws Exception {
        TaskDTO task = new TaskDTO(...);
        when(taskService.getTaskById(any(UUID.class))).thenReturn(task);

        mockMvc.perform(get("/api/tasks/{id}", UUID.randomUUID()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(task.getTitle())));
    }
}
```

### E2E Test (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('user can log in and see dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```
