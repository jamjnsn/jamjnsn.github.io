const path = require("path");

function addStyleResource(rule) {
	rule.use("style-resource")
		.loader("style-resources-loader")
		.options({
			patterns: [path.resolve(__dirname, "./src/assets/sass/app.scss")]
		});
}

module.exports = {
	siteName: "JNSN",
	siteDescription: "My blog",

	siteUrl: "https://jnsn.me",

	templates: {
		Tag: "/blog/tag/:id",
		Post: "/blog/:slug"
	},

	plugins: [
		{
			// Create posts from markdown files
			use: "@gridsome/source-filesystem",
			options: {
				typeName: "Post",
				path: "content/blog/*.md",
				refs: {
					// Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
					tags: {
						typeName: "Tag",
						create: true
					}
				}
			}
		},

		{
			// Import projects
			use: "@gridsome/source-filesystem",
			options: {
				typeName: "Project",
				path: "content/projects/*.yml"
			}
		}
	],

	transformers: {
		remark: {
			externalLinksTarget: "_blank",
			externalLinksRel: ["nofollow", "noopener", "noreferrer"],
			anchorClassName: "icon icon-link",
			plugins: ["gridsome-plugin-remark-prismjs-all"]
		}
	},

	// Add rules to Webpack
	chainWebpack(config) {
		// Load variables for all vue-files
		const types = ["vue-modules", "vue", "normal-modules", "normal"];

		types.forEach(type => {
			addStyleResource(config.module.rule("sass").oneOf(type));
		});

		// or if you use scss
		types.forEach(type => {
			addStyleResource(config.module.rule("scss").oneOf(type));
		});
	}
};
