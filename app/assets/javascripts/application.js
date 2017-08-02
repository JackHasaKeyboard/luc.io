// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

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

	var youtubeVid = new RegExp('(?:youtube\.com\/watch\\?v=|youtu\.?be\/)([^ ]+)');

	var track = {
		protec: [
		],
		attac: [
		]
	};

	$.each(link, function(type, list) {
		$('#bar').append('<div id="' + type + '"></div>');

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

	document.title = track[mode][i]['title'] + ' | luc.io';

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
});
