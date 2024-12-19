<template>

	<div v-if="siteKey" id="cap_cha">

		<ValidationProvider name="form-recaptcha" :rules="version == 'v2' ? 'required' : ''">
			<vue-recaptcha :ref="version == 'v2' ? 'recaptcha' : 'invisibleRecaptcha'"
			               name="form-recaptcha"
			               v-model="recaptchaVerified"
			               @verify="markRecaptchaAsVerified"
			               @expired="onExpired"
			               :sitekey="siteKey ? siteKey : ''"
			               :size="version == 'v2' ? 'normal' : 'invisible'">
			</vue-recaptcha>
		</ValidationProvider>
	</div>
</template>
<script>

import { VueRecaptcha } from 'vue-recaptcha';

export default {

	name : 'recaptcha-field',

	description : 'Recaptcha Field component',

	props: {

		siteKeyValue : { type : String, default : '' },

		captchaVersion : { type : String, default : '' },

		from : { type : String, default : ''},

		node: {type: Object, default : ()=> {}},

		category : {type: String, default: 'ticket'},

		verifyCaptcha : { type : Function, default :()=>{} }
	},

	data() {

		return {

			recaptchaVerified : "",
		}
	},

	components: {

		VueRecaptcha
	},

	created(){

		window.emitter.on(this.category+'FormSubmitted', ()=>{

			this.$emit("assignToModel", 'value', "");

			window.grecaptcha.reset();
		})
	},

	mounted() {

		if(this.$refs.recaptcha){

			this.$refs.recaptcha.reset()
		}

		if(this.$refs.invisibleRecaptcha) {

			this.$refs.invisibleRecaptcha.reset()
		}

		if(this.version != 'v2' && this.siteKey)
		{
			this.$refs.invisibleRecaptcha.execute();
		}
	},

	computed: {

		siteKey() {

			return this.siteKeyValue ? this.siteKeyValue : this.recaptchaSiteKey
		},

		version() {

			return this.captchaVersion ? this.captchaVersion : this.recaptchaVersion
		}
	},

	methods: {

		markRecaptchaAsVerified(response) {

			this.recaptchaVerified = response;

			this.$emit("assignToModel", 'value',this.recaptchaVerified);

			this.verifyCaptcha(response);

			window.emitter.emit('recaptcha-validated')
		},

		onExpired() {

			this.verifyCaptcha('');
		}
	}
};
</script>

<style>
/*#faveo-form-client-panel #cap_cha,.faveo-form #cap_cha{ margin-left: -10px; }*/

/*.modal-body #cap_cha { margin-left: -20px !important; }*/
</style>
