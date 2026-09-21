/* ===========================================================================
   Собирает статические страницы для поисковиков из js/data.js:
     books/<id>.html   — отдельная страница каждой книги
     books/index.html  — список всех книг обычными ссылками
     sitemap.xml, robots.txt

   Каталог на главной рисуется скриптом, и Яндекс такие книги почти не
   видит. Отдельная страница с названием в заголовке — то, что находится
   по запросу «<название книги> купить».

   Запуск после любой правки BOOKS в js/data.js:
     node tools/build-pages.mjs
   =========================================================================== */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const code = readFileSync(join(root, 'js/data.js'), 'utf8');
const { STORE_CONFIG, CATEGORIES, PUBLISHERS, BOOKS } = vm.runInNewContext(
  `${code}\n;({ STORE_CONFIG, CATEGORIES, PUBLISHERS, BOOKS })`
);

// Адрес сайта со слешем на конце. При переходе на свой домен меняется здесь
// и в STORE_CONFIG.siteUrl.
const SITE = STORE_CONFIG.siteUrl.replace(/\/?$/, '/');
const today = new Date().toISOString().slice(0, 10);

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const price = (value) => `${value.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} ₽`;
const label = (list, id) => (list.find((item) => item.id === id) || {}).label;

function orderLink(book) {
  const text = `Здравствуйте! Хочу заказать книгу «${book.title}» (${price(book.price)}) с сайта Badr Magazin.`;
  return `https://wa.me/${STORE_CONFIG.phone}?text=${encodeURIComponent(text)}`;
}

