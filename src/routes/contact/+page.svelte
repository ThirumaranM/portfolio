<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import { title, contactInfo } from '@data/contact';
	import CardDivider from '$lib/components/Card/CardDivider.svelte';
	import emailjs from '@emailjs/browser';

	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	let isSubmitting = false;
	let submitSuccess = false;
	let submitError = '';

	let form: HTMLFormElement; // Add this line to define the form variable

	const handleSubmit = async () => {
		isSubmitting = true;
		submitError = '';
		
		try {
			await emailjs.sendForm(
				'service_184zkg5', 
				'template_76b5snh', 
				form, // This will now reference the form element
				't9B5mfTrVa-blnugN' 
			);
			
			// Reset form on success
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
</script>

<SearchPage {title}>
	<div class="col items-center relative mt-10 flex-1 w-full max-w-4xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
			<!-- Contact Information -->
			<Card>
				<div class="flex-1 col gap-4 items-stretch">
					<h2 class="text-[1.5em] font-bold">Get in Touch</h2>
					
					<div class="col text-[0.9em] gap-3">
						<div class="row items-center gap-2">
							<UIcon icon="i-carbon-email" />
							<a href={`mailto:${contactInfo.email}`} class="hover:underline">{contactInfo.email}</a>
						</div>
						
						<div class="row items-center gap-2">
							<UIcon icon="i-carbon-phone" />
							<a href={`tel:${contactInfo.phone}`} class="hover:underline">{contactInfo.phone}</a>
						</div>
						
						<div class="row items-center gap-2">
							<UIcon icon="i-carbon-location" />
							<span>{contactInfo.location}</span>
						</div>
					</div>
					
					<CardDivider />
					
					<div class="mt-4">
						<h3 class="text-[1.1em] font-semibold mb-2">Connect with me</h3>
						<div class="flex gap-4">
							{#each contactInfo.socialMedia as social}
								<a 
									href={social.url} 
									target="_blank" 
									rel="noopener noreferrer"
									class="text-[1.5em] hover:text-[var(--accent-text)] transition-colors"
									title={social.platform}
								>
									<UIcon icon={social.icon} />
								</a>
							{/each}
						</div>
					</div>
				</div>
			</Card>
			
			<!-- Contact Form -->
			<Card>
				<div class="flex-1 col gap-4 items-stretch">
					<h2 class="text-[1.5em] font-bold">Send a Message</h2>
					
					{#if submitSuccess}
						<div class="bg-green-100 dark:bg-green-900 p-4 rounded-md text-green-800 dark:text-green-200">
							Thank you for your message! I'll get back to you soon.
						</div>
					{:else}
						<form bind:this={form} on:submit|preventDefault={handleSubmit} class="col gap-4">
							{#if submitError}
								<div class="bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-800 dark:text-red-200">
									{submitError}
								</div>
							{/if}
							
							<div class="col gap-1">
								<label for="name" class="text-sm">Name</label>
								<input 
									type="text" 
									id="name" 
									name="name"
									bind:value={name} 
									required 
									class="p-2 rounded-md bg-[var(--main)] border border-[var(--border)]"
								/>
							</div>
							
							<div class="col gap-1">
								<label for="email" class="text-sm">Email</label>
								<input 
									type="email" 
									id="email" 
									name="email"
									bind:value={email} 
									required 
									class="p-2 rounded-md bg-[var(--main)] border border-[var(--border)]"
								/>
							</div>
							
							<div class="col gap-1">
								<label for="subject" class="text-sm">Subject</label>
								<input 
									type="text" 
									id="subject" 
									name="subject"
									bind:value={subject} 
									required 
									class="p-2 rounded-md bg-[var(--main)] border border-[var(--border)]"
								/>
							</div>
							
							<div class="col gap-1">
								<label for="message" class="text-sm">Message</label>
								<textarea 
									id="message" 
									name="message"
									bind:value={message} 
									required 
									rows="5"
									class="p-2 rounded-md bg-[var(--main)] border border-[var(--border)] resize-none"
								></textarea>
							</div>
							
							<button 
								type="submit" 
								disabled={isSubmitting}
								class="bg-[var(--accent)] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
							>
								{isSubmitting ? 'Sending...' : 'Send Message'}
							</button>
						</form>
					{/if}
				</div>
			</Card>
		</div>
	</div>
</SearchPage>