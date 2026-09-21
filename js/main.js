/* Рендер каталога, корзина и интерактив. Данные живут в data.js — здесь их нет. */

const WHATSAPP_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01c-1.48 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.21 8.21z"/></svg>';

const CART_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1.1 12.2a1 1 0 0 1-1 .8H8.1a1 1 0 0 1-1-.8L6 7z"/><path d="M9.5 7V5.6a2.5 2.5 0 0 1 5 0V7"/></svg>';

const TRASH_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 7h15M10 11v5.5M14 11v5.5M6.5 7l.9 12.1a1 1 0 0 0 1 .9h7.2a1 1 0 0 0 1-.9L17.5 7M9.5 7V4.8a.8.8 0 0 1 .8-.8h3.4a.8.8 0 0 1 .8.8V7"/></svg>';

/* Состав корзины и данные покупателя лежат в localStorage — заказ
   переживает перезагрузку, а форму не нужно заполнять заново. */
const CART_KEY = 'badr-cart-v1';
const CHECKOUT_KEY = 'badr-checkout-v1';
const MAX_QTY = 99;
const DELIVERY_METHODS = ['Почта России', 'СДЭК', 'Озон'];

const catalogGrid = document.getElementById('catalog-grid');
const filterBar = document.getElementById('catalog-filters');
const publisherBar = document.getElementById('publisher-filters');
const catalogCount = document.getElementById('catalog-count');

const bookSheet = document.getElementById('book-sheet');
const sheetCover = document.getElementById('sheet-cover');
const sheetKind = document.getElementById('sheet-kind');
const sheetTitle = document.getElementById('sheet-title');
const sheetAuthor = document.getElementById('sheet-author');
const sheetAbout = document.getElementById('sheet-about');
const sheetSpecs = document.getElementById('sheet-specs');
const sheetPrice = document.getElementById('sheet-price');
const sheetCart = document.getElementById('sheet-cart');

const cartButton = document.getElementById('cart-open');
const cartBadge = document.getElementById('cart-count');
const drawer = document.getElementById('cart');
const cartList = document.getElementById('cart-list');
const cartCheckout = document.getElementById('cart-checkout');
const cartForm = document.getElementById('cart-form');
const cartFoot = document.getElementById('cart-foot');
const cartTotal = document.getElementById('cart-total');
const cartOrder = document.getElementById('cart-order');
const cartClear = document.getElementById('cart-clear');

const checkoutName = document.getElementById('checkout-name');
const checkoutPhone = document.getElementById('checkout-phone');
const checkoutAddress = document.getElementById('checkout-address');
const checkoutDeliveryInputs = Array.from(
  document.querySelectorAll('#checkout-delivery input[name="delivery"]')
);

let activeCategory = 'all';
let activePublisher = 'all';
let activeQuery = '';
let activePage = 1;
const PAGE_SIZE = 20;
const catalogPager = document.getElementById('catalog-pager');
const cart = new Map();

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Цена в data.js хранится числом, а показывается по-русски:
   2200 → «2 200 ₽», с неразрывным пробелом перед знаком рубля. */
function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')}\u00A0${STORE_CONFIG.currency}`;
}

function plural(count, forms) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

function bookById(id) {
  return BOOKS.find((book) => book.id === id);
}

function categoryLabel(id) {
  const found = CATEGORIES.find((category) => category.id === id);
  return found ? found.label : '';
}

function publisherLabel(id) {
  const found = PUBLISHERS.find((publisher) => publisher.id === id);
  return found ? found.label : '';
}

function buildWhatsAppLink() {
  const text = 'Здравствуйте! Пишу с сайта Badr Magazin — хочу задать вопрос по книгам.';
  return `https://wa.me/${STORE_CONFIG.phone}?text=${encodeURIComponent(text)}`;
}

/* Заказ уходит одним сообщением: список книг, итог и данные покупателя —
   продавцу этого достаточно, чтобы сразу оформить доставку. */
