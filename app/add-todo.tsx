'use client';

/**
 * This component represents a presentation layer element in the clean architecture.
 * It handles the UI concerns for creating new todos, acting as part of the interface adapters layer.
 * The component is responsible for:
 * 1. Capturing user input through a form
 * 2. Delegating the business logic to the createTodo action
 * 3. Handling the response and showing appropriate feedback
 * 4. Managing its local state (input field clearing)
 * 
 * It follows the separation of concerns principle by keeping UI logic separate from business logic,
 * which is handled by the createTodo action.
 */

import { Plus } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

import { Button } from './_components/ui/button';
import { Input } from './_components/ui/input';
import { createTodo } from './actions';

export function CreateTodo() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const res = await createTodo(formData);

    if (res) {
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success('Todo(s) created!');

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
      <Input
        ref={inputRef}
        name="todo"
        className="flex-1"
        placeholder="Take out trash"
      />
      <Button size="icon" type="submit">
        <Plus />
      </Button>
    </form>
  );
}
