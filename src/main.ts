// noinspection TypeScriptValidateTypes

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import router from "./router"
import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import primevueLocale from '/utils/primevueLocale';

import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(PrimeVue, {
    ripple: true,
    locale: primevueLocale,
    theme: {
        preset: Aura
    }
});

app.use(ToastService);

app.component('Button', Button);
app.component('Toast', Toast);

app.use(router).mount('#app');
