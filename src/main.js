import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./routes"
import { vfmPlugin } from 'vue-final-modal'

import "./assets/scss/index.scss"
import App from "./App.vue"
const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(vfmPlugin)
    .mount("#app")