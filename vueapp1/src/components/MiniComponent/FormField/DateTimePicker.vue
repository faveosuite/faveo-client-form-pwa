<template>

	<form-field-template :label="label" :name="name" :labelStyle="labelStyle"  :classname="classname" :hint="hint" :required="required" :isInlineForm="isInlineForm" :tipRule="tipRule"
	                     :labelLength="labelLength">

		<ValidationProvider :name="name" :rules="rules" v-model="changedValue">

			<template v-slot="{ field, errorMessage, meta, classes }">

				<calendar-component v-if="inline" :popup-style="{ top: '100%', left: 0}" :append-to-body="false"
				                    v-model:value="changedValue" lang="en"
				                    :type="type" :time-picker-options="timePickerOptions"
				                    :format="format" :placeholder="lang(place)"
				                    :disabled="disabled" :range="range"
				                    :input-class="['form-control', errorMessage ? 'field-danger' : '']"
				                    v-on:confirm="onDateTimeChange"
				                    v-on:clear="onDateTimeClear"
				                    @update:changedValue="onEventChange"
				                    :clearable="clearable" :confirm="false"
				                    :editable="editable" :shortcuts="pickers"
				                    :disabled-date="disabledDateMethod" :time-title-format="titleFormat">
				</calendar-component>

				<template v-else>

					<date-picker :popup-style="{ top: '100%', left: 0}" :append-to-body="false" v-if="label === 'Publish immediately'"
					             v-model:value="changedValue" lang="en"
					             :type="type" :time-picker-options="timePickerOptions"
					             :format="format" :placeholder="lang(place)"
					             :disabled="disabled" :range="range"
					             :input-class="['form-control', errorMessage ? 'field-danger' : '']"
					             v-on:confirm="onDateTimeChange"
					             v-on:clear="onDateTimeClear"
					             :clearable="clearable" :shortcuts="pickers"
					             :confirm="confirm" :disabled-date="disabledDateMethod" :time-title-format="titleFormat">
					</date-picker>

					<date-picker  :popup-style="{ top: '100%', left: 0}" :append-to-body="false" v-if="!currentYearDate && label !== 'Publish immediately'"
					              v-model:value="changedValue" lang="en"
					              :type="type" :time-picker-options="timePickerOptions"
					              :format="format" :placeholder="lang(place)"
					              :disabled="disabled" :range="range"
					              :input-class="['form-control', errorMessage ? 'field-danger' : '']"
					              v-on:confirm="onDateTimeChange"
					              v-on:clear="onDateTimeClear"
					              @change="onEventChange"
					              :clearable="clearable" :confirm="confirm"
					              :editable="editable" :shortcuts="pickers"
					              @paste="preventPaste"
					              :disabled-date="disabledDateMethod" :time-title-format="titleFormat">
					</date-picker>

					<date-picker :popup-style="{ top: '100%', left: 0}" :append-to-body="false" v-if="currentYearDate"
					             v-model:value="changedValue" lang="en"
					             :type="type" :time-picker-options="timePickerOptions"
					             :format="format" :placeholder="lang(place)"
					             :disabled="disabled" :editable="editable"
					             :range="range"
					             :input-class="['form-control', errorMessage ? 'field-danger' : '']"
					             v-on:confirm="onDateTimeChange"
					             v-on:clear="onDateTimeClear"
					             :clearable="clearable"
					             :disabled-date="disabledDateMethod"
					             :not-before="moment(moment().year()+'-01-01').format('YYYY-MM-DD')"
					             :not-after="moment(moment().year()+'-12-31').format('YYYY-MM-DD')"
					             :shortcuts="pickers" :confirm="confirm" :time-title-format="titleFormat">
					</date-picker>
				</template>

				<span v-show="errorMessage" class="error-block is-danger">{{errorMessage}}</span>

			</template>

		</ValidationProvider>
	</form-field-template>

</template>

<script>

import DatePicker from 'vue-datepicker-next';
const CalendarComponent = DatePicker.Calendar

