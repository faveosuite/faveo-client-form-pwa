<template>
	<Loader v-if="isLoading" :duration="1000"></Loader>
	<div v-else>
		<div v-if="decryptedMessage">
			<div v-if="contentType === 'text'">
				<p class="decryptedText">{{ decryptedMessage }}</p>
			</div>
			<div v-else-if="contentType === 'image'" class="content-container image-container">
				<img :src="decryptedMessage" class="cursor-pointer" alt="Decrypted Image" />
			</div>
			<div v-else-if="contentType === 'pdf'" class="content-container pdf-container">
				<embed :src="decryptedMessage" type="application/pdf" width="100%" height="600px" />
			</div>
			<div v-else-if="contentType === 'filetext' || contentType === 'csv'" class="content-container filetext-container">
				<p>{{ lang('cant_preview_secret') }}</p>
				<a :href="decryptedMessage" :download="this.filename">
					{{ lang('download_link_here') }}
				</a>
			</div>
			<div v-else-if="isDownloadable" class="content-container file-container">
				<p>{{ lang('cant_preview_secret') }}</p>
				<a :href="decryptedMessage" :download="this.filename">
					{{ lang('download_link_here') }}
				</a>
			</div>
		</div>
		<div v-else class="content-container">
			<p><strong>{{ lang('secret_doest_not_exist') }}</strong></p>
			<p>{{ lang('it_might_be_caused_by_any_of_these_reasons') }}</p>
			<p><span><strong>{{ lang('opened_before') }}</strong></span>{{ lang('secret_can_restrict') }}</p>
			<p>{{ lang('secret_might_have_been_compromised') }}</p>
			<p><span><strong>{{ lang('broken_link') }}</strong></span>{{ lang('link_must_match_perfectly') }}</p>
			<p><span><strong>{{ lang('expired') }}</strong></span> {{ lang('no_secrets_lasts') }}</p>
		</div>
	</div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue';
import Loader from "../MiniComponent/Loader.vue";

export default {
	name:'preview-content',
	components: {Loader},
	props: {
		decryptedMessage: { type: String, default: '' },
		contentType: { type: String, default: 'text' },
		filename: { type: String, default: '' }
	},
	setup(props) {
		const isLoading = ref(true);

		const getFileExtension = (contentType) => {
			const extensions = {
				filetext: 'txt',
				csv: 'csv',
				zip: 'zip',
				rar: 'rar',
				doc: 'doc',
				docx: 'docx',
				xls: 'xls',
				xlsx: 'xlsx',
				ppt: 'ppt',
				pptx: 'pptx',
			};
			return extensions[contentType] || 'txt';
		};

		const isDownloadable = computed(() => {
			return ['zip', 'rar', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(props.contentType);
		});

		watch(
			() => props.decryptedMessage,
			(newVal) => {
				if (newVal) {
					isLoading.value = false;
				}
			}
		);

		watch(
			() => props.contentType,
			(newVal) => {
				if (newVal) {
					isLoading.value = false;
				}
			}
		);

		onMounted(() => {
			// Simulate a loading delay for demonstration
			setTimeout(() => {
				isLoading.value = false;
			}, 1000);
		});

		return {
			isLoading,
			getFileExtension,
			isDownloadable,
		};
	}
};
</script>

<style scoped>
.image-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.image-container img {
	max-height: 400px;
	max-width: 100%;
}

.pdf-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 600px;
}

.filetext-container,
.file-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
}
.decryptedText{
	white-space: pre-line!important;
}
</style>
