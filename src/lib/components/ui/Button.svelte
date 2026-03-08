<script lang="ts">
	import { Button } from 'bits-ui';
	import type { ButtonRootProps } from 'bits-ui';

	type Props = ButtonRootProps & {
		variant?: 'default' | 'outline' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg' | 'icon';
	};

	let {
		variant = 'default',
		size = 'default',
		disabled = false,
		children,
		...rest
	}: Props = $props();
</script>

<Button.Root class="btn" data-variant={variant} data-size={size} {disabled} {...rest} >
		{@render children?.()}
</Button.Root>

<style>
	:global([data-button-root]){
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--time);
		border: 1px solid transparent;
	}

	/* Variant logic stays here, not in app.css */
	:global([data-button-root][data-variant='default'] ){
		background: var(--bg);
		color: var(--muted);
	}
	:global([data-button-root][data-variant='default']:hover) {
		color: var(--text);
	}
	:global([data-button-root][data-variant='outline'] ){
		background: var(--fg);
		border-color: var(--muted);
		color: var(--text);
	}
	:global([data-button-root][data-variant='outline']:hover ){
		border-color: var(--text);
		color: var(--text);
	}

	:global([data-button-root][data-variant='link'] ){
		background: var(--mg);
		color: var(--text);
		box-shadow: none;
	}
	:global([data-button-root][data-variant='link']:hover ){
		background: var(--accent);
		color: white;
	}

	/* Size logic */
	:global([data-button-root][data-size='sm'] ){
		height: 2rem;
		padding: 0 0.75rem;
		font-size: 0.75rem;
	}
	:global([data-button-root][data-size='default'] ){
		height: 2.5rem;
		padding: 0 1rem;
		font-size: 0.875rem;
	}
	:global([data-button-root][data-size='lg'] ){
		height: 3rem;
		padding: 0 2rem;
		font-size: 1rem;
	}
</style>
