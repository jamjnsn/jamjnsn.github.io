<template>
	<Layout>
		<page-title>Projects</page-title>
		<div class="container">
			<div class="project-list">
				<article
					class="project card"
					v-for="edge in $page.allProject.edges"
					:key="edge.node.title"
				>
					<div class="card-body">
						<g-image :src="edge.node.image" class="project-image" />
						<h2 class="title">{{ edge.node.title }}</h2>

						<div>
							<div class="project-description">
								{{ edge.node.description }}
							</div>
							<g-link
								v-if="edge.node.link"
								:to="edge.node.link"
								class="view-link"
								>View</g-link
							>
						</div>
					</div>
				</article>
			</div>
		</div>
	</Layout>
</template>

<page-query>
query Projects {
  allProject {
    edges {
      node {
		title
		image (quality: 100)
		description
		link
      }
    }
  }
}
</page-query>

<script>
import PageTitle from "../components/PageTitle.vue";

export default {
	metaInfo: {
		title: "Projects"
	},
	components: {
		PageTitle
	},
	computed: {
		projects() {
			return this.$page.allProject.edges;
		}
	}
};
</script>

<style lang="scss">
.project {
	border-radius: 0.4em;
}

.project-image {
	display: block;
	max-width: 100%;
	height: auto;
	border-radius: 0.2em;
	margin-bottom: 1em;
}

.project-list {
	.card:not(:last-child) {
		margin-bottom: 1em;
	}
}

.view-link {
	@extend .button;
	display: inline-block;
	margin-top: 1em;

	&:before {
		content: "> ";
	}
}
</style>
