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
	import { onMount } from 'svelte';

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
	const totalExpNum = parseFloat(totalExp);

	// Select key core skills to highlight in recruiter sidebar
	const coreSkillSlugs = ['aws', 'docker', 'terraform', 'kubernetes', 'python', 'git', 'shell-scripting'];
	const coreSkills = skillItems.filter((skill) => coreSkillSlugs.includes(skill.slug));

	// Animated counter
	let displayExp = 0;
	let displayCerts = 0;

	onMount(() => {
		const duration = 1200;
		const steps = 40;
		const stepTime = duration / steps;
		let step = 0;
		const interval = setInterval(() => {
			step++;
			const progress = step / steps;
			const ease = 1 - Math.pow(1 - progress, 3);
			displayExp = parseFloat((ease * totalExpNum).toFixed(1));
			displayCerts = Math.round(ease * certificationItems.length);
			if (step >= steps) {
				clearInterval(interval);
				displayExp = totalExpNum;
				displayCerts = certificationItems.length;
			}
		}, stepTime);
	});
</script>

<CommonPage {title}>
	<div class="resume-container">
		{#if data}



			<!-- ── Action Bar ── -->
			<div class="action-bar">
				<div class="file-info">
					<div class="pdf-icon-wrap">
						<UIcon icon="i-carbon-document-pdf" classes="text-1.4em" />
					</div>
					<div>
						<span class="file-name">resume.pdf</span>
						<span class="file-meta">Last updated 2025</span>
					</div>
				</div>
				<div class="actions">
					<a href={data} target="_blank" rel="noopener noreferrer" class="btn-action">
						<UIcon icon="i-carbon-launch" />
						<span class="btn-text">Open</span>
					</a>
					<a href={data} download="thirumaran_resume.pdf" class="btn-action btn-primary">
						<span class="dl-shimmer" aria-hidden="true"></span>
						<UIcon icon="i-carbon-download" />
						<span class="btn-text">Download PDF</span>
					</a>
				</div>
			</div>

			<!-- ── Dashboard Grid ── -->
			<div class="dashboard-grid">

				<!-- Left: PDF Preview -->
				<div class="resume-viewer-card">
					<div class="viewer-header">
						<span class="viewer-badge">
							<span class="live-dot" aria-hidden="true"></span>
							Live Preview
						</span>
						<a href={data} target="_blank" rel="noopener noreferrer" class="viewer-fullscreen" title="Open fullscreen">
							<UIcon icon="i-carbon-maximize" />
						</a>
					</div>
					<iframe src={`${data}#toolbar=0&navpanes=0`} title="Resume PDF Preview" class="pdf-iframe" />
					<!-- Mobile fallback -->
					<div class="mobile-fallback">
						<div class="fallback-icon">
							<UIcon icon="i-carbon-document" />
						</div>
						<h3>Interactive PDF Preview</h3>
						<p>PDF previews are best viewed on larger screens.</p>
						<div class="fallback-actions">
							<a href={data} target="_blank" rel="noopener noreferrer" class="btn-action">
								<UIcon icon="i-carbon-launch" />
								<span>Open Fullscreen</span>
							</a>
							<a href={data} download="thirumaran_resume.pdf" class="btn-action btn-primary">
								<UIcon icon="i-carbon-download" />
								<span>Download</span>
							</a>
						</div>
					</div>
				</div>

				<!-- Right: Recruiter Sidebar -->
				<div class="recruiter-sidebar">

					<!-- Profile Card -->
					<div class="sidebar-card profile-card">
						<div class="profile-glow" aria-hidden="true"></div>
						<div class="profile-avatar-ring">
							<UIcon icon="i-carbon-user-avatar-filled" classes="avatar-icon" />
						</div>
						<div class="profile-info">
							<h4>Senior Cloud &amp; DevOps Engineer</h4>
							<span class="profile-badge">
								<UIcon icon="i-carbon-certificate" classes="text-0.85em" />
								AWS Certified Specialist
							</span>
						</div>
					</div>

					<!-- Stats -->
					<div class="sidebar-card stats-card">
						<div class="stat-item">
							<div class="stat-circle exp-circle">
								<span class="stat-num">{displayExp}+</span>
							</div>
							<div class="stat-desc">
								<span class="stat-title">Years Exp</span>
								<span class="stat-sub">Cloud &amp; DevOps</span>
							</div>
						</div>
						<div class="stat-divider"></div>
						<div class="stat-item">
							<div class="stat-circle cert-circle">
								<span class="stat-num">{displayCerts}</span>
							</div>
							<div class="stat-desc">
								<span class="stat-title">AWS Certs</span>
								<span class="stat-sub">Official credentials</span>
							</div>
						</div>
					</div>

					<!-- Certifications -->
					<div class="sidebar-card certs-card">
						<div class="card-header">
							<UIcon icon="i-carbon-certificate" classes="header-icon" />
							<h5>Official Credentials</h5>
						</div>
						<div class="certs-list">
							{#each certificationItems as cert}
								<a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" class="cert-item">
									{#if cert.badgeImageUrl}
										<img src={getAssetURL(cert.badgeImageUrl)} alt={cert.degree} class="cert-badge" />
									{/if}
									<div class="cert-info">
										<span class="cert-degree">{cert.degree}</span>
										<span class="cert-org">{cert.organization}</span>
									</div>
									<div class="cert-arrow">
										<UIcon icon="i-carbon-arrow-up-right" classes="text-0.85em" />
									</div>
								</a>
							{/each}
						</div>
					</div>

					<!-- Core Skills -->
					<div class="sidebar-card skills-card">
						<div class="card-header">
							<UIcon icon="i-carbon-tools" classes="header-icon" />
							<h5>Core DevOps Toolkit</h5>
						</div>
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
				<UIcon icon="i-carbon-document-blank" classes="text-5em text-[var(--tertiary-text)] mb-4" />
				<p>No CV available at the moment.</p>
			</div>
		{/if}
	</div>
</CommonPage>

<style lang="scss">
	/* ─────────────────────────────────────────
	   Page wrapper
	───────────────────────────────────────── */
	.resume-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
		max-width: 1040px;
		margin: 0 auto;
	}

	@keyframes ping {
		0%   { box-shadow: 0 0 0 0   rgba(16,185,129,0.5); }
		70%  { box-shadow: 0 0 0 10px rgba(16,185,129,0);   }
		100% { box-shadow: 0 0 0 0   rgba(16,185,129,0);   }
	}

	/* ─────────────────────────────────────────
	   Action bar
	───────────────────────────────────────── */
	.action-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 20px;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(12px);
		border-radius: 12px;
		box-shadow: 0 4px 12px var(--glass-shadow);
		gap: 12px;

		@media (max-width: 600px) {
			flex-direction: column;
			align-items: stretch;
		}
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.pdf-icon-wrap {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ef4444;
		flex-shrink: 0;
	}

	.file-name {
		font-weight: 700;
		font-size: 1em;
		color: var(--main-text);
		display: block;
	}

	.file-meta {
		font-size: 0.72em;
		color: var(--tertiary-text);
	}

	.actions {
		display: flex;
		gap: 10px;
		@media (max-width: 600px) { justify-content: center; }
	}

	.btn-action {
		position: relative;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 9px 16px;
		border-radius: 9px;
		font-weight: 600;
		font-size: 0.88em;
		text-decoration: none;
		color: var(--secondary-text);
		background: var(--main-hover);
		border: 1px solid var(--border);
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

		&:hover {
			color: var(--main-text-hover);
			border-color: var(--accent);
			transform: translateY(-2px);
		}

		&.btn-primary {
			color: #ffffff;
			background: linear-gradient(135deg, var(--accent), #7c3aed);
			border-color: transparent;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 24px rgba(99,102,241,0.35);
			}
		}
	}

	/* Shimmer on download button */
	.dl-shimmer {
		position: absolute;
		top: 0; left: -100%;
		width: 55%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
		transform: skewX(-20deg);
		animation: shimmer 2.2s ease-in-out infinite;
	}

	@keyframes shimmer {
		0%   { left: -100%; }
		55%  { left: 160%;  }
		100% { left: 160%;  }
	}

	/* ─────────────────────────────────────────
	   Dashboard grid
	───────────────────────────────────────── */
	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 24px;
		align-items: start;

		@media (max-width: 1024px) { grid-template-columns: 1fr; }
	}

	/* ─────────────────────────────────────────
	   PDF viewer card
	───────────────────────────────────────── */
	.resume-viewer-card {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 80vh;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(20px);
		border-radius: 16px;
		overflow: hidden;
		position: relative;
		transition: all 0.35s ease;

		/* animated gradient border glow on hover */
		&::after {
			content: '';
			position: absolute;
			inset: -1px;
			border-radius: 17px;
			background: linear-gradient(135deg, var(--accent), #a78bfa, #34d399);
			z-index: -1;
			opacity: 0;
			transition: opacity 0.35s ease;
		}

		&:hover::after { opacity: 0.5; }

		&:hover {
			box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 0 30px rgba(99,102,241,0.12);
		}

		@media (max-width: 768px) { height: auto; min-height: 300px; }
	}

	.viewer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		background: rgba(0,0,0,0.15);
		border-bottom: 1px solid var(--glass-border);
		flex-shrink: 0;
	}

	.viewer-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.75em;
		font-weight: 600;
		color: #10b981;
	}

	.live-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #10b981;
		animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
	}

	.viewer-fullscreen {
		color: var(--tertiary-text);
		font-size: 1.1em;
		display: flex;
		align-items: center;
		text-decoration: none;
		padding: 4px;
		border-radius: 6px;
		transition: all 0.2s;

		&:hover { color: var(--main-text); background: var(--main-hover); }
	}

	.pdf-iframe {
		width: 100%;
		height: 100%;
		border: none;
		background: transparent;
		flex: 1;

		@media (max-width: 768px) { display: none; }
	}

	/* ─────────────────────────────────────────
	   Sidebar
	───────────────────────────────────────── */
	.recruiter-sidebar {
		display: flex;
		flex-direction: column;
		gap: 16px;
		position: sticky;
		top: 70px;
	}

	.sidebar-card {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(16px);
		border-radius: 14px;
		padding: 16px;
		box-shadow: 0 4px 16px var(--glass-shadow);
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		animation: card-in 0.5s ease both;

		&:hover {
			border-color: var(--accent);
			box-shadow: 0 8px 28px rgba(0,0,0,0.12), 0 0 20px rgba(99,102,241,0.08);
			transform: translateY(-2px);
		}
	}

	@keyframes card-in {
		from { opacity: 0; transform: translateY(12px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* Profile card */
	.profile-card {
		display: flex;
		align-items: center;
		gap: 14px;
		position: relative;
		overflow: hidden;
	}

	.profile-glow {
		position: absolute;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
		top: -30px;
		right: -20px;
		pointer-events: none;
	}

	.profile-avatar-ring {
		width: 54px;
		height: 54px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), #a78bfa);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 0 0 3px rgba(99,102,241,0.2), 0 0 20px rgba(99,102,241,0.2);

		:global(.avatar-icon) {
			font-size: 1.9em;
			color: #fff;
		}
	}

	.profile-info {
		flex: 1;
		min-width: 0;

		h4 {
			margin: 0 0 6px;
			font-size: 0.95em;
			font-weight: 700;
			color: var(--main-text);
			line-height: 1.25;
		}
	}

	.profile-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.72em;
		font-weight: 600;
		color: var(--accent-text);
		background: rgba(99,102,241,0.1);
		border: 1px solid rgba(99,102,241,0.2);
		padding: 3px 8px;
		border-radius: 99px;
	}



	/* Stats card */
	.stats-card {
		display: flex;
		align-items: center;
		padding: 16px;
		background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(167,139,250,0.06));
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		min-width: 0;
	}

	.stat-divider {
		width: 1px;
		height: 44px;
		background: var(--glass-border);
		margin: 0 10px;
		flex-shrink: 0;
	}

	.stat-circle {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		&.exp-circle {
			background: rgba(99,102,241,0.12);
			border: 2px solid rgba(99,102,241,0.25);
			box-shadow: 0 0 10px rgba(99,102,241,0.15);
		}

		&.cert-circle {
			background: rgba(245,158,11,0.12);
			border: 2px solid rgba(245,158,11,0.25);
			box-shadow: 0 0 10px rgba(245,158,11,0.15);
		}
	}

	.stat-num {
		font-size: 1em;
		font-weight: 800;
		color: var(--main-text);
		white-space: nowrap;
	}

	.stat-desc {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		overflow: hidden;
	}

	.stat-title {
		font-size: 0.78em;
		font-weight: 700;
		color: var(--main-text);
		line-height: 1.2;
	}

	.stat-sub {
		font-size: 0.66em;
		color: var(--tertiary-text);
	}

	/* Card header */
	.card-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--glass-border);

		:global(.header-icon) {
			font-size: 1em;
			color: var(--accent-text);
		}

		h5 {
			margin: 0;
			font-size: 0.82em;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.8px;
			color: var(--secondary-text);
		}
	}

	/* Certs */
	.certs-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.cert-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 10px;
		border-radius: 10px;
		background: var(--main-hover);
		border: 1px solid var(--border);
		text-decoration: none;
		color: inherit;
		transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			left: 0; top: 0; bottom: 0;
			width: 3px;
			background: linear-gradient(180deg, var(--accent), #a78bfa);
			opacity: 0;
			transition: opacity 0.2s;
		}

		&:hover {
			border-color: var(--accent);
			background: rgba(99,102,241,0.05);
			transform: translateX(4px);

			&::before { opacity: 1; }

			.cert-arrow { opacity: 1; color: var(--accent); }
		}

		.cert-badge {
			width: 30px;
			height: 30px;
			object-fit: contain;
			flex-shrink: 0;
		}

		.cert-info {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-width: 0;

			.cert-degree {
				font-size: 0.8em;
				font-weight: 600;
				color: var(--main-text);
				line-height: 1.3;
			}

			.cert-org {
				font-size: 0.7em;
				color: var(--tertiary-text);
				margin-top: 1px;
			}
		}

		.cert-arrow {
			color: var(--tertiary-text);
			opacity: 0.4;
			transition: all 0.2s;
			flex-shrink: 0;
		}
	}

	/* Skills */
	.skills-card {
		.skills-grid {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;

			:global(.chip-icon) {
				margin: 0 !important;
				transition: transform 0.2s, box-shadow 0.2s;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(99,102,241,0.2) !important;
				}
			}
		}
	}

	/* ─────────────────────────────────────────
	   Mobile fallback
	───────────────────────────────────────── */
	.mobile-fallback {
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
		flex: 1;

		.fallback-icon {
			width: 72px;
			height: 72px;
			border-radius: 20px;
			background: rgba(99,102,241,0.1);
			border: 1px solid rgba(99,102,241,0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 2em;
			color: var(--accent-text);
			margin-bottom: 16px;
		}

		h3 {
			font-size: 1.2em;
			font-weight: 700;
			color: var(--main-text);
			margin: 0 0 8px;
		}

		p {
			font-size: 0.88em;
			color: var(--secondary-text);
			max-width: 280px;
			line-height: 1.5;
			margin: 0 0 20px;
		}

		.fallback-actions {
			display: flex;
			gap: 10px;
			flex-wrap: wrap;
			justify-content: center;
		}

		@media (max-width: 768px) { display: flex; }
	}

	/* ─────────────────────────────────────────
	   Empty state
	───────────────────────────────────────── */
	.no-resume-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80px 20px;
		background: var(--glass-bg);
		border: 1px dashed var(--glass-border);
		border-radius: 16px;
		color: var(--tertiary-text);
		text-align: center;

		p { font-size: 1em; margin: 0; }
	}
</style>
