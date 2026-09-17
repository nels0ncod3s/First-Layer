<script>
	import BrandMark from '$lib/components/BrandMark.svelte';
	import Check from '@lucide/svelte/icons/check';
</script>

<aside class="auth-artwork" aria-label="About First Layer">
	<a href="/" class="auth-brand"><BrandMark size={32} />first layer.</a>
	<div class="artwork-content">
		<span class="artwork-eyebrow">ONE LAYER. MORE POSSIBILITY.</span>
		<h2>A foundation<br />for your<br /><span>next big thing.</span></h2>
		<div class="artwork-layers" aria-hidden="true">
			<span></span><span></span><span><BrandMark size={55} /></span>
		</div>
		<p>
			Your users. Your applications. Your ideas.<br />A little more connected.
		</p>
	</div>
	<div class="artwork-bottom">
		<span><Check size={14} /> Built for the people who build.</span><span>01 / FIRST LAYER</span>
	</div>
</aside>

<style>
	.auth-artwork {
		position: fixed;
		inset: 0 50% 0 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 45px 50px;
		background: #bba3f1;
		color: #251735;
		overflow: hidden;
	}
	.auth-brand {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 25px;
		letter-spacing: -1px;
		font-weight: 650;
		position: relative;
		z-index: 1;
	}
	.artwork-content {
		position: relative;
		margin-top: 40px;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.artwork-eyebrow {
		font-size: 9px;
		letter-spacing: 1.6px;
		color: #584476;
		font-weight: 600;
	}
	.artwork-content h2 {
		font-size: clamp(40px, 4.9vw, 67px);
		letter-spacing: -3px;
		line-height: 1.1;
		font-weight: 500;
		margin: 23px 0;
		position: relative;
		z-index: 1;
	}
	.artwork-content h2 span {
		color: #64507e;
	}
	.artwork-content p {
		font-size: 13px;
		line-height: 1.9;
		color: #5d467a;
		position: relative;
		z-index: 1;
		margin-top: 130px;
	}
	.artwork-layers {
		position: absolute;
		right: -35px;
		bottom: 65px;
		width: 290px;
		height: 260px;
		transform: rotate(-10deg);
		opacity: 0.85;
	}
	.artwork-layers > span {
		position: absolute;
		display: grid;
		place-items: center;
		width: 205px;
		height: 155px;
		border: 1px solid #5b3f8738;
		border-radius: 20px;
		transform: skewY(-23deg);
		top: 70px;
		left: 30px;
		background: #d9c8ff40;
	}
	.artwork-layers > span:nth-child(2) {
		top: 30px;
		background: #cfbaf953;
	}
	.artwork-layers > span:nth-child(3) {
		top: -10px;
		background: linear-gradient(150deg, #d8c7fb, #ad8cdc);
		box-shadow: 20px 30px 70px #52337520;
		color: #5b3c84;
	}
	.artwork-bottom {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		gap: 20px;
		font-size: 10px;
		color: #665180;
		margin-top: 25px;
	}
	.artwork-bottom > span:first-child {
		display: flex;
		gap: 7px;
		align-items: center;
	}
	.artwork-bottom > span:last-child {
		font: 8px monospace;
		letter-spacing: 1px;
	}
	@media (max-height: 760px) {
		.artwork-content h2 {
			font-size: 54px;
		}
		.artwork-content p {
			margin-top: 80px;
		}
		.artwork-layers {
			width: 235px;
			height: 180px;
			right: -70px;
			bottom: 20px;
			opacity: 0.6;
		}
		.auth-artwork {
			padding: 35px;
		}
	}
	@media (max-width: 1000px) {
		.auth-artwork {
			display: none;
		}
	}
</style>
