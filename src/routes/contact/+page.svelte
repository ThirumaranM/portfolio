<script context="module">
    export const ssr = false;
</script>

<script lang="ts">
    import Card from '$lib/components/Card/Card.svelte';
    import UIcon from '$lib/components/Icon/UIcon.svelte';
    import SearchPage from '$lib/components/SearchPage.svelte';
    import { title, contactInfo } from '$lib/data/contact';
    import CardDivider from '$lib/components/Card/CardDivider.svelte';
    import emailjs from '@emailjs/browser';
    import type { Icon } from '$lib/types';

    const socialMediaList = contactInfo.socialMedia as Array<{
        platform: string;
        url: string;
        icon: Icon;
    }>;

    let name = '';
    let email = '';
    let subject = '';
    let message = '';
    let isSubmitting = false;
    let submitSuccess = false;
    let submitError = '';
    let showCopyTooltip = false;

    const MAX_MESSAGE = 500;

    $: filledCount = [name, email, subject, message].filter(v => v && v.trim().length > 0).length;
    $: progressWidth = Math.round((filledCount / 4) * 100);

    let form: HTMLFormElement;

    const handleSubmit = async () => {
        isSubmitting = true;
        submitError = '';
        try {
            await emailjs.sendForm(
                'service_184zkg5',
                'template_76b5snh',
                form,
                't9B5mfTrVa-blnugN'
            );
            name = '';
            email = '';
            subject = '';
            message = '';
            submitSuccess = true;
        } catch (error) {
            submitError = 'Failed to send message. Please try again.';
        } finally {
            isSubmitting = false;
        }
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(contactInfo.email);
            showCopyTooltip = true;
            setTimeout(() => { showCopyTooltip = false; }, 2000);
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    };

    const brandColor: Record<string, string> = {
        linkedin: '#0a66c2',
        github: '#6e40c9',
        twitter: '#1d9bf0',
        x: '#000000',
        instagram: '#e1306c',
        youtube: '#ff0000',
    };
</script>

