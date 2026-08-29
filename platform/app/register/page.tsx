'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { registerAction, type FormState } from './actions';

const initialState: FormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Создаём...' : 'Создать аккаунт'}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, initialState);

  if (state.status === 'success') {
    return (
      <div className="card">
        <h2>Проверьте почту</h2>
        <p>
          Мы отправили письмо со ссылкой для подтверждения. После подтверждения
          сможете войти.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Регистрация</h2>
      <form className="stacked" action={formAction}>
        <label>
          Имя
          <input type="text" name="first_name" autoComplete="given-name" />
        </label>
        <label>
          Фамилия
          <input type="text" name="last_name" autoComplete="family-name" />
        </label>
        <label>
          Ник для ссылки на страницу (например, egor)
          <input type="text" name="handle" required pattern="[a-z0-9_-]{3,32}" />
        </label>
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Пароль (минимум 8 символов)
          <input type="password" name="password" required minLength={8} autoComplete="new-password" />
        </label>
        {state.status === 'error' && <p className="error-message">{state.message}</p>}
        <SubmitButton />
      </form>
    </div>
  );
}
