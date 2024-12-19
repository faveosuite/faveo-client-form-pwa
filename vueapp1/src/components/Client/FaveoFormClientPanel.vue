<template>

	<div :id="formId" class="pt-0">

		<Alert v-if="!disableEmail" componentName="faveo-form" />

		<Loader v-if="showLoader || submitFormInProgress" :duration="4000"/>

		<div v-if="formId !== 'chat-widget' && mode !== 'edit' && category === 'ticket' && formsLength > 1" class="row mb-1">

			<DynamicSelect :label="trans('select_form')" :multiple="false" name="selectedForm"
			               classname="col-sm-12" :apiEndpoint="'/from/forms/'+category+'?panel=client'" :value="selectedForm"
			               :onChange="onChange" :clearable="false" :label-style="{ display : 'none' }">

			</DynamicSelect>
		</div>

		<div v-if="showOrgField" class="row">

			<StaticSelect :label="lang('organization')"  :elements="organizations" name="organization"
			              :value="organization" classname="col-sm-12" :onChange="onOrgChange" :required="true"
			              :inputStyle="inputStyle">

			</StaticSelect>
		</div>

		<FormWithCaptcha v-if="formUniqueKey && formSelected" btnClass='btn btn-primary pull-right text-white' btnName="submit"
		                 componentName="faveo-form" :loading="!showLoader"
		                 btn_id="client-ticket-submit-button" :formSubmit="formSubmit" :page="formId == 'chat-widget' ? '' : category+'_create_client'"
		                 recaptchaContainerClass="mt-2" :input-style="inputStyle" :btn-style="btnStyle" :disableSubmit="submitFormInProgress">

			<template #fields>

				<div class="form-div">

					<ValidationObserver ref="faveoFormObserver" v-slot="{ values, errors, validate }">

						<FormRenderer
							:key="formUniqueKey"
							:fetchFormFieldApi="fetchFormFieldApi"
							:disableEmail="disableEmail"
							:formUniqueKey="formUniqueKey"
							:scenario="scenario || mode"
							:category="category"
							:panel="panel"
							:afterSubmit="afterSubmit"
							:btnStyle="btnStyle"
							:isInlineForm="false"
							:inputStyle="inputStyle"
							:formId="formId"
							:apiKey="apiKey"
							:selectDependencyId="editId">
						</FormRenderer>
					</ValidationObserver>
				</div>
			</template>
		</FormWithCaptcha>

		<div class="form-group row mt-3" v-show="!showLoader && formUniqueKey && formSelected">

			<div class="col-md-12">

				<button type="submit" class="btn btn-primary pull-right text-white" :disabled="submitFormInProgress" @click="popUpSubmit()"
				        :style="btnStyle" id="client_form_submit">
					<span><i class="fas fa-save"></i></span>
					{{ trans('submit') }}
				</button>

				<div v-if="redirectPath" class="col-xs-6 col-sm-6 pull-left col-md-8 h-100 d-flex align-items-center" :class="{align1 : language === 'ar'}">

					<router-link :to="redirectPath.route" :style="linkStyle" id="forgot_to_login">{{lang(redirectPath.text)}}</router-link>

				</div>
			</div>
		</div>
	</div>
</template>

<script>

import { getIdFromUrl} from "../../helpers/extraLogics.js";
import { getApiForFetchingFormFields, getFormUniqueKey } from '../../helpers/formUtils';
import { faveoFormCommons } from '../../mixins/faveoFormCommons';
import Loader from "../MiniComponent/Loader.vue";
import FormWithCaptcha from "../Common/NewForm/FormWithCaptcha.vue";
import DynamicSelect from "../MiniComponent/FormField/DynamicSelect.vue";
import axios from "axios";
import {errorHandler} from "../../helpers/responseHandler";
import Alert from "../MiniComponent/Alert.vue";
import FormRenderer from "../Common/NewForm/FormRenderer.vue";
import StaticSelect from "../MiniComponent/FormField/StaticSelect.vue";

