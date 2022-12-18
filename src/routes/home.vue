<template>
    <div class="app home">
        <div class="home-header">
            <div class="home-header-left">
                <span class="home-header-title">Mitch's Injection Timer</span>
            </div>
            <div class="home-header-right">
                <span>
                    {{displayTime(currentTime, 'HH:mm')}}
                </span>
            </div>

        </div>
        <div class="home-container">
            <aside class="home-left">
                <icon 
                    type="play" 
                    label="Start" 
                    :class="inProgress == 2 ? '__isDisabled' : ''"
                    v-if="inProgress !== 1" 
                    @click="startInjecting"
                />
                <icon 
                    type="stop" 
                    label="Stop" 
                    class="__isDanger"
                    @click="stopInjecting"
                    v-if="inProgress === 1" 
                />
            </aside>
            <section class="home-center">
                <figure class="progress-circle">
                    <div class="circle-border" :style="`background-image: conic-gradient(#1391B2 ${stepProgress}%, #eee ${stepProgress}%, #eee)`"></div>
                    <div class="circle-mask"></div>

                    <span class="progress-text">
                        <span v-if="inProgress == 0">
                            -
                        </span>
                        <span v-if="inProgress == 1">
                            {{stepProgress}}%
                        </span>
                        <span v-if="inProgress == 2">
                            Done
                        </span>
                    </span>
                </figure>
                    
                

                <span class="time-left">
                    <span v-if="inProgress == 0">
                            &nbsp;
                    </span>
                    <span v-if="inProgress == 1">
                        {{stepTimeRemaining}} seconds left
                    </span>
                    <span v-if="inProgress == 2">
                        -
                    </span>
                </span>
                


                <span class="progress-status">
                    {{currentStep}}/{{maxSteps}}
                </span>
                


                <div class="progress-remaining">

                    <span v-if="inProgress == 0">
                        <span class="progress-remaining-left">Expected completion time</span>
                        <span class="progress-remaining-right">{{displayTime(completionTimestamp, 'HH:mm')}}</span>
                    </span>
                    <span v-if="inProgress == 1">
                        <span class="progress-remaining-left">Total time remaining</span>
                        <span class="progress-remaining-right">~{{completionTimeRemaining}} seconds</span>
                    </span>
                    <span v-if="inProgress == 2">
                        -
                    </span>
                    
                </div>
            </section>

            <aside class="home-right">
                <!-- Hier zou nog het 1 en ander kunnen komen -->
            </aside>
        </div>

        <site-footer />
    </div>
</template>


<script>
import siteFooter from "./../components/site-footer.vue"
import {defineComponent} from "vue"
import MitchDB from "../stores/mitchdb";
import Icon from "./../components/icon.vue"
import dayjs from "dayjs"
import _ from "lodash"

