import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AddItemForm } from '@/components/AddItemForm';
import { updateItemAction, deleteItemAction } from './actions';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: items } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="card">
        <h2>Добавить хотелку</h2>
        <p className="hint">Вставьте ссылку на товар — подтянем название, картинку и цену, если найдём.</p>
        <AddItemForm />
      </div>

      <h2 style={{ marginTop: 28 }}>Мои хотелки</h2>
      {(!items || items.length === 0) && <p className="hint">Пока пусто.</p>}

      {items?.map((item) => (
        <form key={item.id} className="dashboard-item" action={updateItemAction}>
          <input type="hidden" name="id" value={item.id} />
          {item.image_url ? (
            <Image src={item.image_url} alt="" width={80} height={80} unoptimized />
          ) : (
            <div />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input type="text" name="title" defaultValue={item.title ?? ''} placeholder="Название" />
            <input
              type="text"
              name="description"
              defaultValue={item.description ?? ''}
              placeholder="Описание"
            />
            <div className="row-gap">
              <input
                type="number"
                step="0.01"
                name="price"
                defaultValue={item.price ?? ''}
                placeholder="Цена"
                style={{ width: 100 }}
              />
              <input
                type="number"
                step="0.01"
                name="target_amount"
                defaultValue={item.target_amount ?? ''}
                placeholder="Цель сбора"
                style={{ width: 120 }}
              />
              <input
                type="number"
                step="0.01"
                name="raised_amount"
                defaultValue={item.raised_amount ?? 0}
                placeholder="Собрано"
                style={{ width: 100 }}
              />
            </div>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hint">
              Ссылка на товар
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button type="submit" className="secondary">
              Сохранить
            </button>
            <button type="submit" formAction={deleteItemAction} className="danger">
              Удалить
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
