<script setup>

import FaveoFormClientPanel from "./components/Client/FaveoFormClientPanel.vue";

const theme = import.meta.env.VITE_THEME;

</script>

<template>

	<div class="row container-fluid" :class="theme">

		<nav class="navbar navbar-expand-sm justify-content-center">

			<ul class="navbar-nav">

				<li class="nav-item active">

					<a class="nav-link" href="javascript:;">

						<img src="/images/192X192-01.png" height="50" width="50" alt="Img">
					</a>
				</li>
			</ul>
		</nav>

		<div class="col"></div>

		<div class="col-10">

			<FaveoFormClientPanel panel="client" category="ticket"></FaveoFormClientPanel>
		</div>

		<div class="col"></div>
	</div>
</template>
