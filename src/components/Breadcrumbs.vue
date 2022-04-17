<template>
	<div class="breadcrumbs">
		<span class="home">~/</span>
		<span v-for="parent in parents" :key="parent">
			<g-link :to="parent">{{ parent }}</g-link>
			<span class="separator">/</span>
		</span>
		<span>{{ currentPage }}</span>
	</div>
</template>

<script>
export default {
	props: ["currentPath"],
	computed: {
		parents() {
			return this.currentPath.split("/").filter(n => n);
		}
	}
};
</script>

<style scoped lang="scss">
.breadcrumbs {
	margin-bottom: 2em;
	font-size: 0.9em;

	.separator,
	.home {
		padding: 0.25em;
		font-size: 0.9em;
		color: $gray;
	}

	span {
		display: inline-block;
	}

	a {
		margin: 0.5em;

		&:hover {
			border-bottom: 0.2em solid $white;
		}
	}
}
</style>
