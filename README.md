# NextLevel — Магазин игр

Интернет-магазин видеоигр с каталогом, корзиной, оформлением заказов и админ-панелью.

## Стек технологий
- **Frontend:** Next.js 16, React, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, JWT (авторизация)
- **База данных:** PostgreSQL

## Как запустить
### 1. Создание базы данных:

sql
CREATE DATABASE nextlevel;
\c nextlevel;
#### 1. Таблица games (Игры)
Здесь хранится каталог игр. Поле in_stock (логическое) отвечает за то, есть ли игра в продаже (для блокировки кнопки «Купить»).

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    platform VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,1),
    cover VARCHAR(500),
    release_date DATE,
    popular BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
#### 2. Таблица users (Пользователи)
Хранит данные для авторизации. Пароли хэшируются (bcrypt), а поле role определяет права (обычный user или admin).

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
#### 3. Таблица orders (Заказы)
Хранит информацию о заказах. total — итоговая сумма, status — статус (новый, в обработке, выполнен, отменен).

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_address TEXT,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
#### 4. Таблица order_items (Состав заказа)
Связывает заказы и игры (так как в одном заказе может быть несколько игр). Использует внешние ключи (REFERENCES) для связи с другими таблицами.

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL
);

#### 5. Добавление данных игр в бд
INSERT INTO games (id, title, description, genre, platform, price, rating, cover, release_date, popular, in_stock)
VALUES 
(1, 'Resident Evil Requiem', 'Выживание в Раккун-Сити после катастрофы. Новый виток классического хоррора от Capcom.', 'Хоррор на выживание', 'PC, PS5, Xbox Series X|S', 2600.00, 4.9, '/images/games/Resident_Evil_Requiem.jpg', '2026-02-27', TRUE, TRUE),
(2, 'Forza Horizon 6', 'Открытый мир Японии, более 550 автомобилей и захватывающие гонки.', 'Гонки', 'PC, Xbox Series X|S', 3990.00, 4.7, '/images/games/forza-h6.webp', '2026-05-15', TRUE, TRUE),
(3, '007 First Light', 'История становления Джеймса Бонда в стиле стелс-экшена от создателей Hitman.', 'Экшен', 'PC, PS5, Xbox Series X|S', 3200.00, 4.8, '/images/games/007-first-light.webp', '2026-05-27', TRUE, TRUE),
(4, 'ARC Raiders', 'Кооперативный шутер на выживание, где игрокам предстоит сражаться с машинами.', 'Шутер', 'PC, PS5, Xbox Series X|S', 1249.00, 4.5, '/images/games/ARC_Raiders.webp', '2026-01-20', TRUE, TRUE),
(5, 'Subnautica 2', 'Продолжение знаменитого подводного выживания на новой планете.', 'Выживание', 'PC, Xbox Series X|S', 1430.00, 4.6, '/images/games/Subnautica_2.jpg', '2026-05-10', TRUE, TRUE),
(6, 'Crimson Desert', 'Масштабный экшен-RPG в открытом мире, основанный на легендах.', 'Экшен-РПГ', 'PC, PS5, Xbox Series X|S', 3670.00, 4.4, '/images/games/Crimson_Desert.jpg', '2026-03-20', FALSE, TRUE),
(7, 'Slay the Spire 2', 'Продолжение культовой карточной roguelike-игры.', 'Рогалик', 'PC', 1005.00, 4.8, '/images/games/Slay_the_Spire_2.jpg', '2026-02-15', FALSE, TRUE),
(8, 'Ghost of Yotei', 'Новая история в мире Ghost of Tsushima, действие происходит в горах Японии.', 'Приключенческий экшен', 'PS5', 4790.00, 4.9, '/images/games/Ghost_of_Yotei.webp', '2026-04-10', TRUE, TRUE),
(9, 'Death Stranding 2', 'Продолжение культовой игры Хидео Кодзимы о связи и выживании.', 'Экшен', 'PS5', 2999.00, 4.7, '/images/games/Death Stranding 2.webp', '2026-06-01', FALSE, TRUE),
(10, 'Grand Theft Auto VI', 'Возвращение в Вайс-Сити. Самая ожидаемая игра десятилетия.', 'Экшен', 'PC, PS5, Xbox Series X|S', 7100.00, 5.0, '/images/games/Grand_Theft_Auto_VI.webp', '2026-11-19', TRUE, FALSE)

### 2. Подключение к БД


В папке `backend` создай файл `.env`:
DB_USER=postgres
DB_HOST=localhost
DB_NAME=nextlevel
DB_PASSWORD=пароль
DB_PORT=5432
PORT=3001
JWT_SECRET=пароль

### 3. Backend
Вести в консоль:
cd backend
npm install
node server.js
(Сервер запустится на порту 3001)

### 4. Frontend
Вести в консоль:
//В корне проекта
npm install
npm run dev

### Тестовый аккаунт админа
Чтобы создать админа, зарегистрируйся на сайте и выполни SQL: 
UPDATE users SET role = 'admin' WHERE email = 'твой_email';
