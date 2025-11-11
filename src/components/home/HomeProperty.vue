<script setup lang="ts">

interface Props{
    caption:string;
    values:string[];
}
const {caption,values} = defineProps<Props>();
</script>

<template>
    <div class="property">
        <h4 style="margin-right: 5px">{{caption}}</h4>
        <select>
            <option @value=""></option>
            <option v-for="value in values" :key="value" @value="value">{{value}}</option>
        </select>
    </div>
</template>

<style scoped>

</style>