function head({ title, description, url, image, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="../assets/images/favicon.ico?v=2" sizes="any">
<link rel="apple-touch-icon" href="../assets/images/apple-touch-icon.png?v=2">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="Badr Magazin">
<meta name="theme-color" content="#128099">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
</head>
<body>

<header class="masthead">
  <div class="shell masthead__inner">
    <a href="../index.html" class="masthead__branding">
      <img class="masthead__logo" src="../assets/images/logo.png" alt="Badr Magazin" width="515" height="233">
    </a>
    <a class="btn btn--line pagehead__back" href="../index.html#catalog">Весь каталог</a>
  </div>
</header>
`;
}

function foot() {
  return `
<footer class="colophon">
  <div class="shell colophon__inner">
    <span>© Badr Magazin · Издательский Дом «BadrBook»</span>
    <span>${esc(STORE_CONFIG.address)} · ${esc(STORE_CONFIG.phoneDisplay)}</span>
  </div>
</footer>

<script src="../js/data.js"></script>
<script src="../js/analytics.js"></script>
</body>
</html>
`;
}

const breadcrumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item
  }))
});

function bookPage(book) {
  const url = `${SITE}books/${book.id}.html`;
  const image = SITE + book.image;
  const category = label(CATEGORIES, book.category);
  const publisher = label(PUBLISHERS, book.publisher);
  const about = book.about || book.description || '';
  const byAuthor = book.author ? `, ${book.author}` : '';

  const title = `${book.title}${byAuthor} — купить книгу | Badr Magazin`;
  const description = `Купить книгу «${book.title}»${byAuthor} за ${price(book.price)}. ${about} Исламские книги на русском с доставкой по всей России — Badr Magazin, Хасавюрт.`;

  const specs = [
    ['Автор', book.author],
    ['Раздел', category],
    ['Издательство', publisher],
    ['Переплёт', book.binding],
    ['Год издания', book.year],
    ['Страниц', book.pages]
  ].filter(([, value]) => value);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Book', 'Product'],
        name: book.title,
        ...(book.author && { author: { '@type': 'Person', name: book.author } }),
        ...(publisher && { publisher: { '@type': 'Organization', name: publisher } }),
        ...(book.pages && { numberOfPages: book.pages }),
        ...(book.year && { datePublished: String(book.year) }),
        inLanguage: 'ru',
        image,
        description: about,
        url,
        offers: {
          '@type': 'Offer',
          price: book.price,
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
          url,
          seller: { '@type': 'BookStore', name: 'Badr Magazin' }
        }
      },
      breadcrumbs([
        ['Badr Magazin', SITE],
        ['Все книги', `${SITE}books/`],
        [book.title, url]
      ])
    ]
  };

  const related = BOOKS.filter((other) => other.category === book.category && other.id !== book.id).slice(0, 6);

  return `${head({ title, description, url, image, jsonLd })}
<main class="band bookpage">
  <div class="shell">
    <nav class="bookpage__crumbs" aria-label="Навигация">
      <a href="../index.html">Главная</a> / <a href="index.html">Все книги</a> / <span>${esc(book.title)}</span>
    </nav>

    <article class="bookpage__grid">
      <img class="bookpage__cover" src="../${esc(book.image)}" alt="Обложка книги «${esc(book.title)}»" width="215" height="301">

      <div>
        <p class="sheet__kind">${esc(category || 'Книга')}</p>
        <h1 class="bookpage__title">${esc(book.title)}</h1>
        ${book.author ? `<p class="sheet__author">${esc(book.author)}</p>` : ''}
        ${about ? `<p class="sheet__about">${esc(about)}</p>` : ''}

        <dl class="specs">
${specs
  .map(
    ([name, value]) =>
      `          <div class="spec"><dt class="spec__label">${esc(name)}</dt><dd class="spec__value">${esc(value)}</dd></div>`
  )
  .join('\n')}
        </dl>

        <p class="sheet__price bookpage__price">${price(book.price)}</p>
        <div class="bookpage__actions">
          <a class="btn btn--solid btn--lg" href="${esc(orderLink(book))}" target="_blank" rel="noopener">Заказать в WhatsApp</a>
          <a class="btn btn--line btn--lg" href="../index.html?book=${esc(book.id)}#catalog">Положить в корзину</a>
        </div>
        <p class="bookpage__note">Доставка по всей России и по миру, самовывоз в Хасавюрте. Розница от одной книги, опт от 5000 ₽.</p>
      </div>
    </article>
${
  related.length
    ? `
    <section class="bookpage__related">
      <h2 class="band-title">Ещё в разделе «${esc(category)}»</h2>
      <ul class="bookpage__list">
${related.map((other) => `        <li><a href="${esc(other.id)}.html">${esc(other.title)}</a> — ${price(other.price)}</li>`).join('\n')}
      </ul>
    </section>`
    : ''
}
  </div>
</main>
${foot()}`;
}

function listPage() {
  const url = `${SITE}books/`;
  const title = 'Все исламские книги на русском — каталог Badr Magazin';
  const description = `Каталог Badr Magazin: ${BOOKS.length} книг — Коран, тафсиры, хадисы, акыда и фикх, психология, семья, сира, детские книги. Издательство BadrBook и партнёры. Доставка по всей России.`;

  const sections = CATEGORIES.filter((category) => category.id !== 'all')
    .map((category) => [category, BOOKS.filter((book) => book.category === category.id)])
    .filter(([, books]) => books.length);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: title,
        url,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: BOOKS.map((book, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE}books/${book.id}.html`,
            name: book.title
          }))
        }
      },
      breadcrumbs([
        ['Badr Magazin', SITE],
        ['Все книги', url]
      ])
    ]
  };

  return `${head({ title, description, url, image: `${SITE}assets/images/logo.jpg`, jsonLd })}
<main class="band bookpage">
  <div class="shell">
    <nav class="bookpage__crumbs" aria-label="Навигация">
      <a href="../index.html">Главная</a> / <span>Все книги</span>
    </nav>
    <h1 class="bookpage__title">Исламские книги на русском языке</h1>
    <p class="sheet__about">Все книги Badr Magazin — магазина Издательского Дома «BadrBook» в Хасавюрте. Доставка по всей России и по миру.</p>
${sections
  .map(
    ([category, books]) => `
    <section class="bookpage__related">
      <h2 class="band-title">${esc(category.label)}</h2>
      <ul class="bookpage__list">
${books.map((book) => `        <li><a href="${esc(book.id)}.html">${esc(book.title)}</a>${book.author ? ` · ${esc(book.author)}` : ''} — ${price(book.price)}</li>`).join('\n')}
      </ul>
    </section>`
  )
  .join('\n')}
  </div>
</main>
${foot()}`;
}

const booksDir = join(root, 'books');
mkdirSync(booksDir, { recursive: true });

// Страницы снятых с продажи книг удаляем, чтобы в поиске не висели пустые.
for (const file of readdirSync(booksDir)) {
  if (file.endsWith('.html')) unlinkSync(join(booksDir, file));
}

for (const book of BOOKS) {
  writeFileSync(join(booksDir, `${book.id}.html`), bookPage(book));
}
writeFileSync(join(booksDir, 'index.html'), listPage());

const urls = [
  [SITE, '1.0'],
  [`${SITE}books/`, '0.9'],
  ...BOOKS.map((book) => [`${SITE}books/${book.id}.html`, '0.8'])
];

writeFileSync(
  join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, priority]) => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`
);

writeFileSync(
  join(root, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE}sitemap.xml
`
);

console.log(`Готово: ${BOOKS.length} страниц книг, список, sitemap.xml, robots.txt`);
