<template>

	<form-field-template :label="label" :labelStyle="labelStyle" :name="name" :classname="classname" :hint="hint"
	                     :required="required" :isInlineForm="isInlineForm" :key="counter" :tipRule="tipRule" :labelLength="labelLength">

		<div>

			<ValidationProvider :name="name" :rules="rules" ref="fileUpload"  v-model="changedValue"
			                    v-slot="{ errorMessage,handleBlur, classes }">

				<input :id="'file-upload-'+name" :name="name" ref="files" type="file" :accept="accept"
				       @input="handleChange" @change="onFileSelected"
				       @blur="handleBlur"
				       :multiple="multiple"/>

				<button type="button" @click="$refs.files.click()" class="btn-bs-file btn btn-sm btn-default btn-block">

					<span><i class="far fa-file"></i> {{ trans('choose_file') }}</span>
				</button>

				<div v-if="files && files.length">

					<div class="file-detail-box" v-for="(file, index) in files" :key="index">

						<div class="file-details">

							{{ (file.name || file.value) + ' (' + (file.size) + (!file.view_url ? ' KB':'') +')'}}

							<div class="float-right">

								<popover arrow placement="left">

									<i v-if="!file.download_url && isImageTypeFile(file.name) || name === 'package_pic'" class="fas fa-eye pointer"
									   @click="displayPreviewImageIfAny(index)" :title="trans('preview')"
									>

									</i>

									<template #content>

										<template v-if="previewImgSrc || file.view_url">

											<div class="card m_4">

												<div class="card-header">

													<h3 class="card-title">{{ trans('preview') }}</h3>

												</div>

												<div v-if="name === 'package_pic' && file.view_url" class="card-body pb-0">

													<faveo-image-element id="attach-img" :source-url="file.view_url"
													                     :classes="['preview_img']"/>
												</div>

												<div v-else class="card-body pb-0">

													<faveo-image-element id="attach-img" :source-url="previewImgSrc"
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

								<!-- todo: this is a temporary block and should be removed once attachment module is rewritten  -->
								<a v-if="(file.link || file.download_url) && (name !== 'package_pic')" class="fas fa-download ml-2" v-tooltip="trans('download_attachment')" style="color: inherit;"
								   :href="(this.formType === 'asset' || this.formType === 'changes' || this.formType === 'service_desk' || this.formType === 'license' || this.formType === 'contract' || this.formType === 'releases' || this.formType === 'problem') ? file.download_url : (basePath() + file.link)"
								></a>
							</div>
						</div>
					</div>
				</div>

				<span v-if="errorMessage" class="error-block is-danger">{{ errorMessage }}{{ (lang(str) || lang(str1)) ? '.' : '' }}&nbsp;</span>
				<i> {{ lang(str) }}</i>
				<i> {{ lang(str1) }}</i>

			</ValidationProvider>

			<!-- <span v-else>No file choosen</span> -->

			<!-- <div v-if="showPreview" class="popover " id="preview">
			  <div class="arrow" id="arrow"></div>
			  <h6 class="popover-title preview-title">Preivew
				<i class="fas fa-times pull-right" @click="showPreview = false" :title="trans('close')"></i>
			  </h6>
			  <div class="popover-content preview-content">
				<img id="preview_img" v-if="previewImgSrc" :src="previewImgSrc"/>
				<span v-else>Loading...</span>
			  </div>
			</div> -->

		</div>
	</form-field-template>

</template>

<script type="text/javascript">

import {boolean} from '../../../helpers/extraLogics'
import FormFieldTemplate from "./FormFieldTemplate.vue";

import FaveoImageElement from "../../Common/FaveoImageElement.vue";

import {errorHandler} from "../../../helpers/responseHandler";

export default {

	name: "file-upload",

	description: "file upload component along with error block",

	props: {

		label: {type: String, required: true},

		hint: {type: String, default: ""}, //for tooltip message

		name: {type: String, required: true},

		onChange: {type: Function, Required: true},

		classname: {type: String, default: ""},

		required: {type: Boolean, default: false},

		labelStyle: {type: Object},

		id: {type: [String, Number], default: 'file-upload'},

		value: {type: [Object, String, Array], default: ''},

		accept: {type: String, default: ''},

		multiple: {type: Boolean, default: false},

		// fileMaxSize: {type: Number, default: 2}, // Max size(in MB) allowed for a file

		isInlineForm: {type: Boolean, default: false},

		rules: {type: String, default: ''},

		//FOR TOOLTIP POSITION
		tipRule: {type: [Number, Boolean], default: false},

		//for SD size Modules
		sizeModules: {type: String, default: ''},

		formType : { type : String, default : ''},

		labelLength : { type : [Number, String], default : 500 }
	},

	data() {
		return {
			files: [],

			totalSize: null,

			previewImgSrc: '',

			showPreview: false,

			max_size: 0,

			file_size: 0,

			max_file: 0,

			str: '',

			str1: '',

			changedValue: this.value,

			counter: 0,
		};
	},
	async beforeMount() {
		await axios.get('file-manager/upload-info').then(response => {
			if (!this.sizeModules.post_max_size) {
				this.totalSize = response.data.data.maxPostSize;
				this.str1 =  this.lang('max_upload_size') + this.formatBytes(this.totalSize);
			}
		}).catch(error => {
			// Handle error if needed
		});
	},

	mounted() {
		this.max_size = this.sizeModules.post_max_size;
		this.file_size = this.sizeModules.upload_max_filesize;
		this.max_file = this.sizeModules.max_file_uploads;
		if (this.max_size !== undefined || this.file_size !== undefined || this.max_file !== undefined) {
			this.str =  this.lang('max_upload_size') + this.formatBytes(this.max_size);
		} else {
			this.str = '';
		}
		this.updatefiles(this.value);
	},

	watch: {
		value(newVal) {

			this.updatefiles(newVal);

			this.changedValue= newVal;
		}
	},

	methods: {
		formatBytes(bytes, decimals) {

			if (bytes == 0)
				return '0 Bytes';

			var k = 1024,

				dm = decimals || 2,

				sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],

				i = Math.floor(Math.log(bytes) / Math.log(k));

			return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
		},


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
			this.counter++;
			const files = e.target.files;
			const maxFiles = this.max_file; // maximum number of files allowed
			if (files.length + this.files.length > maxFiles) {

				let message1 = this.trans('file_upload_limit')

				let message2 = this.trans('files')

				this.$store.dispatch('setAlert', {

					type: 'danger',

					message: (`${message1} ${maxFiles} ${message2}`),

					component_name: 'faveo-form'
				})
				return;
			}else{
				for (var i = 0; i < files.length; i++) {
					if (this.multiple) {
						const fileName = files[i].name;
						const fileExists = this.files.some(file => file.name === fileName);

						!fileExists ? this.files.push(files[i]) : '';
					} else {
						// emptying the array to clear all references
						this.files.splice(0, this.files.length);
						this.files.push(files[i]);
					}
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
		'form-field-template': FormFieldTemplate,
		'faveo-image-element': FaveoImageElement
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
.file-details{
	padding: .3rem;
	background: #f8f9fa;
}

.m_4 {
	margin: -4px !important;
}
</style>