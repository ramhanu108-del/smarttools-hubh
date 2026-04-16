// --- Data & Initialization ---
const TOOLS = [
    { id: 'image-compressor', title: 'Image Compressor', desc: 'Reduce file size without quality loss.', category: 'Image', icon: 'minimize' },
    { id: 'background-remover', title: 'Background Remover', desc: 'Remove backgrounds instantly.', category: 'Image', icon: 'trash-2' },
    { id: 'word-counter', title: 'Word Counter', desc: 'Detailed text analysis tool.', category: 'Text', icon: 'type' },
    { id: 'password-generator', title: 'Password Generator', desc: 'Strong random keys for security.', category: 'Utility', icon: 'lock' },
    { id: 'username-generator', title: 'IG Username Generator', desc: 'Unique handles for Instagram.', category: 'Instagram', icon: 'instagram' },
    { id: 'caption-generator', title: 'IG Caption Generator', desc: 'Catchy captions for your feed.', category: 'Instagram', icon: 'message-circle' },
    { id: 'bio-generator', title: 'IG Bio Generator', desc: 'Stylish profile bios with fonts.', category: 'Instagram', icon: 'sparkles' }
    // All 33 tools follow this structure...
];

const CATEGORIES = ['All', 'Image', 'PDF', 'Finance', 'Text', 'Instagram', 'Utility'];

let state = {
    search: '',
    category: 'All',
    activeTool: null,
    isDark: localStorage.getItem('theme') === 'dark'
};

// --- App Core ---
function init() {
    renderCategories();
    renderTools();
    lucide.createIcons();
    setupEventListeners();
    applyTheme();
}

function setupEventListeners() {
    document.getElementById('toolSearch').addEventListener('input', (e) => {
        state.search = e.target.value.toLowerCase();
        renderTools();
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
        state.isDark = !state.isDark;
        applyTheme();
    });
}

function applyTheme() {
    if (state.isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

function renderCategories() {
    const container = document.getElementById('categoryTabs');
    container.innerHTML = CATEGORIES.map(cat => `
        <button onclick="setCategory('${cat}')" 
                class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${state.category === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}">
            ${cat}
        </button>
    `).join('');
}

function setCategory(cat) {
    state.category = cat;
    renderCategories();
    renderTools();
}

function renderTools() {
    const grid = document.getElementById('toolGrid');
    const filtered = TOOLS.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(state.search) || t.desc.toLowerCase().includes(state.search);
        const matchesCat = state.category === 'All' || t.category === state.category;
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '';
        document.getElementById('emptyState').classList.remove('hidden');
    } else {
        document.getElementById('emptyState').classList.add('hidden');
        grid.innerHTML = filtered.map(t => `
            <div onclick="openTool('${t.id}')" class="group bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-500 transition-all cursor-pointer tool-card">
                <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="${t.icon}"></i>
                </div>
                <h3 class="text-lg font-bold mb-2">${t.title}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">${t.desc}</p>
            </div>
        `).join('');
        lucide.createIcons();
    }
}

// --- Tool Modal Logic ---
function openTool(id) {
    const tool = TOOLS.find(t => t.id === id);
    if (!tool) return;
    
    state.activeTool = tool;
    document.getElementById('modalTitle').innerText = tool.title;
    document.getElementById('modalOverlay').classList.add('active');
    setTimeout(() => document.getElementById('modalContent').classList.add('active'), 50);
    document.body.classList.add('modal-open');
    
    renderToolUI(id);
    renderSEO(id);
}

function closeTool() {
    document.getElementById('modalContent').classList.remove('active');
    setTimeout(() => {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.classList.remove('modal-open');
    }, 300);
}

// --- Specific Tool Rendering Impls ---
function renderToolUI(id) {
    const container = document.getElementById('toolUI');
    
    if (id === 'word-counter') {
        container.innerHTML = `
            <div class="space-y-6">
                <textarea id="counterInput" placeholder="Paste your text here..." class="w-full h-48 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 outline-none focus:border-blue-500 transition-all"></textarea>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                        <div class="text-2xl font-bold" id="wCount">0</div>
                        <div class="text-xs uppercase text-gray-500">Words</div>
                    </div>
                    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                        <div class="text-2xl font-bold" id="cCount">0</div>
                        <div class="text-xs uppercase text-gray-500">Chars</div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('counterInput').addEventListener('input', (e) => {
            const val = e.target.value.trim();
            document.getElementById('wCount').innerText = val ? val.split(/\s+/).length : 0;
            document.getElementById('cCount').innerText = val.length;
        });
    } else if (id === 'username-generator') {
        container.innerHTML = `
            <div class="space-y-6">
                <input id="igKeyword" type="text" placeholder="Enter keyword (optional)" class="p-4 rounded-xl w-full bg-gray-100">
                <button onclick="genIGNames()" class="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Generate Usernames</button>
                <div id="igList" class="grid grid-cols-2 gap-2 mt-4"></div>
            </div>
        `;
    }
    // ... other tool handlers added here ...
}

function genIGNames() {
    const k = document.getElementById('igKeyword').value || 'cool';
    const list = document.getElementById('igList');
    list.innerHTML = Array.from({length: 10}).map(() => {
        const name = k + '_' + Math.floor(Math.random()*100);
        return `<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg flex justify-between items-center text-sm border border-gray-100 dark:border-gray-800">
            ${name}
            <button onclick="copyText('${name}')" class="text-blue-500">Copy</button>
        </div>`;
    }).join('');
}

function copyText(txt) {
    navigator.clipboard.writeText(txt);
    alert('Copied to clipboard!');
}

function renderSEO(id) {
    // Inject the H1, Introductions, and FAQs here for SEO parity
    const seo = document.getElementById('modalSEO');
    seo.innerHTML = `
        <h3 class="text-xl font-bold mb-4">Using the tool</h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-10">Detailed guide and benefits for ${id} go here...</p>
        <div class="space-y-4">
            <details class="group border border-gray-100 dark:border-gray-700 rounded-xl p-4 cursor-pointer">
                <summary class="font-bold flex justify-between list-none">Is it safe? <span class="group-open:rotate-180 transition-transform">▼</span></summary>
                <p class="pt-4 text-sm text-gray-500">Yes, all processing happens locally.</p>
            </details>
        </div>
    `;
}

init();