function buildOrderLink(entries, customer) {
  const total = entries.reduce((sum, entry) => sum + entry.qty * entry.book.price, 0);
  const lines = entries.map(
    (entry, index) =>
      `${index + 1}. «${entry.book.title}» — ${entry.qty} шт. × ${formatPrice(
        entry.book.price
      )} = ${formatPrice(entry.qty * entry.book.price)}`
  );

  const parts = [
    'Здравствуйте! Заказ с сайта Badr Magazin:',
    lines.join('\n'),
    '',
    `Итого: ${formatPrice(total)}`,
    '',
    `Имя: ${customer.name}`,
    `Телефон: ${customer.phone}`,
    `Способ доставки: ${customer.delivery}`,
    `Адрес доставки: ${customer.address}`
  ];

  return `https://wa.me/${STORE_CONFIG.phone}?text=${encodeURIComponent(parts.join('\n'))}`;
}

/* Каталог ---------------------------------------------------------------- */

function stepperMarkup(id, title, qty) {
  return (
    `<div class="stepper" role="group" aria-label="Количество: «${title}»">` +
    `<button class="stepper__btn" type="button" data-dec="${id}" aria-label="Убрать одну книгу «${title}»">−</button>` +
    `<span class="stepper__value">${qty}</span>` +
    `<button class="stepper__btn" type="button" data-inc="${id}" aria-label="Добавить ещё одну книгу «${title}»">+</button>` +
    '</div>'
  );
}

/* Пока книги нет в корзине — кнопка «В корзину», дальше — «− 1 +». */
function cartControlMarkup(book) {
  const id = escapeHtml(book.id);
  const title = escapeHtml(book.title);
  const qty = cart.get(book.id) || 0;

  if (qty === 0) {
    return `<button class="btn btn--solid book__add" type="button" data-add="${id}" aria-label="Добавить «${title}» в корзину">${CART_ICON}В корзину</button>`;
  }
  return stepperMarkup(id, title, qty);
}

function renderFilters() {
  filterBar.innerHTML = CATEGORIES.map(
    (category) =>
      `<button type="button" class="filter" data-category="${category.id}" aria-pressed="${
        category.id === activeCategory
      }">${escapeHtml(category.label)}</button>`
  ).join('');

  publisherBar.innerHTML = PUBLISHERS.map(
    (publisher) =>
      `<button type="button" class="filter" data-publisher="${publisher.id}" aria-pressed="${
        publisher.id === activePublisher
      }">${escapeHtml(publisher.label)}</button>`
  ).join('');
}

function normalize(text) {
  return String(text || '').toLowerCase().replace(/ё/g, 'е');
}

function matchesQuery(book) {
  if (!activeQuery) return true;
  const haystack = normalize(`${book.title} ${book.author || ''} ${book.description}`);
  return activeQuery.split(/\s+/).every((word) => haystack.includes(word));
}

function renderPager(pageCount) {
  catalogPager.hidden = pageCount < 2;
  if (pageCount < 2) {
    catalogPager.innerHTML = '';
    return;
  }

  const pages = [];
  for (let page = 1; page <= pageCount; page += 1) {
    pages.push(
      `<button type="button" class="filter" data-page="${page}" aria-label="Страница ${page}"${
        page === activePage ? ' aria-pressed="true" aria-current="page"' : ' aria-pressed="false"'
      }>${page}</button>`
    );
  }

  catalogPager.innerHTML =
    `<button type="button" class="filter" data-page="${activePage - 1}" aria-label="Предыдущая страница"${
      activePage === 1 ? ' disabled' : ''
    }>←</button>` +
    pages.join('') +
    `<button type="button" class="filter" data-page="${activePage + 1}" aria-label="Следующая страница"${
      activePage === pageCount ? ' disabled' : ''
    }>→</button>`;
}

