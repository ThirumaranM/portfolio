import Assets from './assets';
import type { Skill, SkillCategory } from '../types';
import svelte from '../md/svelte.md?raw';
import { omit, type StringWithAutoComplete } from '@riadh-adrani/utils';

const defineSkillCategory = <S extends string>(data: SkillCategory<S>): SkillCategory<S> => data;

const categories = [
	defineSkillCategory({ name: 'Programming Languages', slug: 'pro-lang' }),
	defineSkillCategory({ name: 'Frameworks', slug: 'framework' }),
	defineSkillCategory({ name: 'Libraries', slug: 'library' }),
	defineSkillCategory({ name: 'Langauges', slug: 'lang' }),
	defineSkillCategory({ name: 'Databases', slug: 'db' }),
	defineSkillCategory({ name: 'ORMs', slug: 'orm' }),
	defineSkillCategory({ name: 'DevOps', slug: 'devops' }),
	defineSkillCategory({ name: 'Testing', slug: 'test' }),
	defineSkillCategory({ name: 'Dev Tools', slug: 'devtools' }),
	defineSkillCategory({ name: 'Markup & Style', slug: 'markup-style' }),
	defineSkillCategory({ name: 'Design', slug: 'design' }),
	defineSkillCategory({ name: 'Soft Skills', slug: 'soft' })
] as const;

const defineSkill = <S extends string>(
	skill: Omit<Skill<S>, 'category'> & {
		category?: StringWithAutoComplete<(typeof categories)[number]['slug']>;
	}
): Skill<S> => {
	const out: Skill<S> = omit(skill, 'category');

	if (skill.category) {
		out.category = categories.find((it) => it.slug === skill.category);
	}

	return out;
};

