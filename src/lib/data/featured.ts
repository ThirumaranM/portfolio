import Assets from './assets';
import { getSkills } from './skills';
import type { Project } from '../types';

export const items: Array<Project> = [
	{
		slug: 'sri-thirumal-fabrications',
		color: '#ff9900',
		description: 'Designed and developed a professional corporate website for Sri Thirumal Fabrications. Created a responsive, modern interface to showcase their products, services, and business portfolio effectively to clients and partners. Ensured cross-browser compatibility and optimized the performance for seamless user experience.',
		shortDescription: 'Professional corporate website developed for Sri Thirumal Fabrications.',
		links: [{ to: 'https://srithirumalfabrications.com', label: 'Website' }],
		logo: Assets.Unknown,
		name: 'Sri Thirumal Fabrications Website',
		period: { from: new Date('2024-01-01') },
		skills: getSkills('HTML', 'CSS', 'JavaScript'),
		type: 'Web Development',
		screenshots: []
	}
];

export const title = 'Featured Work';