function renderBooks() {
  const visible = BOOKS.filter(
    (book) =>
      (activeCategory === 'all' || book.category === activeCategory) &&
      (activePublisher === 'all' || book.publisher === activePublisher) &&
      matchesQuery(book)
  );

  catalogCount.textContent =
    visible.length === 0
      ? ''
      : `${visible.length} ${plural(visible.length, ['книга', 'книги', 'книг'])}`;

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  activePage = Math.min(activePage, pageCount);
  renderPager(pageCount);

  if (visible.length === 0) {
    catalogGrid.innerHTML = activeQuery
      ? '<p class="shelf__empty">По вашему запросу ничего не нашлось. Напишите нам — подскажем, есть ли книга в наличии.</p>'
      : '<p class="shelf__empty">В этом разделе пока пусто. Напишите нам — подскажем, что есть в наличии.</p>';
    return;
  }

  catalogGrid.innerHTML = visible
    .slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE)
    .map(
      (book) => `
      <li class="book">
        <img class="book__cover" src="${escapeHtml(book.image)}" alt="Обложка книги «${escapeHtml(
        book.title
      )}»" loading="lazy" width="215" height="301">
        <p class="book__kind">${escapeHtml(categoryLabel(book.category))}</p>
        <h3 class="book__title"><button class="book__open" type="button" data-book="${escapeHtml(
          book.id
        )}">${escapeHtml(book.title)}</button></h3>
        <p class="book__note">${escapeHtml(book.description)}</p>
        <div class="book__foot">
          <span class="book__price">${escapeHtml(formatPrice(book.price))}</span>
          <div class="book__cart" data-id="${escapeHtml(book.id)}">${cartControlMarkup(book)}</div>
        </div>
      </li>`
    )
    .join('');
}

/* Меняем только изменившуюся карточку: если книга уже в корзине — правим
   одну цифру, иначе при каждом «+» терялся бы фокус на кнопке.
   Одна книга может быть на экране дважды — на полке и в открытой
   карточке, поэтому обновляем оба места. */
function updateCardControl(id) {
  const book = bookById(id);
  if (!book) return;

  const qty = cart.get(id) || 0;

  document.querySelectorAll(`.book__cart[data-id="${id}"]`).forEach((holder) => {
    const value = holder.querySelector('.stepper__value');
    if (qty > 0 && value) {
      value.textContent = String(qty);
      return;
    }

    const hadFocus = holder.contains(document.activeElement);
    holder.innerHTML = cartControlMarkup(book);
    if (hadFocus) {
      const next = holder.querySelector('[data-inc]') || holder.querySelector('button');
      if (next) next.focus();
    }
  });
}

/* Категория и издательство сужают полку вместе: выбор в одной строке
   не сбрасывает выбор в другой. */
function bindFilterBar(bar, key, onPick) {
  bar.addEventListener('click', (event) => {
    const button = event.target.closest('.filter');
    if (!button) return;
    const picked = button.dataset[key];
    onPick(picked);
    activePage = 1;
    bar.querySelectorAll('.filter').forEach((item) => {
      item.setAttribute('aria-pressed', String(item.dataset[key] === picked));
    });
    renderBooks();
  });
}

catalogPager.addEventListener('click', (event) => {
  const button = event.target.closest('[data-page]');
  if (!button || button.disabled) return;
  activePage = Number(button.dataset.page);
  renderBooks();
  document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
});

bindFilterBar(filterBar, 'category', (picked) => {
  activeCategory = picked;
});

bindFilterBar(publisherBar, 'publisher', (picked) => {
  activePublisher = picked;
});

/* Карточка книги ---------------------------------------------------------
   Открывается кликом по книге на полке и показывает то, что в полку не
   влезает: автора, издательство, переплёт, год. Кнопка «В корзину» внутри —
   та же самая, поэтому количество здесь и на полке всегда сходится. */

let sheetTimer = 0;
let sheetOpener = null;

function specMarkup(label, value) {
  return (
    '<div class="spec">' +
    `<dt class="spec__label">${label}</dt>` +
    `<dd class="spec__value">${escapeHtml(value)}</dd>` +
    '</div>'
  );
}

