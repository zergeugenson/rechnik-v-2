// noinspection TypeScriptValidateTypes

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import router from "./router"
import '@/style.css';
import '@/assets/styles/index.scss';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import material from '@primevue/themes/aura';
import primevueLocale from '/utils/primevueLocale';

import Button from 'primevue/button';
import Toast from 'primevue/toast';
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

app.use(router).mount('#app');
