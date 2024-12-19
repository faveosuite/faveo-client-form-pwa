<template>

	<form-field-template :label="label" :labelStyle="labelStyle" :name="name" :classname="classname" :hint="hint" :required="required"
	                     :isInlineForm="isInlineForm" :actionBtn="actionBtn" :tipRule="tipRule" :isRequester="isRequester" :labelLength="labelLength">

		<template v-if="from">

			<div v-if="type === 'textarea'">

              <textarea :id="id" :name="name" :class="['form-control', inputClass]" :maxlength="length" :type="type" v-model="changedValue"
                        v-on:input="onChange(changedValue, name)" @keyup="keyupListener($event,name)"
                        @keydown="keydownListener($event,name)" @keypress="keypressEvt($event,name,type)" @paste="pasteEvt($event,name,type)" :cols="columns" :rows="rows" :style="inputStyle" :pattern="pattern ? pattern : null"
                        :placeholder="trans(placehold)" :ref="autofocus ? 'textField' : ''" :disabled="disabled"
              >

              </textarea>
			</div>

			<input v-else :id="id" :name="name" :class="inputClasses" :type="type" :disabled="disabled" :style="inputStyle"
			       v-model="changedValue" v-on:input="onChange(changedValue, name)" @keyup="keyupListener($event,name)"
			       @keydown="keydownListener($event,name)" @keypress="keypressEvt($event,name,type)" @paste="pasteEvt($event,name,type)"
			       :placeholder="trans(placehold)" :maxlength="max ? max : undefined" :pattern="pattern ? pattern : null" :ref="autofocus ? 'textField' : ''"
			/>
		</template>

		<template v-else>

			<ValidationProvider :name="name" :rules="rules" v-model="changedValue">

				<template v-slot="{ field, errorMessage, meta, classes }">

					<div v-if="type === 'textarea'">
						<small v-if="showWordLimit" slot="word-limit-counter">{{'(' + (changedValue.length || 0) + '/' + length + ')'}}</small>
						<textarea
							:id="id"
							:name="name"
							:class="['form-control', inputClass, classes, errorMessage ? 'field-danger' : '']"
							:maxlength="length"
							:type="type"
							v-model="changedValue"
							v-on:input="onChange(changedValue, name)"
							:cols="columns"
							:rows="rows"
							:style="inputStyle"
							:pattern="pattern ? pattern : null"
							:placeholder="trans(placehold)"
							:ref="autofocus ? 'textField' : ''"
							:disabled="disabled"
						></textarea>
					</div>
					<div class="input-group" v-else-if="type === 'password' ">

						<div v-if="page === 'oauth-login' && type === 'password'" class="input-group-append">
							<span class="input-group-text oauth-login-icon"><i class="fa fa-lock"></i></span>
						</div>
						<input autocomplete="off"
						       :id="id"
						       :name="name"
						       :class="['form-control', inputClass]"
						       :type="showPassword ? 'text' : 'password'"
						       :disabled="disabled"
						       :style="inputStyle"
						       v-model="changedValue"
						       v-on:input="onChange(changedValue, name)"
						       @keyup="keyupListener($event, name)"
						       @keydown="keydownListener($event, name)"
						       @keypress="keypressEvt($event, name, type)"
						       @paste="pasteEvt($event, name, type)"
						       :placeholder="trans(placehold)"
						       :maxlength="max ? max : undefined"
						       :pattern="pattern ? pattern : null"
						       :ref="autofocus ? 'textField' : ''"
						/>
						<div class="input-group-append" v-if="type === 'password'">
                <span class="input-group-text">
                     <i :class="['fa', showPassword ? 'fa-eye' : 'fa-eye-slash']" @click="togglePassword"></i>
                     </span>
						</div>
					</div>
					<div class="input-group" v-else-if="type === 'text' && page === 'oauth-login'">
						<div class="input-group-append">
							<span class="input-group-text oauth-login-icon"><i class="fa fa-user"></i></span>
						</div>
						<input
							:id="id"
							:name="name"
							:class="['form-control', inputClass, classes, errorMessage ? 'field-danger' : '', isUserNameOrEmail ? 'text-lowercase' : '']"
							:type="type"
							:disabled="disabled"
							:style="inputStyle"
							v-model="changedValue"
							v-on:input="onChange(changedValue, name)"
							@keyup="keyupListener($event,name)"
							@keydown="keydownListener($event,name)"
							@keypress="keypressEvt($event,name,type)"
							@paste="pasteEvt($event,name,type)"
							:placeholder="trans(placehold)"
							:maxlength="max ? max : undefined"
							:pattern="pattern ? pattern : null"
							:ref="autofocus ? 'textField' : ''"
						/>
					</div>
					<input autocomplete="off" @mouseenter="handelTooltip(true)" @mouseleave="handelTooltip(false)"
					       v-else
					       :id="id"
					       :name="name"
					       :class="['form-control', inputClass, classes, errorMessage ? 'field-danger' : '', isUserNameOrEmail ? 'text-lowercase' : '']"
					       :type="type"
					       :disabled="disabled"
					       :style="inputStyle"
					       v-model="changedValue"
					       v-on:input="onChange(changedValue, name)"
					       @keyup="keyupListener($event,name)"
					       @keydown="keydownListener($event,name)"
					       @keypress="keypressEvt($event,name,isEXT ? 'number' : type)"
					       @paste="pasteEvt($event,name,isEXT ? 'number' : type)"
					       :placeholder="trans(placehold)"
					       :maxlength="max ? max : undefined"
					       :pattern="pattern ? pattern : null"
					       :ref="autofocus ? 'textField' : ''"
					/>

					<span v-if="errorMessage" class="error-block is-danger">{{errorMessage}}
                      <span v-if="!pattern">{{validationMessage ? '(' + validationMessage + ')' : ''}} </span></span>

				</template>
			</ValidationProvider>

		</template>


	</form-field-template>

