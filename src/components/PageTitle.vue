<template>
	<header class="page-title">
		<div class="container">
			<h1>
				<slot />
			</h1>
		</div>

		<svg class="flourish" viewBox="0 0 100 5">
			<polygon points="0,0 50,0 0,2" />
		</svg>
	</header>
</template>

<script>
export default {};
</script>

<style lang="scss">
.page-title {
	font-size: 2em;
	font-weight: bold;
	color: $white;
	line-height: 1;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	background-color: $gray-darker;

	h1 {
		padding-bottom: 0.5em;
		z-index: 100;
	}

	.container {
		padding-bottom: 0;
	}
}

.flourish {
	position: absolute;
	fill: $gray-darker;
	width: 100%;
	pointer-events: none;
}
</style>
