'use server';

import { createClient } from '@/lib/supabase/server';

export type FormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' };

const HANDLE_RE = /^[a-z0-9_-]{3,32}$/;

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const firstName = String(formData.get('first_name') ?? '').trim();
  const lastName = String(formData.get('last_name') ?? '').trim();
  const handle = String(formData.get('handle') ?? '').trim().toLowerCase();

  if (!email || !password || !handle) {
    return { status: 'error', message: 'Заполните email, пароль и ник для ссылки на страницу.' };
  }
  if (password.length < 8) {
    return { status: 'error', message: 'Пароль должен быть не короче 8 символов.' };
  }
  if (!HANDLE_RE.test(handle)) {
    return { status: 'error', message: 'Ник: 3-32 символа, только латиница, цифры, "-" и "_".' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { handle, first_name: firstName, last_name: lastName },
    },
  });

  if (error) {
    if (error.message.includes('already registered') || error.code === 'user_already_exists') {
      return { status: 'error', message: 'Этот email уже зарегистрирован.' };
    }
    if (
      error.message.toLowerCase().includes('duplicate') ||
      error.message.toLowerCase().includes('database error saving new user') ||
      error.code === '23505'
    ) {
      return { status: 'error', message: 'Этот ник уже занят, выберите другой.' };
    }
    return { status: 'error', message: error.message };
  }

  return { status: 'success' };
}
