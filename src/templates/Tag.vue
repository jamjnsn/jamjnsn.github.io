<template>
	<Layout>
		<page-title>#{{ $page.tag.title }}</page-title>
		<div class="container">
			<post-list :posts="posts" />
		</div>
	</Layout>
</template>

<page-query>
query Tag ($id: ID!) {
  tag (id: $id) {
    title
    belongsTo {
      edges {
        node {
          ...on Post {
            title
            slug
			date_posted (format: "MMMM D, YYYY")
			date_updated (format: "MMMM D, YYYY")
			path
            description
            content
          }
        }
      }
    }
  }
}
</page-query>

<script>
import PageTitle from "../components/PageTitle.vue";
import PostList from "../components/PostList.vue";

export default {
	components: {
		PostList,
		PageTitle
	},
	metaInfo() {
		return {
			title: this.$page.tag.title
		};
	},
	computed: {
		posts() {
			let posts = [];

			this.$page.tag.belongsTo.edges.map(edge => {
				posts.push(edge.node);
			});

			return posts;
		}
	}
};
</script>

<style scoped lang="scss"></style>
