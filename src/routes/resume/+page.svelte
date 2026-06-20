<script lang="ts">
	import { data, title } from '@data/resume';
	import { base } from '$app/paths';
	import { getAssetURL } from '$lib/data/assets';
	import { items as certificationItems } from '@data/certifications';
	import { items as skillItems } from '@data/skills';
	import { items as experienceItems } from '@data/experience';
	import CommonPage from '$lib/components/CommonPage.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import ChipIcon from '$lib/components/Chip/ChipIcon.svelte';

	// Compute total experience dynamically
	const calculateTotalExperience = (): string => {
		let totalMonths = 0;
		experienceItems.forEach((job) => {
			const from = job.period.from;
			const to = job.period.to ?? new Date();
			const diffTime = Math.abs(to.getTime() - from.getTime());
			const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.4375));
			totalMonths += diffMonths;
		});
		const years = totalMonths / 12;
		return `${years.toFixed(1)}+`;
	};

	const totalExp = calculateTotalExperience();

	// Select key core skills to highlight in recruiter sidebar
	const coreSkillSlugs = ['aws', 'docker', 'terraform', 'kubernetes', 'python', 'git', 'shell-scripting'];
	const coreSkills = skillItems.filter((skill) => coreSkillSlugs.includes(skill.slug));
</script>