<SearchPage {title}>
    <div class="contact-page col items-center flex-1 w-full">

        <!-- ── Decorative background orbs ── -->
        <div class="orb orb-1" aria-hidden="true"></div>
        <div class="orb orb-2" aria-hidden="true"></div>
        <div class="orb orb-3" aria-hidden="true"></div>

        <!-- ── Available badge ── -->
        <div class="availability-badge" role="status">
            <span class="pulse-dot" aria-hidden="true"></span>
            Available for opportunities
        </div>

        <!-- ── Section heading ── -->
        <div class="section-heading">
            <h1 class="gradient-title">Let's Work Together</h1>
            <p class="section-sub">Have a project in mind? Drop me a message and I'll get back to you within 24 hours.</p>
        </div>

        <!-- ── Two-column grid ── -->
        <div class="contact-grid">

            <!-- ── Left: Contact Info ── -->
            <Card>
                <div class="info-card-inner">
                    <div class="info-header">
                        <h2>Get in Touch</h2>
                        <span class="response-time"> Usually responds within 24h</span>
                    </div>

                    <div class="contact-items">

                        <!-- Email -->
                        <div class="contact-item">
                            <div class="item-icon-wrap email-icon">
                                <UIcon icon="i-carbon-email" />
                            </div>
                            <div class="item-details">
                                <span class="item-label">Email</span>
                                <a href={`mailto:${contactInfo.email}`} class="item-value link">{contactInfo.email}</a>
                            </div>
                            <button on:click={copyEmail} class="copy-btn" title="Copy email" aria-label="Copy email">
                                {#if showCopyTooltip}
                                    <span class="copy-tooltip">Copied!</span>
                                    <UIcon icon="i-carbon-checkmark" />
                                {:else}
                                    <UIcon icon="i-carbon-copy" />
                                {/if}
                            </button>
                        </div>

                        <!-- Phone -->
                        <div class="contact-item">
                            <div class="item-icon-wrap phone-icon">
                                <UIcon icon="i-carbon-phone" />
                            </div>
                            <div class="item-details">
                                <span class="item-label">Phone</span>
                                <a href={`tel:${contactInfo.phone}`} class="item-value link">{contactInfo.phone}</a>
                            </div>
                        </div>

                        <!-- Location -->
                        <div class="contact-item location-item">
                            <div class="item-icon-wrap location-icon">
                                <UIcon icon="i-carbon-location" />
                            </div>
                            <div class="item-details">
                                <span class="item-label">Location</span>
                                <span class="item-value">{contactInfo.location}</span>
                            </div>
                            <span class="live-badge" title="Current location">🟢 Live</span>
                        </div>

                    </div>

                    <CardDivider />

                    <div class="socials-section">
                        <h3>Follow me</h3>
                        <div class="social-grid">
                            {#each socialMediaList as social}
                                {@const key = social.platform.toLowerCase()}
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="social-pill"
                                    style="--brand: {brandColor[key] ?? '#6366f1'}"
                                    title={social.platform}
                                >
                                    <UIcon icon={social.icon} classes="sicon" />
                                    <span>{social.platform}</span>
                                </a>
                            {/each}
                        </div>
                    </div>
                </div>
            </Card>

            <!-- ── Right: Form ── -->
            <Card>
                <div class="form-card-inner">
                    <div class="form-header">
                        <h2>Send a Message</h2>
                        <!-- form fill progress -->
                        <div class="fill-progress" title="{progressWidth}% complete">
                            <div class="fill-track">
                                <div class="fill-bar" style="width: {progressWidth}%;"></div>
                            </div>
                            <span class="fill-label">{filledCount}/4</span>
                        </div>
                    </div>

                    {#if submitSuccess}
                        <div class="success-banner">
                            <div class="success-icon">
                                <UIcon icon="i-carbon-checkmark-filled" />
                            </div>
                            <div>
                                <strong>Message sent!</strong>
                                <p>Thank you! I'll get back to you within 24 hours.</p>
                            </div>
                        </div>
                    {:else}
                        <form bind:this={form} on:submit|preventDefault={handleSubmit} class="contact-form" novalidate>

                            {#if submitError}
                                <div class="error-banner">
                                    <UIcon icon="i-carbon-warning-alt-filled" />
                                    <span>{submitError}</span>
                                </div>
                            {/if}

                            <div class="form-row">
                                <div class="field">
                                    <input type="text" id="cf-name" name="name" placeholder=" " bind:value={name} required autocomplete="name" />
                                    <label for="cf-name">Your Name</label>
                                </div>
                                <div class="field">
                                    <input type="email" id="cf-email" name="email" placeholder=" " bind:value={email} required autocomplete="email" />
                                    <label for="cf-email">Email Address</label>
                                </div>
                            </div>

                            <div class="field">
                                <input type="text" id="cf-subject" name="subject" placeholder=" " bind:value={subject} required />
                                <label for="cf-subject">Subject</label>
                            </div>

                            <div class="field textarea-field">
                                <textarea id="cf-message" name="message" placeholder=" " bind:value={message} required rows="5" maxlength={MAX_MESSAGE}></textarea>
                                <label for="cf-message">Your Message</label>
                                <span class="char-count {message.length > MAX_MESSAGE - 50 ? 'near-limit' : ''}">{message.length}/{MAX_MESSAGE}</span>
                            </div>

                            <button type="submit" class="send-btn" disabled={isSubmitting}>
                                <span class="btn-shimmer" aria-hidden="true"></span>
                                {#if isSubmitting}
                                    <UIcon icon="i-carbon-progress-bar-round-spin" classes="spin-icon" />
                                    <span>Sending…</span>
                                {:else}
                                    <UIcon icon="i-carbon-send" />
                                    <span>Send Message</span>
                                {/if}
                            </button>

                        </form>
                    {/if}
                </div>
            </Card>

        </div>
    </div>
</SearchPage>

<style lang="scss">
    /* ─────────────────────────────────────────
       Page wrapper
    ───────────────────────────────────────── */
    .contact-page {
        position: relative;
        overflow: hidden;
        padding: 40px 16px 60px;
        gap: 28px;
    }

    /* ─────────────────────────────────────────
       Decorative background orbs
    ───────────────────────────────────────── */
    .orb {
        position: fixed;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
        z-index: 0;
        animation: drift 10s ease-in-out infinite alternate;
    }

    .orb-1 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
        top: -80px;
        right: -80px;
        animation-duration: 12s;
    }

    .orb-2 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%);
        bottom: 60px;
        left: -60px;
        animation-duration: 15s;
        animation-delay: -4s;
    }

    .orb-3 {
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
        top: 40%;
        left: 40%;
        animation-duration: 18s;
        animation-delay: -8s;
    }

    @keyframes drift {
        from { transform: translate(0, 0) scale(1); }
        to   { transform: translate(30px, 20px) scale(1.08); }
    }

    /* ─────────────────────────────────────────
       Availability badge
    ───────────────────────────────────────── */
    .availability-badge {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 18px;
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.25);
        border-radius: 99px;
        font-size: 0.82em;
        font-weight: 600;
        color: #10b981;
        letter-spacing: 0.3px;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.4);
            animation: pulse-ring 1.8s ease-out infinite;
        }
    }

    @keyframes pulse-ring {
        0%   { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2.2); opacity: 0; }
    }

    /* ─────────────────────────────────────────
       Section heading
    ───────────────────────────────────────── */
    .section-heading {
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 520px;
    }

    .gradient-title {
        font-size: clamp(1.8em, 4vw, 2.6em);
        font-weight: 800;
        background: linear-gradient(135deg, var(--accent) 0%, #a78bfa 50%, #34d399 100%);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 4s ease infinite;
        line-height: 1.2;
        margin: 0 0 10px;
    }

    @keyframes gradient-shift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .section-sub {
        font-size: 0.95em;
        color: var(--tertiary-text);
        line-height: 1.6;
        margin: 0;
    }

    /* ─────────────────────────────────────────
       Two-column grid
    ───────────────────────────────────────── */
    .contact-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1.35fr;
        gap: 28px;
        width: 100%;
        max-width: 960px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    /* ─────────────────────────────────────────
       Info card
    ───────────────────────────────────────── */
    .info-card-inner {
        display: flex;
        flex-direction: column;
        gap: 20px;
        height: 100%;
    }

    .info-header {
        h2 {
            font-size: 1.25em;
            font-weight: 700;
            margin: 0 0 4px;
        }
    }

    .response-time {
        font-size: 0.78em;
        color: var(--tertiary-text);
    }

    /* Contact items */
    .contact-items {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        border-radius: 14px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        &:hover {
            transform: translateX(4px);
            border-color: var(--accent);
            box-shadow: -4px 0 0 var(--accent), 0 4px 20px rgba(99,102,241,0.1);
        }
    }

    .item-icon-wrap {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        flex-shrink: 0;

        &.email-icon    { background: rgba(239, 68,  68,  0.12); color: #ef4444; }
        &.phone-icon    { background: rgba(16,  185, 129, 0.12); color: #10b981; }
        &.location-icon { background: rgba(99,  102, 241, 0.12); color: #6366f1; }
    }

    .item-details {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .item-label {
        font-size: 0.7em;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: 700;
        color: var(--tertiary-text);
    }

    .item-value {
        font-size: 0.9em;
        font-weight: 500;
        color: var(--main-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.link {
            text-decoration: none;
            transition: color 0.2s;
            &:hover { color: var(--accent); }
        }
    }

    .live-badge {
        font-size: 0.7em;
        font-weight: 600;
        color: #10b981;
        flex-shrink: 0;
    }

    /* Copy button */
    .copy-btn {
        background: transparent;
        border: none;
        color: var(--tertiary-text);
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        position: relative;
        flex-shrink: 0;
        transition: all 0.2s;

        &:hover {
            color: var(--main-text);
            background: var(--main-hover);
        }
    }

    .copy-tooltip {
        position: absolute;
        bottom: 130%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        color: #fff;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 0.7em;
        white-space: nowrap;
        pointer-events: none;
        animation: tooltip-in 0.2s ease;

        &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: var(--accent);
        }
    }

    @keyframes tooltip-in {
        from { opacity: 0; transform: translate(-50%, 4px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
    }

    /* Socials */
    .socials-section {
        h3 {
            font-size: 0.85em;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--tertiary-text);
            margin: 0 0 10px;
        }
    }

    .social-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .social-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 11px 14px;
        border-radius: 12px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        text-decoration: none;
        color: var(--secondary-text);
        font-size: 0.88em;
        font-weight: 500;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        overflow: hidden;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--brand);
            opacity: 0;
            transition: opacity 0.25s;
        }

        &:hover {
            border-color: var(--brand);
            color: var(--brand);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.1), 0 0 12px color-mix(in srgb, var(--brand) 30%, transparent);

            &::before { opacity: 0.07; }
        }

        :global(.sicon) {
            font-size: 1.15em;
            position: relative;
            z-index: 1;
        }

        span { position: relative; z-index: 1; }
    }

    /* ─────────────────────────────────────────
       Form card
    ───────────────────────────────────────── */
    .form-card-inner {
        display: flex;
        flex-direction: column;
        gap: 20px;
        height: 100%;
    }

    .form-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        h2 {
            font-size: 1.25em;
            font-weight: 700;
            margin: 0;
        }
    }

    .fill-progress {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    .fill-track {
        width: 80px;
        height: 5px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 99px;
        overflow: hidden;
    }

    .fill-bar {
        height: 100%;
        border-radius: 99px;
        background: linear-gradient(90deg, var(--accent), #a78bfa);
        transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .fill-label {
        font-size: 0.75em;
        font-weight: 600;
        color: var(--tertiary-text);
    }

    /* Contact form */
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;

        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }
    }

    /* Floating-label fields */
    .field {
        position: relative;

        input, textarea {
            width: 100%;
            padding: 16px 14px 8px;
            background: var(--glass-bg);
            border: 1.5px solid var(--glass-border);
            border-radius: 10px;
            color: var(--main-text);
            font-family: inherit;
            font-size: 0.93em;
            outline: none;
            transition: border-color 0.25s, box-shadow 0.25s;
            box-sizing: border-box;
            line-height: 1.5;

            &:focus {
                border-color: var(--accent);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), 0 2px 12px rgba(99, 102, 241, 0.08);
            }

            &:focus ~ label,
            &:not(:placeholder-shown) ~ label {
                top: 6px;
                font-size: 0.68em;
                color: var(--accent);
                font-weight: 600;
            }
        }

        label {
            position: absolute;
            left: 14px;
            top: 14px;
            font-size: 0.9em;
            color: var(--tertiary-text);
            pointer-events: none;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
    }

    .textarea-field {
        textarea {
            resize: none;
            padding-bottom: 26px;
        }

        .char-count {
            position: absolute;
            right: 12px;
            bottom: 9px;
            font-size: 0.68em;
            color: var(--tertiary-text);
            pointer-events: none;
            transition: color 0.2s;

            &.near-limit {
                color: #f59e0b;
                font-weight: 700;
            }
        }
    }

    /* Send button */
    .send-btn {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 14px 24px;
        border: none;
        border-radius: 10px;
        font-size: 0.95em;
        font-weight: 700;
        font-family: inherit;
        color: #ffffff;
        background: linear-gradient(135deg, var(--accent) 0%, #7c3aed 50%, #a78bfa 100%);
        background-size: 200% 200%;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        letter-spacing: 0.3px;

        &:hover:not(:disabled) {
            background-position: right center;
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
        }

        &:active:not(:disabled) {
            transform: translateY(0);
        }

        &:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }
    }

    /* Shimmer sweep */
    .btn-shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
        transform: skewX(-20deg);
        animation: shimmer 2.5s ease-in-out infinite;
    }

    @keyframes shimmer {
        0%   { left: -100%; }
        60%  { left: 160%;  }
        100% { left: 160%;  }
    }

    :global(.spin-icon) {
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }

    /* ─────────────────────────────────────────
       Success / Error banners
    ───────────────────────────────────────── */
    .success-banner {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        border-radius: 14px;
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.25);
        color: #10b981;
        animation: slide-in 0.4s ease;

        strong { display: block; font-size: 1em; margin-bottom: 2px; }
        p      { margin: 0; font-size: 0.85em; opacity: 0.85; }
    }

    .success-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4em;
        flex-shrink: 0;
    }

    .error-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 10px;
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: #ef4444;
        font-size: 0.88em;
    }

    @keyframes slide-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }
</style>