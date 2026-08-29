import * as cheerio from 'cheerio';

export type LinkMetadata = {
  title: string;
  description: string;
  imageUrl: string | null;
  price: number | null;
  currency: string;
};

function toAbsolute(url: string, base: string): string {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(',', '.');
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; WishlistBot/1.0; +https://egordevyatkin.github.io)',
        Accept: 'text/html',
      },
    });

    if (!res.ok) {
      throw new Error(`Страница ответила статусом ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const meta = (name: string) =>
      $(`meta[property="${name}"]`).attr('content') ?? $(`meta[name="${name}"]`).attr('content');

    const title = meta('og:title') || $('title').first().text().trim() || url;
    const description = meta('og:description') || meta('description') || '';
    const rawImage = meta('og:image') || meta('twitter:image');
    const imageUrl = rawImage ? toAbsolute(rawImage, url) : null;

    const price =
      parsePrice(meta('product:price:amount')) ??
      parsePrice(meta('og:price:amount')) ??
      parsePrice($('[itemprop="price"]').attr('content') || $('[itemprop="price"]').text());
    const currency = meta('product:price:currency') || meta('og:price:currency') || 'RUB';

    return { title: title.slice(0, 200), description: description.slice(0, 500), imageUrl, price, currency };
  } finally {
    clearTimeout(timeout);
  }
}
