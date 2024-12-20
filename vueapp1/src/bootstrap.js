import lodash from 'lodash-core';

window._ = lodash;

import './assets/css/common.scss';
import './assets/css/dynamicSelectCommon.css';
import './assets/css/popover.css';
import './assets/css/tooltip.css';
import 'vue-select/dist/vue-select.css';
import 'vue-datepicker-next/index.css';
import 'intl-tel-input/build/css/intlTelInput.css';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

window.app = app;

import globalMixin from "./mixins/globalMixin.js";

app.mixin(globalMixin);

import { VTooltip } from 'floating-vue';

function getDynamicContent(value) {

    value = String(value); // Convert value to string

    const language = sessionStorage.getItem('app_language');
    const isSpecialLanguage = ['kr', 'zh-hans', 'zh-hant'].includes(language);
    const isSpecialLanguage2 = ['vi', 'id', 'no','ar','pt','ru','de'].includes(language);
    const hasLineBreak = /<br\s*\/?>/.test(value);
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    let lengthCondition;
    switch (true) {
        case isSpecialLanguage:
            lengthCondition = 45;
            break;
        case isSpecialLanguage2:
            lengthCondition = 90;
            break;
        case hasLineBreak:
            lengthCondition = 52;
            break;
        case hasSpecialCharacters && (language ==='en' || language === 'en-gb'):
            lengthCondition = 95;
            break;
        default:
            lengthCondition = 100;
    }

    const breakCount = (value.match(/<br\s*\/?>/g) || []).length;

    return (breakCount >= 2) || (value.length >= lengthCondition)
        ? `<p class="text-left m-0">${value}</p>`
        : value;
}

const CustomTooltip = {
    beforeMount(el, binding) {
        if (binding.value) {
            const content = getDynamicContent(typeof binding.value === 'object' && binding.value.content ? binding.value.content : binding.value);
            const updatedBindingValue = {
                ...binding.value,
                content,
                html: true
            };

            el.setAttribute('title', content);
            VTooltip.beforeMount(el, {...binding, value: updatedBindingValue});
        }
    }
};

app.directive('tooltip', CustomTooltip);

import 'floating-vue/dist/style.css'

import mitt from 'mitt';
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
window.emitter = emitter;

import 'es6-promise/auto';

import store from "./store/index.js";

import { boolean, lang, getSubStringValue} from "./helpers/extraLogics.js";

try {

    window.$ = window.jQuery = jQuery;

} catch (e) { }

import VueProgressBar from "@aacassandra/vue3-progressbar";

const options = {
    color: "rgb(0, 154, 186)",
    failedColor: "red",
    thickness: "3px",
    transition: {
        speed: "2s",
        opacity: "0.6s"
    },
    autoRevert: true,
    location: "top",
    inverse: false,
    autoFinish: false
};

app.use(VueProgressBar, options)

import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css"
app.component("infinite-loading", InfiniteLoading);

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';

window.axios = axios;

/**
 * Cache object for the request object
 */
let requestObjectCache = null;
let totalAxiosRequests = 0;
let successfulResponses = 0;
let loaderStarted = false;
let setLoader = false;
let progressStatus = 0;
let stopClearAxiosCount = true;
let fromSetLoader = false;

/**
 * Clear the request cache object after 500 miliseconds
 */
let clearRequestCache = function() {
    setTimeout(() => {
        requestObjectCache = null;
    }, 500);
}

// Function to clear Axios count and finish loader
let ClearAxiosCount = ()=>{
    stopClearAxiosCount = true;
    setTimeout(()=>{
        if(stopClearAxiosCount){
            progressStatus = app.config.globalProperties.$Progress.get()
            if(progressStatus !== 0){
                app.config.globalProperties.$Progress.finish()
                stopClearAxiosCount = false;
                totalAxiosRequests = 0;
                successfulResponses = 0;
                loaderStarted = false;
            }
        }
    }, 90000)
}

// Function to start the loader if not already started
const startLoader = () => {
    if (!loaderStarted) {
        app.config.globalProperties.$Progress.start();
        if(!fromSetLoader){
            successfulResponses = 0;
        }
        loaderStarted = true;
        setLoader = true;
        fromSetLoader = false;
        ClearAxiosCount();
    }
};

