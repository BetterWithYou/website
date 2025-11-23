// Website Configuration
// Modify this file to control which pages appear in the navigation menu

const siteConfig = {
    pages: [
        {
            name: "HOME",
            path: "index.html",
            relativePath: "../index.html" // Used when navigating from subpages
        },
        {
            name: "ABOUT",
            path: "pages/about.html",
            relativePath: "about.html"
        },
        {
            name: "EVENTS",
            path: "pages/events.html",
            relativePath: "events.html"
        },
        {
            name: "CONTACT",
            path: "pages/contact.html",
            relativePath: "contact.html"
        }
        // Uncomment below to add Gallery and Artists pages
        // {
        //     name: "Gallery",
        //     path: "pages/gallery.html",
        //     relativePath: "gallery.html"
        // },
        // {
        //     name: "Artists",
        //     path: "pages/artists.html",
        //     relativePath: "artists.html"
        // }
    ]
};
