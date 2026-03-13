## Requisiti

- PHP 8.2+
- Composer
- Node.js + NPM
- Istanza PostgreSQL attiva

## Installazione rapida

```bash
composer setup
```

Esegue in sequenza: `composer install` → copia `.env.example` → `key:generate` → `migrate` → `npm install` → `npm run build`.

## Installazione manuale

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
```

### Configurazione database (PostgreSQL)

Nel file `.env`, sostituire la sezione database con:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=abifin
DB_USERNAME=postgres
DB_PASSWORD=
```

## Dati di test

```bash
php artisan db:seed

# oppure reset completo + seed
php artisan migrate:fresh --seed
```

### Credenziali

| Ruolo   | Email             | Password |
|---------|-------------------|----------|
| Admin   | admin@abifin.it   | admin    |
| Cliente | cliente@abifin.it | cliente  |

## Avvio sviluppo

```bash
npm run dev
```

## Test

```bash
composer test
```
