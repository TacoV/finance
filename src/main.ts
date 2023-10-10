import './assets/main.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const app = createApp(App)
app.use(PrimeVue)
app.component('Button', Button)
app.component('FileUpload', FileUpload)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.mount('#app')
