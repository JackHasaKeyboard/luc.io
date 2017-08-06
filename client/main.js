import { Template } from 'meteor/templating';

import './main.html';

var key = 'AIzaSyBxDR9n9N0Hg1C2-7_5F1hDGjs4gu61bso'

$(document).ready(function() {
	var link = {
		protec: [
			'https://www.youtube.com/watch?v=OCD99jMMuh0',
			'https://www.youtube.com/watch?v=AXT4dxCrmEI',
			'https://www.youtube.com/watch?v=_12QwdU1e6Q'
		],
		attac: [
			'https://www.youtube.com/watch?v=h8rsGxmlBRU',
			'https://www.youtube.com/watch?v=cAn4lQyTJfI',
			'https://www.youtube.com/watch?v=GTG7TPlvpMI'
		]
	};

	var color = {
		protec: [246, 237, 96],
		attac: [69, 234, 34]
	};

	var youtubeVid = new RegExp('(?:youtube\.com\/watch\\?v=|youtu\.?be\/)([^ ]+)');

	var track = {
		protec: [
		],
		attac: [
		]
	};

	$.each(link, function(type, list) {
		$('#track').append('<div id="' + type + '"></div>');

		$.each(list, function(i, song) {
			try {
				var id = youtubeVid.exec(song)[1];

				$.ajax({
					url: 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + key + '&part=snippet,contentDetails',
					dataType: 'json',
					async: false,
					success: function(data) {
						title = data.items[0].snippet.title;
					}
				});

				track[type].push({
					id: id,
					title: title
				});
			}

			catch(err) {
				console.log(err)
			}
		});
	});

	$.each(track, function(type, list) {
		$.each(list, function(i, song) {
			$('#' + type).append('<a><li>' + song['title'] + '</li></a>');
		});
	});

	var i = 0;
	mode = 'protec'

	// youtube player
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	window.onYouTubePlayerAPIReady = function() {
		player = new YT.Player('player', {
			autoplay: 1,
			videoId: track[mode][i]['id']
		});
	}

	$(document).on('keydown keyup', function(e) {
		if (e.type == 'keydown') {
			switch(e.which) {
				case 32: // space
					e.preventDefault();

					togTrack();

					break;

				case 13: // enter
					player.loadVideoById({
						videoId: track[mode][i]['id']
					});

					break;
			}
		}
	});

	function changeTrack() {
		$('#bar a').css('text-decoration', 'none');
		$('#bar #' + mode + ' a:nth-child(' + (i + 1) + ')').css('text-decoration', 'underline');

		document.title = track[mode][i]['title'] + ' | luc.io';
	}

	changeTrack();

	$(document).on('keydown', function(e) {
		switch(e.which) {
			case 78: // n
				if (i < track['protec'].length - 1) {
					i++;
				}

				break;
			case 80: // p
				if (i > 0) {
					i--;
				}

				break;
		}

		changeTrack();
	});

	$('#next').click(function() {
		if (i < track['protec'].length - 1) {
			i++;
		}

		changeTrack();
	});

	$('#prev').click(function() {
		if (i > 0) {
			i--;
		}

		changeTrack();
	});

	$('#tog').click(function() {
		togTrack();
	});

	function togTrack() {
		if (player.getPlayerState() == 1) { // playing
			player.pauseVideo();

			$('#tog i').attr('class', 'fa fa-play');
		}

		if (player.getPlayerState() == 5 || player.getPlayerState() == 2) { // cued, paused
			player.playVideo();

			$('#tog i').attr('class', 'fa fa-pause');
		}
	}

	$('#bar div').click(function() {
		mode = $(this).attr('id');

		$('svg path').attr({
			'fill': 'rgba(' + color[mode] + ', 0.26)',
			'stroke': 'rgb(' + color[mode] + ')'
		});
	});
});