'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type FormState = { status: 'idle' } | { status: 'error'; message: string };

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { status: 'error', message: 'Введите email и пароль.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return { status: 'error', message: 'Email ещё не подтверждён — проверьте почту.' };
    }
    return { status: 'error', message: 'Неверный email или пароль.' };
  }

  redirect('/dashboard');
}
