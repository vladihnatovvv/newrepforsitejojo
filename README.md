# JoJo Store Build

У репозиторії зараз є дві частини:

1. кастомна тема `WordPress + WooCommerce`:
   `wp-content/themes/jojo-avoe`
2. скрипт для витягування товарів з Telegram:
   `scripts/telegram_products_export.py`

## Тема WordPress / WooCommerce

Тема зібрана під магазин аксесуарів у стилі референсу `AVOE`:

- мінімалістичний hero
- картки товарів
- каталог
- сторінка товару
- кошик
- checkout
- FAQ
- slide cart
- адаптив під мобілку
- підготовка до інтеграцій `Нова пошта`, `keyCRM`, `Torgsoft`

### Структура категорій

Категорії з Telegram-гілок зафіксовані тут:

- [docs/catalog-structure.md](/Users/ihnatovvladgmail.com/Documents/JoJo/docs/catalog-structure.md)

### WooCommerce дані

Підготовлені файли для швидкого старту:

- `data/woocommerce-categories.csv` — дерево категорій
- `data/sample-products.csv` — приклад товарів для імпорту
- `docs/wordpress-woocommerce-setup.md` — порядок запуску магазину

### Де лежить тема

- `wp-content/themes/jojo-avoe/style.css`
- `wp-content/themes/jojo-avoe/functions.php`
- `wp-content/themes/jojo-avoe/assets/css/main.css`
- `wp-content/themes/jojo-avoe/assets/js/theme.js`

### Локальний прев'ю-стенд

Щоб швидко глянути верстку без WordPress:

```bash
python3 -m http.server 4173
```

Після цього відкрийте:

- `http://localhost:4173/preview/index.html`
- `http://localhost:4173/preview/catalog.html`
- `http://localhost:4173/preview/product.html`
- `http://localhost:4173/preview/cart.html`
- `http://localhost:4173/preview/checkout.html`

### Як підключити тему до WordPress

1. Скопіювати папку `wp-content/themes/jojo-avoe` у ваш `WordPress`
2. Активувати тему в `Appearance -> Themes`
3. Встановити і активувати `WooCommerce`
4. Призначити сторінки магазину
5. Налаштувати меню
6. Підключити інтеграції доставки, CRM і обліку

## Telegram -> WooCommerce Prep

Скрипт витягує повідомлення з Telegram-групи або каналу, зберігає сирий архів і намагається знайти товари для подальшого імпорту в `WooCommerce`.

## Що вміє

- читає історію чату через `Telethon`
- зберігає всі повідомлення у `JSONL`
- опціонально завантажує фото
- будує чорновий `products.csv` і `products.json`
- намагається витягнути:
  - назву
  - ціну
  - артикул / `SKU`
  - категорію
  - колір
  - розмір
  - статус наявності

## 1. Підготувати Telegram API

Створіть `api_id` і `api_hash` тут:

- [https://my.telegram.org](https://my.telegram.org)

Потім у терміналі:

```bash
export TG_API_ID=123456
export TG_API_HASH=your_api_hash
```

## 2. Встановити залежність

```bash
pip3 install telethon
```

## 3. Запуск

```bash
python3 scripts/telegram_products_export.py --chat "my_group_username" --download-media
```

Або по invite / id:

```bash
python3 scripts/telegram_products_export.py --chat "https://t.me/your_invite_link"
python3 scripts/telegram_products_export.py --chat "-1001234567890"
```

## 4. Корисні параметри

```bash
python3 scripts/telegram_products_export.py \
  --chat "my_group_username" \
  --limit 500 \
  --reverse \
  --download-media \
  --output-dir output/telegram_export
```

- `--limit 500` — взяти тільки останні 500 повідомлень
- `--reverse` — обробляти від старих до нових
- `--download-media` — скачати фото
- `--include-non-product` — зберегти в products і неочевидні записи

## 5. Результат

Після запуску з'являться файли:

- `output/telegram_export/raw/messages.jsonl`
- `output/telegram_export/products.json`
- `output/telegram_export/products.csv`
- `output/telegram_export/media/` якщо ввімкнено завантаження фото

## 6. Важливе обмеження

Якщо товари в Telegram оформлені дуже хаотично, скрипт витягне тільки чорнові дані. Це нормально: далі я можу допомогти перетворити `products.csv` у формат під імпорт `WooCommerce`.