function openBook(id) {
  const book = bookById(id);
  if (!book) return;

  sheetCover.src = book.image;
  sheetCover.alt = `Обложка книги «${book.title}»`;
  sheetKind.textContent = categoryLabel(book.category);
  sheetTitle.textContent = book.title;
  sheetAuthor.textContent = book.author || '';
  sheetAuthor.hidden = !book.author;
  sheetAbout.textContent = book.about || book.description;
  sheetPrice.textContent = formatPrice(book.price);

  sheetSpecs.innerHTML = [
    ['Издательство', publisherLabel(book.publisher)],
    ['Переплёт', book.binding],
    ['Год издания', book.year],
    ['Страниц', book.pages]
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => specMarkup(label, String(value)))
    .join('');

  sheetCart.dataset.id = book.id;
  sheetCart.innerHTML = cartControlMarkup(book);

  // Куда вернуть фокус после закрытия — на ту книгу, с которой пришли.
  sheetOpener = document.activeElement;

  window.clearTimeout(sheetTimer);
  bookSheet.hidden = false;
  document.body.style.overflow = 'hidden';
  window.requestAnimationFrame(() => {
    bookSheet.dataset.open = 'true';
  });
  bookSheet.querySelector('.sheet__close').focus();
}

function closeBook() {
  if (bookSheet.hidden) return;

  bookSheet.dataset.open = 'false';
  document.body.style.overflow = '';
  sheetTimer = window.setTimeout(() => {
    if (bookSheet.dataset.open === 'false') bookSheet.hidden = true;
  }, 340);

  if (sheetOpener && sheetOpener.isConnected) sheetOpener.focus();
  sheetOpener = null;
}

catalogGrid.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-book]');
  if (trigger) openBook(trigger.dataset.book);
});

bookSheet.addEventListener('click', (event) => {
  if (event.target.closest('[data-sheet-close]')) {
    closeBook();
    return;
  }
  handleCartClick(event);
});

/* Корзина ----------------------------------------------------------------- */

function loadCart() {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.keys(saved).forEach((id) => {
      const qty = Math.floor(Number(saved[id]));
      if (bookById(id) && Number.isFinite(qty) && qty > 0) {
        cart.set(id, Math.min(qty, MAX_QTY));
      }
    });
  } catch (error) {
    // Приватный режим или запрет хранилища: работаем без сохранения.
  }
}

function saveCart() {
  try {
    const plain = {};
    cart.forEach((qty, id) => {
      plain[id] = qty;
    });
    window.localStorage.setItem(CART_KEY, JSON.stringify(plain));
  } catch (error) {
    // Не смогли сохранить — корзина всё равно работает до перезагрузки.
  }
}

function cartEntries() {
  const entries = [];
  cart.forEach((qty, id) => {
    const book = bookById(id);
    if (book) entries.push({ book, qty });
  });
  return entries;
}

function cartRowMarkup(entry) {
  const id = escapeHtml(entry.book.id);
  const title = escapeHtml(entry.book.title);

  return `
    <li class="cart-row" data-row="${id}">
      <img class="cart-row__cover" src="${escapeHtml(
        entry.book.image
      )}" alt="" width="54" height="76" loading="lazy">
      <div>
        <p class="cart-row__title">${title}</p>
        <p class="cart-row__price">${escapeHtml(formatPrice(entry.book.price))} за книгу</p>
        <div class="cart-row__controls">
          ${stepperMarkup(id, title, entry.qty)}
          <span class="cart-row__sum">${escapeHtml(
            formatPrice(entry.qty * entry.book.price)
          )}</span>
        </div>
      </div>
      <button class="cart-row__remove" type="button" data-remove="${id}" aria-label="Убрать «${title}» из корзины">${TRASH_ICON}</button>
    </li>`;
}

