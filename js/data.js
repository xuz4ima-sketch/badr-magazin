/* ===========================================================================
   ЕДИНСТВЕННЫЙ ФАЙЛ, КОТОРЫЙ НУЖНО ПРАВИТЬ ДЛЯ РЕАЛЬНОГО КОНТЕНТА.
   Ни index.html, ни styles.css, ни main.js трогать не нужно.

   Что заменить перед запуском (сейчас стоят заглушки):
     1. STORE_CONFIG.phone    — реальный номер WhatsApp
     2. STORE_CONFIG.instagram / telegram — реальные ссылки
     3. BOOKS — при новых поступлениях добавляйте книги по образцу ниже
     4. publisher — id из списка PUBLISHERS; новое издательство сначала
        добавьте в PUBLISHERS, потом ставьте книгам

   Магазин офлайн находится в Хасавюрте (Россия), поэтому все цены —
   в рублях, целыми числами, без пробелов: 1850, а не «1 850 ₽».
   Разделитель разрядов и знак ₽ сайт подставляет сам.
   =========================================================================== */

const STORE_CONFIG = {
  // Номер WhatsApp: только цифры, с кодом страны (для России — 7),
  // без «+», пробелов и скобок.
  // Отсюда собираются ВСЕ ссылки на сайте — меняется в одном месте.
  phone: '79218141414', // номер из Telegram-канала @BADRMAGAZIN

  // Как номер показывать людям в блоке контактов.
  phoneDisplay: '+7 921 814-14-14',

  telegram: 'https://t.me/BADRMAGAZIN',
  instagram: 'https://www.instagram.com/badr.magazin/',
  wildberries: '#', // TODO: вставить ссылку на страницу магазина на Wildberries

  address: 'г. Хасавюрт, ул. Гамидова, 175, Т/Ц «Грэйс», 2-й этаж (напротив «Арбата»)',
  workingHours: 'Со вторника по воскресенье, 09:00 – 19:00 (понедельник — выходной)',

  currency: '₽'
};

const CATEGORIES = [
  { id: 'all', label: 'Все книги' },
  { id: 'quran', label: 'Коран и таджвид' },
  { id: 'tafsir', label: 'Тафсиры' },
  { id: 'hadith', label: 'Хадисы' },
  { id: 'aqidah', label: 'Акыда и фикх' },
  { id: 'psychology', label: 'Психология' },
  { id: 'family', label: 'Семья' },
  { id: 'history', label: 'Сира и история' },
  { id: 'kids', label: 'Детям' }
];

const PUBLISHERS = [
  { id: 'all', label: 'Все издательства' },
  { id: 'badr-book', label: 'Badr Book' },
  { id: 'wasat-media', label: 'Wasat Media' },
  { id: 'fajr', label: 'Фаджр' },
  { id: 'dar-al-salam', label: 'Dar al-Salam' },
  { id: 'noonbook', label: 'Noonbook' }
];

/* Обложки: положите файлы в assets/images/books/ и укажите путь в image,
   например 'assets/images/books/quran-kuliev.jpg'.
   Пропорции обложки на сайте — 5:7, лучше загружать примерно 600×840 px. */
const PLACEHOLDER_COVER = 'assets/images/books/cover-placeholder.svg';

/* Книги, фото и розничные цены взяты из Telegram-канала @BADRMAGAZIN
   (посты 2025–2026 гг.). Фото — первый кадр обложки из поста, обрезанный
   под 5:7. Оптовая цена в канале ниже розничной; на сайте — розница.

   Поля книги (необязательные можно не писать — строка в карточке скроется):
     title       — как книга названа на обложке
     author      — автор или составитель (необязательно)
     category    — id из CATEGORIES
     publisher   — id из PUBLISHERS (необязательно, если неизвестно)
     binding     — «Твёрдый переплёт» или «Мягкая обложка» (необязательно)
     year, pages — год тиража и число страниц (необязательно)
     description — одна строка для карточки на полке
     about       — 2–3 предложения для окна книги (необязательно) */
