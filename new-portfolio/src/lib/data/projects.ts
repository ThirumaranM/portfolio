import Assets from './assets';
import { getSkills } from './skills';
import type { Project } from '../types';

export const items: Array<Project> = [
	{
		slug: 'automated-pipeline',
		color: '#5e95e3',
		description:
			'Developed automation workflows for a research-driven application focused on identifying good and bad bacteria in human samples. Implemented CI/CD pipelines to streamline the data ingestion, processing, and deployment lifecycle. Utilized AWS services such as Lambda, S3, and Batch to automate data extraction, transformation, and storage. Integrated machine learning models for bacterial classification to support real-time analysis. Ensured the entire workflow was scalable, secure, and optimized for performance in a fully cloud-native environment.',
		shortDescription:
			'Cloud-based automation pipeline for analyzing bacterial composition in human samples using AWS serverless technologies and CI/CD workflows.',
		links: [{ to: '', label: '' }],
		logo: Assets.Amili,
		name: 'Automated Pipeline for Microbiome Analysis',
		period: {
			from: new Date('2023-08-01'),
			to: new Date('2025-03-31')
		},
		skills: getSkills('aws', 'python', 'docker', 'postgreSQL', 'git'),
		type: 'Backend Automation'
	},
	{
		slug: 'sales-management',
		color: '#ff3e00',
		description:
			'Built and deployed a sales management application backend using Python and AWS services to handle core sales functions such as order processing, inventory, and transaction management. Integrated AWS Lambda for serverless execution, reducing operational overhead and enabling real-time updates. Architected scalable data storage using RDS for structured and unstructured data. Used API Gateway for secure and efficient API communication. Implemented CI/CD pipelines for continuous integration and deployment, ensuring system reliability and fast iteration cycles.',
		shortDescription:
			'Cloud-native sales management system with RESTful APIs and serverless backend using AWS services for order tracking and transaction processing.',
		links: [{ to: '', label: '' }],
		logo: Assets.Plant365,
		name: 'Sales Management Application',
		period: {
			from: new Date('2023-1-01'),
			to: new Date('2023-07-30')
		},
		skills: getSkills('aws', 'python', 'git'),
		type: 'Serverless Application',
		screenshots: [
			{
				label: '1',
				src: Assets.screen1
			},
			// {
			// 	label: '2',
			// 	src: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
			// },
			// {
			// 	label: '3',
			// 	src: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			// },
			// {
			// 	label: '4',
			// 	src: 'https://images.unsplash.com/photo-1542903660-eedba2cda473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			// },
			// {
			// 	label: '5',
			// 	src: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			// },
			// {
			// 	label: '6',
			// 	src: 'https://images.unsplash.com/photo-1585079542156-2755d9c8a094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			// }
		]
	}
];

export const title = 'Projects';