const CART_EMPTY_MARKUP = `
  <li class="cart-empty">
    <p class="cart-empty__text">Корзина пока пуста. Добавьте книги из каталога — соберём заказ в один список и отправим его в WhatsApp.</p>
    <a class="btn btn--line" href="#catalog" data-cart-close>Перейти к каталогу</a>
  </li>`;

/* changedId — подсказка: если строка в корзине уже нарисована и книга из неё
   не исчезла, обновляем в ней только число и сумму, без перерисовки списка. */
function renderCart(changedId) {
  const entries = cartEntries();
  const count = entries.reduce((sum, entry) => sum + entry.qty, 0);
  const total = entries.reduce((sum, entry) => sum + entry.qty * entry.book.price, 0);

  cartBadge.textContent = String(count);
  cartBadge.dataset.empty = String(count === 0);
  cartButton.setAttribute(
    'aria-label',
    count === 0
      ? 'Корзина пуста'
      : `Корзина: ${count} ${plural(count, ['книга', 'книги', 'книг'])}`
  );

  cartTotal.textContent = formatPrice(total);
  cartFoot.hidden = entries.length === 0;
  cartCheckout.hidden = entries.length === 0;

  if (changedId) {
    const row = cartList.querySelector(`[data-row="${changedId}"]`);
    const book = bookById(changedId);
    const qty = cart.get(changedId) || 0;
    if (row && book && qty > 0) {
      row.querySelector('.stepper__value').textContent = String(qty);
      row.querySelector('.cart-row__sum').textContent = formatPrice(qty * book.price);
      return;
    }
  }

  cartList.innerHTML = entries.length
    ? entries.map(cartRowMarkup).join('')
    : CART_EMPTY_MARKUP;
}

function bumpCartButton() {
  cartButton.classList.remove('is-bumped');
  // Перезапуск анимации: без чтения layout класс вернётся в том же кадре.
  void cartButton.offsetWidth;
  cartButton.classList.add('is-bumped');
}

function changeQty(id, qty) {
  if (!bookById(id)) return;

  const before = cart.get(id) || 0;
  const next = Math.max(0, Math.min(Math.floor(qty), MAX_QTY));
  if (next === before) return;

  if (next === 0) cart.delete(id);
  else cart.set(id, next);

  saveCart();
  updateCardControl(id);
  renderCart(id);
  if (next > before) bumpCartButton();
}

/* Один обработчик на каталог и на корзину: кнопки в них одинаковые. */
function handleCartClick(event) {
  const node = event.target.closest('[data-add], [data-inc], [data-dec], [data-remove]');
  if (!node) return;

  if (node.dataset.remove) {
    changeQty(node.dataset.remove, 0);
    return;
  }

  const id = node.dataset.add || node.dataset.inc || node.dataset.dec;
  const current = cart.get(id) || 0;
  changeQty(id, node.dataset.dec ? current - 1 : current + 1);
}

catalogGrid.addEventListener('click', handleCartClick);
cartClear.addEventListener('click', () => {
  const ids = Array.from(cart.keys());
  cart.clear();
  saveCart();
  ids.forEach(updateCardControl);
  renderCart();
});

cartButton.addEventListener('animationend', () => {
  cartButton.classList.remove('is-bumped');
});

/* Форма доставки ----------------------------------------------------------
   Имя, телефон, адрес и способ доставки запоминаются в этом браузере,
   чтобы постоянному покупателю не вводить их заново при следующем заказе. */

function loadCheckout() {
  try {
    const raw = window.localStorage.getItem(CHECKOUT_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);

    if (typeof saved.name === 'string') checkoutName.value = saved.name;
    if (typeof saved.phone === 'string') checkoutPhone.value = saved.phone;
    if (typeof saved.address === 'string') checkoutAddress.value = saved.address;
    if (DELIVERY_METHODS.includes(saved.delivery)) {
      const match = checkoutDeliveryInputs.find((input) => input.value === saved.delivery);
      if (match) match.checked = true;
    }
  } catch (error) {
    // Приватный режим или запрет хранилища: форма просто останется пустой.
  }

  syncDeliveryClasses();
}

