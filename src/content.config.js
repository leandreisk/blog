import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({ 
		// base: "src/data/blog-posts",       // sans "./"
    	pattern: "src/data/blog-posts/**/*.md",
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		translationSlug: z.string(),
		publishDate: z.union([z.string(), z.date()]),
		description: z.string(),
		lang: z.enum(['en', 'fr']),
	}),
});

const projects = defineCollection({
	loader: glob({ 
		// base: "src/data/blog-posts",       // sans "./"
    	pattern: "src/data/projects/**/*.md",
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		translationSlug: z.string(),
		publishDate: z.union([z.string(), z.date()]),
		description: z.string(),
		// si tu veux ajouter des champs spécifiques projets
		tools: z.array(z.string()).optional(),
		repo: z.string().url().optional(),
		lang: z.enum(['en','fr']),
		}),
});

export const collections = { posts, projects };