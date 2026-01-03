import {invoke,InvokeArgs} from '@tauri-apps/api/core'

export async function execute<T>(command: string, args?: InvokeArgs,cache:boolean = false): Promise<T|undefined> {
    if (cache) {
        let s = localStorage.getItem(command);
        if (s === null) {
            let r = await execute<T>(command, args,cache=false);
            localStorage.setItem(command, JSON.stringify(r));
            return r;
        }
        return JSON.parse(s);
    }
    try {
        console.info("command:", command, "args:"+args);
        return await invoke<T>(command, args);
    } catch (err) {
        console.error(err);
        throw err;
    }
}
