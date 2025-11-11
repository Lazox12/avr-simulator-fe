<script setup lang="ts">
import {Operand, PartialInstruction, RawInstruction} from "@/structs.ts";
import {execute} from "@/command_service.ts";
import AsmTablePopup from "@/components/asm/AsmTablePopup.vue";
interface Props{
    inst:PartialInstruction;
}
const {inst} = defineProps<Props>();
let hoverTimeout :any|null = null;
let popupData:string = "";
let popupVisibility:boolean = false;
const instructionList = await getInstructionList();

function mouseEnter(data:Promise<string>|string,address:number,column:number):void{
    hoverTimeout = setTimeout(async () => {
        console.log("test")
        if(typeof data !== "string"){
            data = await data;
        }
        popupData = data;
        popupVisibility = true;
        let f = document.getElementById("asm-table-col-"+column+"-"+address);
        let pop = document.getElementById("asm-popup");
        if(f===null || pop===null){
            console.error(data,address,column);
            return;
        }
        let rect = f.getBoundingClientRect();
        console.log(rect);
        pop.style.top = (rect.top+rect.height) + "px";
        pop.style.left = rect.left + "px";
    }, 1500)
}
function mouseLeave(){
    if (hoverTimeout === null) {
        return;
    }
    clearTimeout(hoverTimeout);
    let pop = document.getElementById("asm-popup");
    if (pop === null) {
        return;
    }
    popupVisibility = false;
    popupData = "";
}
async function printInstructionPopup(opcode_id:number):Promise<string>{
    let i = await getInstruction(opcode_id);
    return `description: ${i.description}<br>action: ${i.action}`;

}
async function getInstructionList(): Promise<RawInstruction[]>{
    let x= localStorage.getItem("instruction-list");
    let i:RawInstruction[];
    if (x ===null){
        let a = await execute<RawInstruction[]>("get_instruction_list")
        if(a!==null){
            localStorage.setItem("instruction-list",JSON.stringify(a));
            i = a;
        }
        i = [];
    }else{
        i = JSON.parse(x)
    }

    return i;
}
function getInstruction(opcode_id:number){
    let res = instructionList.at(opcode_id);
    if(res!==undefined){
        return res;
    }
    if(opcode_id==999){
        return {
            action: "nothing",
            binMask: 0xffff,
            binOpcode: -1,
            constraints: null,
            description: "not a valid instruction, probably a constant stored in flash",
            len: -1,
            name: ".word",
            opcode: ".word"

        }
    }
}
function renderOperand(op:Operand[]|null) {
    let def:Operand = {
        name: "",
        constraint:"-1",
        value: 0,
        operandInfo: null,
    }
    if (op ===null){
        op = new Array<Operand>();
    }
    const result = [...op];
    while (result.length < 3) {
        result.push(def);
    }
    return result.slice(0, 3); // ensure only 3
}
function printOperandPopup(operand:Operand):string{
    return `value: ${operand.value.toString(16)} <br>register mask: ${operand.operandInfo?.registerMask} <br>description: ${operand.operandInfo?.description}`;
}
function printOperandValue(op:Operand):string{
    if (op.operandInfo!=null){
        console.log(op.operandInfo);
        return op.operandInfo.registerName
    }

    switch(op.constraint){
        case "r":{
            return "r"+String(op.value);
        }
        case "d":{
            return "r"+String(op.value);
        }
        case "v":{
            return "r"+String(op.value);
        }
        case "a":{
            return "r"+String(op.value);
        }
        case "w":{
            return "r"+String(op.value);
        }
        case "e":{
            switch (op.value){
                case 3: return "X";
                case 2: return "Y";
                case 0: return "Z";
                default: return "cant deocde"
            }
        }
        case "b":{
            switch (op.value){
                case 0: return "Z";
                case 1: return "Y";
                default: return "cant deocde"
            }
        }
        case "z":{
            if(op.value!=0){
                return "Z+";
            }
            return "";
        }
        case "M":{
            return "0x"+op.value.toString(16);
        }
        case "n":{
            return "0x"+op.value.toString(16);
        }
        case "s":{
            return "0x"+op.value.toString(16);
        }
        case "P":{
            return "0x"+op.value.toString(16);
        }
        case "p":{
            return "0x"+op.value.toString(16);
        }
        case "K":{
            return "0x"+op.value.toString(16);
        }
        case "i":{
            return "0x"+op.value.toString(16);
        }
        case "j":{
            return "0x"+op.value.toString(16);
        }
        case "l":{
            return "."+String(op.value);
        }
        case "L":{
            return "."+String(op.value);
        }
        case "h":{
            return "0x"+op.value.toString(16);
        }
        case "S":{
            return "0x"+op.value.toString(16);
        }
        case "E":{
            return "0x"+op.value.toString(16);
        }
        case "o":{
            return String(op.value);
        }
        default:{
            return 'error invild constraint:'+op.constraint;
        }
    }
}
function printComment(i:PartialInstruction):string|undefined{
    switch (i.commentDisplay) {
        case "None":
            return "";
        case "Bin":
            return "0b"+parseInt(i.comment).toString(2);
        case "Dec":
            return parseInt(i.comment).toString(10);
        case "Oct":
            return "0c"+parseInt(i.comment).toString(8);
        case "Hex":
            return "0x"+parseInt(i.comment).toString(16);
        case "String":
            return i.comment;
    }
    return undefined;
}
</script>

<template>

            <tr>
                <td contenteditable>{{"0x"+inst.address.toString(16)}}</td>
                <td
                    :id="'asm-table-col-1-'+inst.address"
                    @mouseenter="mouseEnter(printInstructionPopup(inst.opcodeId), inst.address, 1)"
                    @mouseleave="mouseLeave()"
                    contenteditable>
                    {{ (getInstruction(inst.opcodeId)).name }}
                </td>
                <template v-for="(op,index) of renderOperand(inst.operands)" :key="index">
                <td
                    v-if="op.constraint=='-1'"
                    :id="'asm-table-col-'+(index+2)+'-'+inst.address">
                </td>
                <td
                    v-else-if="op.operandInfo===null"
                    :id="'asm-table-col-'+(index+2)+'-'+inst.address"
                    contenteditable>
                    {{printOperandValue(op)}}
                </td>
                <td
                    v-else
                    :id="'asm-table-col-'+(index+2)+'-'+inst.address"
                    @mouseenter="mouseEnter(printOperandPopup(op),inst.address,index+2)"
                    @mouseleave="mouseLeave()"
                    contenteditable>
                    {{printOperandValue(op)}}
                </td>
                </template>
                <td
                    :id="'asm-table-col-4-'+inst.address"
                    contenteditable>
                    {{printComment(inst)}}
                </td>
            </tr>
            <asm-table-popup :visibility="popupVisibility" :data="popupData"/>


</template>

<style scoped>

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    z-index: 10;
    position: relative;
}
tr:nth-child(even) {
    background-color: #dddddd;
}
table.floatThead-table {
    border-top: none;
    border-bottom: none;
    background-color: #fff;
}

th {
    position: sticky;
    left:1%;
    width: 10%;
    background: white;
    z-index: 20;
}
</style>