<template>
    <i class="icon">
        <div class="icon-svg" v-html="iconList[type]" />
        <span v-if="label" class="icon-label">{{label}}</span>
    </i>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import iconGears from "./../assets/icons/gears.svg?raw"
import iconPlay from "./../assets/icons/play-button.svg?raw"
import iconStop from "./../assets/icons/stop-button.svg?raw"
import iconCross from "./../assets/icons/cross.svg?raw"

export default defineComponent({
    name: "icon",
    data: () => {
        return {
            iconList: {
                gears: iconGears,
                play: iconPlay,
                cross: iconCross,
                stop: iconStop
            }
        }
    },
    props: {
        type: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: false
        }
    },
    
    created() {
    },
    mounted() {
    },
    unmounted() {
        
    },
    methods: {
        
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-decoration: none;

    .icon-svg {
        display: inline-block;
        width: 100%;
        
        svg {
            fill: currentColor;
            width: 100%;    
            height: auto;
        }
    }
    .icon-label {
        color: currentColor;
        display: inline-block;
        width: 100%;
        text-align: center;
        text-decoration: none;
        font-style: normal;
        margin-top: 8px;
    }
}
</style>
