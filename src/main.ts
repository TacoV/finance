import './assets/main.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'

const app = createApp(App)
app.use(PrimeVue)
app.component('Button', Button)
app.component('FileUpload', FileUpload)
app.mount('#app')
