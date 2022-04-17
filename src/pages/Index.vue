<template>
	<Layout>
		<div class="container">
			<div class="hello">
				<pre v-html="hello" />
			</div>

			<div class="content">
				<p>
					I'm just a guy from Canada with a passion for technology.
					Starting as a child making a website in Microsoft Paint,
					I've sought out knowledge about computer programming and
					design with a focus on constantly learning and improving.
					Besides this, I also dabble in cooking, photography, music
					production, and drumming.
				</p>
			</div>
		</div>
	</Layout>
</template>

<script>
export default {
	metaInfo: {
		title: "My home"
	},
	data() {
		return {
			hello: [
				" _    _      _ _       _",
				"| |  | |    | | |     | |",
				"| |__| | ___| | | ___ | |",
				"|  __  |/ _ \\ | |/ _ \\| |",
				"| |  | |  __/ | | (_) |_|",
				"|_|  |_|\\___|_|_|\\___/(_)",
				"========================="
			].join("\r\n")
		};
	}
};
</script>

<style scoped lang="scss">
.hello {
	display: block;
	margin-bottom: 1em;
}
</style>
