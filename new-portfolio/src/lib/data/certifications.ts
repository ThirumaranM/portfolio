import Assets from './assets';
import type { Certifications } from '../types';

export const title = 'Certifications';

export const items: Array<Certifications> = [
    {
        degree: 'AWS Certified Developer - Associate',
        description: 'AWS Certified Developer - Associate showcases skills and knowledge in developing, optimizing, packaging, and deploying applications, using CI/CD workflows, and identifying and resolving application issues. This certification is a good starting point on the AWS Certification journey for individuals in IT or cloud developer job roles. Certified AWS Solutions Architect with expertise in designing and deploying scalable, highly available systems on AWS',
        location: 'Online',
        logo: Assets.AWS,
        name: 'AWS Certification',
        organization: 'Amazon Web Services',
        color: 'red',
        period: { from: new Date(2024, 8, 26), to: new Date(2027, 8, 26) },
        shortDescription: 'Validates expertise in designing distributed systems on AWS.',
        verificationUrl: 'https://www.credly.com/earner/earned/badge/88ec6825-77c4-4f22-86ad-487bba5fe581', 
        badgeImageUrl: Assets.associate, 
        slug: 'aws-developer-associate',
        subjects: ['AWS Lambda', 'Amazon EC2', 'Amazon API Gateway', 'Amazon DynamoDB', 'Aws CloudFormation', 'Amazon RDS', '+ more']
    },
    {
        degree: 'AWS Certified Solutions Architect - Professional',
        description: 'AWS Certified Solutions Architect - Professional helps certified individuals showcase advanced knowledge and skills in providing complex solutions to complex problems, optimizing security, cost, and performance, and automating manual processes. This certification is a means for organizations to identify and develop talent with these critical skills for implementing cloud initiatives',
        location: 'Online',
        color: 'blue',
        logo: Assets.AWS,
        name: 'AWS Certification',
        organization: 'Amazon Web Services',
        period: { from: new Date(2025, 2, 7), to: new Date(2028, 2, 6) },
        shortDescription: 'Experienced AWS Solutions Architect - Professional with a strong track record of leading cloud transformation initiatives and delivering resilient, scalable solutions on AWS.',
        verificationUrl: 'https://www.credly.com/earner/earned/badge/e558ad89-dcc4-4add-96c1-289cb46c45a1', 
        badgeImageUrl: Assets.professioanl, 
        slug: 'aws-solutions-architect',
        subjects: ['Amazon EC2', 'Amazon ECS', 'Amazon S3', 'Amazon VPC', 'Amazon RDS', 'AWS IAM', 'AWS CloudTrail', 'Amazon EFS', '+ more']
    }
];
