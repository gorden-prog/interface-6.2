(function () {
	'use strict';

	const preloader = document.getElementById('preloader');
	if (!preloader) return;

	const bar = document.getElementById('preloader-bar');
	const counter = document.getElementById('preloader-percent');
	const stage = document.getElementById('preloader-stage');
	const wheel = document.getElementById('preloader-wheel');
	const tire = document.getElementById('preloader-tire');

	const duration = 500 + Math.random() * 2500;
	const plateau = 84 + Math.random() * 14;
	const easePower = 1.7 + Math.random() * 2.4;
	const startedAt = performance.now();
	const SPIN_DURATION = 0.32;

	let progress = 0;
	let angle = 0;
	let loaded = document.readyState === 'complete';
	let finished = false;

	document.body.classList.add('is-loading');

	const travel = () => stage && wheel ? Math.max(0, stage.clientWidth - wheel.offsetWidth) : 0;

	const render = value => {
		progress = value;
		if (bar) bar.style.transform = `scaleX(${value / 100})`;
		if (counter) counter.textContent = `${Math.round(value)}%`;
		if (!wheel || !tire) return;

		const distance = travel() * (value / 100);
		const radius = Math.max(1, wheel.offsetWidth / 2);
		angle = (distance / radius) * (180 / Math.PI);

		wheel.style.transform = `translate3d(${distance}px,0,0)`;
		tire.style.transform = `rotate(${angle}deg)`;
	};

	const finish = () => {
		if (finished) return;
		finished = true;
		render(100);

		if (wheel && tire) {
			tire.style.animationDelay = `${-(angle % 360) / 360 * SPIN_DURATION}s`;
			preloader.classList.add('is-done');

			const target = travel() + window.innerWidth * 0.6;
			wheel.style.transition = 'transform .75s cubic-bezier(.5,0,.85,.5)';
			void wheel.offsetWidth;
			wheel.style.transform = `translate3d(${target}px,0,0)`;
		} else {
			preloader.classList.add('is-done');
		}

		document.body.classList.remove('is-loading');
		window.setTimeout(() => preloader.remove(), 1000);
	};

	const tick = () => {
		if (finished) return;
		const elapsed = performance.now() - startedAt;
		const ratio = Math.min(1, elapsed / duration);
		const target = plateau * (1 - Math.pow(1 - ratio, easePower));
		render(Math.max(progress, target));
		if (loaded && elapsed >= duration) finish();
		else requestAnimationFrame(tick);
	};

	if (!loaded) window.addEventListener('load', () => {
		loaded = true;
	}, { once: true });

	window.setTimeout(() => {
		loaded = true;
		finish();
	}, duration + 900);

	requestAnimationFrame(tick);
})();
