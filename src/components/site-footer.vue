<template>
    <footer class="site-footer">
        <div class="site-footer-column">
            <form class="site-footer-row" id="current-steps" @submit="resetSteps">
                <label class="label" for="">Current</label>
                <input class="input" type="text" disabled v-model="document.currentStep">
                <button class="button" type="submit">
                    reset
                </button>
            </form>
            <form class="site-footer-row" id="max-steps">
                <label class="label" for="">Max</label>
                <input class="input" type="number" min="0"  v-model.number="document.maxSteps">
                <button class="button square" @click="decreaseMaxSteps">
                    -
                </button>
                <button class="button square" @click="increaseMaxSteps">
                    +
                </button>
            </form>
        </div>
        <div class="site-footer-column">
            <form class="site-footer-row" id="mold-closing-time">
                <label class="label" for="">Mold closing time</label>
                <span class="input" type="text" @click="moldClosingTimeModal = true" v-html="display(closingTime)"/>
            </form>
            <form class="site-footer-row" id="injection-time">
                <label class="label" for="">Injection time</label>
                <span class="input" type="text" @click="moldInjectionTimeModal = true" v-html="display(injectionTime)"/>
            </form>
        </div>
        <div class="site-footer-column">
            <router-link to="/settings">
                <icon type="gears" label="settings" />
            </router-link>
        </div>


        
        <vue-final-modal name="reset" v-model="showResetModal">
            <button class="vfm-close" @click="showResetModal = false">
                <icon type="cross" />
            </button>
            <h1>Are you sure you want to reset the current cycle?</h1>
            
            <div class="vfm-buttons-container">
                <button class="vfm-button" @click="resetCurrentStep">
                    Yes
                </button>
                <button class="vfm-button" @click="showResetModal = false">
                    No
                </button>
            </div>
        </vue-final-modal>



        <!-- Mold closing time -->
        <vue-final-modal name="reset" v-model="moldClosingTimeModal">
            <button class="vfm-close" @click="moldClosingTimeModal = false">
                <icon type="cross" />
            </button>
            <h1>Set mold closing time</h1>
            
            <div class="vfm-buttons-container __isNarrow">
                <span class="time-input-container">
                    <input class="vfm-input time-input" min="0" v-model.number="moldClosingTimeSeconds" @change="mitchDB.update" type="number">
                    <label>seconds</label>
                </span>
                <span class="time-input-container">
                    :
                </span>
                <span class="time-input-container">
                    <input class="vfm-input time-input" min="0" v-model.number="moldClosingTimeMiliseconds" @change="mitchDB.update" type="number">
                    <label>miliseconds</label>
                </span>
            </div>
        </vue-final-modal>



        <!-- Mold injection time -->
        <vue-final-modal name="reset" v-model="moldInjectionTimeModal">
            <button class="vfm-close" @click="moldInjectionTimeModal = false">
                <icon type="cross" />
            </button>
            <h1>Set mold injection time</h1>
            
            <div class="vfm-buttons-container __isNarrow">
                <span class="time-input-container">
                    <input class="vfm-input time-input" v-model.number="moldInjectionTimeSeconds" @change="mitchDB.update" type="number">
                    <label>seconds</label>
                </span>
                <span class="time-input-container">
                    :
                </span>
                <span class="time-input-container">
                    <input class="vfm-input time-input" v-model.number="moldInjectionTimeMiliseconds" @change="mitchDB.update" type="number">
                    <label>miliseconds</label>
                </span>
            </div>
        </vue-final-modal>
    </footer>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import MitchDB from "../stores/mitchdb";
import Icon from "./icon.vue"
import _ from "lodash";

