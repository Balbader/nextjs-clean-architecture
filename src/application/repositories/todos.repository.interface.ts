/**
 * This interface defines the contract for Todo repository implementations following Clean Architecture principles.
 * In Clean Architecture, repository interfaces reside in the application/business layer and define
 * how the application core interacts with external data sources without knowing their implementation details.
 * 
 * The actual implementation of this interface (e.g., database access) will be in the infrastructure layer,
 * maintaining the dependency rule where outer layers depend on inner layers through interfaces.
 * This enables loose coupling and makes the system more maintainable and testable.
 */
import type { Todo, TodoInsert } from '@/src/entities/models/todo';

export interface ITodosRepository {
  createTodo(todo: TodoInsert, tx?: any): Promise<Todo>;
  getTodo(id: number): Promise<Todo | undefined>;
  getTodosForUser(userId: string): Promise<Todo[]>;
  updateTodo(id: number, input: Partial<TodoInsert>, tx?: any): Promise<Todo>;
  deleteTodo(id: number, tx?: any): Promise<void>;
}
