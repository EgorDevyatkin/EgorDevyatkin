'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { fetchLinkMetadata } from '@/lib/fetchMetadata';

export type AddItemState = { status: 'idle' } | { status: 'error'; message: string };

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');
  return { supabase, userId: user.id };
}

export async function addItemAction(_prev: AddItemState, formData: FormData): Promise<AddItemState> {
  const url = String(formData.get('url') ?? '').trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    return { status: 'error', message: 'Вставьте полную ссылку на товар (начинается с http:// или https://).' };
  }

  const { supabase, userId } = await requireUserId();

  let meta;
  try {
    meta = await fetchLinkMetadata(url);
  } catch {
    return {
      status: 'error',
      message: 'Не удалось загрузить страницу. Добавьте её вручную ниже и заполните поля сами.',
    };
  }

  const { error } = await supabase.from('wishlist_items').insert({
    owner_id: userId,
    url,
    title: meta.title,
    description: meta.description,
    image_url: meta.imageUrl,
    price: meta.price,
    currency: meta.currency,
  });

  if (error) {
    return { status: 'error', message: error.message };
  }

  revalidatePath('/dashboard');
  return { status: 'idle' };
}

export async function updateItemAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id'));
  const { supabase, userId } = await requireUserId();

  const title = String(formData.get('title') ?? '');
  const description = String(formData.get('description') ?? '');
  const priceRaw = String(formData.get('price') ?? '');
  const targetRaw = String(formData.get('target_amount') ?? '');
  const raisedRaw = String(formData.get('raised_amount') ?? '');

  await supabase
    .from('wishlist_items')
    .update({
      title,
      description,
      price: priceRaw ? Number(priceRaw) : null,
      target_amount: targetRaw ? Number(targetRaw) : null,
      raised_amount: raisedRaw ? Number(raisedRaw) : 0,
    })
    .eq('id', id)
    .eq('owner_id', userId);

  revalidatePath('/dashboard');
}

export async function deleteItemAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id'));
  const { supabase, userId } = await requireUserId();

  await supabase.from('wishlist_items').delete().eq('id', id).eq('owner_id', userId);

  revalidatePath('/dashboard');
}
