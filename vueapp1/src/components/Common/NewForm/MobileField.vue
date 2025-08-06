<template>

	<form-field-template :label="label" :labelStyle="labelStyle" :name="name" :classname="classname" :hint="hint" :required="required"
	                     :isInlineForm="isInlineForm" :tipRule="tipRule" :labelLength="labelLength">

		<ValidationProvider :name="name" :rules="mobileRules" v-model="changedValue" :validate-on="['input', 'change']">

			<template v-slot="{ field, errorMessage, meta, classes }">

				<div v-show="showField" class="row" :dir="appLanguage === 'ar' ? 'rtl' : 'ltr'">

					<div :class="extensionEnabled && fieldFor !== 'automator' ? 'col-sm-8' : 'col-sm-12'">

						<div class="intl-tel-input allow-dropdown separate-dial-code iti-sdc-3" style="width: 100%">

							<input class="form-control" autocomplete="off"
							       :dir="appLanguage === 'ar' ? 'rtl' : 'ltr'"
							       :id="id"
							       :name="name"
							       :class="['form-control', inputClass, classes, errorMessage ? 'field-danger' : '']"
							       type="text"
							       :disabled="disabled"
							       :style="inputStyle"
							       v-model="changedValue"
							       v-on:input="onInputChange(changedValue, name)"
							       :ref="autofocus ? 'mobileField' : ''"/>
						</div>
					</div>

					<div v-if="extensionEnabled && fieldFor !== 'automator'"  class="col-sm-4">

						<input class="form-control" autocomplete="off"
						       type="text"
						       :id="ext[0].id"
						       :name="ext[0].key"
						       v-model="changedExtValue"
						       v-on:input="onExtInputChange(changedExtValue, ext[0].key)"
						       @keyup="keyupListener($event,ext[0].key)"
						       @keydown="keydownListener($event,ext[0].key)"
						       @keypress="keypressEvt($event,ext[0].key,'number')"
						       @paste="pasteEvt($event,ext[0].key,'number')"
						       :maxlength="8"
						       placeholder="EXT">
					</div>

					<span v-if="errorMessage" class="error-block is-danger col-sm-12">{{errorMessage}}
						<span v-if="!pattern">{{validationMessage ? '(' + validationMessage + ')' : ''}} </span>
					</span>
				</div>
			</template>
		</ValidationProvider>
	</form-field-template>

</template>

<script type="text/javascript">

import FormFieldTemplate from "../../MiniComponent/FormField/FormFieldTemplate.vue";
import {findObjectByKey, flatten, getCountry} from "../../../helpers/extraLogics";
import axios from "axios";
import {errorHandler} from "../../../helpers/responseHandler";

import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import {ar, bs, de, en, es, fr, id, it, ko, nl, pt, ru, zh} from 'intl-tel-input/i18n';

import { defineRule } from 'vee-validate';

defineRule('phone', (value, id) => {
	if (!value || value.trim() === '') return true;

	const input = document.getElementById(id[0]);
	if (!input) return true;

	const iti = intlTelInput.getInstance(input);
	if (!iti) return true;

	if(iti && !iti.getNumber()){
		return true;
	}

	return iti.isValidNumber() ?? true;
});

import * as languages from 'intl-tel-input/i18n'

