<script setup lang="ts">
import Home from "@/components/Home.vue";
import Asm from "@/components/Asm.vue";
import Sim from "@/components/Sim.vue";
import {ref} from "vue";

const windows:Record<string,any> = {"Home":Home,"Assembly":Asm,"sim":Sim}
let active = ref("Home");
function setActive(key:string) {
    active.value = key;
}
</script>

<template >
    <header class="header">
        <div v-for="(_,key) in windows ">
            <button class="button" @click="setActive(key)">{{key}}</button>
        </div>
    </header>
    <main id="main" class="main">
        <component class="component" :is="windows[active]" />
    </main>
    <footer>
        <div class="footer">
            <p>
                test
            </p>
        </div>
    </footer>
</template>
<style scoped>



    .header{
        background: #555;
        color: white;
        padding: 0 10px; /* Adjusted padding for better vertical alignment */
        display: flex;
        gap: 15px;
        height: 50px; /* Fixed height for stability */
        align-items: center; /* Vertically center buttons */
        flex-shrink: 0; /* Prevent header from shrinking */
    }
    .component {
        height: 100%;
    }
    .main{
        flex: 1;
        display: flex;         /* Makes the inner component fill this area */
        flex-direction: column;
        overflow: auto;        /* Adds scrollbars to MAIN only if content is too long */
        position: relative;
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
    .button{
        height: 30px;
        padding: 0 15px;
        cursor: pointer;
        background: #777;
        border: none;
        color: white;
        border-radius: 4px;
    }
    .button.active {
        background: #42b883; /* Vue green for active state */
        font-weight: bold;
    }
</style>