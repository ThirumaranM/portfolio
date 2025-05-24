import Assets from './assets';
import { getSkills } from './skills';
import { ContractType, type Experience } from '../types';

export const items: Array<Experience> = [
	{
		slug: 'open-sourcer',
		company: 'Meyi Cloud Solutions Private Limited',
		description: 'Developed and maintained backend services using Python and AWS. Designed and implemented CI/CD pipelines for automated deployments. Built and optimized serverless architectures using AWS Lambda, API Gateway, and DynamoDB. Managed cloud infrastructure, ensuring scalability, security, and cost-efficiency. Collaborated with cross-functional teams todeliver high-performance applications. ',
		contract: ContractType.FullTime,
		type: 'Software Development',
		location: 'Puducherry',
		period: {
			from: new Date('2023-04-01')
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
		description: 'Assisted in developing and testing backend applications using Python. Gained hands-on experience with AWS services and cloud-based deployments. Supported CI/CD pipeline implementation for automated builds and deployments. Worked on serverless computing with AWS Lambda and API Gateway. Collaborated with senior developers to troubleshoot and optimize applications.',
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
