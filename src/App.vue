<template >
  <router-view />
</template>


<script setup>
    
import MitchDB from "./stores/mitchdb";
const mitchDB = MitchDB()
mitchDB.load()
</script>

<style src="./assets/scss/index.scss"></style>