</template>

<script type="text/javascript">

import FormFieldTemplate from "./FormFieldTemplate.vue";

export default {
	name: "text-field",

	description: "text field component along with error block",

	props: {
		/**
		 * the label that needs to be displayed
		 * @type {String}
		 */
		label: { type: String, required: true },

		/**
		 * Hint regarding what the field is about (it will be shown as tooltip message)
		 * @type {String}
		 */
		hint: { type: String, default: "" }, //for tooltip message

		/**
		 * selected value of the field.
		 * list of already selected element ids that has to be displayed
		 * @type {Number|Boolean}
		 */

		value: { type: [String,null], required: true },

		/**
		 * the name of the state in parent class
		 * @type {String}
		 */
		name: { type: String, required: true },

		/**
		 * Type of the text field. Available options : text, textarea, password, number
		 * @type {String}
		 */
		type: { type: String, default: "text" },

		/**
		 * The function which will be called as soon as value of the field changes
		 * It should have two arguments `value` and `name`
		 *     `value` will be the updated value of the field
		 *     `name` will be thw name of the state in the parent class
		 *
		 * An example function :
		 *         onChange(value, name){
		 *             this[name]= selectedValue
		 *         }
		 *
		 * @type {Function}
		 */
		onChange: { type: Function, Required: true },

		/**
		 * classname of the form field. It can be used to give this component any bootstrap class or a custom class
		 * whose css will be defined in parent class
		 * @type {String}
		 */
		classname: { type: String, default: "" },

		/**
		 * Whether the given field is required or not.
		 * If passed yes, an asterik will be displayed after the label
		 * @type {Boolean}
		 */
		required: { type: Boolean, default: false },

		length: {type: [Number,String], default: 2000},

		keyupListener: { type: Function , default : ()=>{} },

		keydownListener: { type: Function , default : ()=>{} },

		keypressEvt: { type: Function ,  default : ()=>{} },

		pasteEvt: { type: Function ,  default : ()=>{} },

		/**
		 * for show labels of the fields
		 * @type {Object}
		 */
		labelStyle:{type:Object},

		/**
		 * for showing placeholder
		 * @type {String}
		 */
		placehold : { type: String, default : 'enter_a_value'},

		/**
		 * Id of the text field
		 * @type {String|Number}
		 */
		id : {type: [String,Number], default:'text-field'},

		disabled : { type : Boolean, default : false},

		columns : { type : [String, Number], default : ''},

		inputStyle : { type : Object, default : ()=>{}},

		max : { type : [Number, String] , default : ''},

		rows : { type : [Number, String] , default : ''},

		cols : { type : [Number, String] , default : ''},

		inputClass : { type : String, default : ''},

		// if true, will show the word counter in textbox
		showWordLimit: { type: Boolean, default: false },

		isInlineForm: { type: Boolean, default: false },

		rules: { type: String, default: '' },

		pattern: { type: String, default: null },

		validationMessage: { type: String, default: '' },

		actionBtn: { type: Object, default: () => null },

		from : { type : String, default : '' },

		//FOR TOOLTIP POSITION
		tipRule : { type : [Number, Boolean], default : false },

		autofocus : { type : [Number, Boolean], default : false },

		isRequester: { type: Boolean, default : false },

		page : { type : String, default : '' },

		labelLength : { type : [Number, String], default : 500 },

		isEXT: { type : Boolean, default : false },

		defaultKey : { type : String, default : '' },

		for: { type: String, default: '' },
	},
	data() {
		return {
			/**
			 * The updated value in the text field
			 * @type {String}
			 */
			changedValue: this.value,

			showPassword:false,
		};
	},

	mounted() {

		this.changedValue = this.value;

		this.$nextTick(() => {

			if(this.autofocus){

				setTimeout(()=>{

					this.$refs.textField.focus();
				},1);
			}
		});
	},

	computed: {
		isUserNameOrEmail() {
			return this.defaultKey === 'user_name' || this.defaultKey === 'email' || this.type === 'email';
		},

		inputClasses() {
			return ['form-control', this.inputClass, { 'text-lowercase': this.isUserNameOrEmail }];
		}
	},

	/**A watcher metod has been added since at firt the changevalue is empty and fetch the data accordingly
	 * we need a watcher to update it with new value
	 * @type {String}
	 */
	watch: {
		value(newVal) {
			this.changedValue = (this.id === 'seats' && newVal <= 0 && newVal !== '') ? 0 : newVal;
		},

		changedValue(newVal) {
			if (this.isUserNameOrEmail) {
				const input = this.$refs.textField;
				if (input) {
					const start = input.selectionStart;
					const end = input.selectionEnd;
					this.changedValue = newVal.toLowerCase();
					this.$nextTick(() => {
						input.setSelectionRange(start, end);
					});
				} else {
					this.changedValue = newVal.toLowerCase();
				}
			}
		}
	},
	methods: {
		togglePassword() {
			this.showPassword = !this.showPassword;
		},

		handelTooltip(value){
			let previousValue
			if(previousValue !== value){
				if(this.for === 'client-requester'){
					window.emitter.emit('client-requester-tooltip', value);
				}
			}
			previousValue = value;
		},
	},

	components: {
		"form-field-template": FormFieldTemplate,
	}
};
</script>

<style scoped>

.input-group-text{
	cursor:pointer !important;
}

.oauth-login-icon{
	border-top-left-radius: 4px !important;
	border-bottom-left-radius: 4px !important;
}
</style>
