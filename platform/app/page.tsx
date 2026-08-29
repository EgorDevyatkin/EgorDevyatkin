import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="card">
      <h2>Личный вишлист с прогрессом донатов</h2>
      <p>
        Заведите аккаунт, добавляйте хотелки просто вставив ссылку на товар —
        мы сами подтянем название, картинку и описание. У каждой хотелки свой
        прогресс-бар, чтобы гости видели, сколько уже собрано.
      </p>
      <div className="row-gap">
        <Link className="btn" href="/register">
          Создать аккаунт
        </Link>
        <Link className="btn secondary" href="/login">
          Войти
        </Link>
      </div>
    </div>
  );
}
