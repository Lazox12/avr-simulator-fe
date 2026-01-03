<script setup lang="ts">
import {Operand, PartialInstruction, RawInstruction} from '@/structs.ts';
import {ListenerService} from "@/listener_service.ts";
import AsmTableRow from "@/components/asm/AsmTableRow.vue";
import {ref, watch} from "vue";
import {execute} from "@/command_service.ts";
let instructions = ListenerService.instance.listen<PartialInstruction[]>("asm-update",[])
let breakpoints = ListenerService.instance.listen<number[]>("breakpoints-update",[])
const instructionList = await execute<RawInstruction[]>("get_instruction_list",undefined,true);
let hoverTimeout :any|null = null;
function applyChanges(){

}
function clearTable(){
    instructions.value = [];
}
function getInstruction(opcode_id:number){
    if(instructionList ===undefined){
        return;
    }
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
function printOperandValue(op:Operand|undefined):string{
    if(op===undefined){
        return ""
    }
    if (op.operandInfo!=null){
        console.debug(op.operandInfo);
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
        case "c":{
            if (op.value==1){
                return String("+");
            }
            if (op.value==1){
                return String("-");
            }
        }
        default:{
            return 'error invild constraint:'+op.constraint;
        }
    }
}
function printInstruction(instruction: PartialInstruction):string{
    let toReturn = "";
    toReturn+=getInstruction(instruction.opcodeId).name
    toReturn+=" "
    if (instruction.operands===null){
        return toReturn;
    }
    for (let op in instruction.operands){
        toReturn +=printOperandValue(instruction.operands[op]);
        toReturn+=","
    }
    toReturn =toReturn.substring(0, toReturn.length - 1);
    toReturn+="\n"
    return toReturn
}
function mouseEnter(data:Promise<string>|string,address:number):void{
    hoverTimeout = setTimeout(async () => {
        //console.log("test")
        if(typeof data !== "string"){
            data = await data;
        }
        let f = document.getElementById("asm-table-col-"+address);
        let pop = document.getElementById("asm-popup");
        if(f===null || pop===null){
            console.error(data,address);
            return;
        }
        pop.innerHTML=data
        pop.style.visibility="visible";
        let rect = f.getBoundingClientRect();
        //console.log(rect);
        pop.style.top = (rect.top+rect.height) + "px";
        pop.style.left = (rect.left+50) + "px";
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
    pop.style.visibility="hidden";
    pop.innerHTML =""
}
async function printInstructionPopup(opcode_id:number):Promise<string>{
    let i = await getInstruction(opcode_id);
    return `<p style="display: flex"">Description: ${i.description}<br> Action: ${i.action}</p>`;

}
function handleLineClick(event:MouseEvent,address:number):void{
    const x = event.clientX

    if (x > 50) {
        return
    }
    execute("sim_action", {action:{break:address}});

}
watch(breakpoints,(b_new,b_old)=>{
    console.log(b_old,b_new);
    for(let i in b_old){
        let d = document.getElementById("asm-table-col-"+b_old[i])
        if (d ===null){
            console.error("invalid elem id with param",b_old[i])
            return;
        }
        d.style.backgroundColor="";
    }
    for(let i in b_new){
        let d = document.getElementById("asm-table-col-"+b_new[i])
        if (d ===null){
            console.error("invalid elem id with param",b_new[i])
            return;
        }
        d.style.backgroundColor="rgba(255,0,0,0.3)";
    }
})

</script>

<template>
    <div class="code-container">
        <span class="line"
              :id = "'asm-table-col-'+i.address"
              :data-num=i.address.toString(16)
              @mouseenter="mouseEnter(printInstructionPopup(i.opcodeId), i.address)"
              @mouseleave="mouseLeave()"
              @click="handleLineClick($event, i.address)"
              v-for="i in instructions">{{printInstruction(i)}}
        </span>

    </div>
    <div id="asm-popup" class="popup">
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
.code-container {
    font-family: 'Courier New', monospace;
    background: #2d2d2d;
    color: #ccc;
    padding: 10px;
    counter-reset: line-number; /* Initialize the counter */
}

.line {
    display: block; /* Forces new line */
    border-radius: 5px;
    line-height: 1.5;
    width: 80%;
}

/* The magic part: generating numbers */
.line::before {
    counter-increment: line-number;
    content: attr(data-num);

    /* Styling the number */
    display: inline-block;
    width: 30px;
    margin-right: 15px;
    color: #666;
    text-align: right;
    border-right: 1px solid #555;
    padding-right: 5px;

    /* Crucial: Prevent user from selecting/copying the line numbers */
    -webkit-user-select: none;
    user-select: none;
}
.popup{
  background-color: lightgray;
  border: 3px solid gray;
  border-radius: 5px;
  z-index: 100;
  position:fixed;
  top: 30px;
  visibility: hidden;
}
#asm-popup h4,
#asm-popup p {
  display: inline;
  vertical-align: top;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  line-height: 28px;
}
</style>