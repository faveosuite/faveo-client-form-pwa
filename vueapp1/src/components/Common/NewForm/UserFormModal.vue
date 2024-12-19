<template>

	<div>

		<loader v-if="submitFormInProgress || isChildFormLoading"/>

		<modal :showModal="show" :onClose="closeModal">

			<template #title><h4>{{ panel === 'client' ? lang('register') : lang('create_user') }}</h4></template>

			<template #fields>

				<div v-show="!isChildFormLoading" id="user-form-modal-body" :class="formId === 'chat-widget' ? 'pl-2' : ''">

					<alert componentName="user-form-modal"/>

					<form-with-captcha v-if="formUniqueKey && formSelected" :loading="!isChildFormLoading" btnClass='btn btn-custom pull-right text-white' btnName="submit"
					                   componentName="user-form-modal" :btnStyle="btnStyle"
					                   btn_id="user-submit" :formSubmit="formSubmit" :page="formId === 'chat-widget' ? '' : panel === 'client' ? 'requester_create_client' : 'requester_create_agent'"
					                   recaptchaContainerClass="mt-2" :inputStyle="inputStyle" :disableSubmit="submitFormInProgress">

						<template #fields>

							<ValidationObserver ref="faveoFormObserver" v-slot="{ values, errors, validate }">

								<FormRenderer
									:key="formUniqueKey"
									:fetchFormFieldApi="fetchFormFieldApi"
									category="requester"
									scenario="create"
									:panel="panel"
									:formUniqueKey="formUniqueKey"
									:isChildForm="true"
									:inputStyle="inputStyle"
									:btnStyle="btnStyle"
									:apiKey="apiKey"
									:isInlineForm="false"
									:formId="formId"
									callingFrom="popup"
								>
								</FormRenderer>
							</ValidationObserver>
						</template>
					</form-with-captcha>
				</div>
			</template>

			<template v-show="!isChildFormLoading" #controls>

				<button type="button" class="btn"
				        :class="[panel === 'agent' || 'admin' ? 'btn-primary' : 'btn-custom text-white', 'pull-right']"
				        :disabled="submitFormInProgress"
				        @click="popUpSubmit()"
				        :style="btnStyle">
					<span><i class="fas fa-save"></i></span>
					{{ trans('submit') }}
				</button>
			</template>
		</modal>
	</div>
</template>

<script>

import {faveoFormCommons} from '../../../mixins/faveoFormCommons';
import Modal from '../../../components/Common/Modal.vue';
import Alert from "../../MiniComponent/Alert.vue";
import Loader from "../../MiniComponent/Loader.vue";
import FormWithCaptcha from "../../Common/NewForm/FormWithCaptcha.vue";
import axios from "axios";
import {errorHandler} from "../../../helpers/responseHandler";

export default {

	name: 'user-form-modal',

	/**
	 * Props passed to the component:
	 * - show: Boolean flag indicating whether the modal is displayed. Default is false.
	 * - closeModal: Function to close the modal. Required.
	 * - updateNewRequester: Function to update the new requester. Required.
	 * - panel: Specifies the panel type of the component. Default is 'agent'.
	 * - btnStyle: Custom styles for buttons within the modal. Default is an empty object.
	 * - inputStyle: Custom styles for inputs within the modal. Default is an empty object.
	 * - formId: Identifier for the form associated with the modal. Default is an empty string.
	 * - apiKey: API key used for authentication. Default is an empty string.
	 */
	props: {
		show: {type: Boolean, default: false},
		closeModal: {type: Function, required: true},
		updateNewRequester: {type: Function, required: true},
		panel: {type: String, default: 'agent'},
		btnStyle : { type : Object, default : ()=>{}},
		inputStyle : { type : Object, default : ()=>{}},
		formId: { type: String, default: '' },
		apiKey: { type: String, default: '' }
	},

	/**
	 * Data properties for the component:
	 * - formUniqueKey: Unique key for identifying the form. Initialized as an empty string.
	 * - submitFormInProgress: Boolean flag indicating whether the form submission is in progress. Initialized as false.
	 */
	data: () => {
		return {
			fetchFormFieldApi: '',
			formUniqueKey: '',
			submitFormInProgress: false,
			formSelected: false,
			selectedForm: '',
		}
	},

	beforeMount() {

		this.getDefaultFormValue();
	},

	mixins: [faveoFormCommons],

	methods: {

		/**
		 * Retrieves the default form value.
		 */
		getDefaultFormValue () {

			axios.get('/from/forms/requester?api_key='+this.apiKey).then(res=>{

				this.selectedForm = res.data.data.data[0];

				this.updateFetchApi()

			}).catch(err=>{

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

				this.$store.dispatch('createNewFormInstance', { formUniqueKey: this.formUniqueKey, scenario: this.scenario || 'create' });

				this.formSelected = true;
			},1)
		},

		/**
		 * Triggers a submit action by programmatically clicking the submit button.
		 * This method is used to initiate form submission.
		 */
		popUpSubmit() {

			document.getElementById('user-submit').click();
		},

		/**
		 * Handles form submission by dispatching the recaptcha key and calling the onSubmit method.
		 * @param {string} key - The key for the form submission.
		 * @param {string} value - The value for the form submission.
		 * This method dispatches the recaptcha key and then calls the onSubmit method.
		 */
		formSubmit(key, value) {
			this.$store.dispatch('setRecaptchaKey', value)
			this.onSubmit();
		},

		/**
		 * Performs actions after successful form submission.
		 * This method resets the captcha, updates requester data, and closes the modal.
		 * @param {Object} data - The data received after successful form submission.
		 * This method is triggered after a successful form submission to handle various post-submission actions.
		 */
		afterSubmit(data) {

			window.emitter.emit('reset-captcha');

			let requesterData = data.data.data;

			if(!requesterData.email){

				requesterData['name'] = requesterData.full_name;
			}

			this.updateNewRequester(requesterData);

			this.closeModal();

			window.emitter.emit('updateTicketCategory', 'ticket')
		},

		/**
		 * Handles actions after encountering an error, such as closing the modal.
		 * This method is triggered when an error occurs during form submission to perform appropriate error handling actions.
		 */
		afterError() {

			this.closeModal();
		}
	},

	components: {
		'modal': Modal,
		'alert': Alert,
		'loader': Loader,
		"form-with-captcha": FormWithCaptcha
	}
}
</script>

<style scoped>

#user-form-modal-body {
	max-height: 300px;
	overflow-y: auto;
	overflow-x: hidden;
	padding-top: 10px;
}
</style>

<style>
#user-submit{ display: none; }
</style>