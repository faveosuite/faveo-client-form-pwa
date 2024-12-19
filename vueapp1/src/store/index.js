/**
 * Its a vuex store. It is implemeted to avoid sending multiple requests to backend and store repeated data at client-side instead.
 * It can alose be used to ease data management in nested components by simply writing component state to vuex and directly reading
 * from it instead of passing it to components
 * */

import { createStore } from "vuex";

import auth from './modules/auth';

import alert from './modules/alert';

import formBuilder from './modules/formBuilder';

import axiosLoader from './modules/axiosLoader';

import formRender from './modules/formRender';

const store = createStore({

  modules : {
    auth,
    alert,
    formBuilder,
    axiosLoader,
    formRender
  },

});

export default store;