export default defineComponent ({ 
    name: "homePage",
    components: {siteFooter, Icon},
    props: [],
    setup() {
        const mitchDB = MitchDB();

        return {
            mitchDB,
        }
    },
    data() {
        return {
            stepProgress: 0,
            interval: null,
            currentTime: 0,
            completionTimestamp: 0
        }
    },
    computed: {
        inProgress() {
            return this.mitchDB.document.progress
        },
        stepDuration() {
            // Amount of time in miliseconds
            return this.mitchDB.document.injectionTime + this.mitchDB.document.closingTime
        },  
        stepTimeRemaining() {
            const seconds = this.stepDuration/1000
            const timePassed = Math.round((this.stepProgress/100*seconds)*100)/100
            return Math.round((seconds - timePassed)*100)/100
        },
        currentStep() {
            return this.mitchDB.document.currentStep
        },
        maxSteps() {
            return this.mitchDB.document.maxSteps
        },
        completionTimeRemaining() {
            let duration = this.stepDuration * (this.maxSteps - this.currentStep);
            duration -= Math.round((this.stepProgress/100*this.stepDuration)*100)/100;
            return Math.round(duration/1000)
        },
        // completionTimestamp() {
        //     var now = dayjs().add(this.completionTimeRemaining, 'second')
        //     return now.unix()
        // }
    },
    mounted() {
        this.updateCurrentTime()
    },
    methods: {
        startInjecting() {
            if (this.mitchDB.document.currentStep == 0) {
                this.mitchDB.document.currentStep = 1
            }
            this.mitchDB.document.progress = 1
            this.interval = setInterval(() => {
                if (this.mitchDB.document.progress != 1 ) {
                    return
                }

                if (this.mitchDB.document.currentStep >= this.mitchDB.document.maxSteps) {
                    this.mitchDB.document.progress = 2
                    this.mitchDB.update()
                    return
                }

                this.stepProgress +=1;
                
                if (this.stepProgress > 100) {
                    this.stepProgress = 0
                    this.mitchDB.document.currentStep ++
                    if (this.mitchDB.document.currentStep == this.mitchDB.document.maxSteps) {
                        this.mitchDB.document.progress = 2
                        this.mitchDB.update()
                        clearInterval(this.interval);
                    }
                    this.mitchDB.update()
                }
            },(this.stepDuration) / 100)
        },
        stopInjecting() {
            this.mitchDB.document.progress = 0
            this.stepProgress = 0

            clearInterval(this.interval);
            this.mitchDB.update()
        },
        displayTime(unixTimestamp, format) {
            if (_.isNumber(unixTimestamp)) {
                return dayjs.unix(unixTimestamp).format(format)
            }
            return
        },
        updateCurrentTime() {
            setInterval(() => {
                this.completionTimestamp = dayjs().add(this.completionTimeRemaining, 'second').unix()
                this.currentTime = dayjs().unix()
            }, 1000)
        }
    }
})

</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.home-container {
    height: calc(100vh - 218px);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
}
.home-header {
    font-size: 18px;
    color: #fff;
    background-color: $accentColor;
    padding: 16px 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.home-header-title {
    font-size: 24px;
    font-weight: bold;
}

.home-center {
    background-color: #fff;
    height: 100%;
    display: flex;
    margin: auto;
    justify-content: flex-end;
    flex-flow: column;
    align-items: center;
    padding-bottom: 64px;

    .time-left {
        text-align: center;
        display: inline-block;
        width: 100%;
        margin-top: 16px;
        display: inline-block;
        margin-bottom: 8px;
    }
}

.progress-status {
    color: $accentColor;
    font-size: 48px;
    text-align: center;
    display: inline-block;
    width: 100%;
    font-weight: bold;
}

.progress-remaining {
    display: inline-block;
    color: $textColor;
}
 
.progress-remaining-right {
    font-size: 30px;
    padding-left: 8px;
    transform: translateY(4px);
    display: inline-block;
    opacity: 0.8;
}

.progress-circle {
    width: calc(50vh - 92px);
    height: calc(50vh - 92px);
    margin: 0;
    position: relative;
    border-radius: 100%;
    overflow: hidden;
    .circle-mask {
        width: calc(100% - 64px);
        height: calc(100% - 64px);
        left: 32px;
        top: 32px;
        position: absolute;
        background-color: #fff;
        border-radius: 100%;
        // z-index: 1;
    }
    .circle-border {
        position: absolute;
        width: 100%;
        height: 100%;
        // background-image: conic-gradient(red, blue);
    }
    .progress-text {
        position: absolute;
        left: 0;
        right: 0;
        color: $textColor;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        font-size: 32px;
        line-height: 1em;
    }
}

.home-left {
    padding-left: 64px;
    height: 100%;
    align-items: flex-end;
    display: flex;
    padding-bottom: 64px;
    width: 128px;
    
    .icon {
        width: 100%;
        color: $accentColor;
        font-size: 24px;

        &.__isDisabled {
            color: $grey;
        }
        &.__isDanger {
            color: $red;
        }
    }
}

.home-right {
    padding-right: 64px;
    height: 100%;
    align-items: flex-end;
    display: flex;
    padding-bottom: 64px;
    width: 128px;
    
    .icon {
        width: 100%;
        color: $accentColor;
    }
}
</style>