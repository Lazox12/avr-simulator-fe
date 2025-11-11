<script setup lang="ts">

import HomeProperty from "@/components/home/HomeProperty.vue";
import {execute} from "@/command_service.ts";
let mcuValues = await execute<Array<string>>("get_mcu_list");
if(mcuValues===null){
    mcuValues = [""]
}
</script>

<template>
    <HomeProperty caption="mcu" :values="mcuValues"/>
</template>

<style scoped>

</style>