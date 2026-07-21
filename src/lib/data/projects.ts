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
			to: new Date('2024-01-30')
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
			to: new Date('2025-09-30')
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
			to: new Date('2025-11-01')
		},
		skills: getSkills('aws', 'mySQL', 'git'),
		type: 'Backend Automation'
	},
	{
		slug: 'astrology',
		color: 'blueviolet',
		description: `Designed and implemented the backend architecture for a feature-rich astrology platform supporting secure mobile OTP authentication, Single Sign-On (Google and Apple), master–child profile management, and encrypted user data storage. Developed scalable RESTful APIs using Node.js and integrated PostgreSQL/MySQL for efficient data management.

Built a robust AI-driven workflow supporting multilingual horoscope generation, real-time language translation using Amazon Translate, and automated PDF report generation with secure storage on Amazon S3. Optimized API costs by implementing intelligent caching strategies and proxy integrations with third-party astrology providers while maintaining high availability and low response times.

Implemented a comprehensive user engagement system, including dynamic push notifications based on astrological events, per-user API usage tracking and quota management, a Karma Points (KPoints) wallet for managing in-app purchases and AI interactions, and friend-linking capabilities for compatibility analysis. Developed feedback collection mechanisms to continuously improve AI-generated responses and recommendation quality.

Designed the backend with a scalable, secure, and modular architecture, incorporating JWT-based authentication, role-based access control, centralized error handling, and logging to ensure maintainability, performance, and production reliability.`,
		shortDescription:
			'Developed a secure, multilingual backend system with hierarchical user management, in-app credit system, and intelligent API proxying for an astrology-based mobile platform.',
		links: [{ to: '', label: '' }],
		logo: Assets.astrology,
		name: 'Personalized Astrology Platform with SSO',
		period: {
			from: new Date('2025-05-01'),
			to: new Date('2026-02-01')
		},
		skills: getSkills('aws', 'postgreSQL', 'git', 'python', 'shell-scripting'),
		type: 'Backend Automation'
	},
	{
		slug: 'real-time-tracking',
		color: '#1e90ff',
		description: `Designed and deployed a real-time connection tracking platform on AWS using a microservices architecture hosted on Amazon ECS. Provisioned the complete infrastructure using Terraform, enabling consistent, repeatable, and automated deployments across environments.

Implemented containerized microservices with Application Load Balancers, Auto Scaling, and Amazon Route 53 to deliver a highly available, scalable, and low-latency application. Built and maintained CI/CD pipelines to automate application deployment, reducing release time and ensuring reliable rollouts.

Integrated Amazon CloudWatch for centralized logging, metrics collection, dashboards, and proactive alerting to monitor application health, infrastructure performance, and service availability. Configured comprehensive CloudWatch alarms and ECS service monitoring to quickly identify and resolve operational issues.

Conducted extensive performance and load testing using Locust to simulate real-world traffic patterns, validate application scalability, and benchmark API response times. Tuned ECS Auto Scaling policies based on CPU utilization, memory usage, and request load, ensuring optimal resource utilization while maintaining application performance under high concurrency.

Collaborated with development teams to optimize container performance, troubleshoot production issues, and improve deployment reliability, resulting in a resilient, production-ready microservices platform capable of handling increasing traffic demands.`,
		shortDescription: 'Real-time connection tracking deployed on AWS ECS using Terraform.',
		links: [{ to: '', label: '' }],
		logo: Assets.RealTimeTracking,
		name: 'Real-Time Tracking Application',
		period: { from: new Date('2025-11-01') },
		skills: getSkills('aws', 'ecs', 'terraform', 'docker'),
		type: 'Cloud Deployment',
		screenshots: []
	},
	{
		slug: 'aws-vpn-network',
		color: '#8a2be2',
		description: `Designed and deployed a secure, scalable network infrastructure across multiple AWS accounts, integrating on-premises environments with AWS and other cloud platforms through highly available Site-to-Site VPN connections. Leveraged AWS CloudFormation to automate infrastructure provisioning, ensuring consistency, repeatability, and faster deployments.

Implemented cross-account AWS Transit Gateway architecture to centralize network connectivity and simplify routing between multiple VPCs and hybrid environments. Automated VPN tunnel creation, route propagation, and network configuration to reduce manual effort and improve operational efficiency.

Applied least-privilege IAM roles and security best practices to enable secure cross-account resource access while maintaining compliance and governance standards. Configured centralized logging using Amazon CloudWatch for VPN, Transit Gateway, and VPC network events, enabling proactive monitoring and troubleshooting.

Developed monitoring dashboards to track VPN tunnel health, network throughput, latency, and connectivity status, reducing incident response time and improving operational visibility. Collaborated with infrastructure and security teams to troubleshoot hybrid networking issues, optimize routing performance, and ensure high availability across production environments.`,
		shortDescription:
			'Multi-account AWS server deployment with VPN connectivity using CloudFormation.',
		links: [{ to: '', label: '' }],
		logo: Assets.AWSVPN,
		name: 'AWS VPN Multi-Account Network',
		period: { from: new Date('2025-12-01') },
		skills: getSkills('aws', 'vpn', 'cloudformation', 'networking'),
		type: 'Infrastructure',
		screenshots: []
	},
	{
		slug: 'land-deal',
		color: '#ff7f50',
		description: `Designed and developed a full-stack real estate platform for managing property evaluations, deal creation, customer interactions, and partner collaboration, supporting over 500 active property listings. Built responsive frontend components and RESTful backend APIs using Node.js and Express.js, delivering a seamless user experience and efficient business workflows.

Architected and deployed the application on AWS EC2 with Amazon RDS for relational data storage and Amazon S3 for secure document and media storage, ensuring high availability, scalability, and reliable application performance. Integrated AWS Lambda for background processing and event-driven automation where required.

Managed the complete DevOps lifecycle, including Docker containerization, CI/CD pipeline implementation, infrastructure provisioning with AWS CloudFormation, application deployment, monitoring, and server maintenance. Configured Nginx as a reverse proxy, implemented SSL/TLS for secure communication, and established CloudWatch monitoring and logging to improve operational visibility.

Optimized deployment workflows and infrastructure automation, reducing deployment time by approximately 50% while maintaining a highly available and secure production environment.`,
		shortDescription:
			'Real estate management platform deployed on EC2 with CloudFormation and full AWS DevOps.',
		links: [{ to: '', label: '' }],
		logo: Assets.LandDeal,
		name: 'Land Deal – Real Estate Management Platform',
		period: { from: new Date('2025-03-01'), to: new Date('2025-06-04') },
		skills: getSkills('aws', 'ec2', 'ecs', 's3', 'rds', 'docker', 'cloudformation', 'nodejs'),
		type: 'Backend Architecture',
		screenshots: []
	}
];

export const title = 'Projects';
