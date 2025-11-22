<script setup lang="ts">

import {execute} from "@/command_service.ts";
import {computed, ref} from "vue";
import {ProjectState} from "@/structs.ts";
import {ListenerService} from "@/listener_service.ts";
let mcuValues= (await execute<Array<string>>("get_mcu_list"))?.sort();
let projectData = ListenerService.instance.listen<ProjectState>("project-update",{name:"",mcu:"",freq:0})
function getFreq(freq:number):{num:number,str:string}{
    if(freq<1000){
        return {num:freq,str:"hz"}
    }else if(freq<(10^3)){
        return {num:freq/(10^3),str:"khz"}
    }else if(freq<(10^6)){
        return {num:freq/(10^6),str:"mhz"}
    }
    return {num:freq,str:"hz"}
}
function setFreqNum(freq:number):number{

}
function setFreqStr(freq:string):number{

}
const mcuModel = computed({
    get: () => projectData.value.mcu,
    set: (v) => projectData.value.mcu = v
});
const freqModel = computed({
    get: () => getFreq(projectData.value.freq).num,
    set: (v) => projectData.value.freq = setFreqNum(v)
});
const freqModel1 = computed({
    get: () => getFreq(projectData.value.freq).str,
    set: (v) => projectData.value.freq = setFreqStr(v)
});

function callback(key:string) {
    switch (key){
        case "mcu":
            projectData.value.mcu = mcuModel.value;
            break;
        case "freq":
            projectData.value.mcu = mcuModel.value;
            break;
        default:
            throw "Unrecognized key";
    }
    console.log(projectData.value);
    execute("set_project_data",{project:projectData.value});
}

</script>

<template>
    <div class="home">
        <div class="property">
            <h4 style="margin-right: 5px">mcu:</h4>
            <select id="mcu" @change="()=>{callback('mcu')}" v-model="mcuModel">
                <option v-for="value in mcuValues" :key="value" :value="value" >{{value}}</option>
            </select>
        </div>
        <div class="property">
            <h4 style="margin-right: 5px">freq:</h4>
            <input style="width: 45px" id="freq" @change="()=>{callback('freq')}" v-model="freqModel" type="number">
            <select id="freq" @change="()=>{callback('freq')}" v-model="freqModel1">
                <option value="hz">Hz</option>
                <option value="kHz">KHz</option>
                <option value="mHz">MHz</option>
            </select>
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