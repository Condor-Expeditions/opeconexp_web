export class HeaderController {
    headerNode: HTMLElement | null;
    navMenu: HTMLElement | null;

    constructor() {
        this.headerNode = document.querySelector("header");
        this.navMenu = document.getElementById("header-nav");
    }

    init() {
        if (!this.headerNode || !this.navMenu) return;

        this.setListenersNavMenu();
    }

    setListenersNavMenu() {
        const menus = this.navMenu?.querySelectorAll("a");

        menus?.forEach((menu) => {
            menu.addEventListener("mouseenter", (e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                const submenu = document.getElementById(`${target.id}-submenu`);
                if (submenu) {
                    submenu.classList.remove("hidden");
                }
            });
        });


    }
}