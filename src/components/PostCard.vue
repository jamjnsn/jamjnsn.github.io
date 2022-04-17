<template>
	<div>
		<div v-if="post.cover_image">
			<g-image
				alt="Cover image"
				class="post-card__image"
				:src="post.cover_image"
			/>
		</div>

		<div>
			<header>
				<h2 v-html="post.title" class="title" />

				<div class="dates">
					<span v-html="post.date_updated" />
				</div>
			</header>

			<p v-html="post.description" />

			<g-link :to="post.path" class="read-more-link">Read More</g-link>
		</div>
	</div>
</template>

<script>
export default {
	props: ["post"]
};
</script>

<style scoped lang="scss">
.read-more-link {
	@extend .button;
	display: inline-block;
	margin-top: 1em;

	&:before {
		content: "> ";
	}
}

.title {
}

header {
	margin-bottom: 1em;
}

.dates {
	@extend small;
}
</style>
