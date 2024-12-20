<template>

	<div class="pl-3 pr-3 pt-2">

		<TinyMCEWithValidation v-if="formField.data_type ==='htmltextarea'" :id="formField.key"
		                       :name="formField.key"
		                       :label="formField.label" :value="selectedValue || ''" :hint="formField.description"
		                       :isInlineForm="isInlineForm" :onChange="onChange" :rules="validationRules"
		                       :required="isRequiredField" :mediaOption="formField.media_option"
		                       :attachments="attachments"
		                       :getAttach="getAttachments" :panel="panel"
		                       :tip-rule="formField.show_description" :place_holder="getPlaceholder('long_text')"
		                       :labelLength="25">

		</TinyMCEWithValidation>

		<DateTimePicker v-if="formField.data_type === 'date'" :type="formField.request_time_information ? 'datetime' : 'date'" :label="formField.label"
		                :value="selectedValue"
		                :id="formField.key" :name="formField.key" :onChange="onChange"
		                :required="isRequiredField"
		                :format="formField.request_time_information ? 'MMMM DD YYYY HH:mm:ss' : 'MMMM DD YYYY'" :clearable="true" :hint="formField.description"
		                :isInlineForm="isInlineForm"
		                :rules="validationRules" outputFormat="YYYY-MM-DD HH:mm:ss" from="form"
		                :tip-rule="formField.show_description" :place="getPlaceholder('select_date')" :labelLength="25">

		</DateTimePicker>

		<!-- Dynamic Select with options form api -->
		<DynamicSelect v-if="(formField.data_type === 'api' || formField.data_type === 'multiselect') && !isMultipleRequester"
		               :id="formField.key" :label="formField.label" :multiple="formField.data_type === 'multiselect'"
		               :name="formField.key" :apiEndpoint="apiInfoUrl" :value="selectedValue" :onChange="onChange"
		               :optionLabel="'name'"
		               :required="isRequiredField"
		               :actionBtn="getActionButtonObj"
		               :apiParameters="apiParams()"
		               :isInlineForm="isInlineForm" :rules="validationRules" :hint="formField.description" :strlength="75"
		               :tip-rule="formField.show_description" :formIsFor="formType"
		               :fieldUniqueName="formField.key" :show-new-button="false" :labelLength="25"
		               :disabled="formField.disabled || false"
		>
		</DynamicSelect>

		<DynamicSelect v-if="formField.data_type === 'select' && formField.title !== 'Api' && showSelectField"
		               :id="formField.key" :label="formField.label" :multiple="false"
		               :name="formField.key" :apiEndpoint="apiInfoUrl" :value="selectedValue" :onChange="onChange"
		               :optionLabel="'label'"
		               :required="isRequiredField"
		               :actionBtn="getActionButtonObj"
		               :apiParameters="apiParams()"
		               :isInlineForm="isInlineForm" :rules="validationRules" :hint="formField.description" :strlength="75"
		               :tip-rule="formField.show_description" :formIsFor="formType"
		               :fieldUniqueName="formField.key" :labelLength="25"
		               :disabled="formField.disabled || false"
		>
		</DynamicSelect>

		<DynamicSelect v-if="formField.data_type === 'select' && formField.title === 'Api'" :id="formField.key" :label="formField.label"
		               :multiple="false"
		               :name="formField.key" :elements="dropdownOptions" :value="selectedValue" :onChange="onChange"
		               :required="isRequiredField" :optionLabel="optionLabel" :isInlineForm="isInlineForm"
		               :rules="validationRules"
		               :hint="formField.description" :strlength="75"
		               :tip-rule="formField.show_description"
		               :fieldUniqueName="formField.key" :labelLength="25">
		</DynamicSelect>

		<FileUpload v-if="formField.key === 'requester' && isMultipleRequester && panel !== 'client'"
		            :label="formField.label" :value="selectedValue" :id="formField.key" :name="formField.key"
		            :onChange="onChange" :required="isRequiredField" accept=".csv,.xlxs" :isInlineForm="isInlineForm"
		            rules="required" :tip-rule="formField.show_description" :labelLength="25">
		</FileUpload>

		<div class="form-check checkbox multi-requester-checkbox text-end mr-1" v-if="showMultiRequesterCheckbox">

			<input type="checkbox" class="form-check-input"  v-model="isMultipleRequester" name="isMultipleRequester"
			       @change="clearSelectedValue()">
			<label class="control-label" > {{ trans('upload_multi_requester') }}</label>
		</div>

		<DynamicSelect v-if="formField.data_type === 'taggable'" :id="formField.key" :label="formField.label"
		               :multiple="true" :taggable="true" :name="formField.key" :elements="[]" :value="selectedValue"
		               :onChange="onChange" :required="isRequiredField" :optionLabel="optionLabel" :isInlineForm="isInlineForm"
		               :rules="validationRules" :hint="formField.description" :strlength="75"
		               :tip-rule="formField.show_description" :labelLength="25">
		</DynamicSelect>

		<DynamicSelect v-if="formField.data_type === 'taggable-api'"
		               :id="formField.key" :label="formField.label"
		               :multiple="true" :taggable="true" :name="formField.key"
		               :value="selectedValue" :onChange="onChange"
		               :required="isRequiredField"
		               :optionLabel="optionLabel"
		               :isInlineForm="isInlineForm" :rules="taggableApiDynamicSelectRules"
		               :hint="formField.description" :strlength="75"
		               :tip-rule="formField.show_description"
		               :apiEndpoint="apiInfoUrl" :labelLength="25">
		</DynamicSelect>

		<TextField
			v-if="formField.data_type === 'text' || formField.data_type === 'textarea' || formField.data_type === 'number' || formField.data_type === 'decimal' || formField.data_type === 'email' || formField.data_type === 'float'"
			:id="formField.key" :label="formField.label" :type="formField.data_type" :name="formField.key"
			:value="selectedValue" :onChange="onChange" :required="isRequiredField" :isInlineForm="isInlineForm"
			:rules="validationRules" :pattern="formField.pattern" :hint="formField.description" :defaultKey="formField.key"
			:validation-message="formField.validation_message" :placehold="getSimplePlaceholder(formField.data_type)"
			:tip-rule="formField.show_description" :autofocus="formField.auto_focus" :disabled="formField.disabled"
			:keypressEvt="keypressEvent" :pasteEvt="pasteEvent" :inputStyle="inputStyle" :labelLength="25">
		</TextField>

		<ClientRequester v-if="formField.data_type === 'client-panel-requester' && !defaultRequester" :id="formField.key"
		                 :label="formField.label"
		                 :name="formField.key" :value="selectedValue" :onChange="onChange"
		                 :required="isRequiredField"
		                 :isInlineForm="isInlineForm" :hint="formField.description" :rules="validationRules"
		                 :actionBtn="getActionButtonObj" :autofocus="formField.auto_focus"
		                 :tip-rule="formField.show_description" :inputStyle="inputStyle" :labelLength="25">
		</ClientRequester>

		<RadioField v-if="formField.data_type === 'radio'" :name="formField.key" :label="formField.label"
		            :hint="formField.description" :required="isRequiredField" :options="formField.options"
		            :value="selectedValue" :onChange="onChange" :isInlineForm="isInlineForm" :rules="validationRules"
		            :tip-rule="formField.show_description" :labelLength="25">
		</RadioField>

		<CheckboxField v-if="formField.data_type === 'checkbox'" :name="formField.key" :label="formField.label"
		               :hint="formField.description" :required="isRequiredField" :options="formField.options"
		               :value="selectedValue" :onChange="onChange" :isInlineForm="isInlineForm" :rules="validationRules"
		               :tip-rule="formField.show_description" :labelLength="25">
		</CheckboxField>

		<MobileField v-if="showMobileField && formField.data_type === 'mobile'"
		             :id="formField.key" :label="formField.label" :type="formField.data_type" :name="formField.key"
		             :value="selectedValue" :onChange="onChange" :required="isRequiredField" :isInlineForm="isInlineForm"
		             :rules="validationRules" :pattern="formField.pattern" :hint="formField.description"
		             :validation-message="formField.validation_message"
		             :tip-rule="formField.show_description" :autofocus="formField.auto_focus" :disabled="formField.disabled"
		             :keypressEvt="keypressEvent" :pasteEvt="pasteEvent" :inputStyle="inputStyle" :placehold="formField.place_holder"
		             :countryCode="country_code" @countryCode="onCountryCodeUpdate($event, 'country_code')"
		             :extensionEnabled="formField.enable_extension" :ext="formField.enable_extension ? formField.union : []" :extValue="extValue"
		             :onExtChange="onExtChange" :labelLength="25" :apiKey="apiKey">
		</MobileField>

		<template v-if="formField.data_type === 'file'">

			<FileUpload v-if="showFileField" :label="formField.label" :value="selectedValue" :name="formField.key"
			            :onChange="onChange" :required="isRequiredField" :id="formField.key" accept=""
			            :isInlineForm="isInlineForm" :rules="validationRules" :hint="formField.description"
			            :multiple="formField.key!=='organisation_logo' "
			            :tip-rule="formField.show_description" :labelLength="25"
			            v-bind="formField.key !== 'organisation_logo' ? { sizeModules: sizeModules } : {}" :formType="formType">
			</FileUpload>

			<CustomLoader v-if="!showFileField"></CustomLoader>
		</template>

		<template v-if="formField.data_type === 'image'">

			<AssetImageUpload v-if="showFileField" :label="formField.label" :value="selectedValue" :name="formField.key"
			                  :onChange="onChange" :required="isRequiredField" :id="formField.key"
			                  accept="image/*" :isInlineForm="isInlineForm" :rules="validationRules" :hint="formField.description"
			                  :tip-rule="formField.show_description" :labelLength="25">
			</AssetImageUpload>

			<CustomLoader v-if="!showFileField"></CustomLoader>
		</template>

		<template v-if="formField.data_type === 'custom'">

			<div id="faveo-app-extra-form-field">{{ customTypeFormFieldMounted() }}</div>
		</template>

		<transition name="modal">

			<UserFormModal v-if="showCreateUserModal" :show="showCreateUserModal" :isInlineForm="isInlineForm"
			               :closeModal="onUserPopupClose" :updateNewRequester="onChange" :labelLength="25"
			               :panel="panel" :inputStyle="inputStyle" :btnStyle="btnStyle" :formId="formId" :apiKey="apiKey">
			</UserFormModal>
		</transition>
	</div>

	<div v-for="node in childNodes" :key="node.id" class="form-field-wrapper">

		<FormFieldRenderer v-if="node.data_type !== 'section'"
		                   :formId="formId"
		                   :form-field="node"
		                   :formUniqueKey="formUniqueKey"
		                   :input-style="inputStyle"
		                   :btn-style="btnStyle"
		                   :panel="panel"
		                   :scenario="scenario"
		                   :formType="formType"
		                   :isInlineForm="isInlineForm"
		                   :apiKey="apiKey"
		                   :selectDependencyId="selectDependencyId"
		                   :selectDependencyKey="selectDependencyKey"
		                   :callingFrom="callingFrom">
		</FormFieldRenderer>

		<FormSectionRenderer v-if="node.data_type === 'section'" :formSection="node"
		                     :isChildNodes="true"
		                     :formId="formId"
		                     :formUniqueKey="formUniqueKey"
		                     :panel="panel"
		                     :scenario="scenario"
		                     :formType="formType"
		                     :btn-style="btnStyle"
		                     :input-style="inputStyle"
		                     :isInlineForm="false"
		                     :sizeModules="sizeModules"
		                     :apiKey="apiKey"
		                     :selectDependencyId="selectDependencyId"
		                     :selectDependencyKey="selectDependencyKey"
		                     :callingFrom="callingFrom">
		</FormSectionRenderer>
	</div>
