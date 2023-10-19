import './assets/main.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'

import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'

const app = createApp(App)
app.use(PrimeVue)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('Button', Button)
app.component('Column', Column)
app.component('DataTable', DataTable)
app.component('Dropdown', Dropdown)
app.component('FileUpload', FileUpload)
app.component('InputText', InputText)
app.component('MultiSelect', MultiSelect)
app.component('Tag', Tag)
app.mount('#app')
