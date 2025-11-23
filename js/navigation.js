// Determine if we're on a subpage or the home page
const isSubpage = window.location.pathname.includes('/pages/');

// Build navigation menu dynamically from config
function buildNavigationMenu() {
    const navMenuItems = document.querySelector('.nav-menu-items');
    if (!navMenuItems) return;

    // Clear existing menu items
    navMenuItems.innerHTML = '';

    // Get current page name from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Build menu items from config
    siteConfig.pages.forEach(page => {
        const link = document.createElement('a');
        link.className = 'nav-menu-item';
        link.textContent = page.name;

        // Use appropriate path based on whether we're on a subpage
        link.href = isSubpage ? page.relativePath : page.path;

        // Add target="_self" to ensure normal navigation
        link.target = '_self';

        navMenuItems.appendChild(link);
    });
}

// Initialize navigation menu
buildNavigationMenu();

// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');
const menuOverlay = document.getElementById('menuOverlay');

function toggleMenu() {
    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

hamburgerMenu.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// Close menu when clicking a menu item
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-menu-item')) {
        // Only close menu for hash links (like #), let page navigation happen naturally
        if (e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            toggleMenu();
        }
        // For page navigation, just let it happen without preventDefault
    }
});