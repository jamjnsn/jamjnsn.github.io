<template>
	<Layout>
		<div class="container">
			<post-list :posts="posts" />
		</div>
	</Layout>
</template>

<page-query>
query Posts {
  allPost {
    edges {
      node {
		title
		date_posted (format: "MMMM D, YYYY")
		date_updated (format: "MMMM D, YYYY")
		slug
		path
		description
		content
      }
    }
  }
}
</page-query>

<script>
import PostList from "../components/PostList.vue";

export default {
	components: {
		PostList
	},
	metaInfo: {
		title: "Blog"
	},
	computed: {
		posts() {
			let posts = [];
			this.$page.allPost.edges.map(edge => {
				posts.push(edge.node);
			});
			return posts;
		}
	}
};
</script>

<style lang="scss"></style>
