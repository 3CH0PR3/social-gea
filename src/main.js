import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './index.css';

document.documentElement.dataset.theme = import.meta.env.VITE_APP_THEME ?? 'green';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#root');
