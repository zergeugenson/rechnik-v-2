// noinspection TypeScriptValidateTypes

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import router from "./router"
import '@/style.css';
import 'primeicons/primeicons.css'
import App from './App.vue';
import PrimeVue from 'primevue/config';
import material from '@primevue/themes/aura';
import primevueLocale from '/utils/primevueLocale';

import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import Toast from 'primevue/toast';
import Popover from 'primevue/popover';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import ToastService from 'primevue/toastservice';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(PrimeVue, {
    ripple: true,
    locale: primevueLocale,
    theme: {
        preset: material
    }
});
app.use(ToastService);
app.component('Button', Button);
app.component('Toast', Toast);
app.component('Menubar', Menubar);
app.component('Popover', Popover);
app.component('IftaLabel', IftaLabel);
app.component('InputText', InputText);

app.use(router).mount('#app');
