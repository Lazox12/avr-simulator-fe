<script setup lang="ts">
const {data,visibility} = defineProps({
    data:{type:String,required:true},
    visibility:{type:Boolean,required:true},
})
</script>

<template v-if="visibility===true">
    <div id="asm-popup" class="popup">
        <p @innerHTML="data"></p>
    </div>
</template>

<style scoped>
.popup{
    background-color: lightgray;
    border: 3px solid gray;
    border-radius: 5px;
    z-index: 100;
    position:fixed;
    top: 30px;
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