function saveCheckout() {
  try {
    const delivery = checkoutDeliveryInputs.find((input) => input.checked);
    window.localStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify({
        name: checkoutName.value,
        phone: checkoutPhone.value,
        address: checkoutAddress.value,
        delivery: delivery ? delivery.value : ''
      })
    );
  } catch (error) {
    // Не смогли сохранить — форму придётся заполнить заново в следующий раз.
  }
}

/* Подсвечиваем выбранный способ доставки классом: так же однозначно
   работает в любом браузере, без опоры на CSS-селектор :has(). */
function syncDeliveryClasses() {
  checkoutDeliveryInputs.forEach((input) => {
    input.closest('.radio').classList.toggle('is-checked', input.checked);
  });
}

[checkoutName, checkoutPhone, checkoutAddress].forEach((field) => {
  field.addEventListener('input', saveCheckout);
});

checkoutDeliveryInputs.forEach((input) => {
  input.addEventListener('change', () => {
    syncDeliveryClasses();
    document.getElementById('checkout-delivery').classList.remove('is-invalid');
    saveCheckout();
  });
});

cartForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const entries = cartEntries();
  if (entries.length === 0) return;

  cartForm.classList.add('was-submitted');
  const deliveryChosen = checkoutDeliveryInputs.some((input) => input.checked);
  document.getElementById('checkout-delivery').classList.toggle('is-invalid', !deliveryChosen);

  if (!cartForm.checkValidity()) {
    cartForm.reportValidity();
    return;
  }

  const customer = {
    name: checkoutName.value.trim(),
    phone: checkoutPhone.value.trim(),
    address: checkoutAddress.value.trim(),
    delivery: checkoutDeliveryInputs.find((input) => input.checked).value
  };

  saveCheckout();
  window.open(buildOrderLink(entries, customer), '_blank', 'noopener');
});

/* Панель корзины ---------------------------------------------------------- */

let drawerTimer = 0;

function openCart() {
  window.clearTimeout(drawerTimer);
  drawer.hidden = false;
  document.body.style.overflow = 'hidden';
  // Ждём кадр, иначе панель появится сразу, без выезда.
  window.requestAnimationFrame(() => {
    drawer.dataset.open = 'true';
  });
  const close = drawer.querySelector('.drawer__close');
  if (close) close.focus();
}

function closeCart() {
  if (drawer.hidden) return;
  drawer.dataset.open = 'false';
  document.body.style.overflow = '';
  drawerTimer = window.setTimeout(() => {
    if (drawer.dataset.open === 'false') drawer.hidden = true;
  }, 340);
  cartButton.focus();
}

cartButton.addEventListener('click', openCart);

drawer.addEventListener('click', (event) => {
  if (event.target.closest('[data-cart-close]')) {
    closeCart();
    return;
  }
  handleCartClick(event);
});

/* Одновременно открыт только один диалог: либо карточка книги, либо
   корзина. Escape закрывает его, Tab ходит по кругу внутри него. */
function openDialog() {
  if (!bookSheet.hidden) return { node: bookSheet, close: closeBook };
  if (!drawer.hidden) return { node: drawer, close: closeCart };
  return null;
}

