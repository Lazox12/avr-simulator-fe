<script setup lang="ts">
import { execute } from "@/command_service.ts";
import { computed, ref } from "vue";
import { ProjectState } from "@/structs.ts";
import { ListenerService } from "@/listener_service.ts";

let mcuValues = (await execute<Array<string>>("get_mcu_list", undefined, true))?.sort();
let projectData = ListenerService.instance.listen<ProjectState>("project-update", { name: "", mcu: "", freq: 0 });
let autoUpdateStatus = ListenerService.instance.listen<boolean>("auto_update_status", false);

function getFreq(freq: number): string {
    if (freq < 1000) {
        return freq.toString() + "Hz"
    } else if (freq < (10 ** 6)) {
        return (freq / 1000).toString() + "KHz"
    } else {
        return (freq / (10 ** 6)).toString() + "MHz"
    }
}

function setFreq(data: string): number | undefined {
    data = data.toLowerCase();
    let n;
    if (data.search("khz") != -1) {
        n = parseFloat(data.slice(0, data.length - 3)) * 1000;
    } else if (data.search("mhz") != -1) {
        n = parseFloat(data.slice(0, data.length - 3)) * (10 ** 6);
    } else if (data.search("hz") != -1) {
        n = parseFloat(data.slice(0, data.length - 2));
    } else {
        n = parseFloat(data);
    }
    if (isNaN(n)) {
        return undefined;
    }
    return n
}

const mcuModel = computed({
    get: () => projectData.value.mcu,
    set: (v) => {
        projectData.value.mcu = v
        execute("set_mcu", { mcu: v });
    }
});

const freqModel = computed({
    get: () => { let f = getFreq(projectData.value.freq); console.log(f); return f },
    set: (v) => {
        let d = setFreq(v)
        console.log(d)
        if (d != undefined) {
            projectData.value.freq = d;
            execute("set_freq", { freq: d });
        }
    }
});

const updateModel = computed({
    get: () => autoUpdateStatus.value,
    set: (v) => {
        autoUpdateStatus.value = v;
        execute<null>("sim_action", { action: { watchUpdate: v } })
    }
});

</script>

<template>
    <div class="home">
        <div class="property">
            <h4 style="margin-right: 5px">mcu:</h4>
            <select id="mcu" v-model="mcuModel">
                <option v-for="value in mcuValues" :key="value" :value="value">{{ value }}</option>
            </select>
        </div>
        <div class="property">
            <h4 style="margin-right: 5px">freq:</h4>
            <input style="width: 80px" id="freq" v-model="freqModel" type="text" />
        </div>
        <div class="property">
            <h4 style="margin-right: 5px">auto update values:</h4>
            <input type="checkbox" id="auto-update" v-model="updateModel" />
        </div>
    </div>
</template>

<style scoped>
.home{
    display: flex;
    gap:10px;
}
.property {
    display: flex;
    align-items: center; /* vertically align */
}
</style>