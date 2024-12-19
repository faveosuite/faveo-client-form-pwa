import { getValueToSubmit} from "../../helpers/formUtils.js";

const RECUR_ADDITIONAL_INFO = {
  id: null,
  name: '',
  interval: '',
  delivery_on: '',
  start_date: '',
  end_date: '',
  execution_time: ''
}

const TEMPLATE_ADDITIONAL_INFO = {
  id: null,
  name: ''
}

/**
 * `formDataMap` => This will be a Map of key(unique) and value(selected value with any Data Type)
 * `submitApiEndpoint` => SubmitEndpoint for each form insatnce
 */
class FaveoForm {
  constructor (scenario = 'create') {
    this.formDataMap = new Map();
    this.formDataMap.set('scenario' , scenario);
    this.submitApiEndpoint = '';
  }
}

const state = {
  category: null,

  isBatchTicketMode: false,

  recurAdditionalInfo: RECUR_ADDITIONAL_INFO,

  templateAdditionalInfo: TEMPLATE_ADDITIONAL_INFO,

  formAdditionalInfo: '',

  recaptchaKey: '',

  editorAttachments : [],

  faveoFormData: {},

  /**
   * Used for checking if child form inside a form is loading.
   * for eg. requester form in ticket form
   */
  childFormLoading: false,

  selectedReporter: 0,

  selectedValues: [],

  selectedOrgRelatedDept : [],
  isSetAttachmentsData : [],

  sourceId : '',

  apiKey : ''

}

const getters = {
  getCategory: (state) => state.category,

  getAttachmentsData: (state) => state.isSetAttachmentsData,

  getBatchTicketMode: (state) => state.isBatchTicketMode,

  getRecurAdditionalInfo: (state) => state.recurAdditionalInfo,

  getTemplateAdditionalInfo: (state) => state.templateAdditionalInfo,

  getFormAdditionalInfo: (state) => state.formAdditionalInfo,

  getFaveoFormData: (state) => state.faveoFormData,

  getEditorAttachments: (state) => state.editorAttachments,

  getRecaptchaKey: (state) => state.recaptchaKey,

  getChildFormLoading: (state) => state.childFormLoading,

  getReporter: (state) => state.selectedReporter,

  getSelectedValues: (state) => state.selectedValues,

  getSelectedOrgRelatedDept: (state) => state.selectedOrgRelatedDept,

  getSource: (state) => state.sourceId,

  getApiKey: (state) => state.apiKey,
}

const mutations = {
  setCategory:(state, category) => state.category = category,

  setAttachmentsData: (state, value) => state.isSetAttachmentsData = value,

  setSelectedValues: (state, value) => state.selectedValues = value,

  setBatchTicketMode: (state, value) => state.isBatchTicketMode = value,

  updateRecurProperties: (state, { key, value }) => state.recurAdditionalInfo[key] = value,

  updateTemplateProperties: (state, { key, value }) => state.templateAdditionalInfo[key] = value,

  updateFormAdditionalProperties: (state, value) => {
    state.formAdditionalInfo = value;
  },

  setEditorAttachments: (state, value) => state.editorAttachments = value,

  setRecaptchaKey: (state, value) => state.recaptchaKey = value,

  setSource: (state, value) => state.sourceId = value,

  setApiKey: (state, value) => state.apiKey = value,

  setChildFormLoader: (state, value) => state.childFormLoading = value,

  // Will create new FaveoForm Instance
  createNewFormInstance: (state, {formUniqueKey, scenario}) => {
    state.faveoFormData[formUniqueKey] = new FaveoForm(scenario);
    state.recurAdditionalInfo = RECUR_ADDITIONAL_INFO;
    state.templateAdditionalInfo = TEMPLATE_ADDITIONAL_INFO;
    state.recaptchaKey = "";
    state.editorAttachments = [];
  },


  // Update faveo form instance object
  setFormData: (state, {id, formUniqueKey, isDefault, selectedValue, optionLabel, appendValue}) => {

    // Update formValues
    const value = getValueToSubmit(selectedValue, isDefault, optionLabel, id, appendValue);

    if( id == 'organisation_department' ){
      state.selectedOrgRelatedDept = selectedValue;
    }

    if( id == 'requester' ){
      state.selectedReporter = value;
    }

    if( id == 'asset_ids'){

      let arr = []
      for(let item in selectedValue ){
        arr.push( selectedValue[item] );
      }
      state.selectedValues = arr;
    }

    state.faveoFormData[formUniqueKey] && state.faveoFormData[formUniqueKey].formDataMap.set(id, value);

  },

  deleteFormDataByKey: (state, data) => {

    let _formData = state.faveoFormData[data.formUniqueKey];

    if (_formData) _formData.formDataMap.delete(data.key);

  },

  destroyFormInsatnce: (state, formUniqueKey) => delete state.faveoFormData[formUniqueKey],

  updateSubmitApiEndpoint: (state, { formUniqueKey, submitApiEndpoint }) => state.faveoFormData[formUniqueKey].submitApiEndpoint = submitApiEndpoint

}

const actions = {
  updateCategory: ( {commit}, category) => commit('setCategory', category),

  setAttachmentsData: ( {commit}, value) => commit('setAttachmentsData', value),

  setSelectedValues: ( {commit}, value) => commit('setSelectedValues', value),

  setBatchTicketMode: ({ commit }, value) => commit('setBatchTicketMode', value),

  updateRecurProperties: ({ commit }, data) => commit('updateRecurProperties', data),

  updateTemplateProperties: ({ commit }, data) => commit('updateTemplateProperties', data),

  updateFormAdditionalProperties: ({ commit }, data) => {
    commit('updateFormAdditionalProperties', data)
  },

  setRecaptchaKey: ({ commit }, value) => commit('setRecaptchaKey', value),

  setSource: ({ commit }, value) => commit('setSource', value),

  setApiKey: ({ commit }, value) => commit('setApiKey', value),

  setEditorAttachments: ({ commit }, value) => commit('setEditorAttachments', value),

  setFormData: ({ commit }, data) => commit('setFormData', data),

  deleteFormDataByKey: ({ commit }, data) => commit('deleteFormDataByKey', data),

  createNewFormInstance: ({ commit }, data) => commit('createNewFormInstance', data),

  destroyFormInsatnce: ({ commit }, formUniqueKey) => commit('destroyFormInsatnce', formUniqueKey),

  updateSubmitApiEndpoint: ({ commit }, data) => commit('updateSubmitApiEndpoint', data),

  startChildFormLoader: ({ commit }) => commit('setChildFormLoader', true),

  stopChildFormLoader: ({ commit }) => commit('setChildFormLoader', false),
}

export default { state, getters, mutations, actions }