export default defineComponent({
    name: "site-footer",
    data: () => {
        return {
            document: {},
            showResetModal: false,
            moldClosingTimeModal: false,
            moldInjectionTimeModal: false,
            moldInjectionTimeSeconds: 0,
            moldInjectionTimeMiliseconds: 0,
            moldClosingTimeSeconds: 0,
            moldClosingTimeMiliseconds: 0
        }
    },
    components: {
        Icon
    },
    setup() {
        const mitchDB = MitchDB();

        return {
            mitchDB,
        }
    },
    computed: {
        closingTime() {
            return this.moldClosingTimeSeconds * 1000 + this.moldClosingTimeMiliseconds
        },
        injectionTime() {
            return this.moldInjectionTimeSeconds * 1000 + this.moldInjectionTimeMiliseconds
        }
    },
    watch: {
        closingTime() {
            this.document.closingTime = this.closingTime
            // this.mitchDB.update()
        },
        injectionTime() {
            this.document.injectionTime = this.injectionTime
            // this.mitchDB.update()
        },
        mitchDB: {
            handler: function (newValue, oldValue) {
                this.moldClosingTimeSeconds = Math.floor(this.mitchDB.document.closingTime / 1000)
                this.moldClosingTimeMiliseconds = this.mitchDB.document.closingTime % 1000
                
                this.moldInjectionTimeSeconds = Math.floor(this.mitchDB.document.injectionTime / 1000)
                this.moldInjectionTimeMiliseconds = this.mitchDB.document.injectionTime % 1000
            },
            deep: true
        },
    },
    created() {
        this.document = this.mitchDB.document
    },
    mounted() {
    },
    unmounted() {
        
    },
    methods: {
        display(time) {
            if (!time) {
                time = 0
            }
            return `${time/1000} <span>seconds</span>`
        },
        resetSteps(event) {
            this.showResetModal = true;
            event.preventDefault()
        },
        resetCurrentStep() {
            this.document.currentStep = 0
            this.document.progress = 0
            this.showResetModal = false;
            this.mitchDB.update()
        },
        decreaseMaxSteps(event) {
            event.preventDefault()
            this.document.maxSteps--

            if (this.document.maxSteps < 1) {
                this.document.maxSteps = 1
                return
            }
            this.mitchDB.update()
        },
        increaseMaxSteps(event) {
            event.preventDefault()
            this.document.maxSteps++
            this.mitchDB.update()
        }
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.site-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    background-color: $accentColor;
    padding: 32px 64px;
    color: #fff;

    a {
        text-decoration: none;
        color: #fff;
    }
    
}
.site-footer-column {
    width: calc(100% / 3);

    &:nth-child(3) {
        text-align: right;

        > a { 
            display: inline-block;
        }
    }
}

.site-footer-row {
    display: flex;
    align-items: center;

    + .site-footer-row {
        margin-top: 16px;
    }
    
    .label {
        display: inline-block;
    }
}

.site-footer .input {
    background-color: #fff;
    border: 0 none transparent;
    border-radius: 4px;
    padding: 8px 16px;
    line-height: 1.4em;
    color: $textColor;
    &:focus {
        outline: 0 none transparent;
        color: $accentColor;
        font-weight: bold;
    }
    span {
        color: $grey;
    }
}
.site-footer .button {
    background-color: #fff;
    border: 0 none transparent;
    border-radius: 32px;
    padding: 8px 16px;
    font-size: 20px;
    color: $accentColor;

    &.square {
        width: 40px;
        padding-left: 0;
        padding-right: 0;
    }
}

#current-steps,
#max-steps {
    .input,
    .label {
        width: 72px;
    }
    .button {
        margin-left: 16px;
        + .button { 
            margin-left: 8px;
        }
    }
}

#current-steps .button {
    width: 90px;
}

#mold-closing-time,
#injection-time {
    .label {
        width: 144px;
    }
    .input {
        width: 144px;
        span {
            float: right;
        }
    }
}

.site-footer .icon {
    width: 64px;
}


.site-footer .time-input {
    width: 96px;
    text-align: right;
}

.site-footer .time-input-container {
    font-size: 44px;
    display: flex;
    flex-flow: column nowrap;
    text-align: center;

    &:nth-child(3) {
        input {
            text-align: left;
        }
    }

    label {
        font-size: 14px;
        margin-top: 8px;
        color: $grey;
    }
}
</style>
