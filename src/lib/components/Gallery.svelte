<script lang="ts">
	import { tick } from 'svelte';

	/** * AUTOMATED ASSET LOADING
	 * Scans the assets folder and excludes .svg files
	 */
	const assetFiles = import.meta.glob('$lib/assets/*', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	const images = Object.entries(assetFiles)
		.filter(([path]) => !path.endsWith('.svg'))
		.map(([ url]) => url as string);

	let showPopup = $state(false);
	let currentIndex = $state(0);
	let scrollContainer = $state<HTMLDivElement | null>(null);

	async function open(index: number) {
		currentIndex = index;
		showPopup = true;

		await tick();
		if (scrollContainer) {
			scrollContainer.scrollTo({
				left: index * scrollContainer.clientWidth,
				behavior: 'instant'
			});
		}
	}

	function handleScroll(e: Event) {
		const target = e.target as HTMLDivElement;
		// Calculates the current index based on scroll position
		currentIndex = Math.round(target.scrollLeft / target.clientWidth);
	}

	function close() {
		showPopup = false;
	}
</script>

<div class="grid">
	{#each images as img, i (img)}
		<button class="thumbnail-btn" onclick={() => open(i)}>
			<img src={img} alt="Thumbnail {i}" />
		</button>
	{/each}
</div>

{#if showPopup}
	<div class="overlay">
		<div class="blur-bg" onclick={close} aria-hidden="true"></div>

		<button class="icon-btn close-btn" onclick={close} aria-label="Close">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
			>
		</button>

		<div class="carousel-container">
			<div class="carousel-viewport" bind:this={scrollContainer} onscroll={handleScroll}>
				{#each images as src, i (src)}
					<div class="slide">
						<img {src} alt="Gallery Item {i}" />
					</div>
				{/each}
			</div>

			{#if currentIndex > 0}
				<button
					class="icon-btn nav prev"
					onclick={() =>
						scrollContainer?.scrollBy({ left: -scrollContainer.clientWidth, behavior: 'smooth' })}
					aria-label="Previous"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
					>
				</button>
			{/if}
			{#if currentIndex < images.length - 1}
				<button
					class="icon-btn nav next"
					onclick={() =>
						scrollContainer?.scrollBy({ left: scrollContainer.clientWidth, behavior: 'smooth' })}
					aria-label="Next"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
					>
				</button>
			{/if}
		</div>

		<div class="indicators">
			{#each images as _, i (_)}
				<button
					class="dot {currentIndex === i ? 'active' : ''}"
					onclick={() => open(i)}
					aria-label="Go to slide {i + 1}"
				></button>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Grid styling remains identical */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
		overflow-x: scroll;
		scroll-behavior: smooth;
	}

	.thumbnail-btn {
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.1),
			0 1px 2px -1px rgb(0 0 0 / 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.thumbnail-btn:hover {
		transform: scale(1.02);
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.thumbnail-btn img {
		display: block;
		width: 100%;
		height: 150px;
		object-fit: cover;
	}

	/* Full Screen Overlay */
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.blur-bg {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.95); /* Extremely dark background for high contrast */
		backdrop-filter: blur(12px);
		z-index: -1;
	}

	/* Carousel stretches edge-to-edge */
	.carousel-container {
		position: absolute;
		inset: 0;
		width: 100vw;
		height: 100vh;
	}

	.carousel-viewport {
		display: flex;
		width: 100%;
		height: 100%;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		-ms-overflow-style: none;
		scroll-behavior: smooth;
	}

	.carousel-viewport::-webkit-scrollbar {
		display: none;
	}

	.slide {
		flex: 0 0 100vw;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		scroll-snap-align: start;
		/* Padding removed to allow true full screen */
	}

	.slide img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		user-select: none;
	}

	/* Overlaid UI Elements */
	.icon-btn {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(4px);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		width: 3.5rem;
		height: 3.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.icon-btn:hover {
		background: rgba(255, 255, 255, 0.25);
		transform: scale(1.05);
	}

	.close-btn {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 1010;
	}

	.nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1010;
	}

	.prev {
		left: 1.5rem;
	}
	.next {
		right: 1.5rem;
	}

	.indicators {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.75rem;
		z-index: 1010;
		background: rgba(0, 0, 0, 0.3);
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		backdrop-filter: blur(4px);
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.4);
		border: none;
		cursor: pointer;
		padding: 0;
		transition: all 0.2s;
	}

	.dot.active {
		background: white;
		transform: scale(1.5);
	}
</style>
