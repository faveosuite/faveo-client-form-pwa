<template>

	<form-field-template :label="label" :labelStyle="labelStyle" :name="name" :classname="classname" :hint="hint"
	                     :required="required" :isInlineForm="isInlineForm" :key="counter" :tipRule="tipRule" :labelLength="labelLength">

		<div>

			<ValidationProvider :name="name" :rules="rules" ref="fileUpload" v-model="changedValue"
			                    v-slot="{ errorMessage,handleBlur, classes }">

				<input :id="'file-uploaded-'+name" :name="name" ref="files" type="file" :accept="accept"
				       @input="handleChange" @change="onFileSelected"
				       @blur="handleBlur"/>

				<button type="button" @click="$refs.files.click()" class="btn-bs-file btn btn-sm btn-default btn-block">

					<span><i class="far fa-image"></i> {{ trans('choose_image') }}</span>
				</button>

				<div v-if="files && files.length">

					<div class="file-detail-box" v-for="(file, index) in files" :key="index">

						<div>

							{{
								file.name || file.value ? file.name || file.value + " (" + file.size + " KB)" : (file.includes('/') ? file.split('/').pop() : file)
							}}

							<div class="float-right">

								<popover arrow placement="left">

									<template #content>

										<template v-if="previewImgSrc || file.view_url">

											<div class="card m_4">

												<div class="card-header">

													<h3 class="card-title">{{ trans('preview') }}</h3>

												</div>

												<div class="card-body pb-0">

													<faveo-image-element id="attach-img" :source-url="previewImgSrc || file.view_url"
													                     :classes="['preview_img']"/>
												</div>
											</div>
										</template>

										<template v-else>

											<div class="row" id="load_margin">

												<resue-loader :animation-duration="4000" :size="30"/>
											</div>
										</template>
									</template>
								</popover>&nbsp;

								<a href="javascript:;" @click="handleChange">

									<i class="fas fa-times pointer" @click="removeFile(index)"
									   :title="trans('remove')"></i>
								</a>
								<i v-if="isImageTypeFile(file.name)" class="fas fa-eye pointer ml-2 mr-1"
								   @click="displayPreviewImageIfAny(index)" :title="trans('preview')"
								>

								</i>
							</div>
						</div>
					</div>
				</div>

				<span v-if="errorMessage" class="error-block is-danger">{{ errorMessage }}</span>
			</ValidationProvider>
		</div>
	</form-field-template>

</template>

<script type="text/javascript">

import {boolean} from '../../../helpers/extraLogics'
import FormFieldTemplate from "./FormFieldTemplate.vue";

export default {

	name: "assetimage-upload",

	description: "file upload component along with error block",

	props: {

		label: {type: String, required: true},

		hint: {type: String, default: ""}, //for tooltip message

		name: {type: String, required: true},

		onChange: {type: Function, Required: true},

		classname: {type: String, default: ""},

		required: {type: Boolean, default: false},

		labelStyle: {type: Object},

		id: {type: [String, Number], default: 'file-uploaded'},

		value: {type: [Object, String, Array], default: ''},

		accept: {type: String, default: ''},

		multiple: {type: Boolean, default: false},

		fileMaxSize: {type: Number, default: 2}, // Max size(in MB) allowed for a file

		isInlineForm: {type: Boolean, default: false},

		rules: {type: String, default: ''},

		//FOR TOOLTIP POSITION
		tipRule: {type: [Number, Boolean], default: false},

		labelLength : { type : [Number, String], default : 500 }
	},

	data() {
		return {
			files: [],

			previewImgSrc: '',

			showPreview: false,

			changedValue: this.value,

			counter: 0,
		};
	},

	mounted() {
		this.updatefiles(this.value)
	},

	watch: {
		value(newVal) {
			this.changedValue=newVal;
		}
	},

	methods: {

		isImageTypeFile(name) {
			return /\.(jpe?g|png|gif)$/i.test(name)
		},

		updatefiles(newVal) {
			if (newVal) {
				if (Array.isArray(newVal)) {
					this.files = newVal;
				} else {
					this.files = [newVal];
				}
			} else {
				this.files = []
			}
		},

		async onFileSelected(e) {
			const files = e.target.files;
			const maxFiles = this.max_file; // maximum number of files allowed
			if (files.length + this.files.length > maxFiles) {
				alert(`File upload limit: ${maxFiles}`);
				return;
			}
			for (var i = 0; i < files.length; i++) {
				if (this.multiple) {
					this.files.push(files[i]);
				} else {
					// emptying the array to clear all references
					this.files.splice(0, this.files.length);
					this.files.push(files[i]);
				}
			}
			this.$refs.fileUpload.validate(this.files);
			this.updateParent(this.files, this.name, false);
		},


		displayPreviewImageIfAny(index) {

			this.showPreview = true;

			if (this.files[index].path) {

				this.previewImgSrc = this.files[index].path;

			} else {

				this.previewImgSrc = '';

				setTimeout(() => {

					let reader = new FileReader()
					reader.addEventListener('load', function () {
						this.previewImgSrc = reader.result
					}.bind(this), false)
					reader.readAsDataURL(this.files[index])
				}, 1)
			}
		},

		distroyPreviewImageBlock() {
			this.previewImgSrc = ''
			this.showPreview = false;
		},

		updateParent(newValue, name, isRemoved) {
			this.onChange(newValue, name, isRemoved)
		},

		removeFile(index) {
			this.files.splice(index, 1);
			this.distroyPreviewImageBlock();
			this.updateParent(this.files, this.name, true);
			this.$refs.fileUpload.validate(this.files);
			this.counter++;
		}


	},

	components: {
		'form-field-template': FormFieldTemplate
	}
};
</script>

<style scoped>

.vue-popover {
	width: 260px !important;
	height: 30% !important;
	top: auto !important;
	left: auto !important;
	position: absolute !important;
}

#load_margin {
	margin-top: 15px;
	margin-bottom: 15px;
}

input[type="file"] {
	position: absolute;
	opacity: -999;
}

.preview_img {
	width: 216px;
	height: 180px;
	margin-bottom: 20px;
}

.file-detail-box {
	border: 1px solid #dedede;
	padding: .3rem;
	margin-top: .5rem;
	background: #f8f9fa;
	border-radius: 0.25rem;
}

.m_4 {
	margin: -4px !important;
}
</style>