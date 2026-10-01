// Project root = folder containing this script.js.
// Keep the API URLs on the same project root so pages work from every module folder.
const SCRIPT_URL = document.currentScript?.src || new URL('script.js', document.baseURI).href;
const ROOT = new URL('.', SCRIPT_URL).href;

// If the frontend is opened through VS Code Live Server (for example :5500),
// the PHP files are not executed there. XAMPP normally serves the same project
// on port 80, so use that backend automatically for localhost development.
const API_ROOT = (() => {
    try {
        const root = new URL(ROOT);

        if (
            (root.protocol === 'http:' || root.protocol === 'https:') &&
            (root.hostname === 'localhost' || root.hostname === '127.0.0.1') &&
            root.port &&
            root.port !== '80' &&
            root.port !== '443'
        ) {
            root.port = '';
            return root.href;
        }
    } catch (e) {
        // Fall back to ROOT below.
    }

    return ROOT;
})();

function urlFor(path, base = ROOT) {
    const [p, q] = path.split('?');
    const enc = p.split('/').map(encodeURIComponent).join('/');
    return base + enc + (q ? '?' + q : '');
}

const page = document.body.dataset.page;

const nav = [
    ['Dashboard/index.html', '📊', 'Dashboard', 'dashboard'],
    ['Plots/plots.html', '🌱', 'Plots', 'plots'],
    ['Tasks/watering.html', '💧', 'Watering Tasks', 'watering'],
    ['C&I Inventory/harvest.html', '🧺', 'Harvest Records', 'harvest'],
    ['C&I Inventory/seeds.html', '🫘', 'Seed Inventory', 'seeds'],
    ['I&E Tracking/finance.html', '💰', 'Farm Finance', 'finance'],
    ['Calendar/calendar.html', '🗓️', 'Calendar', 'calendar']
];

function shell(title, subtitle, content) {
    document.getElementById('app').innerHTML = `
        <aside class="sidebar">
            <div class="brand">
                <span>🌱</span>
                <strong>Aniya</strong>
            </div>

            <nav>
                ${nav.map(n => `
                    <a
                        href="${urlFor(n[0])}"
                        class="${page === n[3] ? 'active' : ''}"
                    >
                        <span>${n[1]}</span>
                        ${n[2]}
                    </a>
                `).join('')}
            </nav>

            <div class="side-note">
                Rice plot tracking for the community garden.
            </div>
        </aside>

        <main class="main">
            <header>
                <h1>${title}</h1>
                <p>${subtitle}</p>
            </header>

            ${content}
        </main>

        <div
            id="toast"
            class="toast"
        ></div>
    `;
}

function esc(v) {
    return String(v ?? '').replace(
        /[&<>'"]/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[c])
    );
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

async function api(url, options = {}) {
    let response;

    try {
        response = await fetch(urlFor(url, API_ROOT), options);
    } catch (e) {
        throw new Error(
            'Unable to reach the PHP server. Start Apache and MySQL in XAMPP.'
        );
    }

    let x;

    try {
        x = await response.json();
    } catch (e) {
        throw new Error(
            'The PHP server returned an invalid response. Make sure this project is running through XAMPP/Apache, not as a static file.'
        );
    }

    if (!response.ok || x.success === false) {
        throw new Error(
            x.message || 'Request failed'
        );
    }

    return x;
}

function post(file, data) {
    return api(file, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function toast(msg, error = false) {
    const t = document.getElementById('toast');

    if (!t) return;

    t.textContent = msg;

    t.className =
        'toast show ' +
        (error ? 'error' : '');

    setTimeout(
        () => t.className = 'toast',
        2800
    );
}

function cropBadge(c) {
    return `
        <span class="badge ${String(c).toLowerCase()}">
            ${esc(c)}
        </span>
    `;
}

function statusBadge(s) {
    return `
        <span class="badge ${String(s).toLowerCase()}">
            ${esc(s)}
        </span>
    `;
}

function plotOptions(plots) {
    return plots
        .map(p => `
            <option value="${p.id}">
                ${esc(p.name)} (${esc(p.crop_type)})
            </option>
        `)
        .join('');
}

function setDefaultDates() {
    document
        .querySelectorAll('input[type=date]')
        .forEach(x => {
            if (!x.value) {
                x.value = today();
            }
        });
}