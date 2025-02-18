import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import primevueLocale from '/utils/primevueLocale';

const app = createApp(App);
app.use(PrimeVue, {
    ripple: true,
    locale: primevueLocale,
    theme: {
        preset: Aura
    }
});
app.mount('#app');
