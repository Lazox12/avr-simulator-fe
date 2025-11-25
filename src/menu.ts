import { Menu, MenuItem, Submenu, PredefinedMenuItem } from '@tauri-apps/api/menu';
import { open, save } from '@tauri-apps/plugin-dialog';
import { execute } from "@/command_service";

export async function initMenu() {

    const separator = await PredefinedMenuItem.new({ item: "Separator" });

    const newItem = await MenuItem.new({
        id: "new",
        text: "new project",
        action: async () => {
            const file = await save({
                filters: [{ name: "Sim project files", extensions: ["spro"] }]
            });
            await execute("menu_new", { file });
        }
    });

    const openItem = await MenuItem.new({
        id: "open",
        text: "open",
        action: async () => {
            const file = await open({
                filters: [{ name: "Sim project files", extensions: ["spro"] }]
            });
            await execute("menu_open", { file });
        }
    });

    const importItem = await MenuItem.new({
        id: "import",
        text: "import",
        action: async () => {
            const file = await open({
                filters: [{ name: "compiled binary", extensions: ["hex","elf"] }]
            });
            await execute("menu_import", { file });
        }
    });

    const closeItem = await MenuItem.new({
        id: "close",
        text: "close",
        action: async () => {
            await execute("menu_close");
        }
    });

    const saveItem = await MenuItem.new({
        id: "save",
        text: "save",
        action: async () => {
            await execute("menu_save");
        }
    });

    const fileSubmenu = await Submenu.new({
        text: "File",
        items: [
            newItem,
            openItem,
            importItem,
            separator,
            closeItem,
            saveItem
        ]
    });

    const menu = await Menu.new({
        items: [fileSubmenu]
    });

    await menu.setAsAppMenu();
}
