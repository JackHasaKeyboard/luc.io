async function sleep(
	fn,
	ms
) {
	async function timeOut() {
		return new Promise(
			(resolve) => setTimeout(
				resolve,
				ms
			)
		);
	}
	
	await timeOut();

	return fn();
}

$("#info").ready(() => {
	$("#info").prepend(
		`
		<div
			id="lucio"
		></div>
		`
	);

	var video = $(".video-stream")[0];

	const
		ctx = new (AudioContext || webkitAudioContext)(),
		analyser = ctx.createAnalyser();

		src = ctx.createMediaElementSource(video);

	src.connect(analyser);
	analyser.connect(ctx.destination);

	$("#lucio").append(
		`
		<svg
			id="scope"
			overflow="visible"
			stroke="rgb(69, 234, 34)"
			stroke-width="6px"
			fill="rgba(69, 234, 34, 0.6)"
		>
			<path />
		</svg>
		`
	);

	var
		val = [],
		s = val.join(
			"\n"
		);

	// mode
	const
		col = [ 
			[
				[
					246,
					237,
					96
				], [
					0.6
				]
			], [
				[
					69,
					234,
					34
				], [
					0
				]
			]
		],

		diff = [
			246 - 69,
			237 - 234,
			96 - 34,
			0.6 - 0
		],

		samp = 10;

	var
		upd = [],
		mode = 0,
		dir = 1;

	$("#scope").attr(
		{
			"stroke": "rgb(" + (col[mode][0][0]) + ", " + (col[mode][0][1]) + ", " + (col[mode][0][2]) + ")",
			"fill": "rgba(" + (col[mode][0][0]) + ", " + (col[mode][0][1]) + ", " + (col[mode][0][2]) + ", " + (col[mode][1][0]) + ")"
		}
	);

	$("#lucio").append(
		`
		<div
			id="control"
		></div>
		`
	);
	$("#control").append(
		`
		<label
			id="tog"
			class="switch"><input
			type="checkbox"
		>
			<span
				class="slider"
			></span>
		</label>
		`
	);

	$(".slider").css({
		"background-color": "rgb(" + (col[mode][0][0]) + "," + (col[mode][0][1]) + "," + (col[mode][0][2]) + ")"
	});

	$("#tog").mousedown(async function() {
		if (mode == 0) {
			mode = 1;

			dir = -1;
		} else if (mode == 1) {
			mode = 0;

			dir = 1;
		}

		if (mode == 0) {
			fst = 0;
			snd = 1;
		} else if (mode == 1) {
			fst = 1;
			snd = 0;
		}

		const inc = [
			diff[0] / samp,
			diff[1] / samp,
			diff[2] / samp,
			diff[3] / samp
		];

		for (
			let i = 0;
			i < samp + 1;
			i++
		) {
			await sleep(
				() => {
					upd[0] = col[snd][0][0] + ((inc[0] * i) * dir);
					upd[1] = col[snd][0][1] + ((inc[1] * i) * dir);
					upd[2] = col[snd][0][2] + ((inc[2] * i) * dir);
					upd[3] = col[snd][1][0] + ((inc[3] * i) * dir);

					$(".slider").css({
						"background-color": "rgb(" + (upd[0]) + "," + (upd[1]) + "," + (upd[2]) + ")"
					});

					$("#scope").css({
						"stroke": "rgb(" + (upd[0]) + ", " + (upd[1]) + ", " + (upd[2]) + ")",
						"fill": "rgba(" + (upd[0]) + ", " + (upd[1]) + ", " + (upd[2]) + ", " + upd[3] + ")"
					});
				},
				1000 / samp
			);
		}
	});

	// draw
	function draw() {
		window.requestAnimationFrame(draw);

		var fbc = new Uint8Array(
			analyser.frequencyBinCount
		);

		analyser.getByteFrequencyData(fbc);

		$("#scope path").attr(
			"d",
			s
		);

		var
			wd = $("#lucio").width(),
			cnt = 10,
			spc = (wd / cnt),

			mod = 1;

		var bar = {};
		for (
			let i = 0;
			i < cnt + 1;
			i++
		) {
			if (i == 0) {
				val[i] = "M 0, 0";
			} else {
				val[i] = "Q " + (((i - 1) * spc) + (spc / 2)) + " " + ((fbc[i] / 5) * mod) + " " +  (((i - 1) * spc) + spc) + " " + 0;
			}

			if (mod == 1) {
				mod = -1;
			} else if (mod == -1) {
				mod = 1;
			}
		}

		s = val.join(
			"\n"
		);
	}

	draw();
});
