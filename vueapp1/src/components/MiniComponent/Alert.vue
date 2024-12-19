<template>

	<div v-if="shallDisplay()" class="alert-container" id="alert" >
		<div v-bind:class="['alert alert-dismissible', classname]">
			<button type="button" v-on:click="dismiss" class="btn-close close" id="alert_close"></button>
			<!-- <h4 v-if="classname=='alert-danger'"><i id="ban" class="icon fa fa-ban"></i>&nbsp;{{lang('alert')}}!</h4> -->
			<div id="alert-message">
				<i v-if="classname=='alert-success'" class="fa  fa-check-circle alert-icon"></i>
				<i v-if="classname=='alert-danger'" class="fa fa-warning alert-icon"></i>&nbsp;
				&nbsp;

				<alert-parser :data="getData(message)"></alert-parser>

			</div>
		</div>
	</div>

</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import ActivityParser from "../Common/ActivityParser.vue";

export default {
	name: "alert",

	desciption:
		"It is the alert bar which comes into view as soon as there is an error message in vuex alert store",
	props: {
		componentName: {
			type: String,
			default: ""
		}
	},
	computed: {
		...mapGetters(["getAlertType", "getAlertMessage", "getAlertComponentName", "getAlertDuration"]),

		//gets the alert type from vuex

		type: {
			get() {
				return this.getAlertType;
			}
		},

		//gets alert message from vuex
		message: {
			get() {
				return this.getAlertMessage;
			}
		},

		//returns classname based on type value in vuex
		classname: {
			get() {
				return "alert-" + this.getAlertType;
			}
		}
	},

	methods: {
		/**
		 * dispatches an action that deletes alerts from vuex store
		 * @return {void}
		 */
		dismiss() {
			this.$store.dispatch("unsetAlert");
		},

		shallDisplay() {
			return (this.type !== "" && this.getAlertComponentName === this.componentName) || this.getAlertComponentName === 'root-alert-container';
		},

		getData(value) {

			return  `<span>`+value+`</span>`
		}
	},

	watch: {

		message() {

			if (this.message !== "") {

				let self = this;

				const duration = this.getAlertDuration ? this.getAlertDuration : this.type === "success" ? 7000 : 7000;

				setTimeout(function() {

					self.dismiss();

				}, duration);

				let x = {};

				setTimeout(()=>{

					let x = document.getElementsByClassName("alert-container")[0];

					if(x !== undefined){

						x.scrollIntoView({behavior: "smooth", block: 'start' });
					}
				}, 50)
			}
		}
	},

	components : {
		'alert-parser': ActivityParser,
	}
};
</script>

<style type="text/css">
.alertHide {
	display: none;
}
#alert {
	/*margin: 10px 20px 20px 20px;*/
}
#ban {
	float: left !important;
	margin-left: 4px;
}

.alert-container {
	padding-top: 60px;
	margin-top: -60px;
}

#alert_close{
	font-size: .75rem !important;
	//margin-top: -5px !important;
}

#alert-message{ display: flex; }

.alert-icon { margin-top: 4px; }

</style>
