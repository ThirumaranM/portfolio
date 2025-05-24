import { Platform } from '$lib/types';
import { getSkills } from './skills';

export const title = 'Home';

export const name = 'Thirumaran';

export const lastName = 'M';

export const description =
	'Experienced Backend Developer with strong skills in Python and AWS services.Hands-on expertise in building APIs, automation, and cloud-based solutions.Proficient in DevOps practices using CI/CD pipelines and serverless architectures.Focused on delivering scalable,secure, and efficient backend systems.';

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

export const skills = getSkills('aws', 'docker', 'terraform', 'postgreSQL', 'mySQL', 'shell-scripting', 'python', 'git', 'Nginx', 'Flask');
