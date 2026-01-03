<script setup lang="ts">
import Home from "@/components/home/Home.vue";
import Asm from "@/components/asm/Asm.vue";
import Sim from "@/components/Sim.vue";
import { ref } from "vue";
import {execute} from "@/command_service.ts";

// Use 'any' or Component type if available
const windows: Record<string, any> = { "Home": Home, "Assembly": Asm, "sim": Sim };
const active = ref("Home");

function setActive(key: string) {
    active.value = key;
}
let isRunning = false;
async function onPauseClick() {
    let d = document.getElementById("button-pause-i");

    if (isRunning) {
        await execute<null>("sim_action", {action: "run"});
        d?.classList.remove("fa-pause");
        d?.classList.add("fa-play");
    }else{
        await execute<null>("sim_action", {action: "pause"});
        d?.classList.remove("fa-play");
        d?.classList.add("fa-pause");
    }
}
async function onResumeClick() {}
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
            <div class="control-buttons">
                <button id="button-pause" class="button button-control" @click="onPauseClick" title="run/pause the debuger"><i id="button-pause-i" class="fa fa-pause"/></button>
                <button id="button-next" class="button button-control" @click="onNextClick" title="next instruction"><i class="fa fa-arrow-circle-down" /></button>
                <button id="button-over" class="button button-control" title="skip entire function (only on call)"><i class="fa fa-fast-forward"/></button>
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
.control-buttons{
    margin-left:auto;
    gap: 15px;
    display: flex
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
}
.button-control:active{
    background: #42b883;
}
</style>