import moment from 'moment'
import {useStore} from "vuex";
import {computed} from "vue";
import FormFieldTemplate from "./FormFieldTemplate.vue";
import {carbonToMomentFormatter} from "../../../helpers/extraLogics";
export default {
	name:'date-time-field',

	description:'date time field component along with error block',

	setup(){

		const store = useStore();

		return {

			formattedTime : computed( () => store.getters.formattedTime ),
			getUserData : computed( () => store.getters.getUserData )
		}
	},

	props:{

		/**
		 * the label that needs to be displayed
		 * @type {String}
		 */
		label: { type: String, default: '' },

		/**
		 * Hint regarding what the field is about (it will be shown as tooltip message)
		 * @type {String}
		 */
		hint: { type:String, default: '' }, //for tooltip message

		/**
		 * selected value of the field.
		 * list of already selected element ids that has to be displayed
		 * @type {Number|Boolean}
		 */
		value: { type: [String,Date,null], required: true },

		/**
		 * the name of the state in parent class
		 * @type {String}
		 */
		name: { type: [String,Number], required: true },

		/**
		 * Type of the text field. Available options : text, textarea, password, number
		 * @type {String}
		 */
		type: {type: String, default: 'datetime'},


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
		onChange:{type: Function, Required: true},

		/**
		 * classname of the form field. It can be used to give this component any bootstrap class or a custom class
		 * whose css will be defined in parent class
		 * @type {String}
		 */
		classname : {type: String, default:''},

		/**
		 * for show labels of the fields
		 * @type {Object}
		 */
		labelStyle:{type:Object},

		/**
		 * Whether the given field is required or not.
		 * If passed yes, an asterik will be displayed after the label
		 * @type {Boolean}
		 */
		required: { type: Boolean, default: true},

		/**
		 * time picker options
		 * type {Object}
		 */
		timePickerOptions : { type: Object, default:()=>{}} ,

		/**
		 * format in which date-time should be displayed
		 * @type {String}
		 */
		format : { type: String,default: ''},

		/**
		 * date time picker disabled status
		 * @type {Boolean}
		 */
		disabled : { type: Boolean, default: false},

		/**
		 * date time picker clearable status
		 * @type {Boolean}
		 */
		clearable : { type: Boolean, default: false},

		/**
		 * date time picker range attribute
		 * @type {Boolean}
		 */
		range: { type : Boolean},

		/**
		 * placeholde
		 * @type {String}
		 */
		place: { type : String, default : 'select_date'},
		/**
		 * placeholde
		 * @type {String}
		 */
		notBefore: { type : [String,Date] },

		notAfter: { type : [String,Date] },

		currentYearDate : { type : Boolean , default : false},

		confirm : { type : Boolean , default : true},

		editable : { type : Boolean , default : true},

		pickers : { type : [Boolean, Array] , default : false},

		rules: { type: String, default: '' },

		isInlineForm: { type: Boolean, default: false },

		/**
		 * The format in which output of the selection should be sent to parent component
		 * */
		outputFormat: { type: String, default: "" },

		// Parent component name
		from : { type : String, default : ''},

		//FOR TOOLTIP POSITION
		tipRule : { type : [Number, Boolean], default : false },

		titleFormat : { type : String, default : 'MMMM DD YYYY'},

		checkManual : { type : Boolean, default : false },

		inline : { type : Boolean, default : false },

		timePeriod: {type: String, default: ''},

		// Condition for disable dates
		exactDisabledDate: { type : Boolean, default: false },

		labelLength : { type : [Number, String], default : 500 }
	},
	data(){
		return {
			/**
			 * The updated value in the text field
			 * @type {String}
			 */
			changedValue: this.value,

			selectedValue : '',

			moment:moment,

			count : 0
		}
	},

	beforeMount() {
		// getting the date format from getuserdata
		if (this.getUserData) {
			this.newFormat = this.getUserData.date_format;
		}
		if(this.range) {

			this.changedValue = this.value ? this.value : '';

		} else {

			this.changedValue = this.value ? new Date(this.value) : '';

		}
	},

	methods: {

		preventPaste(event) {

			event.preventDefault();

		},

		onDateTimeClear(value) {

			this.onChange(null, this.name);

			this.changedValue = null
		},

		disabledDateMethod(date){

			const currentDate = new Date().setHours(0, 0, 0, 0);
			const notBeforeDate = new Date(this.notBefore).setHours(0, 0, 0, 0);
			const notAfterDate = new Date(this.notAfter).setHours(0, 0, 0, 0);

			// Based `exactDisabledDate` value - it will disable the dates in picker
			if(this.timePeriod === 'recur'){

				return date <= new Date(this.notBefore) || date >= new Date(this.notAfter);

			} else if(this.exactDisabledDate) {

				return (date <= notBeforeDate || date >= notAfterDate);
			}else {

				return (
					(date < notBeforeDate || date > notAfterDate) && date.getTime() !== currentDate
				);
			}
		},

		onEventChange(value) {
			if(this.checkManual){
				this.onChange(value, this.name);
				this.changedValue = value
			}
		},

		onDateTimeChange(value){

			this.count++;

			if(this.outputFormat){

				this.onChange(value ? moment(value).format(this.outputFormat): null, this.name);

			} else {

				this.onChange(value, this.name);
			}

			this.changedValue = value
		}
	},

	watch:{

		changedValue(newValue,oldValue){

			if(this.inline) {

				this.onEventChange(newValue)
			}
		},

		/**
		 * returns new date time value
		 * @return {Void}
		 */
		value(newValue,oldValue){

			this.changedValue = newValue === '' ? null : newValue;

			/**
			 * This block is for Formatting UTC date to current timezone date which we get from Fetch Api endpoint
			 * This block will execute when this component called from Custom Forms (e.g Asset Form)
			 */
			if (!this.count && this.changedValue && this.from) {
				this.count++;
				this.changedValue = moment(newValue, carbonToMomentFormatter(this.newFormat)).toDate();
				this.onChange(moment(this.changedValue).format(this.outputFormat), this.name);
			}

			else {

				if(this.range){

					this.changedValue = newValue ? newValue : '';

				} else {

					this.changedValue = newValue ? new Date(newValue) : '';
				}
			}
		}
	},

	components:{

		DatePicker,

		CalendarComponent,

		'form-field-template' : FormFieldTemplate
	}
};

</script>

<style>
.mx-input{
	border-radius: 0 !important;
}
.mx-input-append {
	/*height: 30px !important;
	background: none !important*/
}
.mx-shortcuts-wrapper{
	/*display: none !important;*/
}
.mx-shortcuts-wrapper .mx-shortcuts {
	text-transform: capitalize;
}
/*.mx-calendar-content {*/
/*    width: 224px !important;*/
/*}*/
.mx-datepicker{
	width: 100% !important;
}
.mx-datepicker-range {
	width: 100% !important;
}
.mx-input-wrapper input {
	background-color: transparent !important;
	/*height :30px !important;*/
}
.mx-calendar-icon{
	height: auto !important;
}
.mx-input-append{
	background-color: transparent !important;
}
</style>