import App from './App.vue'
import { createApp } from 'vue'
import {initMenu} from "@/menu.ts";

createApp(App).mount('#app').$nextTick(() => {
    initMenu()
})