/**
 * AXIOS Request Interceptor
 *
 * This interceptor is used for rejecting duplicating API call
 * The time window is 250 miliseconds
 *
 */
window.axios.interceptors.request.use((request) => {
    /**
     * Allow request if
     * 1. it's first API call of the App
     * 2. request object doesn't match the cache object
     * 3. requested same API after 250 miliseconds
     */

    if (requestObjectCache === null || JSON.stringify(request) !== requestObjectCache || request.url.includes('http://')  || request.url.includes('https://')) {
        requestObjectCache = JSON.stringify(request);
        clearRequestCache();
        totalAxiosRequests++
        startLoader();
        return request;
    } else { // Reject the API call
        return Promise.reject({
            duplicateRequestRejection: true,
            message: 'Request rejected because of duplicate API call'
        });
    }
});

window.axios.interceptors.response.use((response) => {

    if(totalAxiosRequests !== 0) {
        successfulResponses++;
    }

    // Finish loader and reset counters if all requests are successful
    if ((successfulResponses === totalAxiosRequests) && response.status === 200) {

        if(successfulResponses === 1 && totalAxiosRequests === 1){
            app.config.globalProperties.$Progress.finish()
        }else{
            setTimeout(() => app.config.globalProperties.$Progress.finish(), 500);
        }
        if (stopClearAxiosCount) {
            stopClearAxiosCount = false; // Reset the flag
        }
        successfulResponses = 0;
        totalAxiosRequests = 0;
        loaderStarted = false;
    } else if (setLoader) {
        // Set loader progress based on the total number of requests
        const progressValue = totalAxiosRequests <= 3 ? 60 : (totalAxiosRequests <= 6 ? 50 : 30);
        app.config.globalProperties.$Progress.set(progressValue);
        setLoader = false;
    }else if(successfulResponses > totalAxiosRequests){
        // Finish loader if more successful responses than expected
        setTimeout(() => app.config.globalProperties.$Progress.finish(), 100);
        if (stopClearAxiosCount) {
            stopClearAxiosCount = false; // Reset the flag
        }
        successfulResponses = 0;
        totalAxiosRequests = 0;
        loaderStarted = false;
    }
    else{
        // Increase loader progress based on the total number of requests
        progressStatus = app.config.globalProperties.$Progress.get()
        if(progressStatus === 0){
            loaderStarted = false;
            fromSetLoader = true;
            startLoader()
        }
        const increaseValue = totalAxiosRequests <= 3 ? 5 : (totalAxiosRequests <= 6 ? 4 : 3);
        app.config.globalProperties.$Progress.increase(increaseValue);
    }

    return response

},function (error) {

    // Handle errors, finish loader, and handle specific error statuses
    app.config.globalProperties.$Progress.finish()

    if (stopClearAxiosCount) {
        stopClearAxiosCount = false; // Reset the flag
    }
    successfulResponses = 0;
    totalAxiosRequests = 0;
    loaderStarted = false;

    if (error.response.status === 401) {

        store.dispatch('setAlert', { type: 'danger', message: 'Unauthorized!', component_name: 'layout' });

        setTimeout(()=>{

            window.location = window.axios.defaults.baseURL;
        },2000);
        // Decrement the total count for non-200 responses
        totalAxiosRequests--;

        return Promise.reject(error);
    }else if(error.response.status !== 200){
        totalAxiosRequests--;
    }

    return Promise.reject(error);

});

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * injects components into a container when passed event is triggered
 * NOTE: Will be used to inject html and javascipt code into existing view. Most important used for bilding faveo plugins
 *
 * @param  {String} componentName     Name of the component that you want to inject
 * @param  {Any} componentInstance    Vue component instance. For eg. require('path/to/the/component')
 * @param  {String} eventName         Name of the event to which this component has to be injected
 * @param  {String} containerId     Id of the container(for eg. id of the div) where component has to be injected
 * @return undefined
 */
