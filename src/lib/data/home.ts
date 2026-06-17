import { Platform } from '$lib/types';
import { getSkills } from './skills';

export const title = 'Home';

export const name = 'Thirumaran';

export const lastName = 'M';

export const position = 'Senior Cloud & DevOps Engineer';

export const description = `
Results-driven DevOps and Software Engineer with over 4 years of experience in designing, implementing, and managing cloud-native infrastructure and application deployments. Skilled in AWS cloud services, Infrastructure as Code (Terraform and CloudFormation), CI/CD automation, Docker, Kubernetes, Linux administration, and monitoring solutions. Experienced in building scalable, secure, and highly available cloud environments while collaborating with development teams to streamline software delivery and operational efficiency. Strong background in Python development, cloud automation, system troubleshooting, and DevOps best practices with a focus on reliability, security, and continuous improvement.
`;
export const links: Array<{ platform: Platform; link: string }> = [
	{ platform: Platform.GitHub, link: 'https://github.com/ThirumaranM' },
	{
		platform: Platform.Linkedin,
		link: 'https://www.linkedin.com/in/thiru-maran-m-90769a227/'
	},
	// {
	// 	platform: Platform.Twitter,
	// 	link: 'https://twitter.com/'
	// },
	// {
	// 	platform: Platform.StackOverflow,
	// 	link: 'https://stackoverflow.com/'
	// },
	{
		platform: Platform.Email,
		link: 'maranthiru691@gmail.com'
	},
	// {
	// 	platform: Platform.Youtube,
	// 	link: 'https://www.youtube.com'
	// },
	// {
	// 	platform: Platform.Facebook,
	// 	link: 'https://www.facebook.com'
	// }
];

export const skills = getSkills('aws', 'docker', 'terraform', 'postgreSQL', 'mySQL', 'shell-scripting', 'python', 'git', 'Nginx', 'Flask', 'nodejs', 'mongodb', 'redis', 'kubernetes');
