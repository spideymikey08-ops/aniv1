# Aniya — Agricultural Navigation and Yield Activity Tracker

Aniya is a PHP/MySQL web application for tracking rice plots, plantings, watering tasks, harvest records, seed inventory, and calendar dates.

## Folder structure

```text
Aniya/
├── index.html            (redirects to the Dashboard)
├── config.php            (shared database settings)
├── script.js             (shared JS: sidebar, API helpers)
├── style.css             (shared styles)
├── aniyatrack.sql
├── Dashboard/            index.html, dashboard.js, get_dashboard_data.php
├── Plots/                plots.html/js, add/update/delete_plot, add_planting, get_plots
├── Tasks/                watering.html/js, add/delete/get_task(s), mark_done
├── C&I Inventory/        harvest + seeds pages, JS and PHP endpoints
├── I&E Tracking/         finance.html/js, add/delete/get_finance
└── Calendar/             calendar.html/js, get_calendar.php
```

## XAMPP setup

1. Copy the project folder (for example `Aniya_v7`) to `C:\xampp\htdocs\`.
2. Start **Apache** and **MySQL** in XAMPP.
3. Open `http://localhost/phpmyadmin/`.
4. Import `aniyatrack.sql`. It creates the `aniya_db` database and sample records.
5. Open the project through Apache, for example `http://localhost/Aniya_v7/`. **Do not open the HTML directly with `file://`.**
6. If you prefer VS Code Live Server, keep Apache/MySQL running; the app will automatically use the localhost Apache backend for API requests.

If your MySQL root account has a password, edit `config.php` and change `$pass`.

## Working features

- Dashboard statistics and live database summaries.
- Add, edit, and delete plots.
- Add current planting information and expected harvest date.
- Add, complete/reopen, and delete watering tasks.
- Add and delete harvest records.
- Add, update, and delete seed inventory records with low-stock status.
- Monthly calendar showing watering tasks, expected harvests, and completed harvests.
- Farm Finance: record expenses and income per rice plot, view total expenses, total revenue, net profit/loss, and transaction history.
- Responsive layout styled to match the supplied Aniya/AniTrack screenshots.
- Rice-only system: all plot, planting, watering, harvest, and seed records are restricted to rice.
