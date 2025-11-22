<script setup lang="ts">

import HomeProperty from "@/components/home/HomeProperty.vue";
import {execute} from "@/command_service.ts";
import {ProjectState} from "@/structs.ts";
import {ListenerService} from "@/listener_service.ts";
let mcuValues= await execute<Array<string>>("get_mcu_list");
let projectData = ListenerService.instance.listen<ProjectState>("project-update",{name:"",mcu:""})

</script>

<template>
    <HomeProperty caption="mcu" :values="mcuValues" :default="projectData.mcu"/>
</template>

<style scoped>

</style>