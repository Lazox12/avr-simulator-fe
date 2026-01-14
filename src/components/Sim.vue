<script setup lang="ts">

import {ListenerService} from "@/listener_service.ts";
import {computed, ref, watch} from "vue";

let registers = ListenerService.instance.listen<number[]>("sim-register-status",[0])
const selectedFormat = ref("hex");

const formattedRegisters = computed(() => {
    // Safety check: if registers hasn't loaded yet, return empty
    if (!registers.value) return [];

    return registers.value.map((val) => {
        if (selectedFormat.value === 'hex') {
            return val.toString(16).toUpperCase().padStart(2, '0');
        } else if (selectedFormat.value === 'bin') {
            return val.toString(2).padStart(8, '0');
        } else {
            return val.toString(10);
        }
    });
});

</script>

<template>
    <div class="body">
        <div class="format-select">
            <h4 style="width: 125px">display format:</h4>
            <select v-model="selectedFormat" style = "width:60px;height:40px">
                <option selected value="hex">hex</option>
                <option value="dec">dec</option>
                <option value="bin">bin</option>

            </select>
        </div>
        <div class="register-grid">
            <div
                class="register-cell"
                v-for="(val, i) in formattedRegisters"
                :key="i"
            >
                <div class="reg-header">R{{ i }}</div>
                <div class="reg-value">{{ val }}</div>
            </div>
        </div>
    </div>
    <div class="watchlist">
        <h4>enter regiter to watch:</h4>
        <input class="watchlist-input" style="height:30px">
    </div>

</template>

<style scoped>
.body {
    display: flex;
    flex-wrap: wrap;
}

.format-select {
    margin-left:auto;
    display: flex;
    max-height: 60px;
    align-items: center;
}
.register-grid {
    display: flex;
    flex-wrap: wrap;
}

.register-cell {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    overflow: hidden;
    min-width: 37px;
    text-align: center;
    padding: 5px;
}
.reg-header {
    border-bottom: 1px solid #ccc;
}
.watchlist {
    display: flex;
    align-items: center;
}

</style>