<template>
	<div class="layout">
		<nav class="nav">
			<div class="container">
				<div class="brand">
					<g-link to="/" :alt="$static.metadata.siteName">
						<g-image alt="JNSN" src="~/logo.svg" width="135" />
					</g-link>
				</div>

				<div id="menu">
					<div class="menu-item">
						<g-link to="/projects">Projects</g-link>
					</div>

					<div class="menu-item">
						<g-link to="/blog">Blog</g-link>
					</div>
				</div>
			</div>

			<svg class="top-flourish" viewBox="0 0 100 5">
				<polygon points="0,0 50,0 0,3" />
			</svg>
		</nav>

		<main>
			<slot />
		</main>
	</div>
</template>

<script>
export default {};
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style lang="scss">
.layout {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100vh;
	z-index: 10;

	main {
		flex: 1 1 auto;
		& > .container {
			margin-top: 1em;
		}
	}

	header,
	nav {
		flex: 0 0 auto;
	}

	footer {
		background: $gray-darker;
		height: 100px;
	}
}

.top-flourish {
	position: absolute;
	top: 100%;
	left: 0;
	fill: $primary;
	z-index: 50;
	pointer-events: none;
}

.nav > .container,
#menu {
	display: flex;
	flex-direction: row;
	width: 100%;
}

.nav {
	color: $black;
	background-color: $primary;

	& > .container {
	}
}

#menu {
	justify-content: flex-end;
	align-content: center;
}

.brand {
	border-bottom: 0.4em solid transparent;

	&:hover {
		border-bottom-color: currentColor;
	}
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: center;

	&:not(:last-child) {
		margin-right: 1.5em;
	}

	& > a {
		display: block;
		border-bottom: 0.2em solid transparent;
		font-weight: bold;
		letter-spacing: 0.05em;

		&:hover {
			border-bottom-color: currentColor;
		}
	}
}
</style>
