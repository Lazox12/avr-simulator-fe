<script setup lang="ts">

import {ListenerService} from "@/listener_service.ts";
import {computed, ref, watch} from "vue";
import {execute} from "@/command_service.ts";

let registers = ListenerService.instance.listen<number[]>("sim-register-status",[0])
let watchedRegisters = ListenerService.instance.listen<Map<string,number>>("sim-watch-list-update",new Map())
const selectedFormat = ref("hex");
const input= ref("");

const formattedRegisters = computed(() => {
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
const formatedWatchedRegisters = computed(() => {
    let toRet = new Map();
    for (let [key,val] of Object.entries(watchedRegisters.value)) {

        if (selectedFormat.value === 'hex') {
            toRet.set(key,val.toString(16).toUpperCase().padStart(2, '0'));
        } else if (selectedFormat.value === 'bin') {
            toRet.set(key,val.toString(2).padStart(8, '0'));
        } else {
            toRet.set(key,val.toString(10));
        }
    }
    console.log(toRet);
    return toRet;
});

function stringToNumber(str: string): number[] {
    let result:number[] = [0,0,0,0,0,0,0,0];

    for (let i = 0; i < str.length; i++) {
        // Shift existing bits left by 8 to make room

        // Add the current character's code
        result[i]=str.charCodeAt(i);
    }
    return result;
}

function watchListUpdate() {
    console.log(stringToNumber(input.value))
    execute("sim_action", {action:{watch:stringToNumber(input.value)}});
}
</script>

<template>
    <div class="body">
        <div class="format-select">
            <h4 style="margin-left: auto">display format:</h4>
            <select v-model="selectedFormat" style = "width:60px;height:40px">
                <option selected value="hex">hex</option>
                <option value="dec">dec</option>
                <option value="bin">bin</option>

            </select>
        </div>
        <br>
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
        <input class="watchlist-input" style="height:30px" v-model="input">
        <button @click="watchListUpdate()">watch</button>
    </div>
    <table class="watch-table">
        <thead>
            <tr>
                <th>variable</th>
                <th>value</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(value) in formatedWatchedRegisters">
                <th>{{value[0]}}</th>
                <td>{{value[1]}}</td>

            </tr>
        </tbody>
    </table>

</template>

<style scoped>
.body {
    display: flex;
    flex-wrap: wrap;
}

.format-select {
    display: flex;
    max-height: 60px;
    align-items: center;
    width: 100%;
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
.watch-table {
    width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.watch-table thead tr {
    background-color: #009879; /* Adjust to your brand color */
    color: #ffffff;
    text-align: left;
}

.watch-table th,
.watch-table td {
    padding: 12px 15px;
    border: 1px solid #dddddd;
}

.watch-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

/* Zebra striping for better readability */
.watch-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.watch-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

/* Make the variable name column slightly bold/distinct */
.watch-table tbody th {
    font-weight: 600;
    color: #333;
    background-color: #fafafa;
}

</style>