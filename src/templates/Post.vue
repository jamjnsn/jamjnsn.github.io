<template>
	<Layout>
		<div class="container">
			<breadcrumbs :currentPath="$page.post.path" />

			<header>
				<h1 class="title">
					{{ $page.post.title }}
				</h1>

				<div class="tags" v-if="$page.post.tags">
					<g-link
						v-for="tag in $page.post.tags"
						:key="tag.id"
						:to="tag.path"
						class="read-more-link"
						>{{ tag.id }}</g-link
					>
				</div>

				<div class="meta">
					<div class="meta-entry">
						Posted {{ $page.post.date_posted }}
					</div>
					<div class="meta-entry">
						Last Updated {{ $page.post.date_updated }}
					</div>
				</div>
			</header>

			<div class="content">
				<div v-if="$page.post.cover_image">
					<g-image alt="Cover image" :src="$page.post.cover_image" />
				</div>

				<div v-html="$page.post.content" />
			</div>
		</div>
	</Layout>
</template>

<script>
import Breadcrumbs from "../components/Breadcrumbs.vue";
export default {
	components: { Breadcrumbs },
	metaInfo() {
		return {
			title: this.$page.post.title,
			meta: [
				{
					name: "description",
					content: this.$page.post.description
				}
			]
		};
	}
};
</script>

<page-query>
query Post ($id: ID!) {
  post: post (id: $id) {
    title
	date_posted (format: "MMMM D, YYYY")
	date_updated (format: "MMMM D, YYYY")
	slug
	path
    tags {
      id
      title
	  path
    }
    description
    content
	fileInfo {
		name
	}
  }
}
</page-query>

<style scoped lang="scss">
.meta {
	@extend .small;

	.meta-entry {
		border-bottom: 1px solid currentColor;
		padding: 0.2em;
	}
}

header {
	margin-bottom: 2em;
	padding-bottom: 1em;
	border-bottom: 0.5em solid $white;

	h1 {
		margin-bottom: 0.25em;
	}
}

.tags {
	margin-bottom: 1em;
	font-size: 0.9em;

	& > a {
		display: inline-block;
		padding: 0.2em 0.5em;
		background-color: $gray-dark;
		border-radius: 0.2em;

		&:before {
			content: "#";
		}

		&:not(:last-child) {
			margin-right: 0.5em;
		}

		&:hover {
			background-color: $gray-darker;
		}
	}
}
</style>
