<template>
    <div>404 Not Found</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute()
console.log(route.params.pathMatch);

</script>

<style scoped lang="scss"></style>
