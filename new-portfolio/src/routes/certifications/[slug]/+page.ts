import { items } from '@data/certifications';

export function load({ params }: { params: Record<string, string> }) {
    if (params.slug) {
        const certification = items.find((item) => {
            return item.slug === params.slug;
        });

        return { certification };
    }
}