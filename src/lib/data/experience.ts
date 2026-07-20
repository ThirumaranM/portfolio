import Assets from './assets';
import { getSkills } from './skills';
import { ContractType, type Experience } from '../types';

export const items: Array<Experience> = [
	{
		slug: 'senior-cloud-devops',
		company: 'Meyi Cloud Solutions Private Limited',
		description: `As a Senior Cloud and DevOps Engineer, I lead the design, implementation, and optimization of secure, scalable, and highly available cloud infrastructure on AWS. I work closely with development, architecture, and operations teams to build cloud-native solutions, automate infrastructure, and streamline software delivery through modern DevOps practices.

My responsibilities include architecting AWS environments, implementing Infrastructure as Code (Terraform), building and maintaining CI/CD pipelines using GitHub Actions and Jenkins, and managing containerized workloads with Docker, ECS, and Kubernetes. I design secure networking solutions using VPC, Transit Gateway, Site-to-Site VPN, Route 53, CloudFront, WAF, IAM, and security best practices.

I also lead infrastructure monitoring and observability initiatives using CloudWatch, Grafana, Prometheus, and Loki, ensuring high availability, proactive alerting, and rapid incident response. Additionally, I focus on cloud cost optimization, backup and disaster recovery strategies, performance tuning, and operational excellence.

Beyond technical responsibilities, I collaborate with stakeholders to understand business requirements, mentor engineers, review architecture and infrastructure designs, drive automation initiatives, and manage cloud projects from planning through production deployment. My goal is to build reliable, secure, and efficient cloud platforms that enable development teams to deliver software faster while maintaining operational excellence.`,
		contract: ContractType.FullTime,
		type: 'Software Development',
		location: 'Puducherry',
		period: {
			from: new Date('2026-04-01')
		},
		skills: getSkills('aws', 'docker', 'terraform', 'kubernetes', 'python', 'git', 'shell-scripting'),
		name: 'Senior Cloud & DevOps Engineer',
		color: 'purple',
		links: [],
		logo: Assets.Meyi,
		shortDescription: 'Leading cloud infrastructure and DevOps initiatives.'
	},
	{
		slug: 'open-sourcer',
		company: 'Meyi Cloud Solutions Private Limited',
		description: 'As an Associate Software Engineer, I was responsible for developing and maintaining backend applications and web-based solutions using Python and Node.js. I designed and implemented RESTful APIs, integrated relational and NoSQL databases, developed business logic, and collaborated with frontend developers to deliver scalable and responsive web applications. In addition to software development, I contributed to DevOps initiatives by automating application deployments, building CI/CD pipelines, managing cloud infrastructure on AWS, containerizing applications using Docker, and supporting Infrastructure as Code with Terraform. I worked closely with cross-functional teams to troubleshoot production issues, optimize application performance, and improve system reliability through monitoring and automation. I also participated in Agile development, code reviews, sprint planning, and technical discussions, ensuring the successful delivery of high-quality software solutions while continuously enhancing development and deployment processes.',
		contract: ContractType.FullTime,
		type: 'Software Development',
		location: 'Puducherry',
		period: {
			from: new Date('2023-04-01'),
			to: new Date('2026-03-31')
		},
		skills: getSkills('aws', 'python', 'docker', 'postgreSQL', 'shell-scripting', 'git', 'Nginx', 'Flask'),
		name: 'Associate Software Engineer',
		color: 'red',
		links: [],
		logo: Assets.Meyi,
		shortDescription: 'Developed and maintained backend services using Python and AWS.'
	},
	{
		slug: 'software-freelance',
		company: 'Meyi Cloud Solutions Private Limited',
		description : 'As a Trainee Software Engineer, I gained hands-on experience in backend application development using Python and Node.js, contributing to the design, development, and maintenance of RESTful APIs, backend services, and business logic for web applications. I worked with SQL and NoSQL databases, integrated third-party APIs, and collaborated with senior developers to build scalable and secure backend solutions. Alongside software development, I was actively involved in AWS cloud operations, including provisioning and managing services such as EC2, S3, IAM, RDS, CloudWatch, and VPC. I assisted in deploying applications, automating development workflows, supporting CI/CD pipelines, monitoring cloud infrastructure, troubleshooting production issues, and implementing cloud best practices. Working in an Agile environment, I participated in code reviews, sprint planning, and continuous learning, strengthening my expertise in backend engineering, cloud computing, and DevOps practices.',
		contract: ContractType.FullTime,
		type: 'Software Development',
		location: 'Home',
		period: {
			from: new Date('2022-09-01'),
			to: new Date('2023-03-30')
		},
		skills: getSkills('python', 'postgreSQL', 'git'),
		name: 'Trainee Software Engineer',
		color: 'blue',
		links: [],
		logo: Assets.Meyi,
		shortDescription: 'Assisted in developing and testing backend applications using Python.'
	}
];

export const title = 'Experience';
