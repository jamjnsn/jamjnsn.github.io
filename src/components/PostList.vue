<template>
	<div class="posts">
		<post-card v-for="post in posts" :key="post.slug" :post="post" />
	</div>
</template>

<script>
import PostCard from "./PostCard.vue";

export default {
	components: { PostCard },
	props: ["posts"]
};
</script>

<style lang="scss"></style>
