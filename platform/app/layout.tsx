import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata: Metadata = {
  title: 'Вишлист',
  description: 'Личные вишлисты с прогрессом донатов.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let handle: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('handle')
      .eq('id', user.id)
      .single();
    handle = profile?.handle ?? null;
  }

  return (
    <html lang="ru">
      <body>
        <div className="wrap">
          <header className="site-header">
            <Link href="/">
              <h1>Вишлист</h1>
            </Link>
            <nav className="site-nav">
              {user ? (
                <>
                  {handle && <Link href={`/u/${handle}`}>Моя страница</Link>}
                  <Link href="/dashboard">Личный кабинет</Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login">Войти</Link>
                  <Link href="/register">Регистрация</Link>
                </>
              )}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
