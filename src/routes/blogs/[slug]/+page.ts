import { items } from '@data/blogs';
import { error } from '@sveltejs/kit';

export function load({ params }: { params: Record<string, string> }) {
	if (params.slug) {
		const post = items.find((item) => item.slug === params.slug);

		if (post) {
			return { post };
		}
	}

	throw error(404, 'Blog post not found');
}
