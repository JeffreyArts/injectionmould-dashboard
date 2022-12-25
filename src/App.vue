<template >
  <router-view />
</template>


<script setup>
    
import SocketIO from "./stores/socketio";
import MitchDB from "./stores/mitchdb";
const socketIO = SocketIO()
const mitchDB = MitchDB()
mitchDB.load()
socketIO.init()
</script>

<style src="./assets/scss/index.scss"></style>
