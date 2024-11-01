'use client';

/**
 * This component represents a presentation layer element in the clean architecture.
 * It handles the UI representation of todos and user interactions, following the
 * separation of concerns principle. The component manages local state for bulk operations
 * and delegates data mutations to server actions (defined in actions.ts).
 * 
 * This follows clean architecture by:
 * 1. Keeping UI logic separate from business logic
 * 2. Using dependency inversion (receiving todos as props)
 * 3. Delegating data modifications to use cases (server actions)
 */

import { useCallback, useState } from 'react';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Checkbox } from './_components/ui/checkbox';
import { cn } from './_components/utils';
import { bulkUpdate, toggleTodo } from './actions';
import { Button } from './_components/ui/button';

type Todo = { id: number; todo: string; userId: string; completed: boolean };

export function Todos({ todos }: { todos: Todo[] }) {
  const [bulkMode, setBulkMode] = useState(false);
  const [dirty, setDirty] = useState<number[]>([]);
  const [deleted, setDeleted] = useState<number[]>([]);

  const handleToggle = useCallback(
    async (id: number) => {
      if (bulkMode) {
        const dirtyIndex = dirty.findIndex((t) => t === id);
        if (dirtyIndex > -1) {
          const newDirty = Object.assign([], dirty);
          newDirty.splice(dirtyIndex, 1);
          setDirty(newDirty);
        } else {
          setDirty([...dirty, id]);
        }
      } else {
        const res = await toggleTodo(id);
        if (res) {
          if (res.error) {
            toast.error(res.error);
          } else if (res.success) {
            toast.success('Todo toggled!');
          }
        }
      }
    },
    [bulkMode, dirty]
  );

  const markForDeletion = useCallback(
    (id: number) => {
      const dirtyIndex = dirty.findIndex((t) => t === id);
      if (dirtyIndex > -1) {
        const newDirty = Object.assign([], dirty);
        newDirty.splice(dirtyIndex, 1);
        setDirty(newDirty);
      }

      const deletedIndex = deleted.findIndex((t) => t === id);
      if (deletedIndex === -1) {
        setDeleted((d) => [...d, id]);
      } else {
        const newDeleted = Object.assign([], deleted);
        newDeleted.splice(deletedIndex, 1);
        setDeleted(newDeleted);
      }
    },
    [deleted, dirty]
  );

  const updateAll = async () => {
    const res = await bulkUpdate(dirty, deleted);
    setBulkMode(false);
    setDirty([]);
    setDeleted([]);
    if (res) {
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success('Bulk update completed!');
      }
    }
  };

  return (
    <>
      <ul className="w-full">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-2 w-full hover:bg-muted/50 active:bg-muted rounded-sm p-1"
            >
              <Checkbox
                checked={
                  dirty.findIndex((t) => t === todo.id) > -1
                    ? !todo.completed
                    : todo.completed
                }
                onCheckedChange={() => handleToggle(todo.id)}
                id={`checkbox-${todo.id}`}
                disabled={deleted.findIndex((t) => t === todo.id) > -1}
              />
              <label
                htmlFor={`checkbox-${todo.id}`}
                className={cn('flex-1 cursor-pointer', {
                  'text-muted-foreground line-through':
                    dirty.findIndex((t) => t === todo.id) > -1
                      ? !todo.completed
                      : todo.completed,
                  'text-destructive line-through':
                    deleted.findIndex((t) => t === todo.id) > -1,
                })}
              >
                {todo.todo}
              </label>
              {bulkMode && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="p-3"
                  onClick={() => markForDeletion(todo.id)}
                >
                  <Trash size={16} />
                </Button>
              )}
            </li>
          ))
        ) : (
          <p>No todos. Create some to get started!</p>
        )}
      </ul>
      {bulkMode ? (
        <div className="w-full grid grid-cols-2 gap-2">
          <Button onClick={updateAll}>Update all</Button>
          <Button variant="secondary" onClick={() => setBulkMode(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={() => setBulkMode(true)}>Bulk operations</Button>
      )}
    </>
  );
}
