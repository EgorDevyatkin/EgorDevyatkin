'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addItemAction, type AddItemState } from '@/app/dashboard/actions';

const initialState: AddItemState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Добавляем...' : 'Добавить'}
    </button>
  );
}

export function AddItemForm() {
  const [state, formAction] = useFormState(addItemAction, initialState);

  return (
    <form className="row-gap" action={formAction}>
      <input
        type="url"
        name="url"
        placeholder="https://example.com/tovar"
        required
        style={{ flex: 1, minWidth: 240 }}
      />
      <SubmitButton />
      {state.status === 'error' && <p className="error-message">{state.message}</p>}
    </form>
  );
}
