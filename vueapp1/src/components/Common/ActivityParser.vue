<template>

	<parsed-data :dataValue="data" @click.native="handleAnchorClick"></parsed-data>

	<div v-if="showModal" id="view-redacted-content"></div>
</template>

<script>

import {mapGetters} from "vuex";
import Modal from "./Modal.vue";
import PreviewContent from "./PreviewContent.vue";

export default {

	data() {
		return {
			showModal: false,
		};
	},

	props : {
		data : { type : String, default : '' }
	},

	created() {
		window.emitter.on('hideRedactionPreviewModal', () => {
			this.showModal = false;
		})
	},

	beforeMount(){

		app.component('parsed-data',{

			props : ['dataValue'],

			template : '<div v-html="loadData()"></div>',

			methods : {

				loadData() {

					var parser = new DOMParser();

					var doc = parser.parseFromString(this.dataValue, 'text/html');

					const root = doc.getElementsByTagName('body')[0];

					const anchors  = root.querySelectorAll('a');

					anchors.forEach(anchor => {

						if(anchor.href.includes(this.basePath()) && anchor.style.pointerEvents !== 'none') {

							let anchorArr = anchor.href.replace(this.basePath(),'').split('/');

							let modifiedArr = anchorArr.filter(item => item);

							if(modifiedArr[0] === 'check-ticket' ) {

								anchor.setAttribute('target','_blank');
								anchor = anchor;

							} else if(modifiedArr[0] === 'department' || modifiedArr[0] === 'team' || (modifiedArr[0] === 'service-desk' && modifiedArr[1] === 'products') || (modifiedArr[0] === 'service-desk' && modifiedArr[1] === 'vendor') || (modifiedArr[0] === 'service-desk' && modifiedArr[1] === 'manufacturers') || (modifiedArr[0] === 'service-desk' && modifiedArr[1] === 'deprication') ) {

								anchor.setAttribute('target','_blank');
								anchor.setAttribute('href',anchor.href.replace(this.basePath(),this.basePath()+'/admin'));
								if(anchor.title == 'mention_link') {

									anchor.setAttribute('data-id','mention_link');

									anchor.setAttribute('title','');
								}
								anchor = anchor;

							} else {

								const span = doc.createElement('a');

								if(!anchor.href.includes(this.basePath()+'/panel/') && !anchor.href.includes(this.basePath()+'/admin/') && !anchor.href.includes(this.basePath()+'/client-secret/') && !anchor.href.includes(this.basePath()+'/show/') && !anchor.href.includes(this.basePath()+'/category-list/')){

									span.setAttribute('href',anchor.href.replace(this.basePath(),this.basePath()+'/panel'));

								} else {

									span.setAttribute('href',anchor.href);
								}

								span.setAttribute('target','_blank');

								span.innerText = anchor.innerText;

								if(anchor.title === 'mention_link') {

									span.setAttribute('data-id','mention_link');

									span.setAttribute('title','');
								}
								if (anchor.parentNode) {
									anchor.parentNode.replaceChild(span, anchor);
								}
							}
						}

						anchor.setAttribute('target','_blank');
					});

					return root.innerHTML;
				}
			}
		});
	},
	methods: {
		async handleAnchorClick(event) {
			if (event.target.tagName === 'A' && event.target.textContent.includes('click here to view message')) {
				event.preventDefault();
				const href = event.target.href;
				const id = href.split('/').pop();
				this.modalTitle = 'Decrypted Message';
				window.emitter.emit('render-redacted-message',{'showModal' : this.showModal, 'id' : id });
				this.showModal = true;
			}
		},
	},
	components : { PreviewContent, Modal },
};

</script>
