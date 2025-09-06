import Assets from './assets';
import type { Education } from '../types';

export const items: Array<Education> = [
	{
		degree: 'Bachelor of Technology',
		description: '',
		location: 'Puducherry, India',
		logo: Assets.Christ,
		name: 'Electronics and Communication Engineering',
		organization: 'Christ College of Engineering and Technology',
		period: { from: new Date(2018, 8, 1), to: new Date(2022, 8, 24) },
		shortDescription: 'Electronics and Communication Engineering graduate with focus on embedded systems, communication technologies, and software development.',
		slug: 'christ-ece-btech',
		subjects: ['Digital Electronics', 'Microprocessors', 'Signal Processing', 'VLSI Design', 'Embedded Systems', '+ More']
	},
	{
		degree: 'Higher Secondary Certificate (HSC)',
		description: '',
		location: 'Puducherry, India',
		logo: Assets.Jawahar, // You can replace this with the actual school logo asset if available
		name: '',
		organization: 'Jawahar Higher Secondary School',
		period: { from: new Date(2016, 5, 1), to: new Date(2018, 5, 24) }, // June 2018 – April 2020
		shortDescription: '',
		slug: 'hsc-computer-science',
		subjects: ['Biology', 'Mathematics', 'Physics', 'English', 'Chemsistry']
	}

];

export const title = 'Education';
