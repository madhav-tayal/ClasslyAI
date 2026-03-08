<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PageSection from '$lib/components/layout/PageSection.svelte';
	import PageFooter from '$lib/components/layout/PageFooter.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import {
		faChartLine,
		faClipboardQuestion,
		faBookOpen,
		faRobot,
		faArrowRight,
		faGraduationCap
	} from '@fortawesome/free-solid-svg-icons';
	

	// home page content
	const features = [
		{
			title: 'Smart Quizzes',
			icon: faClipboardQuestion,
			text: 'AI-generated questions that adapt to your knowledge gaps.'
		},
		{
			title: 'Study Guides',
			icon: faBookOpen,
			text: 'Comprehensive summaries generated from your own lecture notes.'
		},
		{
			title: 'Analytics',
			icon: faChartLine,
			text: 'Track your scores and watch your progress over time.'
		}
	];
	const steps = [
		{
			title: 'AI Study Material',
			description:
				'Enter any topic and get curated notes, summaries, and key concepts generated instantly by Gemini.'
		},
		{
			title: 'Smart Quizzes',
			description:
				'Auto-generated quizzes tailored to your study material. Multiple choice, short answer you name it.'
		},
		{
			title: 'Performance Analytics',
			description:
				'Track your scores, spot weak areas, and watch your progress over time with clear visual breakdowns.'
		}
	];
</script>

<PageHeader
	heading="Study Smarter, Not Harder"
	subtitle="ClasslyAI generates personalized study material, quizzes, and performance analytics — all driven by AI so you can focus on actually learning."
>
	{#snippet badge()}
		<Icon icon={faRobot} size="1.2rem" color="var(--accent)" />
		<span>Powered by Gemini</span>
	{/snippet}

	{#snippet redirect()}
		<div class="actions">
			<Button variant='link' href="/dashboard" size="lg">
				Get Started
				<Icon icon={faArrowRight} />
			</Button>

			<Button variant="outline" href="/about" size="lg">Learn More</Button>
		</div>
	{/snippet}
</PageHeader>

<PageSection heading="Everything you need to ace it">
	<div class="features">
		{#each features as feature (feature.title)}
			<Card preset="notched">
				{#snippet content()}
					<Icon icon={feature.icon} size="2rem" color="var(--accent)" />
					<h3>{feature.title}</h3>
					<p>{feature.text}</p>
				{/snippet}
			</Card>
		{/each}
	</div>
</PageSection>

<PageSection heading="How it works">
	<div class="steps-container">
		{#each steps as step, number (step.title)}
			<div class="step">
				<span class="step-num">{number + 1}</span>
				<h3>{step.title}</h3>
				<p>{step.description}</p>
			</div>
		{/each}
	</div>
</PageSection>

<PageFooter
	heading="Ready to level up?"
	subtitle="Jump into your dashboard and start your first AI study session."
>
	{#snippet icon()}
		<Icon icon={faGraduationCap} size="2x" color="var(--accent)" />
	{/snippet}

	<Button variant='ghost' href='/dashboard' >
		Open Dashboard
		<Icon icon={faArrowRight} />
	</Button>
</PageFooter>

<style>
	/* Three-column grid for Features */
	.features {
		display: grid;
		grid-template-columns: repeat(3, 1fr); /* Forced 3 columns */
		gap: 2rem;
		width: 100%;
	}
	.actions {
		display: flex;
		gap: 2rem;
	}
	/* Responsive adjustment for features */
	@media (max-width: 1024px) {
		.features {
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		}
	}

	/* Three-column grid for How It Works */
	.steps-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3rem;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1.25rem;
	}

	.step-num {
		background: var(--bg);
		color: var(--text);
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-weight: 700;
		border: 2px solid var(--muted);
	}
</style>