export default {
	name: "mobile-field",

	description: "mobile field component along with ext block",

	props: {

		label: { type: String, required: true },

		hint: { type: String, default: "" }, //for tooltip message

		value: { type: [String,null], required: true },

		name: { type: String, required: true },

		type: { type: String, default: "text" },

		onChange: { type: Function, Required: true },

		classname: { type: String, default: "" },

		required: { type: Boolean, default: false },

		keyupListener: { type: Function , default : ()=>{} },

		keydownListener: { type: Function , default : ()=>{} },

		keypressEvt: { type: Function ,  default : ()=>{} },

		pasteEvt: { type: Function ,  default : ()=>{} },

		labelStyle:{type:Object},

		placehold : { type: String, default : ''},

		id : {type: [String,Number], default:'mobile-field'},

		disabled : { type : Boolean, default : false},

		inputStyle : { type : Object, default : ()=>{}},

		max : { type : [Number, String] , default : ''},

		inputClass : { type : String, default : ''},

		isInlineForm: { type: Boolean, default: false },

		rules: { type: String, default: '' },

		pattern: { type: String, default: null },

		validationMessage: { type: String, default: '' },

		from : { type : String, default : '' },

		tipRule : { type : [Number, Boolean], default : false },

		autofocus : { type : [Number, Boolean], default : false },

		countryCode: {type: [Number, null], Required: true},

		extensionEnabled: { type : [Number, Boolean], default : false },

		ext: { type: Array, default : () => [] },

		onExtChange: { type: Function, default : ()=>{} },

		extValue: { type: String, default: "" },

		labelLength : { type : [Number, String], default : 500 },

		apiKey: { type: String, default: '' },

		fieldFor: { type: String, default: '' }
	},

	data() {

		return {

			iti: null,

			country_codes: [],

			phone_code: this.countryCode,

			showList: false,

			country: {},

			iso: 'in',

			contryData: null,

			changedValue: this.value,

			example: '99876 54321',

			changedExtValue : this.extValue,

			showField: false
		};
	},

	mounted() {

		this.changedValue = this.value;

		this.changedExtValue = this.extValue;

		this.$nextTick(() => {

			if(this.autofocus){

				setTimeout(()=>{

					this.$refs.mobileField.focus();
				},1);
			}
		});

		const input = document.getElementById(this.id);

		if(input){

			this.iti = intlTelInput(input, {

				i18n: this.getLanguageObject(this.appLanguage),

				initialCountry: this.iso,

				geoIpLookup: function(success, failure) {
					fetch("https://ipapi.co/json")
						.then(function(res) { return res.json(); })
						.then(function(data) { success(data.country_code); })
						.catch(function() { failure(); });
				},

				separateDialCode: true,

				strictMode: true,

				formatAsYouType: false,

				formatOnDisplay: false,

				excludeCountries: ['ax'],

				customPlaceholder: (selectedCountryPlaceholder, selectedCountryData) => {

					return this.placehold ? this.placehold : selectedCountryPlaceholder;
				}
			});

			input.addEventListener("countrychange", () => {

				this.handleCountryChange(this.iti.getSelectedCountryData(), true);
			});

			setTimeout(() => {

				if (this.phone_code && this.changedValue) {

					try {

						this.iti.setNumber('+' + this.phone_code + this.changedValue);

					} catch (error) {

						console.error('Error setting phone number:', error);
					}
				}

				this.showField = true;

			}, 100);
		}
	},

	watch: {

		value(newVal) {

			this.changedValue = (this.id === 'seats' && newVal <= 0 && newVal !== '') ? 0 : newVal;
		},

		extValue(newVal) {

			this.changedExtValue = newVal;
		},

		countryCode(newValue, oldValue) {

			this.phone_code = newValue;

			const input = document.getElementById(this.id);

			if (this.iti) {

				this.iti.setCountry(this.iso);
			}
		}
	},

	computed: {

		mobileRules() {

			const mobileRule = `phone:${this.id}`;

			return this.rules ? `${this.rules}|${mobileRule}` : mobileRule;
		}
	},

	beforeMount() {

		if (!this.countryCode) {

			getCountry().then((res) => {

				this.iso = res;

				this.getCountryCodes();

			}).catch((error) => {

				console.warn(error);

				this.iso = 'in';

				this.phone_code = 91;

				this.getCountryCodes();
			})
		} else {

			this.getCountryCodes();
		}

		this.changedValue = this.value;

		this.changedExtValue = this.extValue;
	},

	beforeDestroy() {
		if (this.iti) {
			this.iti.destroy();
			this.iti = null; // Clean up the reference
		}
	},

	methods: {

		// Get the language object for intl-tel-input based on the system language
		getLanguageObject(lang) {
			const languages = { ar, bs, de, en, es, fr, id, it, ko, nl, pt, ru, zh };
			const specialCases = {
				'kr': 'ko',
				'bsn': 'bs',
				'zh-hans': 'zh',
				'zh-hant': 'zh',
				'en-gb': 'en',
			};

			return languages[specialCases[lang] || lang] || languages['en'];
		},

		getCountryCodes() {

			this.contryData = intlTelInput.getCountryData();

			this.countryDetails(this.contryData);
		},

		onInputChange(value, name) {

			this.changedValue = value

			if (this.fieldFor === 'automator' && this.extensionEnabled) {

				let dataVal = {
					value: this.changedValue,
					nodes: this.ext
				}

				this.onChange(dataVal, name);

			} else {

				this.onChange(this.changedValue, name);
			}
		},

		onExtInputChange(value, name) {

			value = value.replace(/[^0-9]/g, '');

			this.changedExtValue = value;

			this.onExtChange(this.changedExtValue, name);
		},

		countryDetails(codes) {

			this.country_codes = codes;

			if (this.countryCode) {

				this.country = findObjectByKey(codes, 'dialCode', this.phone_code)

			} else {

				this.country = findObjectByKey(codes, 'iso2', this.iso.toLowerCase());
			}

			this.handleCountryChange(this.country, false);
		},

		handleCountryChange(country, status) {

			this.iso = country.iso2;

			this.phone_code = country.dialCode;

			if(status) {
				this.changedValue = "";
			}

			this.$emit('countryCode', this.phone_code);

			// if(this.fieldFor !== 'automator') {
			// 	this.onChange(this.changedValue, this.name)
			// }
		}
	},

	components: {
		"form-field-template": FormFieldTemplate,
	}
};
</script>

<style>

.iti__search-input { padding-left: 6px !important; }
</style>