export const items = [
	defineSkill({
		slug: 'aws',
		color: 'yellow',
		description: 'Amazon Web Services (AWS) is a leading and comprehensive cloud computing platform provided by Amazon. It offers a wide range of services including computing power, storage, databases, machine learning, DevOps tools, and security, all delivered over the internet. AWS enables businesses of all sizes to build scalable, resilient, and cost-effective applications and infrastructures.With its global network of data centers, AWS supports high availability and performance across regions. It is widely used for hosting web applications, managing big data, implementing disaster recovery strategies, and automating infrastructure through Infrastructure as Code (IaC). Its pay-as-you-go pricing and vast service offerings make it ideal for startups, enterprises, and government organizations alike.',
		logo: Assets.AWS,
		name: 'AWS',
		category: 'devops'
	}),
	defineSkill({
		slug: 'python',
		color: 'blue',
		description: 'Python is a powerful, high-level programming language renowned for its simplicity, readability, and versatility. With its clean syntax and dynamic typing, Python enables rapid development and is widely used across various domains, including web development, data science, machine learning, artificial intelligence, automation, scripting, and cloud computing. Its extensive standard library and vibrant ecosystem of third-party packages (like NumPy, Pandas, Flask, Django, and TensorFlow) make Python a top choice for both beginners and experienced developers. Python’s community support and cross-platform compatibility have solidified its position as one of the most popular and in-demand programming languages in the world.',
		logo: Assets.Python,
		name: 'Python',
		category: 'pro-lang'
	}),
	defineSkill({
		slug: 'docker',
		color: 'blue',
		description: 'Docker is a powerful containerization platform that allows developers to package applications along with their dependencies, libraries, and configurations into lightweight, portable containers. These containers ensure that applications run consistently across different environments — from a developer’s local machine to production servers — eliminating the common “it works on my machine” problem. By using Docker, teams can streamline the development, testing, and deployment process, improve scalability, and isolate services in microservices architectures. Docker also integrates seamlessly with CI/CD pipelines and orchestration tools like Kubernetes, making it a cornerstone of modern DevOps practices.',
		logo: Assets.Docker,
		name: 'Docker',
		category: 'devops'
	}),
	defineSkill({
		slug: 'terraform',
		color: 'purple',
		description: 'erraform by HashiCorp is a widely adopted open-source Infrastructure as Code (IaC) tool that enables developers and DevOps engineers to provision, manage, and version cloud infrastructure in a consistent and automated manner. Using a declarative configuration language (HashiCorp Configuration Language – HCL), Terraform allows you to define your infrastructure components such as virtual machines, networking, storage, and services across multiple cloud providers like AWS, Azure, and Google Cloud. Terraform excels in creating reproducible and auditable infrastructure deployments through state management, modular configurations, and a robust ecosystem of providers. It supports automation of complex environments, promotes infrastructure standardization, and integrates well with CI/CD workflows, making it a fundamental tool in modern DevOps and cloud-native development.',
		logo: Assets.Terraform,
		name: 'Terraform',
		category: 'devops'
	}),
	defineSkill({
		slug: 'postgreSQL',
		color: 'blue',
		description: 'PostgreSQL is a powerful, open-source object-relational database management system (ORDBMS) renowned for its robustness, flexibility, and standards compliance. Designed to handle complex queries and large volumes of data, PostgreSQL supports both SQL and advanced features such as full-text search, JSON/JSONB for semi-structured data, window functions, and custom data types. It is highly extensible—developers can define their own functions, data types, and even build custom plugins. With support for ACID transactions, concurrency through Multi-Version Concurrency Control (MVCC), and features like point-in-time recovery and logical replication, PostgreSQL is widely adopted in industries ranging from fintech to analytics and SaaS platforms. Its active community and frequent updates ensure security, performance, and cutting-edge capabilities',
		logo: Assets.PostgreSQL,
		name: 'PostgreSQL',
		category: 'db'
	}),
	defineSkill({
		slug: 'mySQL',
		color: 'teal',
		description: 'MySQL is a widely-used open-source relational database management system (RDBMS) that leverages Structured Query Language (SQL) to manage and manipulate data. Known for its reliability, speed, and ease of use, MySQL is commonly used in web applications, enterprise software, and cloud-native platforms to store and retrieve structured data efficiently. As a central component of the LAMP stack (Linux, Apache, MySQL, PHP/Python/Perl), MySQL supports ACID compliance, replication, and high availability, making it a trusted choice for both small-scale projects and large, data-intensive applications. It offers powerful features like indexing, stored procedures, and transactions, and is compatible with numerous tools and frameworks, making it a go-to solution for developers and database administrators alike',
		logo: Assets.MySQL,
		name: 'MySQL',
		category: 'db'
	}),
	defineSkill({
		slug: 'shell-scripting',
		color: 'gray',
		description: 'Shell Scripting is a powerful method for automating repetitive tasks and managing system operations in Unix and Linux environments. By writing command-line scripts using shells like Bash, Zsh, or Sh, developers and system administrators can streamline workflows, perform batch processing, monitor systems, and configure environments efficiently. Shell scripts can integrate with cron jobs for scheduling, interact with system files, execute complex command sequences, and facilitate DevOps tasks such as deployments and log monitoring. As a foundational skill for anyone working with Linux systems or cloud infrastructure, shell scripting improves productivity and ensures consistent, error-free execution of system-level operations.',
		logo: Assets.Shell,
		name: 'Shell Scripting',
		category: 'pro-lang'
	}),
	defineSkill({
		slug: 'git',
		color: 'orange',
		description: 'Git is a distributed version control system (DVCS) designed to track changes in source code and manage collaborative development across teams. Created by Linus Torvalds, Git enables developers to efficiently handle versioning, branching, and merging of code with speed and integrity. Git allows each developer to have a full copy of the project repository, making it resilient to data loss and enabling offline work. It supports workflows like feature branching, continuous integration, and pull requests, making it an essential tool in modern DevOps and software development pipelines. With platforms like GitHub, GitLab, and Bitbucket built on top of Git, it is widely adopted for open-source and enterprise projects alike',
		logo: Assets.Git,
		name: 'Git',
		category: 'devtools'
	}),
	defineSkill({
		slug: 'Nginx',
		color: 'green',
		description: 'Nginx (pronounced "engine-x") is a high-performance, open-source web server that also functions as a reverse proxy, load balancer, and HTTP cache. Known for its speed, stability, and low resource consumption, Nginx is widely used to serve static content, handle concurrent connections efficiently, and distribute traffic across multiple servers to enhance availability and scalability. Originally designed to solve the C10k problem (handling 10,000 simultaneous connections), Nginx is a core component in modern web architecture. It is often used in combination with application servers and containers, making it a popular choice in DevOps pipelines, microservices, and cloud-native applications.',
		logo: Assets.Nginx,
		name: 'Nginx',
		category: 'devops'
	}),
	defineSkill({
		slug: 'Flask',
		color: 'violet',
		description: 'Flask API is a lightweight web framework in Python used to build RESTful APIs quickly and efficiently. Built on top of the Flask microframework, it provides the tools needed to define endpoints, handle HTTP methods, and serialize data for API communication. Ideal for small to medium-scale applications, Flask API is highly flexible, letting developers integrate custom logic, middleware, and extensions like Flask-RESTful or Flask-SQLAlchemy. Its simplicity and minimal setup make it a popular choice for rapid prototyping, backend services, and deploying machine learning models as web services. Whether used standalone or in conjunction with frontend frameworks and cloud deployments, Flask API provides a clean and Pythonic way to expose application logic via HTTP.',
		logo: Assets.Flask,
		name: 'Flask',
		category: 'framework'
	})
] as const;

export const title = 'Skills';

export const getSkills = (
	...slugs: Array<StringWithAutoComplete<(typeof items)[number]['slug']>>
): Array<Skill> => items.filter((it) => slugs.includes(it.slug));

export const groupByCategory = (
	query: string
): Array<{ category: SkillCategory; items: Array<Skill> }> => {
	const out: ReturnType<typeof groupByCategory> = [];

	const others: Array<Skill> = [];

	items.forEach((item) => {
		if (query.trim() && !item.name.toLowerCase().includes(query.trim().toLowerCase())) return;

		// push to others if item does not have a category
		if (!item.category) {
			others.push(item);
			return;
		}

		// check if category exists
		let category = out.find((it) => it.category.slug === item.category?.slug);

		if (!category) {
			category = { items: [], category: item.category };

			out.push(category);
		}

		category.items.push(item);
	});

	if (others.length !== 0) {
		out.push({ category: { name: 'Others', slug: 'others' }, items: others });
	}

	return out;
};
