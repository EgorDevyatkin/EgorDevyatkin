import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ProgressBar } from '@/components/ProgressBar';

export default async function PublicWishlistPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, handle, first_name, last_name')
    .eq('handle', handle)
    .single();

  if (!profile) notFound();

  const { data: items } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('owner_id', profile.id)
    .order('created_at', { ascending: false });

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.handle;

  return (
    <div>
      <h2>Вишлист {displayName}</h2>
      {(!items || items.length === 0) && <p className="hint">Пока пусто.</p>}

      <div className="wishlist-grid">
        {items?.map((item) => (
          <div key={item.id} className="item-card">
            {item.image_url && <Image src={item.image_url} alt={item.title} width={400} height={150} unoptimized />}
            <div className="body">
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
              {item.price != null && (
                <p className="price">
                  {Number(item.price).toLocaleString('ru-RU')} {item.currency}
                </p>
              )}
              <ProgressBar raised={Number(item.raised_amount)} target={item.target_amount ? Number(item.target_amount) : null} />
              <a className="btn secondary" href={item.url} target="_blank" rel="noopener noreferrer">
                Открыть товар
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
