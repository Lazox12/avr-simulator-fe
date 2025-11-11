<script setup lang="ts">
import {PartialInstruction} from '@/structs.ts';
import {ListenerService} from "@/listener_service.ts";
import AsmTableRow from "@/components/asm/AsmTableRow.vue";
let instructions:PartialInstruction[] = [];
ListenerService.instance.subscribe<PartialInstruction[]>("asm-update",(data)=>{
    instructions = data.payload;
})

function applyChanges(){

}
function clearTable(){
    instructions = [];
}
</script>

<template>
    <div>
        <table>
            <thead>
            <tr>
                <th>address</th>
                <th>instruction</th>
                <th>Operand1</th>
                <th>Operand2</th>
                <th>Operand3</th>
                <th>Comment</th>
            </tr>
            </thead>
            <tbody>
                <asm-table-row v-for="inst in instructions"
                               :key="inst.address"
                               :inst="inst"
                />
            </tbody>
        </table>
        <div style="height: 80px">

        </div>
    </div>
    <button class = "applyButton" @click="applyChanges()" id="asm-apply-changes-button" disabled> apply changes</button>
    <button class = "clearButton" @click="clearTable()" id="asm-clear-button"> clear table</button>
</template>

<style scoped>
.applyButton{
    border: 3px solid gray;
    border-radius: 5px;
    z-index: 100;
    position: fixed;
    top: 70px;
    left: 81%;
    right: 1%;
    height: 60px;
}
.clearButton{
    border: 3px solid gray;
    border-radius: 5px;
    z-index: 100;
    position: fixed;
    top: 150px;
    left: 81%;
    right: 1%;
    height: 60px;
}
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 80%;
    height: 80%;
    z-index: 10;
    position: relative;

}
td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    z-index: 10;
    position: relative;
}

th {
    position: sticky;
    left:1%;
    width: 10%;
    background: white;
    z-index: 20;
}
</style>