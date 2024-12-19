<template>

	<div class="card card-light mb-0 rounded-0">

		<div class="card-header">

			<h3 class="card-title" v-tooltip="formSection.label ? formSection.label : formSection.title">{{formSection.label ? subString(formSection.label) : subString(formSection.title)}}</h3>
			<!-- Slot for rendering custom button content -->
			<slot name="button"></slot>
		</div>

		<div class="card-body p-0 pt-2">

			<div class="row">

				<template v-if="formSection.form_fields.first && formSection.form_fields.second">

					<div class="col-md-6 mb-2">

						<FormFieldRenderer v-for="formField in formSection.form_fields.first" :key="formField.key" :id="formField.key"
						                   :formId="formId"
						                   :form-field="formField"
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
						                   :recur_mode="recur_mode"
						                   :callingFrom="callingFrom"
						>
						</FormFieldRenderer>
					</div>

					<div class="col-md-6 mb-2">

						<FormFieldRenderer v-for="formField in formSection.form_fields.second" :key="formField.key" :id="formField.key"
						                   :formId="formId"
						                   :form-field="formField"
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
						                   :recur_mode="recur_mode"
						                   :callingFrom="callingFrom"
						>
						</FormFieldRenderer>
					</div>
				</template>

				<template v-if="formSection.form_fields.first && !formSection.form_fields.second">

					<div class="col-md-12">

						<FormFieldRenderer v-for="formField in formSection.form_fields.first" :key="formField.key" :id="formField.key"
						                   :formId="formId"
						                   :form-field="formField"
						                   :formUniqueKey="formUniqueKey"
						                   :panel="panel"
						                   :scenario="scenario"
						                   :formType="formType"
						                   :btn-style="btnStyle"
						                   :input-style="inputStyle"
						                   :isInlineForm="isInlineForm"
						                   :sizeModules="sizeModules"
						                   :apiKey="apiKey"
						                   :selectDependencyId="selectDependencyId"
						                   :selectDependencyKey="selectDependencyKey"
						                   :recur_mode="recur_mode"
						                   :callingFrom="callingFrom"
						>
						</FormFieldRenderer>
					</div>
				</template>

				<template v-if="formSection.form_fields.second && !formSection.form_fields.first">

					<div class="col-md-12">

						<FormFieldRenderer v-for="formField in formSection.form_fields.second" :key="formField.key" :id="formField.key"
						                   :formId="formId"
						                   :form-field="formField"
						                   :formUniqueKey="formUniqueKey"
						                   :panel="panel"
						                   :scenario="scenario"
						                   :formType="formType"
						                   :btn-style="btnStyle"
						                   :input-style="inputStyle"
						                   :isInlineForm="isInlineForm"
						                   :sizeModules="sizeModules"
						                   :apiKey="apiKey"
						                   :selectDependencyId="selectDependencyId"
						                   :selectDependencyKey="selectDependencyKey"
						                   :recur_mode="recur_mode"
						                   :callingFrom="callingFrom"
						>
						</FormFieldRenderer>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>

import { getSubStringValue } from "../../../helpers/extraLogics";

export default {

	/**
	 * Props passed to the component:
	 * - formSection: The form section object. Default is an empty object.
	 * - formUniqueKey: Unique key for the form. Required.
	 * - panel: The panel type of the component. Default is 'agent'.
	 * - scenario: The scenario of the component. Required.
	 * - formType: The category of the form. Default is an empty string.
	 * - inputStyle: CSS styles for the input element. Default is an empty object.
	 * - btnStyle: CSS styles for the button element. Default is an empty object.
	 * - sizeModules: Size modules for the form. Default is an empty string.
	 * - isInlineForm: Boolean flag to determine if the form is inline. Default is true.
	 * - formId: The ID of the form. Default is an empty string.
	 * - apiKey: The API key. Default is an empty string.
	 * - selectDependencyId: The ID of the select dependency. Default is an empty string or number.
	 * - selectDependencyKey: The key for the select dependency. Default is an empty string.
	 * - recur_mode: Specifies the mode for recurring events. Default is an empty string.
	 */
	props : {
		formSection : { type: Object, default : ()=>{} },
		formUniqueKey: {type: String, required: true},
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
		selectDependencyKey : { type : String, default : '' },
		recur_mode: {type: String, default: ''},
		callingFrom: { type : String, default : ''}
	},

	methods: {

		subString(value,length = 50){

			return getSubStringValue(value,length)
		},
	}
}
</script>