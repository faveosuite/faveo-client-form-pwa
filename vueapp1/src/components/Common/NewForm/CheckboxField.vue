<template>

	<form-field-template :name="name" :label="label" :hint="hint" :required="required" :labelStyle="labelStyle" :isInlineForm="isInlineForm"  :tipRule="tipRule"
	                     :labelLength="labelLength">

		<div class="row">

			<ValidationProvider :name="name" :rules="rules" class="row" tag="div" v-model="selectedValue">

				<template v-slot="{ field, errorMessage, meta, classes }">

					<div class="col-md-4 pl-4 c-form-checkbox" v-for="option in options" :key="option.id">

						<label class="control-label">

							<input type="checkbox" class="form-check-input" :id="option.form_identifier" v-model="selectedValue" :value="option" :name="getUniqueName(option.form_identifier)" @change="onInput(selectedValue)" :class="errorMessage ? 'field-danger' : ''">

							{{option.label}}
						</label>
					</div>

					<div v-show="errorMessage" class="error-block is-danger col-md-12">{{errorMessage}}</div>
				</template>
			</ValidationProvider>
		</div>
	</form-field-template>
</template>

<script>

import FormFieldTemplate from '../../../components/MiniComponent/FormField/FormFieldTemplate.vue'

import { boolean } from '../../../helpers/extraLogics';

export default {


	name: 'checkbox-field',

	/**
	 * Component properties:
	 * - name: String - The name of the input element.
	 * - label: String - The label for the input element.
	 * - hint: String - Additional hint or description for the input.
	 * - options: Array - The list of options for the input.
	 * - required: Boolean - Indicates if the input is required.
	 * - onChange: Function - Handler function to be called when the input value changes.
	 * - value: Array|String - The current value of the input.
	 * - labelStyle: Object - Custom styles for the label element.
	 * - isInlineForm: Boolean - Indicates if the form is inline.
	 * - rules: String - Additional validation rules for the input.
	 * - from: String - Specifies the source or origin of the component.
	 * - tipRule: Number|Boolean - Additional rule or tip for the input.
	 */
	props: {

		name: { type: String, required: true },

		label: { type: String, required: true },

		hint: { type: String, default: '' },

		options: { type: Array, required: true },

		required: { type: Boolean, default: false },

		onChange: { type: Function, Required: true },

		value: { type: [Array, String], default: '' },

		labelStyle: { type: Object, default: () => {} },

		isInlineForm: { type: Boolean, default: false },

		rules: { type: String, default: '' },

		from: { type: String, default: '' },

		tipRule : { type : [Number, Boolean], default : false },

		labelLength : { type : [Number, String], default : 500 }
	},

	data: () => {

		return {
			// Define a reactive property to store the selected value
			selectedValue: []
		}
	},

	mounted() {
		// Set the initial value of selectedValue to the provided value or an empty array if no value is provided
		this.selectedValue = boolean(this.value) ? this.value : []
	},

	watch: {

		/**
		 * Watch for changes in the value prop and update selectedValue accordingly
		 */
		value(newVal) {

			this.selectedValue = boolean(newVal) ? newVal : []
		}
	},

	methods: {
		/**
		 * Generate a unique name by appending a random number to the provided id
		 *
		 * @param {String} id - The id to append the random number to (optional)
		 * @returns {String} - The unique name generated
		 */
		getUniqueName (id = '') {

			return id + '__' + Math.floor(Math.random() * 100000);
		},

		/**
		 * Handler function for input events, invokes the onChange method with the appropriate parameters based on the 'from' prop
		 *
		 * @param {Any} value - The new value of the input
		 */
		onInput(value){

			if(this.from){

				this.onChange(value, this.name)

			} else {

				this.onChange(value, this.label)
			}
		}
	},

	components: {

		'form-field-template': FormFieldTemplate,
	}
};
</script>

<style scoped>

.c-form-checkbox > label { font-weight: 400; cursor: pointer; }

.form-checkbox{ padding-left: 28px !important; }

.control-label { word-break: break-word; }
</style>