export default {

	name: 'faveo-form-client-panel',

	/**
	 * Props passed to the component:
	 * - category: Specifies the category of the component. Required.
	 * - panel: Specifies the panel type of the component. Default is 'agent'.
	 * - scenario: Specifies the scenario of the component. Default is an empty string.
	 * - updateCount: Function to update the ticket count. Default is an empty function.
	 * - editApiEndpoint: Specifies the API endpoint for editing. Default is an empty string.
	 * - disableEmail: Boolean flag to determine whether email is disabled. Default is false.
	 * - layout: Specifies the layout object. Default is an empty object.
	 * - isInlineForm: Boolean flag to determine whether the form is inline. Default is true.
	 * - formId: Specifies the ID of the form. Default is 'faveo-form-client-panel'.
	 * - apiKey: Specifies the API key. Default is an empty string.
	 * - redirectPath: Object containing route and text for redirection hyperlink
	 */
	props: {
		category: { type: String, required: true },
		panel: { type: String, default: 'agent' },
		scenario: { type: String, default: '' },
		updateCount : { type : Function, default : ()=>{}},
		editApiEndpoint : { type : String, default : '' },
		disableEmail : { type : Boolean, default : false },
		layout : { type : Object , default : ()=>{}},
		isInlineForm: { type: Boolean, default: true },
		formId: { type: String, default: 'faveo-form-client-panel'},
		apiKey : { type: String, default : '' },
		editId : { type: [String,Number], default : '' },
		form_category: { type: Object, default : ()=>{} },
		showOrgField: { type: Boolean, default: false },
		auth : { type : Object, default : ()=>{}},
		loginType : { type: String, default : '' },
		redirectPath: {type: Object, default: ()=>{}}
	},

	/**
	 * Data properties for the component:
	 * - fetchFormFieldApi: Specifies the API endpoint for fetching form fields. Default is an empty string.
	 * - formUniqueKey: Unique key for the form. Default is null.
	 * - submitFormInProgress: Boolean flag indicating if form submission is in progress. Default is false.
	 * - btnStyle: Style object for buttons, with border color and background color properties based on layout configuration.
	 * - inputStyle: Style object for input fields, with border color property based on layout configuration.
	 * - selectedForm: Selected form data. Default is an empty string.
	 * - formSelected: Boolean flag indicating if a form is selected. Default is false.
	 * - linkStyle: Style object for hyperlinks
	 */
	data () {
		return {
			fetchFormFieldApi: '',
			formUniqueKey: null,
			submitFormInProgress: false,
			btnStyle : {},
			inputStyle: {},
			linkStyle: {},
			selectedForm: '',
			formSelected: false,
			organizations : '',
			organization : '',
			formsLength : 0,
		}
	},

	mixins: [faveoFormCommons],

	/**
	 * Executes before the component is mounted:
	 * - Checks if editApiEndpoint is provided.
	 * - Sets fetchFormFieldApi based on the presence of editApiEndpoint.
	 * - Sets up the formSelected flag accordingly.
	 * - If editApiEndpoint is not provided:
	 *    - Sets fetchFormFieldApi to the default endpoint.
	 *    - Retrieves editId from the current URL path.
	 *    - If the mode is 'edit', updates fetchFormFieldApi with the specific endpoint for fetching form fields based on the category and editId.
	 *    - If the mode is not 'edit', retrieves the default form value.
	 * - If editApiEndpoint is provided:
	 *    - Sets fetchFormFieldApi to the provided endpoint.
	 *    - Sets formSelected flag to true.
	 */
	beforeMount() {

		if(!this.editApiEndpoint) {

			this.fetchFormFieldApi = 'api/form/render/';

			const editId = getIdFromUrl(this.currentPath());

			if (this.mode === 'edit') {

				this.fetchFormFieldApi = getApiForFetchingFormFields(this.category, editId);

				this.formSelected = true;

			} else {

				if(this.formId === 'chat-widget') {

					this.selectedForm = this.form_category;

					this.updateFetchApi();

				} else {

					this.getDefaultFormValue();
				}
			}
		} else {

			this.fetchFormFieldApi = this.editApiEndpoint;

			this.formSelected = true;
		}
	},

	created() {

		window.emitter.on('updateTicketCategory', this.updateTicketCategory);

		window.emitter.on('updateOrgUserFormOrg', (orgId) => {
			this.organization = orgId
		})
	},

	computed: {
		/**
		 * Computes the mode of the component.
		 * @returns {string} The mode of the component, either 'edit' or 'create'.
		 */
		mode () {

			return this.currentPath().indexOf('edit') !== -1 ? 'edit' : 'create';
		},
		/**
		 * Returns the API endpoint for fetching form fields.
		 * @returns {string} The API endpoint for fetching form fields.
		 */
		fetchFormApi() {

			return this.fetchFormFieldApi;
		}
	},

	methods: {

		updateTicketCategory() {

			window.emitter.emit('storeCategoryId', this.selectedForm.id)
		},

		/**
		 * Handles the change event for form fields.
		 * @param {any} value - The new value of the form field.
		 * @param {string} name - The name of the form field.
		 */
		onChange (value, name) {

			this[name] = value;

			this.formSelected = false;

			this.updateFetchApi();
		},

		onOrgChange (value, name) {

			this[name] = value;

			const formData = {
				id: 'org_id',
				isDefault: false,
				formUniqueKey: this.formUniqueKey,
				selectedValue: value
			}

			this.$store.dispatch('setFormData', formData)
		},
		/**
		 * Retrieves the default form value.
		 */
		getDefaultFormValue () {

			this.showLoader = true;

			console.log(axios,'kjhg')
			axios.get('/from/forms/'+this.category+'?panel=client').then(res=>{

				this.formsLength = res.data.data.data.length;

				this.selectedForm = res.data.data.data[0];

				this.showLoader = false;

				this.updateFetchApi()

			}).catch(err=>{

				this.showLoader = false;

				errorHandler(err,'faveo-form')
			})
		},
		/**
		 * Updates the API endpoint for fetching form fields.
		 */
		updateFetchApi() {

			this.$store.dispatch('destroyFormInsatnce', this.formUniqueKey);

			this.$store.dispatch('unsetValidationError');

			this.fetchFormFieldApi = '/render/form?id=' + this.selectedForm.id + '&mode=render'

			setTimeout(()=>{

				this.$store.dispatch('createNewFormInstance', { formUniqueKey: this.formUniqueKey, scenario: this.scenario || this.mode });

				this.formSelected = true;
			},1)
		},

		/**
		 * it clicks the button, it clicks the button in FormWithCaptcha which in change triggers formSubmit.
		 * Reason for this workaround is to hide the submit button coming from FormWithCaptcha without breaking
		 * the functionality
		 */
		popUpSubmit() {

			if(this.organization || !this.showOrgField) {

				this.$store.dispatch('unsetValidationError');

				document.getElementById('client-ticket-submit-button').click();

			} else {

				this.$store.dispatch('setValidationError', {'organization' : this.lang('this_field_is_required')})
			}
		},
		/**
		 * Submits the form data after setting the reCAPTCHA key.
		 * @param {string} key - The key for the form data.
		 * @param {any} value - The value of the form data.
		 */
		formSubmit(key, value) {
			this.$store.dispatch('setRecaptchaKey', value)
			this.onSubmit();
		},
		/**
		 * Handles actions after the form submission.
		 * @param {object} data - The data returned after form submission.
		 */
		afterSubmit (data) {
			this.$store.dispatch('destroyFormInsatnce', this.formUniqueKey);
			let formUniqueKey = getFormUniqueKey(this.category);
			this.$store.dispatch('createNewFormInstance', { formUniqueKey, scenario: this.mode });
			this.formUniqueKey = formUniqueKey;
			this.updateCount();
			window.emitter.emit('clientFormSubmitted');
			this.organization = "";

			if(this.mode === 'create' && this.category === 'ticket' && this.auth.user_data.length !== 0){
				setTimeout(()=>{

					let id = data.data.data.encrypted_id;
					return this.$router.push('/check-ticket/'+id)
				},3000)
			}
		},
	},

	components: {
		StaticSelect,
		DynamicSelect,
		Loader,
		FormWithCaptcha,
		Alert,
		FormRenderer
	}
}
</script>

<style scoped>
#faveo-form-client-panel { padding: 1rem; width: 100%; }

#client_form_submit { margin-right: 0px !important; }
</style>

<style>
#client-ticket-submit-button {
	display: none;
}

.sdf {
	position: relative;
	flex: 1 1 auto;
	padding: 1rem;
}
</style>