const BOOKS = [
  {"id": "nachni-s-sebya", "title": "Начни с себя", "author": "Яхья ибн Ибрахим аль-Яхья", "category": "psychology", "publisher": "badr-book", "binding": "Твёрдый переплёт", "pages": 192, "price": 600, "image": "assets/images/books/nachni-s-sebya.jpg", "description": "Бестселлер BadrBook в новом оформлении: глянцевые страницы, твёрдая обложка."},
  {"id": "nashih-nravov", "title": "Наших нравов достаточно!", "category": "psychology", "publisher": "badr-book", "price": 600, "image": "assets/images/books/nashih-nravov.jpg", "description": "Из трио новых книг издательства Badr."},
  {"id": "iz-tesnoty-k-svetu", "title": "Из тесноты к свету", "category": "psychology", "publisher": "badr-book", "price": 600, "image": "assets/images/books/iz-tesnoty-k-svetu.jpg", "description": "Из трио новых книг издательства Badr."},
  {"id": "ego-vospital-allah", "title": "Его воспитал сам Аллах. Мухаммад ﷺ", "author": "Сафи ар-Рахман аль-Мубаракфури", "category": "history", "publisher": "badr-book", "pages": 528, "price": 750, "image": "assets/images/books/ego-vospital-allah.jpg", "description": "Сокращённая автором версия «Ар-Рахик аль-Махтум»."},
  {"id": "dostoinstva-proroka", "title": "Достоинства пророка Мухаммада ﷺ", "category": "history", "publisher": "badr-book", "pages": 192, "price": 450, "image": "assets/images/books/dostoinstva-proroka.jpg", "description": "Издание ИД «BadrBook»."},
  {"id": "vabil", "title": "Вабиль. Благодатный дождь", "author": "Ибн Каййим аль-Джаузийя, разъяснение шейха Ибн База", "category": "aqidah", "publisher": "fajr", "pages": 752, "price": 1600, "image": "assets/images/books/vabil.jpg", "description": "Большой формат 17×24, 752 страницы."},
  {"id": "raskrytie-yavnoy-istiny", "title": "Раскрытие явной истины о лечении припадков, колдовства и сглаза", "author": "Абдуллах ат-Тайяр, Сами аль-Мубарак", "category": "aqidah", "pages": 352, "price": 850, "image": "assets/images/books/raskrytie-yavnoy-istiny.jpg", "description": "Лечение Кораном и Сунной: сглаз, колдовство, рукья."},
  {"id": "500-voprosov-o-dzhinah", "title": "500 вопросов и ответов о джинах", "category": "aqidah", "binding": "Твёрдый переплёт", "pages": 560, "price": 1100, "image": "assets/images/books/500-voprosov-o-dzhinah.jpg", "description": "Формат «вопрос — ответ», лёгкий для понимания язык."},
  {"id": "razyasnenie-40-hadisov", "title": "Разъяснение книги «40 хадисов» ан-Навави", "category": "hadith", "price": 600, "image": "assets/images/books/razyasnenie-40-hadisov.jpg", "description": "Комментарий к сорока хадисам имама ан-Навави."},
  {"id": "dzhami-al-ulum", "title": "Джами аль-улюм. Свод знаний и мудрости", "author": "Ибн Раджаб аль-Ханбали", "category": "hadith", "publisher": "wasat-media", "binding": "Твёрдый переплёт", "price": 850, "image": "assets/images/books/dzhami-al-ulum.jpg", "description": "Классическое разъяснение пятидесяти хадисов."},
  {"id": "40-hadisov-dlya-detey", "title": "40 достоверных хадисов для детей", "category": "kids", "binding": "Твёрдый переплёт", "pages": 112, "price": 400, "image": "assets/images/books/40-hadisov-dlya-detey.jpg", "description": "Твёрдый переплёт, белая бумага."},
  {"id": "propis-korana", "title": "Пропись всего Корана", "category": "quran", "binding": "Твёрдый переплёт", "price": 1500, "image": "assets/images/books/propis-korana.jpg", "description": "Три цвета обложки, в комплекте закладка и листовки."},
  {"id": "mushaf-raduzhny", "title": "Мусхаф радужный", "category": "quran", "binding": "Твёрдый переплёт", "price": 1500, "image": "assets/images/books/mushaf-raduzhny.jpg", "description": "Формат 14×20, разноцветные листы."},
  {"id": "tafsir-ibn-kasira", "title": "Толкование Корана. Ибн Касир", "author": "Исмаил ибн Касир", "category": "tafsir", "binding": "Твёрдый переплёт", "price": 3400, "image": "assets/images/books/tafsir-ibn-kasira.jpg", "description": "Весь Коран в четырёх томах."},
  {"id": "vechny-putnik", "title": "Вечный путник с Кораном", "author": "Ахмад ибн Салих ат-Тувайан", "category": "quran", "publisher": "noonbook", "pages": 128, "price": 350, "image": "assets/images/books/vechny-putnik.jpg", "description": "Размышления о жизни рядом с Кораном."},
  {"id": "musulmanskaya-zhenshchina", "title": "Мусульманская женщина", "category": "aqidah", "price": 650, "image": "assets/images/books/musulmanskaya-zhenshchina.jpg", "description": "Фикх хиджаба, естественных кровотечений и закята с украшений."},
  {"id": "molitva-ahmad", "title": "Молитва", "author": "Имам Ахмад ибн Ханбаль, комментарии Сабри Шахина", "category": "aqidah", "binding": "Твёрдый переплёт", "pages": 111, "price": 350, "image": "assets/images/books/molitva-ahmad.jpg", "description": "Послание имама Ахмада о намазе с комментариями."},
  {"id": "kniga-nikyaha", "title": "Книга никяха", "category": "family", "pages": 224, "price": 500, "image": "assets/images/books/kniga-nikyaha.jpg", "description": "Сборник фетв о браке, разводе и правах супругов."},
  {"id": "voprosy-o-mnogozhenstve", "title": "Вопросы о многоженстве", "category": "family", "price": 400, "image": "assets/images/books/voprosy-o-mnogozhenstve.jpg", "description": "Ответы на частые вопросы о многоженстве."},
  {"id": "prorocheskiy-put-vospitaniya", "title": "Пророческий путь в воспитании детей в свете Корана и Сунны", "author": "Саид ибн Али ибн Вахф аль-Кахтани", "category": "family", "pages": 448, "price": 1000, "image": "assets/images/books/prorocheskiy-put-vospitaniya.jpg", "description": "Воспитание детей по Корану и Сунне."},
  {"id": "kachestva-pravednoy-zhenshchiny", "title": "Качества праведной женщины", "category": "family", "pages": 480, "price": 1000, "image": "assets/images/books/kachestva-pravednoy-zhenshchiny.jpg", "description": "Большая книга о нраве и качествах праведной женщины."},
  {"id": "ty-tozhe-spodvizhnitsa", "title": "Ты тоже сподвижница", "category": "family", "binding": "Твёрдый переплёт", "pages": 272, "price": 650, "image": "assets/images/books/ty-tozhe-spodvizhnitsa.jpg", "description": "Твёрдый переплёт, белая бумага."},
  {"id": "zhenskaya-revnost", "title": "Женская ревность", "author": "Хауля Дарвиш", "category": "family", "publisher": "wasat-media", "pages": 196, "price": 550, "image": "assets/images/books/zhenskaya-revnost.jpg", "description": "О ревности, её причинах и о том, как с ней жить."},
  {"id": "blagochestie-k-roditelyam", "title": "Благочестие к родителям", "category": "family", "publisher": "wasat-media", "pages": 190, "price": 550, "image": "assets/images/books/blagochestie-k-roditelyam.jpg", "description": "О праве родителей и о том, как его исполнить."},
  {"id": "pochtitelnost-k-roditelyam", "title": "Почтительность к родителям", "category": "family", "price": 600, "image": "assets/images/books/pochtitelnost-k-roditelyam.jpg", "description": "Снова в наличии."},
  {"id": "hidzhab", "title": "Хиджаб", "category": "family", "price": 600, "image": "assets/images/books/hidzhab.jpg", "description": "Снова в наличии."},
  {"id": "schastie-s-allahom", "title": "Счастье с Аллахом", "category": "psychology", "publisher": "wasat-media", "pages": 288, "price": 700, "image": "assets/images/books/schastie-s-allahom.jpg", "description": "О покое сердца рядом с Аллахом."},
  {"id": "v-teni-pravila-zhizni", "title": "В тени. Правила жизни", "category": "psychology", "publisher": "wasat-media", "pages": 201, "price": 550, "image": "assets/images/books/v-teni-pravila-zhizni.jpg", "description": "Короткие правила для каждого дня."},
  {"id": "ozarenny", "title": "Озарённый. Тоска сердца по небесам", "author": "Сулейман аль-Убуди", "category": "psychology", "publisher": "wasat-media", "pages": 192, "price": 550, "image": "assets/images/books/ozarenny.jpg", "description": "О тоске верующего сердца по Раю."},
  {"id": "bolezni-serdec", "title": "Болезни сердец и их исцеление", "category": "psychology", "publisher": "wasat-media", "price": 700, "image": "assets/images/books/bolezni-serdec.jpg", "description": "О болезнях сердца и путях их исцеления."},
  {"id": "poroki-yazyka", "title": "Пороки языка в свете Корана и Сунны", "category": "psychology", "publisher": "wasat-media", "pages": 198, "price": 550, "image": "assets/images/books/poroki-yazyka.jpg", "description": "О грехах языка и о том, как их избежать."},
  {"id": "50-svechey", "title": "50 свечей, освещающих ваш путь", "category": "psychology", "pages": 191, "price": 450, "image": "assets/images/books/50-svechey.jpg", "description": "Советы сыновьям и дочерям."},
  {"id": "desyatki-ibn-kayyima", "title": "Десятки Ибн Каййима", "category": "psychology", "publisher": "dar-al-salam", "pages": 208, "price": 550, "image": "assets/images/books/desyatki-ibn-kayyima.jpg", "description": "Наставления Ибн Каййима, собранные по десять."},
  {"id": "prichiny-i-deyaniya", "title": "Причины и деяния, умножающие награду", "category": "aqidah", "publisher": "wasat-media", "price": 600, "image": "assets/images/books/prichiny-i-deyaniya.jpg", "description": "Дела, за которые награда многократно возрастает."},
  {"id": "poleznye-pravila", "title": "Полезные правила счастливой жизни", "category": "psychology", "publisher": "wasat-media", "binding": "Твёрдый переплёт", "price": 850, "image": "assets/images/books/poleznye-pravila.jpg", "description": "Правила спокойной и счастливой жизни."},
  {"id": "raudat-al-ukalya", "title": "Раудат аль-укаля. Сад для отдыха разумных", "author": "Ибн Хиббан аль-Бусти", "category": "psychology", "publisher": "wasat-media", "binding": "Твёрдый переплёт", "price": 850, "image": "assets/images/books/raudat-al-ukalya.jpg", "description": "Классика об уме, нраве и отношениях с людьми."},
  {"id": "lyataif-al-maarif", "title": "Лятаиф аль-маариф. О временах и сезонах поклонений", "author": "Ибн Раджаб аль-Ханбали", "category": "aqidah", "publisher": "wasat-media", "binding": "Твёрдый переплёт", "price": 850, "image": "assets/images/books/lyataif-al-maarif.jpg", "description": "Поклонение по месяцам и сезонам года."},
  {"id": "minhadzh-al-kasidin", "title": "Минхадж аль-Касидин. Путь стремящихся к Аллаху", "category": "aqidah", "publisher": "wasat-media", "binding": "Твёрдый переплёт", "pages": 656, "price": 1650, "image": "assets/images/books/minhadzh-al-kasidin.jpg", "description": "Спутник на пути к Аллаху, основанный на Сунне."},
  {"id": "kitab-az-zuhd", "title": "Китаб аз-Зухд. Книга аскетизма", "category": "aqidah", "publisher": "wasat-media", "binding": "Твёрдый переплёт", "pages": 493, "price": 1450, "image": "assets/images/books/kitab-az-zuhd.jpg", "description": "О скромности в мирском и стремлении к вечному."},
  {"id": "kniga-udela", "title": "Книга удела", "category": "aqidah", "publisher": "wasat-media", "pages": 377, "price": 800, "image": "assets/images/books/kniga-udela.jpg", "description": "О предопределении и уделе человека."},
  {"id": "toska-po-ramadanu", "title": "И забилось моё сердце от тоски по Рамадану", "category": "aqidah", "price": 700, "image": "assets/images/books/toska-po-ramadanu.jpg", "description": "Книга, которая готовит сердце к Рамадану."},
  {"id": "posol-znaniy", "title": "Посол знаний и призыва", "category": "history", "binding": "Твёрдый переплёт", "pages": 560, "price": 850, "image": "assets/images/books/posol-znaniy.jpg", "description": "Твёрдый переплёт, белая бумага."},
  {"id": "put-k-pokayaniyu", "title": "Путь к покаянию", "author": "Мухаммад ибн Ибрахим аль-Хамд", "category": "aqidah", "binding": "Мягкая обложка", "pages": 88, "price": 250, "image": "assets/images/books/put-k-pokayaniyu.jpg", "description": "Разъяснение сути покаяния и его положений."},
  {"id": "probuzhdenie-very", "title": "Пробуждение веры", "category": "aqidah", "pages": 48, "price": 130, "image": "assets/images/books/probuzhdenie-very.jpg", "description": "Небольшая книга об обновлении веры."},
  {"id": "100-dua", "title": "100 дуа из Корана и Сунны", "category": "aqidah", "price": 200, "image": "assets/images/books/100-dua.jpg", "description": "Мольбы из Корана и Сунны в компактном формате."},
  {"id": "poslaniya-ot-proroka", "title": "Послания от Пророка ﷺ", "category": "history", "price": 1000, "image": "assets/images/books/poslaniya-ot-proroka.jpg", "description": "Послания для тех, кто любит Пророка ﷺ."},
  {"id": "shkola-muhammada", "title": "Школа Мухаммада ﷺ", "category": "history", "price": 600, "image": "assets/images/books/shkola-muhammada.jpg", "description": "Чему учит жизнь Пророка ﷺ."},
  {"id": "al-aksa", "title": "Аль-Акса. Истина против мифов", "category": "history", "price": 650, "image": "assets/images/books/al-aksa.jpg", "description": "История и значение мечети Аль-Акса."},
  {"id": "umar-al-muhtar", "title": "Умар аль-Мухтар", "author": "Али Мухаммад ас-Салляби", "category": "history", "price": 600, "image": "assets/images/books/umar-al-muhtar.jpg", "description": "Биография «Льва пустыни», героя ливийского сопротивления."},
  {"id": "titany-istorii", "title": "Титаны истории. 2 тома", "author": "Али ат-Тантави", "category": "history", "pages": 894, "price": 1500, "image": "assets/images/books/titany-istorii.jpg", "description": "Два тома по 447 страниц, цена за комплект."},
  {"id": "kachestva-lyudey-dzhahilii", "title": "Качества людей времён невежества", "category": "history", "price": 850, "image": "assets/images/books/kachestva-lyudey-dzhahilii.jpg", "description": "Черты эпохи невежества, от которых предостерегает ислам."}
];
