# Aktywni.pl – Web (Frontend) 🇵🇱

Frontend aplikacji **Aktywni.pl** – systemu monitorowania aktywności fizycznej.  
Aplikacja webowa umożliwia logowanie administratora, rejestrację użytkownika oraz obsługę resetu hasła (tryb demo bez wysyłki maila).

---

## Technologie

- React (Vite)
- React Router
- Axios
- Docker (uruchamianie jako kontener `web`)

---

## Funkcjonalności

### Autoryzacja i konta
- Logowanie (`/api/login`)
- Rejestracja użytkownika (`/api/register`)
  - formularz z potwierdzeniem hasła
- Reset hasła:
  - generowanie tokenu resetu (`/api/password/forgot`)
  - ustawienie nowego hasła (`/api/password/reset`)

## API (Backend)

Frontend komunikuje się z backendem przez endpointy:

- `POST /api/login`
- `POST /api/register`
- `POST /api/password/forgot`
- `POST /api/password/reset`

Backend powinien działać na porcie `3000`.

---

---

# Aktywni.pl – Web (Frontend) 🇬🇧

Frontend for **Aktywni.pl** – a physical activity monitoring system.  
The web application supports admin login, user registration, and password reset flow (demo mode without sending emails).

---

## Tech Stack

- React (Vite)
- React Router
- Axios
- Docker (runs as the `web` container)

---

## Features

### Authentication & Accounts
- Login (`/api/login`)
- User registration (`/api/register`)
  - registration form includes password confirmation
- Password reset:
  - generate reset token (`/api/password/forgot`)
  - set a new password (`/api/password/reset`)

## API (Backend)

The frontend communicates with the backend using:

- `POST /api/login`
- `POST /api/register`
- `POST /api/password/forgot`
- `POST /api/password/reset`

Backend should be running on port `3000`.
