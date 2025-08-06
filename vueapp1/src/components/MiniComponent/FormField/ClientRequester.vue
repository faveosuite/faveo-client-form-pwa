<style scoped>

</style>
<template>
	<template v-if="showTooltip">
		<text-field :title="requesterValue ? requesterValue : ''"
		            v-if="isLoggedIn"
		            :id="id"
		            :label="label"
		            type="text"
		            :name="name"
		            :value="requesterValue"
		            :onChange="onChange"
		            :required="required"
		            :rules="rules"
		            :hint="hint"
		            :isInlineForm="isInlineForm"
		            :placehold="trans('form_requester_placeholder')"
		            :inputStyle="inputStyle" autofocus="autofocus"
		            :isRequester="true"
		            :disabled="true" :labelLength="labelLength"
		            for="client-requester">
		</text-field>

		<text-field :title="requesterValue ? requesterValue : ''"
		            v-else
		            :id="id"
		            :label="label"
		            type="text"
		            :name="name"
		            :value="requesterValue"
		            :onChange="onChange"
		            :required="required"
		            :isInlineForm="isInlineForm"
		            :rules="rules"
		            :hint="hint"
		            :placehold="trans('form_requester_placeholder')"
		            :actionBtn="actionBtn" :autofocus="autofocus"
		            :isRequester="true"
		            :inputStyle="inputStyle"  :labelLength="labelLength"
		            for="client-requester">
		</text-field>
	</template>
	<template v-else>
		<text-field
			v-if="isLoggedIn"
			:id="id"
			:label="label"
			type="text"
			:name="name"
			:value="requesterValue"
			:onChange="onChange"
			:required="required"
			:rules="rules"
			:hint="hint"
			:isInlineForm="isInlineForm"
			:placehold="trans('form_requester_placeholder')"
			:inputStyle="inputStyle" autofocus="autofocus"
			:isRequester="true"
			:disabled="true" :labelLength="labelLength"
			for="client-requester">
		</text-field>

		<text-field
			v-else
			:id="id"
			:label="label"
			type="text"
			:name="name"
			:value="requesterValue"
			:onChange="onChange"
			:required="required"
			:isInlineForm="isInlineForm"
			:rules="rules"
			:hint="hint"
			:placehold="trans('form_requester_placeholder')"
			:actionBtn="actionBtn" :autofocus="autofocus"
			:isRequester="true"
			:inputStyle="inputStyle"  :labelLength="labelLength"
			for="client-requester">
		</text-field>
	</template>
</template>
<script>

import {mapGetters} from "vuex";
import {boolean} from "../../../helpers/extraLogics";
import TextField from "./TextField.vue";

export default {
	props: {
		/**
		 * the label that needs to be displayed
		 * @type {String}
		 */
		label: {type: String, required: true},

		/**
		 * Hint regarding what the field is about (it will be shown as tooltip message)
		 * @type {String}
		 */
		hint: {type: String, default: ""}, //for tooltip message

		/**
		 * selected value of the field.
		 * list of already selected element ids that has to be displayed
		 * @type {Number|Boolean}
		 */

		value: {type: [String, null], required: true},

		/**
		 * the name of the state in parent class
		 * @type {String}
		 */
		name: {type: String, required: true},


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
		onChange: {type: Function, Required: true},

		/**
		 * Whether the given field is required or not.
		 * If passed yes, an asterik will be displayed after the label
		 * @type {Boolean}
		 */
		required: {type: Boolean, default: false},

		/**
		 * Id of the text field
		 * @type {String|Number}
		 */
		id: {type: [String, Number], default: 'text-field'},

		rules: {type: String, default: ''},

		actionBtn: {type: Object, default: () => null},

		inputStyle : { type : Object, default : ()=>{}},

		autofocus : { type : [Boolean, Number], default : false },

		isInlineForm: { type: Boolean, default: true },

		labelLength : { type : [Number, String], default : 500 }
	},


	data() {
		return {
			requesterValue: this.value,
			isLoggedIn : false,
			showTooltip: true,
		};
	},

	mounted() {
		// if logged in, the logged in user should be the requester
		// adding a next tick to make sure that form is ready with empty fields al
		// @see https://vuejs.org/v2/api/#mounted
		this.$nextTick(()=>{

			if(boolean(this.userData.user_data)){
				this.onChange(this.userData.user_data, this.name);
				this.isLoggedIn = true;
			}
		})
	},

	created() {
		window.emitter.on('client-requester-tooltip', (value) => {
			this.showTooltip = value; // show tooltip on client requester field
		});
	},

	computed : {
		...mapGetters({userData: 'getUserData'}),
	},

	watch: {
		value(requester){
			if (typeof requester === 'object') {
				this.requesterValue = requester.meta_name ? requester.meta_name : '';
				this.onChange(requester, this.name);
			} else {
				this.requesterValue = requester;
			}
		}
	},

	components: {
		'text-field': TextField,
	},
};
</script>

<style>

.requester-action-button {
	/* aligns new requester button on client panel page */
	padding: 0;
	margin: 0 -8px;
}

</style>