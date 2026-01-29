import { ref, onMounted, onUnmounted, Ref } from "vue";
import { listen, Event } from "@tauri-apps/api/event";

const startupListeners:string[] = ["asm-update","project-update","sim-register-status",""];

export class ListenerService {
    private static _instance: ListenerService;

    private eventBuffer: Map<string, any> = new Map();

    private subscribers: Map<string, Set<(payload: any) => void>> = new Map();

    private listeners: Set<string> = new Set();

    private constructor() {
        startupListeners.forEach(listener => {
            this.ensureTauriListener(listener);
        })
    }

    public static get instance(): ListenerService {
        if (!ListenerService._instance) {
            ListenerService._instance = new ListenerService();
        }
        return ListenerService._instance;
    }


    public listen<T>(eventName: string, initialValue: T): Ref<T> {
        // Create the Vue Ref
        const data = ref<T>(initialValue) as Ref<T>;

        this.ensureTauriListener(eventName);

        const updateRef = (payload: T) => {
            console.log("[SignalService]:"+eventName+" recieved payload:"+payload+ "   of type:"+typeof payload);
            if (typeof payload === "object"){
                console.log(JSON.stringify(payload, null, 2))
            }
            data.value = payload;
        };

        onMounted(() => {
            // 1. Replay History: If data arrived while this component was unloaded
            const data = this.eventBuffer.get(eventName);
            if(data !== undefined) {
                updateRef(data);
            }

            // 2. Subscribe: Add to the active notification list
            if (!this.subscribers.has(eventName)) {
                this.subscribers.set(eventName, new Set());
            }
            this.subscribers.get(eventName)!.add(updateRef);
        });

        onUnmounted(() => {
            // 3. Cleanup: Remove from notification list when component unmounts
            const list = this.subscribers.get(eventName);
            if (list) {
                list.delete(updateRef);
            }
        });

        return data;
    }


    private ensureTauriListener(eventName: string) {
        if (this.listeners.has(eventName)) return;

        this.listeners.add(eventName);
        console.log(`[SignalService] Initialized global listener for: ${eventName}`);

        listen(eventName, (event: Event<any>) => {
            const payload = event.payload;

            this.eventBuffer.set(eventName, payload);

            // B. Notify all active components (Vue Refs)
            const activeListeners = this.subscribers.get(eventName);
            if (activeListeners) {
                activeListeners.forEach((callback) => callback(payload));
            }
        });
    }
}