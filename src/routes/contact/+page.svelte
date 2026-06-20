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
            setTimeout(() => {
                showCopyTooltip = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    };
</script>

<SearchPage {title}>
    <div class="col items-center relative mt-10 flex-1 w-full max-w-4xl mx-auto page-entrance">
        <div class="contact-container">

            <!-- ───── Contact Information ───── -->
            <Card>
                <div class="flex-1 col gap-4 items-stretch">
                    <h2 class="text-[1.5em] font-bold">Get in Touch</h2>

                    <div class="contact-card-list">

                        <!-- Email -->
                        <div class="contact-item-card">
                            <UIcon icon="i-carbon-email" classes="contact-icon text-red-500" />
                            <div class="contact-details">
                                <span class="contact-label">Email Address</span>
                                <a href={`mailto:${contactInfo.email}`} class="contact-link">{contactInfo.email}</a>
                            </div>
                            <button on:click={copyEmail} class="copy-btn" title="Copy Email">
                                {#if showCopyTooltip}
                                    <span class="copy-tooltip">Copied!</span>
                                    <UIcon icon="i-carbon-checkmark" classes="text-green-500" />
                                {:else}
                                    <UIcon icon="i-carbon-copy" />
                                {/if}
                            </button>
                        </div>

                        <!-- Phone -->
                        <div class="contact-item-card">
                            <UIcon icon="i-carbon-phone" classes="contact-icon text-green-500" />
                            <div class="contact-details">
                                <span class="contact-label">Phone Number</span>
                                <a href={`tel:${contactInfo.phone}`} class="contact-link">{contactInfo.phone}</a>
                            </div>
                        </div>

                        <!-- Location -->
                        <div class="contact-item-card location-pulse">
                            <UIcon icon="i-carbon-location" classes="contact-icon text-blue-500" />
                            <div class="contact-details">
                                <span class="contact-label">Location</span>
                                <span class="contact-val">{contactInfo.location}</span>
                            </div>
                        </div>

                    </div>

                    <CardDivider />

                    <div class="mt-2">
                        <h3 class="text-[1.1em] font-semibold mb-2">Connect with me</h3>
                        <div class="social-links-grid">
                            {#each socialMediaList as social}
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="social-badge"
                                    style:--brand-color={social.platform.toLowerCase() === 'linkedin' ? '#0077b5' : '#8c52ff'}
                                    title={social.platform}
                                >
                                    <UIcon icon={social.icon} classes="social-icon" />
                                    <span>{social.platform}</span>
                                </a>
                            {/each}
                        </div>
                    </div>
                </div>
            </Card>

            <!-- ───── Contact Form ───── -->
            <Card>
                <div class="flex-1 col gap-3 items-stretch">
                    <h2 class="text-[1.5em] font-bold">Send a Message</h2>

                    <!-- Progress bar -->
                    <div class="progress-container">
                        <div class="progress-fill" style="width: {progressWidth}%;"></div>
                    </div>

                    {#if submitSuccess}
                        <div class="success-message">
                            <UIcon icon="i-carbon-checkmark-filled" classes="text-1.5em" />
                            <span>Thank you! I'll get back to you soon.</span>
                        </div>
                    {:else}
                        <form bind:this={form} on:submit|preventDefault={handleSubmit} class="col gap-1">

                            {#if submitError}
                                <div class="error-message">
                                    <UIcon icon="i-carbon-warning-alt-filled" classes="text-1.5em" />
                                    <span>{submitError}</span>
                                </div>
                            {/if}

                            <!-- Name -->
                            <div class="input-wrapper">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder=" "
                                    bind:value={name}
                                    required
                                />
                                <label for="name">Name</label>
                            </div>

                            <!-- Email -->
                            <div class="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder=" "
                                    bind:value={email}
                                    required
                                />
                                <label for="email">Email</label>
                            </div>

                            <!-- Subject -->
                            <div class="input-wrapper">
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    placeholder=" "
                                    bind:value={subject}
                                    required
                                />
                                <label for="subject">Subject</label>
                            </div>

                            <!-- Message -->
                            <div class="input-wrapper textarea-wrapper">
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder=" "
                                    bind:value={message}
                                    required
                                    rows="5"
                                ></textarea>
                                <label for="message">Message</label>
                                <span class="char-counter {message.length > MAX_MESSAGE - 50 ? 'warning' : ''}">{message.length} / {MAX_MESSAGE}</span>
                            </div>

                            <!-- Submit -->
                            <button type="submit" disabled={isSubmitting} class="btn-submit">
                                {#if isSubmitting}
                                    <UIcon icon="i-carbon-progress-bar-round-spin" classes="animate-spin text-1.25em" />
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
    /* ── Layout ── */
    .contact-container {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 32px;
        width: 100%;
        max-width: 900px;
        margin: 0 auto;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 24px;
        }
    }

    /* ── Contact Info Cards ── */
    .contact-card-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-top: 8px;
    }

    .contact-item-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 18px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        position: relative;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        &:hover {
            border-color: var(--border-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 16px var(--glass-shadow);
        }

        :global(.contact-icon) {
            font-size: 1.6em;
        }
    }

    .contact-details {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;

        .contact-label {
            font-size: 0.72em;
            color: var(--tertiary-text);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .contact-link, .contact-val {
            font-size: 0.92em;
            color: var(--main-text);
            font-weight: 500;
            text-decoration: none;
            margin-top: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .contact-link:hover {
            color: var(--accent-text-hover);
            text-decoration: underline;
        }
    }

    /* ── Copy Button ── */
    .copy-btn {
        background: transparent;
        border: none;
        color: var(--tertiary-text);
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        position: relative;
        flex-shrink: 0;

        &:hover {
            color: var(--main-text-hover);
            background: var(--main-hover);
        }
    }

    .copy-tooltip {
        position: absolute;
        bottom: 130%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.72em;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        animation: tooltip-fade 0.2s ease forwards;

        &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: var(--accent);
        }
    }

    @keyframes tooltip-fade {
        from { opacity: 0; transform: translate(-50%, 4px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
    }

    /* ── Social Badges ── */
    .social-links-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;

        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }
    }

    .social-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 12px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        text-decoration: none;
        color: var(--secondary-text);
        font-weight: 500;
        font-size: 0.9em;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        &:hover {
            color: var(--main-text-hover);
            border-color: var(--brand-color);
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 15px var(--brand-color);
        }

        :global(.social-icon) {
            font-size: 1.25em;
        }
    }

    /* ── Form Progress Bar ── */
    .progress-container {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 4px;
    }

    .progress-fill {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, var(--accent), var(--accent-text-hover));
        transition: width 0.35s ease;
    }

    /* ── Input Fields ── */
    .input-wrapper {
        position: relative;
        margin-bottom: 6px;

        input, textarea {
            width: 100%;
            padding: 14px 12px 10px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            color: var(--main-text);
            outline: none;
            font-size: 0.93em;
            font-family: inherit;
            transition: border-color 0.25s ease, box-shadow 0.25s ease;
            box-sizing: border-box;

            &:focus {
                border-color: var(--accent);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
            }

            &:focus ~ label,
            &:not(:placeholder-shown) ~ label {
                top: -9px;
                left: 8px;
                font-size: 0.72em;
                color: var(--accent-text);
                background: var(--main);
                padding: 0 5px;
                border-radius: 4px;
                border: 1px solid var(--glass-border);
            }
        }

        label {
            position: absolute;
            left: 12px;
            top: 13px;
            color: var(--tertiary-text);
            pointer-events: none;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-size: 0.93em;
        }
    }

    .textarea-wrapper {
        textarea {
            resize: none;
            padding-bottom: 26px;
        }

        .char-counter {
            position: absolute;
            right: 10px;
            bottom: 8px;
            font-size: 0.7em;
            color: var(--tertiary-text);
            pointer-events: none;

            &.warning {
                color: var(--accent);
                font-weight: 600;
            }
        }
    }

    /* ── Submit Button ── */
    .btn-submit {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 13px 24px;
        margin-top: 6px;
        border: none;
        border-radius: 8px;
        font-size: 0.95em;
        font-weight: 600;
        font-family: inherit;
        color: #ffffff;
        background: linear-gradient(135deg, var(--accent) 0%, var(--accent-text-hover) 100%);
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

    /* ── Location Pulse ── */
    @keyframes pulseGlow {
        0%   { box-shadow: 0 0 0 0   rgba(99, 102, 241, 0.4); }
        50%  { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);   }
        100% { box-shadow: 0 0 0 0   rgba(99, 102, 241, 0);   }
    }

    .location-pulse {
        animation: pulseGlow 2.5s infinite;
    }

    /* ── Success / Error Banners ── */
    .success-message, .error-message {
        padding: 14px 16px;
        border-radius: 10px;
        font-size: 0.93em;
        line-height: 1.5;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid transparent;
    }

    .success-message {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.25);
        color: #10b981;
    }

    .error-message {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.25);
        color: #ef4444;
    }
</style>