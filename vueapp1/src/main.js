import './bootstrap';
import 'es6-promise/auto';
import store from "./store/index.js";
import { FulfillingBouncingCircleSpinner } from 'epic-spinners';

app.component('fulfilling-bouncing-circle-spinner', FulfillingBouncingCircleSpinner);

import Loader from './components/Client/Pages/ReusableComponents/Loader.vue';
app.component('loader', Loader);

import FormRenderer from "./components/Common/NewForm/FormRenderer.vue";
app.component('FormRenderer', FormRenderer);

import FormSectionRenderer from "./components/Common/NewForm/FormSectionRenderer.vue";
app.component('FormSectionRenderer', FormSectionRenderer);

import FormFieldRenderer from "./components/Common/NewForm/FormFieldRenderer.vue";
app.component('FormFieldRenderer', FormFieldRenderer);

app.use(store);
app.mount('#app')
