import { items } from '@data/blogs';
import { error } from '@sveltejs/kit';

export function load({ params }: { params: Record<string, string> }) {
	if (params.slug) {
		const index = items.findIndex((item) => item.slug === params.slug);

		if (index !== -1) {
			const post = items[index];
			const prevPost = index > 0 ? items[index - 1] : null;
			const nextPost = index < items.length - 1 ? items[index + 1] : null;
			return { post, prevPost, nextPost };
		}
	}

	throw error(404, 'Blog post not found');
}
