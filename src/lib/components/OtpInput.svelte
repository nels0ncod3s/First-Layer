<script>
	// Reusable N-digit code input: auto-advances between boxes, supports
	// pasting a full code, and shakes red briefly when told the last
	// attempt was wrong. Framework-agnostic UX pattern (no FirstLayer- or
	// Supabase-specific logic in here) — the caller owns verification and
	// just flips `error` when a code comes back invalid.
	let {
		length = 6,
		value = $bindable(""),
		error = false,
		disabled = false,
		onComplete = () => {}
	} = $props();

	let digits = $state(Array(length).fill(""));
	let inputs = $state([]);
	let shake = $state(false);

	$effect(() => {
		if (error) {
			shake = true;
			const t = setTimeout(() => (shake = false), 400);
			return () => clearTimeout(t);
		}
	});

	export function clear() {
		digits = Array(length).fill("");
		value = "";
		inputs[0]?.focus();
	}

	function syncValue() {
		value = digits.join("");
		if (digits.every((d) => d !== "")) {
			onComplete(value);
		}
	}

	function handleInput(i, e) {
		const val = e.currentTarget.value.replace(/\D/g, "");
		digits[i] = val ? val[val.length - 1] : "";
		if (val && i < length - 1) {
			inputs[i + 1]?.focus();
		}
		syncValue();
	}

	function handleKeydown(i, e) {
		if (e.key === "Backspace" && !digits[i] && i > 0) {
			inputs[i - 1]?.focus();
		} else if (e.key === "ArrowLeft" && i > 0) {
			inputs[i - 1]?.focus();
		} else if (e.key === "ArrowRight" && i < length - 1) {
			inputs[i + 1]?.focus();
		}
	}

	function handlePaste(e) {
		e.preventDefault();
		const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
		if (!text) return;
		digits = text
			.split("")
			.concat(Array(length).fill(""))
			.slice(0, length);
		const nextEmpty = digits.findIndex((d) => !d);
		inputs[nextEmpty === -1 ? length - 1 : nextEmpty]?.focus();
		syncValue();
	}
</script>

<div class="otp-row" class:shake role="group" aria-label="Verification code">
	{#each digits as _, i}
		<input
			bind:this={inputs[i]}
			bind:value={digits[i]}
			type="text"
			inputmode="numeric"
			autocomplete={i === 0 ? "one-time-code" : "off"}
			maxlength="1"
			class="otp-box"
			class:error
			{disabled}
			aria-label={`Digit ${i + 1} of ${length}`}
			oninput={(e) => handleInput(i, e)}
			onkeydown={(e) => handleKeydown(i, e)}
			onpaste={handlePaste}
		/>
	{/each}
</div>

<style>
	.otp-row {
		display: flex;
		gap: 0.6rem;
		justify-content: center;
	}
	.otp-box {
		width: 2.9rem;
		height: 3.4rem;
		text-align: center;
		font-size: 1.4rem;
		font-weight: 600;
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: #f3f4f6;
		transition: border-color 0.15s ease, background 0.15s ease;
	}
	.otp-box:focus {
		outline: none;
		border-color: #7c3aed;
		background: rgba(124, 58, 237, 0.08);
	}
	.otp-box.error {
		border-color: #ef4444;
		background: rgba(239, 68, 68, 0.08);
		color: #fca5a5;
	}
	.otp-box:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.shake {
		animation: otp-shake 0.4s ease;
	}
	@keyframes otp-shake {
		10%,
		90% {
			transform: translateX(-2px);
		}
		20%,
		80% {
			transform: translateX(4px);
		}
		30%,
		50%,
		70% {
			transform: translateX(-8px);
		}
		40%,
		60% {
			transform: translateX(8px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.shake {
			animation: none;
		}
	}
</style>
