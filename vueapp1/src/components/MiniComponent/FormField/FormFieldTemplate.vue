<template>
	<div :class="[classname, 'form-group', 'form-field-template mb-3', {'has-error': name && errors && (name in errors) }, { 'row': isInlineForm } ]" v-bind:id="label">

		<div :class="{ 'col-md-2 flex break-all': isInlineForm }">
			<label v-bind:for="label" v-tooltip="showTooltipOnLabel ? label : ''" :style="labelStyle" class="form-label">{{getSubString(label,labelLength)}}</label>
			<label class="is-danger" :style="labelStyle" v-if="required">*</label>
			<tool-tip v-if="hint && hint !=='' && !tipRule" :message="getHint(hint)" size="small"></tool-tip>
			<slot name="word-limit-counter"></slot>
			<!--
			  Showing clear button only when field value is type of object, e.g DatePicker
			-->
			<i v-if="isClearField && value && typeof(value) == 'object'" @click="clearField" class="fas fa-times clear-btn" title="Clear" aria-hidden="true"></i>

			<a v-if="showNewButton && !isInlineForm" class="btn btn-default btn-xs btn-sm mb2 float-right" href="javascript:;" @click="clickEvent(name)">

				<i class="glyphicon glyphicon-plus"> </i> {{lang('new')}}
			</a>

			<i class="float-right" v-if="showPreview">(e.g {{showPreview}})</i>
		</div>

		<div :class="[ isInlineForm ? 'col-md-10 flex' : actionBtn && actionBtn.isFor === 'requester' ? 'flex-100' : '' ]">
			<div class="slot-container">
				<slot></slot>
				<template v-if="hint && hint !='' && tipRule">

					<div class="text-small"><i class="fas fa-question-circle text-primary"> </i> <em v-html="getHint(hint)"></em></div>
				</template>
				<div v-if="name in errors" class="error-block is-danger">{{errors[name]}}</div>
			</div>
			<button v-if="actionBtn" type="button" :class="isRequester ? 'req-btn' : ''" class="btn btn-default form-field-action-button" @click="() => actionBtn.action()"><span>{{trans(actionBtn.text)}}</span></button>

			<a v-if="showNewButton && isInlineForm" class="req-btn btn btn-default form-field-action-button new_entry_btn" href="javascript:;" @click="clickEvent(name)">

				<i class="glyphicon glyphicon-plus"> </i> {{lang('new')}}
			</a>

		</div>

	</div>
</template>

<script>
import { mapGetters } from "vuex";
import ToolTip from "../ToolTip.vue";

export default {
	name: "form-field-template",

	description:
		"This component handles the error block by reading validation errors directly for vuex store and hint tooltip message",

	props: {
		/**
		 * label that has to be displayed above the field
		 * @type {String}
		 */
		label: { type: String, required: true },

		/**
		 * the name of the state in parent class, for looking into the vuex store for errors
		 * @type {String}
		 */
		name: { type: [String, Number], required: true, default: '' },

		/**
		 * For showing Field label.
		 * If passed display as none, the label will not be displayed
		 * @type {Object}
		 */
		labelStyle:{type:Object, default: function () { return { }}},

		/**
		 * name of the class (for css, not really required)
		 * @type {String}
		 */
		classname: { type: String, default: "" },

		/**
		 * Hint regarding what the field is about (it will be shown as tooltip message)
		 * @type {String}
		 */
		hint: { type: String, default: "" },

		/**
		 * Whether the given field is required or not.
		 * If passed yes, an asterik will be displayed after the label
		 * @type {Boolean}
		 */
		required: { type: [Boolean, Number], default: false },

		isClearField : { type : Boolean, default : false },

		clearField : { type : Function },

		value : { type: [String, Date, Object, Array], default : '' },

		/**
		 * The new button is need to show or not.
		 * @type {Boolean}
		 */
		showNewButton: { type: Boolean, default: false },

		onClickEvent : { type : Function},

		isInlineForm: { type: Boolean, default: false },

		isRequester: { type: Boolean, default: false },

		actionBtn: { type: Object, default: () => null },

		showPreview : { type : [String, Object], default : '' },

		//FOR TOOLTIP POSITION
		tipRule : { type : [Number, Boolean], default : false },

		labelLength : { type : [Number, String], default : 500 },

		showTooltipOnLabel : { type : Boolean, default : true }
	},

	computed: {
		...mapGetters(["getValidationErrors"]),

		//watches errors in vuex stroe for changes
		errors: {
			cache: false,

			get() {
				return this.getValidationErrors || {};
			}
		}
	},
	watch: {
		errors(newValue) {
			// console.log(" array got changed accordingly ");
			/**
			 * watcher is set on the errors array we are adding a scroll function to it when the validation fails
			 */
			this.newValue = this.errors;
			let x = {};

			setTimeout(() => {

				let errorBlock = document.querySelectorAll('.error-block:not([style*="display: none"])')[0]
				errorBlock && errorBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 1);
		}
	},

	methods : {

		clickEvent(name){

			this.onClickEvent(name);
		},

		getHint(value) {

			return value ? value.replace(/\n/g,'<br>') : value;
		}
	},

	components: {
		"tool-tip": ToolTip,
	}
};
</script>

<style scoped>

.slot-container {
	width: inherit;
}
.form-field-action-button {
	height: fit-content;
	white-space: nowrap;
	margin-left: 5px;
}
.flex-100{ display: flex; width: 100%;}

.req-btn { height: 36px;margin-left: 4px;}

.new_entry_btn { position: relative;left: 4px; }

.break-all { word-break: break-all; }
</style>