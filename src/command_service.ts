import {invoke,InvokeArgs} from '@tauri-apps/api/core'
import {defineStore} from "pinia";
import {ref} from "vue";

export async function execute<T>(command: string, args?: InvokeArgs): Promise<T|undefined> {
    try {
        console.info("command:", command, "args:"+args);
        return await invoke<T>(command, args);
    } catch (err) {
        console.error(err);
    }
}