</template>

<script>

import {MULTIPLE_PROPERTY_HELPER, boolean} from '../../../helpers/extraLogics';
import {getFormFieldValue} from '../../../helpers/formUtils';
import axios from 'axios';
import {mapGetters} from 'vuex';
import DynamicSelect from "../../MiniComponent/FormField/DynamicSelect.vue";
import TextField from "../../MiniComponent/FormField/TextField.vue";
import RadioField from "./RadioField.vue";
import CheckboxField from "./CheckboxField.vue";
import FileUpload from "../../MiniComponent/FormField/fileUpload.vue";
import DateTimePicker from "../../MiniComponent/FormField/DateTimePicker.vue";
import UserFormModal from "./UserFormModal.vue";
import ClientRequester from "../../MiniComponent/FormField/ClientRequester.vue";
import AssetImageUpload from "../../MiniComponent/FormField/assetimageUpload.vue";
import TinyMCEWithValidation from "../tinyMCE/TinyMCEWithValidation.vue";
import CustomLoader from "../../MiniComponent/Loader.vue";
import MobileField from "./MobileField.vue";
import FormSectionRenderer from "./FormSectionRenderer.vue";

export default {

	name: 'form-field-renderer',

	/**
	 * Props for the component:
	 * - formUniqueKey: Form unique key to pick data from the Store (String, required)
	 * - formField: Form field object (Object, required)
	 * - panel: One category may be present in different panels(admin/client/agent) (String, default: 'agent')
	 * - scenario: Scenario will be the mode of the FaveoForm Category; may be create/edt/recur etc (String, required)
	 * - formType: Form type will be the category of the FaveoForm (ticket, user ...) (String, default: '')
	 * - inputStyle: Style object for input elements (Object, default: () => ({}))
	 * - btnStyle: Style object for buttons (Object, default: () => ({}))
	 * - sizeModules: Size modules for the form (String, default: '')
	 * - isInlineForm: Flag to determine if the form is inline or not (Boolean, default: true)
	 * - formId: ID of the form (String, default: '')
	 * - apiKey: API key (String, default: '')
	 * - selectDependencyId: Select dependency ID (String|Number, default: '')
	 * - selectDependencyKey: Select dependency key (String, default: 'id')
	 * - recur_mode: Recur mode (String, default: '')
	 */
	props: {
		formUniqueKey: {type: String, required: true},
		formField: {type: Object, required: true},
		panel: {type: String, default: 'agent'},
		scenario: {type: String, require: true},
		formType : { type : String, default : ''},
		inputStyle : { type : Object, default : ()=>{}},
		btnStyle : { type : Object, default : ()=>{}},
		sizeModules: { type : String, default : ''},
		isInlineForm: { type: Boolean, default: true },
		formId: { type: String, default: '' },
		apiKey : { type : String, default : '' },
		selectDependencyId : { type : [String, Number], default : '' },
		selectDependencyKey : { type : String, default : 'id' },
		recur_mode: {type: String, default: ''},
		callingFrom: { type : String, default : ''}
	},

	components: {
		FormSectionRenderer,
		MobileField,
		TinyMCEWithValidation,
		DynamicSelect,
		TextField,
		RadioField,
		CheckboxField,
		FileUpload,
		DateTimePicker,
		UserFormModal,
		ClientRequester,
		AssetImageUpload,
		CustomLoader
	},

	/**
	 * Data properties for the component:
	 * - childNodes: Array to store child nodes (Array, default: [])
	 * - dropdownOptions: Array to store dropdown options (Array, default: [])
	 * - isMultipleRequester: Flag to indicate if multiple requesters are selected (Boolean, default: false)
	 * - selectedValue: Currently selected value (String, default: '')
	 * - showCreateUserModal: Flag to control the visibility of the create user modal (Boolean, default: false)
	 * - attachments: Array to store attachments (Array, default: [])
	 * - taggableApiDynamicSelectRules: Rules for taggable API dynamic selection (String, default: '')
	 * - showFileField: Flag to control the visibility of the file field (Boolean, default: false)
	 * - showSelectField: Flag to control the visibility of the select field (Boolean, default: false)
	 */
	data() {

		return {
			childNodes: [],
			dropdownOptions: [],
			isMultipleRequester: false,
			selectedValue: '',
			showCreateUserModal: false,
			attachments: [],
			taggableApiDynamicSelectRules: '',
			showFileField : false,
			showSelectField: false,


			country_code: null,
			showMobileField: false,
			extValue: '',

			entryFor : '',
			showModal : false,
			defaultRequester : import.meta.env.VITE_DEFAULT_REQUESTER
		}
	},

	/**
	 * Lifecycle hook called before the component is mounted:
	 * - Checks the form field data type and scenario to determine actions
	 * - If the data type is 'select' and the scenario is 'edit', 'fork', or 'recur' with 'edit' mode,
	 *   calls the getSelectFieldOptions method to fetch select field options
	 * - Otherwise, sets the showSelectField flag to true
	 * - If the form field applies to a form and has a value with an ID, calls the getAppliedForm method
	 *   to retrieve applied form data
	 */
	beforeMount() {

		if(this.formField.key === 'approver_id' && this.formField.value) {

			window.emitter.emit('disableSpecificFormField',{identifier : 'status_id', disabled: true, setValue: false });
		}

		if (this.formField.data_type === 'select' && this.formField.value && (this.scenario === 'edit' || this.scenario === 'fork' || (this.scenario === 'recur' && this.recur_mode === 'edit') || this.formField.title !== 'Api')) {

			this.getSelectFieldOptions();

		} else if(this.formField.data_type === 'select' && this.formField.title === 'Api') {

			this.getSelectFieldOptions();

		} else {

			this.showSelectField = true;
		}

		if(this.formField.data_type === 'mobile') {

			if(this.formField.value && this.formField.value.includes(" ")){

				this.country_code = this.formField.value.split(' ')[0];
			}

			if(this.formField.enable_extension && this.formField.union && this.formField.union.length) {

				this.extValue = this.formField.union[0].value ? this.formField.union[0].value : '';

				this.onExtChange(this.extValue, this.formField.union[0].key)
			}

			setTimeout(()=>{
				this.showMobileField = true;
			},200);


		} else {

			setTimeout(()=>{
				this.showMobileField = true;
			},200);
		}

		if(this.formField.apply_form && this.formField.value && this.formField.value.id) {

			this.getAppliedForm(this.formField.value, this.formField.apply_model_category);
		}
	},

	created() {

		window.emitter.on('updateSpecificFormField', (value)=>{

			if(value.name === this.formField.key) {

				this.onChange(value.value, value.name);
			}
		});
	},

	/**
	 * Lifecycle hook called after the component is mounted:
	 * - Sets the selected value by calling the getFormFieldValue method with relevant parameters
	 * - Delays setting the showFileField flag to true after 2000 milliseconds
	 * - Binds values from the URL
	 * - Renders nested form fields if any based on the selected value
	 * - Updates form values to the store
	 */
	mounted() {

		this.selectedValue = getFormFieldValue(this.formField.value, this.formField.options, this.formField.default, this.formField.data_type, this.formField.key);

		setTimeout(() => {

			this.showFileField = true;

		}, 2000)

		this.bindValuesFromUrl();

		this.renderNestedFormFieldsIfAny(this.selectedValue);

		this.updateFormValuesToStore();

		if(this.defaultRequester && this.formField.data_type === 'client-panel-requester') {
			this.onChange(this.defaultRequester, 'requester');
		}
	},

	computed: {

		/**
		 * Computed property that maps the 'getFaveoFormData' getter to the component.
		 * Computed property that maps the 'getBatchTicketMode' getter to the component.
		 */
		...mapGetters({getFaveoFormData: 'getFaveoFormData', isBatchTicketMode: 'getBatchTicketMode'}),

		/**
		 * Computes the API URL by parsing the api_info property of the formField object.
		 * If no API URL is found, returns an empty string.
		 * If the API URL is '/api/dependency/departments?meta=true' or '/api/dependency/help-topics?meta=true', appends the panel type to the URL.
		 * @returns {string} The computed API URL.
		 */
		apiInfoUrl() {

			let apiUrl = MULTIPLE_PROPERTY_HELPER.convertStringOfPropertiesToObject(this.formField.api_info).url;

			if(!apiUrl && this.formField.api_info) {

				apiUrl = this.formField.api_info + '?mode=render';

				if(this.panel === 'client' && this.formField.title === 'Select') {
					apiUrl = apiUrl + '&panel=' + this.panel;
				}

			} else if(apiUrl === '/api/dependency/departments?meta=true' || apiUrl === '/api/dependency/help-topics?meta=true') {

				apiUrl = apiUrl + '&panel=' + this.panel;
			}

			return apiUrl
		},

		/**
		 * Computes the label key from the api_info property of the formField object.
		 * If no label key is found, returns 'label'.
		 * @returns {string} The computed label key.
		 */
		optionLabel() {
			return MULTIPLE_PROPERTY_HELPER.convertStringOfPropertiesToObject(this.formField.api_info).key || 'label';
		},

		/**
		 * Computes whether the form field is required.
		 * @returns {boolean} True if the form field is required, otherwise false.
		 */
		isRequiredField() {
			return Boolean(this.formField.required);
		},

		/**
		 * Computes the validation rules based on the formField's data type and required status.
		 * If the form field is required, adds the 'required' rule.
		 * If the form field's data type is 'email', adds the 'email' rule.
		 * Returns the concatenated validation rules.
		 * @returns {string} The computed validation rules.
		 */
		validationRules() {

			let validationObj = [];

			if (this.isRequiredField) {
				validationObj.push('required')
			}

			if (this.formField.data_type === 'email') {
				validationObj.push('email')
			}

			return validationObj.join('|')
		},

		/**
		 * Computes the action button object based on the formField key and panel type.
		 * If the form field key is 'requester', determines the action text based on the panel type.
		 * Emits a 'cropModalChanged' event.
		 * Returns the action button object with text, isFor, and action properties.
		 * If the form field key is not 'requester', returns null.
		 * @returns {Object|null} The computed action button object or null.
		 */
		getActionButtonObj() {

			if (this.formField.key === 'requester' && this.callingFrom !== 'changeTicketStatus') {
				// on client panel, user will be registering itself. But on agent panel, agent will be creating other users
				let text = this.panel === 'client' ? 'Register' : 'Create User';
				window.emitter.emit("cropModalChanged", "");
				return {text: text, isFor: 'requester', action: () => this.showCreateUserModal = true}
			} else {
				return null;
			}
		},

		/**
		 * Computes whether to show the multi-requester checkbox based on the formField key and panel type.
		 * Returns true if the form field key is 'requester' and the panel type is 'agent', and the batch ticket mode is true.
		 * Otherwise, returns false.
		 * @returns {boolean} True if the multi-requester checkbox should be shown, otherwise false.
		 */
		showMultiRequesterCheckbox() {
			return this.formField.key === 'requester' && this.isBatchTicketMode && this.panel === 'agent';
		},

		shouldCheckTicketStatus() {
			return this.callingFrom === 'changeTicketStatus' &&
				(this.formField.title === 'Help Topic' ||
					this.formField.title === 'Department' ||
					this.formField.title === 'Select');
		}
	},

	methods: {

		onUserPopupClose() {

			this.showCreateUserModal = false;

			window.emitter.emit('updateTicketCategory', 'ticket')
		},

		getField(name){

			this.entryFor = this.formField;

			this.showModal = true;
		},

		onClose() {

			this.showModal = false;

			this.$store.dispatch('unsetValidationError');
		},

		createdValue(value,name) {

			this.onChange(value,name);
		},

		// returns placeholder text
		getPlaceholder(value) {

			return this.formField.place_holder ? this.formField.place_holder : this.lang(value)
		},

		/**
		 * returns placeholder text based on field type
		 * */
		getSimplePlaceholder(type) {

			let placeholder = 'short_text';

			if(this.formField.place_holder){

				placeholder = this.formField.place_holder;

				return placeholder;
			}

			if(type === 'email') { placeholder = 'email@example.com' }

			else if(type === 'textarea'){ placeholder = 'long_text'; }

			else if(type === 'mobile'){ placeholder = '9876543210'; }

			return this.lang(placeholder);
		},

		onCountryCodeUpdate(value, name) {

			this[name] = value;
		},

		onExtChange(value = "", name) {

			this.extValue = value;

			const formData = {
				id: name,
				isDefault: 0,
				formUniqueKey: this.formUniqueKey,
				selectedValue: this.extValue || '',
				optionLabel: this.optionLabel,
			}

			this.$store.dispatch('setFormData', formData)
		},

		/**
		 * Retrieves the applied form based on the provided value and model.
		 * Emits the 'modelFormFieldFetched' event with the fetched data.
		 * @param {Object} value - The value object.
		 * @param {string} model - The model category.
		 */
		getAppliedForm(value,model) {

			let currentFormId = this.$route.params && this.$route.params.id ? this.$route.params.id :'';

			axios.get('/fetch/default-custom-fields/'+value.id+'/'+model,{ params : { id: currentFormId, category : this.formType, mode: 'render', scenario: this.scenario }})
				.then((response) => {

					window.emitter.emit('modelFormFieldFetched', { nodes : response.data.data.nodes, identifier : this.formField.form_identifier});
				})
				.catch((error) => {
					console.error(error);
				})
		},

		/**
		 * Computes the API parameters based on the component's properties.
		 * @returns {Object} The computed API parameters.
		 */
		apiParams() {

			if(this.getFaveoFormData[this.formUniqueKey] ) {

				this.getFaveoFormData[this.formUniqueKey].formDataMap.set('category', this.formType);

				if(this.apiKey) {

					this.getFaveoFormData[this.formUniqueKey].formDataMap.set('api_key', this.apiKey);

				}

				if(this.selectDependencyId) {

					this.getFaveoFormData[this.formUniqueKey].formDataMap.set('id', this.selectDependencyId);
				}

				if(this.shouldCheckTicketStatus) {
					this.getFaveoFormData[this.formUniqueKey].formDataMap.set('checkTicketStatus', true);
				}

				return this.getFaveoFormData[this.formUniqueKey].formDataMap;

			} else {

				return this.apiKey ? {api_key : this.apiKey} : {}
			}
		},

		/**
		 * Handles the keypress event based on the provided event, name, and type.
		 * Prevents non-numeric characters for type 'number'.
		 * Prevents non-numeric characters and multiple decimal points for types 'float' and 'decimal'.
		 * @param {Event} evt - The keypress event.
		 * @param {string} name - The name of the field.
		 * @param {string} type - The data type of the field.
		 */
		keypressEvent(evt, name, type) {

			if (type === 'number' || type === 'mobile') {

				evt = (evt) ? evt : window.event;

				var charCode = (evt.which) ? evt.which : evt.keyCode;

				if ((charCode > 31 && (charCode < 48 || charCode > 57))) {

					evt.preventDefault();
				} else {

					return true;
				}
			} else if (type === 'float' || type === 'decimal') {

				evt = evt || window.event;

				var charCode = (evt.which) ? evt.which : evt.keyCode;

				var value = evt.target.value;

				// Allow only one decimal point and not as first character
				if ((charCode == 46 && value.indexOf('.') !== -1) || (charCode == 46 && value.length === 0)) {
					evt.preventDefault();
				}

				// Allow numeric characters and decimal point
				else if ((charCode >= 48 && charCode <= 57) || charCode == 46) {
					return true;
				}

				// Prevent any other characters
				else {
					evt.preventDefault();
				}
			}
		},

		/**
		 * Handles the paste event based on the provided event, name, and type.
		 * Prevents non-numeric characters for type 'number'.
		 * Prevents non-numeric characters and multiple decimal points for types 'float' and 'decimal'.
		 * @param {Event} evt - The paste event.
		 * @param {string} name - The name of the field.
		 * @param {string} type - The data type of the field.
		 */
		pasteEvent(evt, name, type) {

			if (type === 'number' || type === 'mobile') {

				evt = (evt) ? evt : window.event;

				if (evt.clipboardData.getData('Text').match(/[^\d]/)) {

					evt.preventDefault();
				}

			} else if (type === 'float' || type === 'decimal') {

				evt = evt || window.event;

				var clipboardData = evt.clipboardData || window.clipboardData;

				var pastedText = clipboardData.getData('Text');

				// Allow negative numbers and only one decimal point
				if (!/^[-]?\d*\.?\d*$/.test(pastedText)) {

					evt.preventDefault();
				}
			}
		},
		/**
		 * Updates the attachments and dispatches them to the store.
		 * @param {Array} value - The array of attachments.
		 */
		getAttachments(value) {

			this.attachments = value;

			this.$store.dispatch('setEditorAttachments', this.attachments)
		},

		/**
		 * Determines if an element is an email address.
		 * @param {Object} element - The element to check.
		 * @param {number} index - The index of the element.
		 * @param {Array} array - The array being traversed.
		 * @returns {boolean} True if the element is an email address, otherwise false.
		 */
		isMail(element, index, array) {

			let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/;

			return emailPattern.test(element.email ? element.email : element.name);
		},

		/**
		 * Handles the change event for the form field.
		 * Executes various actions based on the provided value and name.
		 * Updates the selected value, form data to the store, and renders nested form fields.
		 * @param {*} value - The selected value.
		 * @param {string} name - The name of the field.
		 */
		onChange(value, name) {

			if(name === 'approver_id') {

				window.emitter.emit('disableSpecificFormField',{identifier : 'status_id', disabled: !!value, setValue: !!value });
			}

			if (this.formField.data_type === 'decimal' && typeof value === 'string' && value.endsWith('.')) {
				value += '0';
			}

			if(this.formField.apply_form && value && value.id) {

				this.getAppliedForm(value, this.formField.apply_model_category);
			}

			if(name === 'requester'){

				this.selectedValue= value.user_name;
			}

			if (name === 'help_topic_id' || name === 'department_id' || name === 'team_id') {

				window.emitter.emit('updateDynamicSelect')
			}

			if (this.formType === 'requester') {

				if (name === 'organisation' || name === 'organisation_department') {

					window.emitter.emit('updateDynamicSelect')
				}
			}

			if (name === 'adhoc_approvers_agent') {

				if (!value.length) {

					this.taggableApiDynamicSelectRules = ''

				} else {

					this.taggableApiDynamicSelectRules = value.every(this.isMail) ? '' : 'email'
				}
			}

			this.selectedValue = value ? value : ''

			this.updateFormValuesToStore()

			this.renderNestedFormFieldsIfAny(value);

			if(this.formField.value && this.formField.value !== this.selectedValue) {

				if(this.formField.options && this.formField.options.length) {

					let currNodes = this.formField.options.find((option) => option.label === this.formField.value);

					if(currNodes) {

						this.removeField(currNodes.nodes);
					}
				} else if(this.formField.value && this.formField.value.nodes && this.formField.value.nodes.length) {

					this.removeField(this.formField.value.nodes);
				}
			}
		},

		removeField(array) {

			for (let i = 0; i < array.length; i++) {

				if(array[i].key) {

					this.$store.dispatch('deleteFormDataByKey', {formUniqueKey: this.formUniqueKey, key: array[i].key})

				} else if (array[i].form_fields && typeof array[i].form_fields === 'object') {

					Object.keys(array[i].form_fields).forEach(key => {

						this.removeField(array[i].form_fields[key]);
					});
				} else {

					if(boolean(array[i].options)) {

						array[i].options.forEach(element => {

							this.removeField(element.nodes ? element.nodes : [])
						})
					}
				}
			}
		},
		/**
		 * Updates the form data to the store.
		 * Dispatches the form data including id, isDefault, formUniqueKey, selectedValue, and optionLabel to the store.
		 */
		updateFormValuesToStore() {

			const formData = {
				id: this.formField.key,
				isDefault: Boolean(this.formField.default),
				formUniqueKey: this.formUniqueKey,
				selectedValue: this.selectedValue || '',
				optionLabel: this.optionLabel,
			}

			if(this.formField.data_type === 'mobile') {

				formData['appendValue'] = this.country_code;
			}

			this.$store.dispatch('setFormData', formData)
		},

		/**
		 * Renders nested form fields based on the provided value.
		 * Clears the child nodes and adds new child nodes if the value is an array or has nodes.
		 * @param {*} value - The value to render nested form fields for.
		 */
		renderNestedFormFieldsIfAny(value) {

			this.childNodes = []

			if (value) {

				if (Array.isArray(value)) {

					value.forEach(v => {
						if (boolean(v.nodes)) {
							this.childNodes.push(...v.nodes)
						}
					})

				} else if (boolean(value.nodes)) {

					this.childNodes = value.nodes
				}
			}

			if(this.callingFrom === 'changeTicketStatus') {
				window.emitter.emit('validateEditForm');
			}
		},

		/**
		 * Retrieves the select field options.
		 * Fetches option list for API field or sets dropdown options from formField options.
		 */
		getSelectFieldOptions() {

			if (boolean(this.apiInfoUrl)) {

				if(this.formField.title === 'Api') {

					// Fetch option list -- specifically for 3rd party api config form-field
					axios.get(this.apiInfoUrl).then((response) => {

						this.dropdownOptions = response.data;

					}).catch((error) => {

						console.error(error);
					})

				} else {

					this.fetchOptionListForApiField();
				}

			} else {

				this.dropdownOptions = this.formField.options;
			}
		},

		/**
		 * Fetches the option list for API field.
		 * Fetches the option list from the provided API URL and updates the dropdown options.
		 */
		fetchOptionListForApiField() {

			axios.get(this.apiInfoUrl,{ params : { id: this.selectDependencyId, category : this.formType, scenario: this.scenario, 'choose_from': this.formField.value , checkTicketStatus: !!this.shouldCheckTicketStatus }})
				.then((response) => {

					this.formField.options.push(response.data.data.data[0]);

					this.renderNestedFormFieldsIfAny(response.data.data.data[0]);

					this.showSelectField = true;

					if(this.callingFrom === 'changeTicketStatus') {
						window.emitter.emit('validateEditForm');
					}

				}).catch((error) => {

				console.error(error);
			})
		},

		/**
		 * Clears the selected value.
		 */
		clearSelectedValue() {

			this.selectedValue = ''
		},

		/**
		 * Executes custom actions when the custom type form field is mounted.
		 * Emits a 'custom-type-form-field-mounted' event with relevant data.
		 */
		customTypeFormFieldMounted() {

			const data = {
				node: this.formField,
				showFilter: this.panel === "agent" || this.panel === "admin",
				formUniqueKey: this.formUniqueKey,
				scenario: this.scenario,
				category: this.formType,
				isInlineForm: this.isInlineForm,
				showDivClass: false
			};

			window.emitter.emit('custom-type-form-field-mounted', data);
		},

		/**
		 * Binds values from the URL parameters to the form field if available.
		 */
		bindValuesFromUrl() {

			let urlParams = new URLSearchParams(window.location.search);

			if(!this.formField.key) { return }

			let unique = this.formField.key.replace('_id', '');

			if (urlParams.get(unique) && !this.selectedValue) {

				if (this.formField.title === 'Api') {

					axios.get(this.apiInfoUrl, {
						params: {
							'strict-search': 1,
							'search-query': urlParams.get(unique),
							'paginate': 1
						}

					}).then(res => {

						res.data.data.data[0] && (this.selectedValue = res.data.data.data[0]);
					});
				}

				this.formField.data_type === 'client-panel-requester' && (this.selectedValue = urlParams.get(unique));
			}
		}
	},

	/**
	 * Clears the form data stored in the Vuex store before the component is destroyed.
	 */
	beforeDestroy() {

		this.$store.dispatch('deleteFormDataByKey', {formUniqueKey: this.formUniqueKey, key: this.formField.key})
	}
}
</script>


<style scoped>
.multi-requester-checkbox {
	margin-top: -15px;
}
</style>

