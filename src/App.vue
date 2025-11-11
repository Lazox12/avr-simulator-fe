<script setup lang="ts">
import Home from "@/components/home/Home.vue";
import Asm from "@/components/asm/Asm.vue";
import Sim from "@/components/Sim.vue";
import { ref } from "vue";

// Use 'any' or Component type if available
const windows: Record<string, any> = { "Home": Home, "Assembly": Asm, "sim": Sim };
const active = ref("Home");

function setActive(key: string) {
    active.value = key;
}
</script>

<template>
    <!-- Wrap everything in a main layout container -->
    <div class="app-layout">
        <header class="header">
            <!-- Added :key to v-for to prevent Vue warnings -->
            <div v-for="(_, key) in windows" :key="key">
                <button
                    class="button"
                    :class="{ 'active': active === key }"
                    @click="setActive(key)"
                >
                    {{ key }}
                </button>
            </div>
        </header>

        <main id="main" class="main">
            <!-- The component will now fill this space -->
            <suspense class="component-view">
            <component :is="windows[active]"/>
            </suspense>
        </main>

        <footer class="footer">
            <p>test</p>
        </footer>
    </div>
</template>

<style scoped>
/* The main container that forces full height */
.app-layout {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Use 100vh to fill the viewport exactly */
    margin: 0;
}

.header {
    background: #555;
    color: white;
    padding: 0 10px; /* Adjusted padding for better vertical alignment */
    display: flex;
    gap: 15px;
    height: 50px; /* Fixed height for stability */
    align-items: center; /* Vertically center buttons */
    flex-shrink: 0; /* Prevent header from shrinking */
}

/* This is the magic part: flex: 1 makes it fill all remaining space */
.main {
    flex: 1;
    display: flex;         /* Makes the inner component fill this area */
    flex-direction: column;
    overflow: auto;        /* Adds scrollbars to MAIN only if content is too long */
    position: relative;
}

/* Ensure the rendered component also fills the space if needed */
.component-view {
    flex: 1;
    height: 100%;
}

.footer {
    background: #333;
    color: #eee;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0; /* Prevent footer from shrinking */
}

.button {
    height: 30px;
    padding: 0 15px;
    cursor: pointer;
    background: #777;
    border: none;
    color: white;
    border-radius: 4px;
}

.button.active {
    background: #42b883;
    font-weight: bold;
}
</style>