<template>

	<div id="form-with-recaptcha">

		<slot name="fields"></slot>

		<div :class="recaptchaContainerClass" v-if="loading">

			<RecaptchaField :key="'captcha'+counter" v-captcha="page" :verifyCaptcha="getCaptcha" name="captcha">

			</RecaptchaField>
		</div>

		<div class="row mt-3" v-if="loading">

			<div class="col-sm-12">

				<button type="button" :id="btn_id" :class="btnClass" @click="onSubmit()" :style="btnStyle" :disabled="disableSubmit">

					<i :class="iconClass"> </i> {{trans(btnName)}}
				</button>
			</div>
		</div>

		<slot name="actions"></slot>
	</div>
</template>

<script>

import RecaptchaField from "../../FormFields/RecaptchaField.vue";

export default {

	name : 'form-with-captcha',

	description : 'Form with Recaptcha Component',

	/**
	 * Props passed to the component:
	 * - btn_id: The ID attribute of the button. Default is an empty string.
	 * - btnClass: CSS class for the button. Default is 'btn btn-custom'.
	 * - btnName: The name attribute of the button. Default is 'save'.
	 * - btnStyle: CSS styles for the button. Default is an empty object.
	 * - inputStyle: CSS styles for the input element. Default is an empty object.
	 * - layout: Layout object. Default is an empty object.
	 * - iconClass: CSS class for the icon associated with the button. Default is 'fa fa-save'.
	 * - formSubmit: Function to handle form submission.
	 * - page: The page associated with the button. Default is an empty string.
	 * - componentName: The name of the component. Default is an empty string.
	 * - recaptchaContainerClass: CSS class for the reCAPTCHA container. Default is an empty string.
	 * - disableSubmit: Boolean flag to disable form submission. Default is false.
	 * - loading: Boolean flag indicating whether the button is in a loading state. Default is true.
	 */
	props : {
		btn_id : { type : String, default : ''},
		btnClass : { type : String, default : 'btn btn-custom' },
		btnName : { type : String, default : 'save' },
		btnStyle : { type : Object, default : ()=>{} },
		inputStyle: { type : Object, default: () =>{} },
		layout: { type : Object, default: () =>{} },
		iconClass : { type : String, default : 'fa fa-save' },
		formSubmit : { type : Function },
		page : { type : String, default : '' },
		componentName : { type : String, default : '' },
		recaptchaContainerClass: { type : String, default : '' },
		disableSubmit: {type: Boolean, default: false},
		loading: {type: Boolean, default: true}
	},

	/**
	 * Data properties for the component:
	 * - captchaKey: The reCAPTCHA key. Default is an empty string.
	 * - counter: Counter variable. Default is 0.
	 */
	data() {
		return {
			captchaKey : '',
			counter : 0
		}
	},

	created() {

		window.emitter.on('login-failure', this.updateCaptcha);

		window.emitter.on('reset-captcha', this.updateCaptcha);

		window.emitter.on('forComment',this.updateCaptcha);
	},

	methods : {

		/**
		 * Updates the captcha counter.
		 */
		updateCaptcha() {

			this.counter += 1;

			this.captchaKey = '';
		},

		/**
		 * Retrieves the reCAPTCHA key.
		 * @param {string} key - The reCAPTCHA key.
		 */
		getCaptcha(key) {

			this.captchaKey = key;
		},

		/**
		 * Handles form submission. If reCAPTCHA is required for the page, it verifies the presence of the key before submitting the form.
		 */
		onSubmit() {

			if(this.page && this.recaptchaApplyfor.includes(this.page)){

				if(this.captchaKey){

					this.formSubmit('g-recaptcha-response',this.captchaKey)

				} else {

					this.$store.dispatch('setAlert',{
						type:'danger',message:'Invalid ReCaptcha', component_name : this.componentName
					})
				}
			} else {

				this.formSubmit()
			}
		}
	},

	components : {

		RecaptchaField
	}
};
</script>

<style>

.modal-body #form-with-recaptcha{
	/* whenever this component is called within a model, model has some padding,
	which cuts the corner of this component. So reducing its width to 98% and making it center align */
	margin-left: 1em;
	margin-right: 1em;
}

</style>