document.addEventListener('keydown', (event) => {
  const dialog = openDialog();
  if (!dialog) return;

  if (event.key === 'Escape') {
    dialog.close();
    return;
  }

  if (event.key !== 'Tab') return;
  const focusable = Array.from(
    dialog.node.querySelectorAll(
      'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((node) => node.offsetParent !== null);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* Первый экран: цифра в счётчике берётся из каталога, чтобы не разъезжалась
   с ним, и добегает до значения за секунду — это то, что цепляет взгляд. */
function fillHeroCount() {
  const value = document.getElementById('hero-count');
  const label = document.getElementById('hero-count-label');
  if (!value || !label) return;

  const total = BOOKS.length;
  label.textContent = `${plural(total, ['издание', 'издания', 'изданий'])} в каталоге`;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || total === 0) {
    value.textContent = String(total);
    return;
  }

  const duration = 900;
  const started = performance.now();

  function step(now) {
    const progress = Math.min((now - started) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    value.textContent = String(Math.round(total * eased));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* Контакты и ссылки — всё из STORE_CONFIG, один источник правды. */
function fillContacts() {
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = buildWhatsAppLink();
  });

  document.querySelectorAll('[data-telegram]').forEach((link) => {
    link.href = STORE_CONFIG.telegram;
  });

  document.querySelectorAll('[data-instagram]').forEach((link) => {
    link.href = STORE_CONFIG.instagram;
  });

  document.querySelectorAll('[data-wildberries]').forEach((link) => {
    const url = STORE_CONFIG.wildberries;
    if (!url || url === '#') {
      link.hidden = true;
      return;
    }
    link.href = url;
  });

  const phoneLink = document.getElementById('contact-phone');
  phoneLink.href = `tel:+${STORE_CONFIG.phone}`;
  phoneLink.textContent = STORE_CONFIG.phoneDisplay;

  document.getElementById('contact-address').textContent = STORE_CONFIG.address;
  document.getElementById('contact-hours').textContent = STORE_CONFIG.workingHours;

  // Карта по строке адреса, без API-ключа. Когда появится улица и дом,
  // точнее будет вставить готовый embed из «Поделиться → Встроить» в Картах.
  const query = encodeURIComponent(STORE_CONFIG.address);
  document.getElementById('contact-map').src = `https://www.google.com/maps?q=${query}&output=embed`;
  document.getElementById('map-link').href = `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/* Мобильное меню */
const burger = document.getElementById('burger');
const nav = document.getElementById('site-nav');

burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  nav.dataset.open = String(!open);
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    burger.setAttribute('aria-expanded', 'false');
    nav.dataset.open = 'false';
  }
});

/* Поиск в шапке: строка выезжает из кнопки справа налево и фильтрует
   каталог на лету, вместе с выбранным разделом и издательством. */
const search = document.getElementById('search');
const searchToggle = document.getElementById('search-toggle');
const searchInput = document.getElementById('search-input');
let searchScrolled = false;

function setSearchOpen(open) {
  search.dataset.open = String(open);
  searchToggle.setAttribute('aria-expanded', String(open));
  searchToggle.setAttribute('aria-label', open ? 'Закрыть поиск' : 'Поиск по каталогу');
  searchInput.tabIndex = open ? 0 : -1;
  if (open) {
    searchInput.focus();
    return;
  }
  if (searchInput.value) {
    searchInput.value = '';
    activeQuery = '';
    activePage = 1;
    renderBooks();
  }
  searchScrolled = false;
}

searchToggle.addEventListener('click', () => {
  setSearchOpen(search.dataset.open !== 'true');
});

searchInput.addEventListener('input', () => {
  activeQuery = normalize(searchInput.value.trim());
  activePage = 1;
  renderBooks();
  // К каталогу прокручиваем один раз за поиск, иначе страница дёргается на каждой букве.
  if (activeQuery && !searchScrolled) {
    searchScrolled = true;
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSearchOpen(false);
    searchToggle.focus();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  }
});

document.addEventListener('click', (event) => {
  if (search.dataset.open === 'true' && !searchInput.value && !search.contains(event.target)) {
    setSearchOpen(false);
  }
});

/* Кнопка «Наверх» показывается, когда первый экран остался позади. */
const toTop = document.getElementById('to-top');

function syncToTop() {
  const visible = window.scrollY > window.innerHeight * 0.8;
  toTop.dataset.visible = String(visible);
  toTop.tabIndex = visible ? 0 : -1;
}

window.addEventListener('scroll', syncToTop, { passive: true });
toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
syncToTop();

document.getElementById('year').textContent = new Date().getFullYear();

loadCart();
loadCheckout();
renderFilters();
renderBooks();
renderCart();
fillHeroCount();
fillContacts();
