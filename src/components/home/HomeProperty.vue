<script setup lang="ts">

import {defineComponent} from "vue";
import {execute} from "@/command_service.ts";

interface Props{
    caption:string;
    values?:string[]|string;
    callback?:Function;
}
const props = defineProps<Props>();
const caption = props.caption;
const values = function(inp?:string[]|string):string[]{

    if(typeof inp=="string"){
        return JSON.parse(inp)
    }
    if(inp===undefined){
        throw Error("inp was undefined")
    }
    return inp

}(props.values);
//console.warn(values)
let selectValue;
function callback(event:Event):void{
    console.log(event)
    if (event.target ===null){
        return;
    }
    console.log(selectValue);
    execute("set_mcu",{mcu:selectValue});
}
</script>

<template>
    <div class="property">
        <h4 style="margin-right: 5px">{{caption}}</h4>
        <select @change="callback" v-model="selectValue">
            <option @value=""></option>
            <option v-for="value in values" :key="value" :value="value">{{value}}</option>
        </select>
    </div>
</template>

<style scoped>

</style>