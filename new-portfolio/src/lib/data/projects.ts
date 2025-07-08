import Assets from './assets';
import { getSkills } from './skills';
import type { Project } from '../types';

export const items: Array<Project> = [
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
			}
		]
	},
	{
		slug: 'automated-pipeline',
		color: '#5e95e3',
		description:
			'Developed automation workflows for a research-driven application focused on identifying good and bad bacteria in human samples. Implemented CI/CD pipelines to streamline the data ingestion, processing, and deployment lifecycle. Utilized AWS services such as Lambda, S3, and Batch to automate data extraction, transformation, and storage. Integrated machine learning models for bacterial classification to support real-time analysis. Ensured the entire workflow was scalable, secure, and optimized for performance in a fully cloud-native environment.',
		shortDescription:
			'Cloud-based automation pipeline for analyzing bacterial composition in human samples using AWS serverless technologies and CI/CD workflows.',
		links: [{ to: '', label: '' }],
		logo: Assets.healthcare,
		name: 'Automated Pipeline for Healthcare Analysis',
		period: {
			from: new Date('2023-08-01'),
			to: new Date('2025-03-31')
		},
		skills: getSkills('aws', 'python', 'docker', 'postgreSQL', 'git'),
		type: 'Backend Automation'
	},
	{
		slug: 'devops-security',
		color: 'greenyellow',
		description:
			'We leverage AWS DevOps practices to automate the entire software delivery process by creating a robust CI/CD pipeline that integrates GitHub with AWS EC2, enabling seamless, rapid, and reliable deployment of our production application and MySQL database. This automation ensures consistent builds, testing, and deployment with minimal manual intervention, improving agility and operational efficiency. At the same time, we prioritize AWS Security by embedding continuous vulnerability scanning and monitoring within our AWS environments to proactively detect and remediate security risks. Using services like Amazon Inspector, AWS Security Hub, and GuardDuty, we identify potential vulnerabilities and suspicious activities, enforcing strict access controls, encryption, and compliance policies to protect our critical infrastructure and data. Together, these DevOps and Security measures ensure fast, safe, and resilient application delivery on AWS.',
		shortDescription:
			'We automate deployments from GitHub to AWS EC2 with CI/CD and continuously monitor AWS for security vulnerabilities to ensure fast, secure releases.',
		links: [{ to: '', label: '' }],
		logo: Assets.coaching,
		name: 'AWS DevOps and AWS Security',
		period: {
			from: new Date('2025-03-01'),
			to: new Date('2025-05-1')
		},
		skills: getSkills('aws', 'mySQL', 'git'),
		type: 'Backend Automation'
	},
	{
		slug: 'astrology',
		color: 'blueviolet',
		description:
			'Designed and implemented the backend infrastructure for a feature-rich astrology platform supporting mobile OTP and SSO authentication (Google, Apple), master–child profile hierarchy, multilingual inference delivery, and encrypted personal data management. The system includes per-user API quota tracking, dynamic push notifications based on astrological events, and an internal Karma Points (KPoints) credit system to manage in-app purchases and AI interactions. Integrated third-party astrology services through proxy APIs while minimizing costs via static data caching. Also enabled real-time language translation using Amazon Translate, PDF report generation and storage, friend linking for compatibility features, and feedback tracking for AI-generated responses.',
		shortDescription:
			'Developed a secure, multilingual backend system with hierarchical user management, in-app credit system, and intelligent API proxying for an astrology-based mobile platform.',
		links: [{ to: '', label: '' }],
		logo: Assets.astrology,
		name: 'Personalized Astrology Platform with SSO',
		period: {
			from: new Date('2025-03-01'),
			to: new Date('2025-05-1')
		},
		skills: getSkills('aws', 'postgreSQL', 'git', 'python', 'shell-scripting'),
		type: 'Backend Automation'
	}
];

export const title = 'Projects';
