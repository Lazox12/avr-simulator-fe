import { ref, onMounted, onUnmounted, Ref } from "vue";
import { listen, Event } from "@tauri-apps/api/event";

export class ListenerService {
    private static _instance: ListenerService;

    // 1. History Buffer: Stores missed events (EventName -> Array of Payloads)
    private eventBuffer: Map<string, any[]> = new Map();
    private readonly MAX_BUFFER_SIZE = 50;

    // 2. Active Vue Subscribers: (EventName -> Set of update functions)
    private subscribers: Map<string, Set<(payload: any) => void>> = new Map();

    // 3. Registered Tauri Listeners: Tracks if we have told Tauri to listen to this event yet
    private listeners: Set<string> = new Set();

    private constructor() {}

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
            console.log(payload);
            data.value = payload;
        };

        onMounted(() => {
            // 1. Replay History: If data arrived while this component was unloaded
            const history = this.eventBuffer.get(eventName);
            if (history && history.length > 0) {
                console.log(`[SignalService] Replaying history for: ${eventName}`);
                // Apply the latest relevant history to the Ref
                // If you want a log of items, you'd handle that differently.
                // Here we assume the ref represents the "current state".
                history.forEach((val) => updateRef(val));
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

            // A. Store in Buffer (FIFO)
            const history = this.eventBuffer.get(eventName) || [];
            history.push(payload);
            if (history.length > this.MAX_BUFFER_SIZE) {
                history.shift();
            }
            this.eventBuffer.set(eventName, history);

            // B. Notify all active components (Vue Refs)
            const activeListeners = this.subscribers.get(eventName);
            if (activeListeners) {
                activeListeners.forEach((callback) => callback(payload));
            }
        });
    }
}