<CommonPage {title}>
	<div class="resume-container">
		{#if data}
			<!-- Action Bar -->
			<div class="action-bar">
				<div class="file-info">
					<UIcon icon="i-carbon-document-pdf" classes="text-1.5em text-red-500" />
					<span class="file-name">resume.pdf</span>
				</div>
				<div class="actions">
					<a href={data} target="_blank" rel="noopener noreferrer" class="btn-action">
						<UIcon icon="i-carbon-launch" />
						<span class="btn-text">Open in New Tab</span>
					</a>
					<a href={data} download="thirumaran_resume.pdf" class="btn-action btn-primary">
						<UIcon icon="i-carbon-download" />
						<span class="btn-text">Download PDF</span>
					</a>
				</div>
			</div>

			<!-- Recruiter Dashboard Grid -->
			<div class="dashboard-grid">
				<!-- Left Column: PDF Preview Card -->
				<div class="resume-viewer-card">
					<iframe src={`${data}#toolbar=0&navpanes=0`} title="Resume PDF Preview" class="pdf-iframe" />
					<!-- Mobile Fallback / View Assistant -->
					<div class="mobile-fallback">
						<UIcon icon="i-carbon-document" classes="text-4em text-[var(--accent-text)] m-b-3" />
						<h3>Interactive PDF Preview</h3>
						<p class="m-b-5">PDF previews are best viewed on larger screens. You can directly open or download the PDF below:</p>
						<div class="row gap-3 mt-4 justify-center">
							<a href={data} target="_blank" rel="noopener noreferrer" class="btn-action">
								<UIcon icon="i-carbon-launch" />
								<span>Open Fullscreen</span>
							</a>
							<a href={data} download="thirumaran_resume.pdf" class="btn-action btn-primary">
								<UIcon icon="i-carbon-download" />
								<span>Download PDF</span>
							</a>
						</div>
					</div>
				</div>

				<!-- Right Column: Recruiter Sidebar (Quick Highlights) -->
				<div class="recruiter-sidebar">
					<!-- Profile Card -->
					<div class="sidebar-section profile-card">
						<div class="profile-avatar">
							<UIcon icon="i-carbon-user-avatar" classes="text-3em text-[var(--accent-text)]" />
						</div>
						<div class="profile-title">
							<h4>Senior Cloud & DevOps Engineer</h4>
							<p>AWS Certified Specialist</p>
						</div>
					</div>

					<!-- Key Stats Widget -->
					<div class="sidebar-section stats-grid">
						<div class="stat-box">
							<span class="stat-value">{totalExp}</span>
							<span class="stat-label">Years Exp</span>
						</div>
						<div class="stat-box">
							<span class="stat-value">{certificationItems.length}</span>
							<span class="stat-label">AWS Certs</span>
						</div>
					</div>

					<!-- Certifications Showcase -->
					<div class="sidebar-section certs-section">
						<h5>Official Credentials</h5>
						<div class="certs-list">
							{#each certificationItems as cert}
								<a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" class="cert-item-link">
									<div class="cert-item">
										{#if cert.badgeImageUrl}
											<img src={getAssetURL(cert.badgeImageUrl)} alt={cert.degree} class="cert-badge" />
										{/if}
										<div class="cert-info">
											<span class="cert-degree">{cert.degree}</span>
											<span class="cert-org">{cert.organization}</span>
										</div>
										<UIcon icon="i-carbon-launch" classes="cert-launch text-0.95em" />
									</div>
								</a>
							{/each}
						</div>
					</div>

					<!-- Technical Stack Highlights -->
					<div class="sidebar-section skills-section">
						<h5>Core DevOps Toolkit</h5>
						<div class="skills-grid">
							{#each coreSkills as skill}
								<ChipIcon
									logo={getAssetURL(skill.logo)}
									name={skill.name}
									href={`${base}/skills/${skill.slug}`}
									grayscale={false}
								/>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="no-resume-card">
				<UIcon icon="i-carbon-document-blank" classes="text-4em text-[var(--tertiary-text)] m-b-3" />
				<p>Ooops! No CV available at the moment.</p>
			</div>
		{/if}
	</div>
</CommonPage>

<style lang="scss">
	.resume-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
	}

	.action-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 10px 20px;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: 12px;
		box-shadow: 0 4px 12px var(--glass-shadow);
		transition: background-color 0.3s, border-color 0.3s;

		@media (max-width: 600px) {
			flex-direction: column;
			gap: 12px;
			align-items: stretch;
			text-align: center;
		}
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 10px;

		@media (max-width: 600px) {
			justify-content: center;
		}
	}

	.file-name {
		font-weight: 600;
		font-size: 1.05em;
		color: var(--main-text);
	}

	.actions {
		display: flex;
		gap: 12px;

		@media (max-width: 600px) {
			justify-content: center;
		}
	}

	.btn-action {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border-radius: 8px;
		font-weight: 500;
		font-size: 0.9em;
		text-decoration: none;
		color: var(--secondary-text);
		background: var(--main-hover);
		border: 1px solid var(--border);
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

		&:hover {
			color: var(--main-text-hover);
			border-color: var(--border-hover);
			transform: translateY(-2px);
		}

		&.btn-primary {
			color: #ffffff;
			background: var(--accent);
			border-color: var(--accent);

			&:hover {
				background: var(--accent-hover);
				border-color: var(--accent-hover);
				box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
			}
		}
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 24px;
		align-items: start;
		width: 100%;

		@media (max-width: 1024px) {
			grid-template-columns: 1fr;
		}
	}

	.resume-viewer-card {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 80vh;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		box-shadow: 0 8px 32px 0 var(--glass-shadow);
		border-radius: 15px;
		overflow: hidden;
		position: relative;
		transition: all 0.3s ease;

		&:hover {
			border-color: var(--border-hover);
			box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16), 0 0 25px rgba(99, 102, 241, 0.15);
		}

		@media (max-width: 768px) {
			height: auto;
			min-height: 300px;
		}
	}

	.pdf-iframe {
		width: 100%;
		height: 100%;
		border: none;
		background: transparent;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.recruiter-sidebar {
		display: flex;
		flex-direction: column;
		gap: 20px;
		position: sticky;
		top: 70px;
	}

	.sidebar-section {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-radius: 12px;
		padding: 16px;
		box-shadow: 0 4px 16px var(--glass-shadow);
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

		&:hover {
			border-color: var(--border-hover);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 15px rgba(99, 102, 241, 0.08);
		}
	}

	.profile-card {
		display: flex;
		align-items: center;
		gap: 12px;

		.profile-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.profile-title {
			h4 {
				margin: 0;
				font-size: 1.05em;
				font-weight: 600;
				color: var(--main-text);
			}
			p {
				margin: 2px 0 0 0;
				font-size: 0.85em;
				color: var(--accent-text);
				font-weight: 500;
			}
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		padding: 12px;
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);

		.stat-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			padding: 10px;

			.stat-value {
				font-size: 1.8em;
				font-weight: 700;
				color: var(--accent-text-hover);
				line-height: 1.1;
			}

			.stat-label {
				font-size: 0.75em;
				text-transform: uppercase;
				letter-spacing: 0.5px;
				color: var(--tertiary-text);
				margin-top: 4px;
				font-weight: 600;
			}
		}
	}

	.certs-section {
		h5 {
			margin: 0 0 12px 0;
			font-size: 0.9em;
			font-weight: 650;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			color: var(--secondary-text);
			border-bottom: 1px solid var(--border);
			padding-bottom: 6px;
		}

		.certs-list {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		.cert-item-link {
			text-decoration: none;
			color: inherit;
		}

		.cert-item {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 8px 10px;
			border-radius: 8px;
			background: var(--main-hover);
			border: 1px solid var(--border);
			transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
			position: relative;

			&:hover {
				border-color: var(--accent);
				background: var(--glass-bg);
				transform: translateY(-2px);

				:global(.cert-launch) {
					color: var(--accent-text-hover);
					opacity: 1;
				}
			}

			.cert-badge {
				width: 32px;
				height: 32px;
				object-fit: contain;
			}

			.cert-info {
				display: flex;
				flex-direction: column;
				flex: 1;

				.cert-degree {
					font-size: 0.82em;
					font-weight: 550;
					line-height: 1.25;
					color: var(--main-text);
				}

				.cert-org {
					font-size: 0.72em;
					color: var(--tertiary-text);
					margin-top: 2px;
				}
			}

			:global(.cert-launch) {
				color: var(--tertiary-text);
				opacity: 0.6;
				transition: all 0.2s ease;
			}
		}
	}

	.skills-section {
		h5 {
			margin: 0 0 12px 0;
			font-size: 0.9em;
			font-weight: 650;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			color: var(--secondary-text);
			border-bottom: 1px solid var(--border);
			padding-bottom: 6px;
		}

		.skills-grid {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;

			:global(.chip-icon) {
				margin: 0 !important;
				padding: 6px 12px !important;
				font-size: 0.8em !important;
			}
		}
	}

	.mobile-fallback {
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40px 20px;
		text-align: center;
		color: var(--secondary-text);

		h3 {
			color: var(--main-text);
			font-size: 1.3em;
			margin-bottom: 8px;
		}

		p {
			font-size: 0.95em;
			max-width: 400px;
			line-height: 1.5;
		}

		@media (max-width: 768px) {
			display: flex;
		}
	}

	.no-resume-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: 15px;
		color: var(--tertiary-text);
		text-align: center;
	}
</style>