export const injectComponentIntoView = (componentName ,componentInstance, eventName, containerId, panel = 'agent') => {

    // let routePanel = panel === 'admin' ? adminRouter : 'agentRouter';

    // register an event, as soon as that event comes, append the component into it
    window.emitter.on( eventName, (data) => {
        // console.log('========',eventName, componentName ,componentInstance, eventName, containerId)
        // what to do if extra parameters is passed with the event ?
        // SOLUTION 1 : emit another event with that data that can be observed by the component
        // SOLUTION 2 : pass that as prop (prefer more)

        // making the appending asychronous so that appending happens only after div is present in the DOM
        setTimeout(()=>{

            let container = document.getElementById(containerId);

            // so that it appends only once
            if(container !== null && document.getElementById(componentName) === null){
                let parentNode = document.createElement('div');
                parentNode.setAttribute('id', componentName);

                let node = document.createElement(componentName);

                // before appending make sure to pass props
                node.setAttribute('data', JSON.stringify(data));

                parentNode.appendChild(node);
                container.appendChild(parentNode);

                let component = {};

                component[componentName] = componentInstance;

                let expose = null

                const childApp = createApp({ render: () => expose = h(componentInstance, { data : JSON.stringify(data)}) })

                // childApp.use(routePanel);

                Object.assign(childApp._context, app._context)

                childApp.mount('#'+componentName)
            }
        },100)

    });
}

import {h} from 'vue';

app.config.globalProperties.h = h;

app.config.globalProperties.$filters = {

    checkValue(value,length) {

        if (!value) return '---'

        return value.name ? getSubStringValue(value.name,length) : getSubStringValue(value,length)
    }
}

/**
 * For show/hide Recaptcha in pages
 */
app.directive("captcha", function(el, binding, vnode) {

    let value = binding.value;

    if(value) {

        if(sessionStorage.getItem('applyfor').includes(value)) {

            el.style.display = "block";

        } else { el.style.display = "none";  }

    } else {

        el.style.display = "block";
    }
});

app.directive('focus-first-input', {
    mounted(el) {
        const firstField = el.querySelector('input, textarea, select');
        if (firstField) {
            firstField.focus();
        }
    }
});
//=============================================== vee-validate start ===============================================//

import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';

import { localize } from '@vee-validate/i18n';

import AllRules from '@vee-validate/rules';

Object.keys(AllRules).forEach(rule => {
    defineRule(rule, AllRules[rule]);
});

configure({

    generateMessage: localize({

        en: {
            messages: {

                required: () => lang('this_field_is_required'),

                email: () => lang('invalid_email'),

                numeric : () => lang('invalid_number'),

                date_format: () => lang('invalid_date_format'),

                max: () => lang('max_length_exceeded'),

                regex: () => lang('invalid_field_format'),

                phone: () => lang('invalid_mobile'),

                min: (ctx) => `${lang('this_field_must_be_at_least')} ${ctx.rule.params[0]} ${lang('characters')}`,
            }
        }
    }),
})

app.component('ValidationObserver', Form);
app.component('ValidationProvider', Field);
app.component('ErrorMessage', ErrorMessage);

//=============================================== vee-validate end ===============================================//

// Observer for Infinite Scrolling
import { ObserveVisibility } from 'vue-observe-visibility';

app.directive('observe-visibility', {
    beforeMount: (el, binding, vnode) => {
        vnode.context = binding.instance;
        ObserveVisibility.bind(el, binding, vnode);
    },
    update: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind,
});

// Install components globally
// import TinyMCE from './components/Common/tinyMCE/TinyMCE.vue';
// import TinyMCEWithValidation from './components/Common/tinyMCE/TinyMCEWithValidation.vue';
// import FormRenderer from "./components/Common/NewForm/FormRenderer.vue";
// import Alert from "./components/MiniComponent/Alert.vue";
// import FaveoFormClientPanel from "./components/Client/FaveoFormClientPanel.vue";
// import FormGenerator from "./components/Common/NewForm/FormGenerator.vue";
// import FormSectionRenderer from "./components/Common/NewForm/FormSectionRenderer.vue";
// app.component('tiny-editor', TinyMCE)
// app.component('tiny-editor-with-validation', TinyMCEWithValidation)
// app.component('form-renderer', FormRenderer)
// app.component('alert', Alert)
// app.component('faveo-form-client-panel', FaveoFormClientPanel)
// app.component('FormGenerator',FormGenerator);
// app.component('FormSectionRenderer', FormSectionRenderer);