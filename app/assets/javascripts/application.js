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
	var track = {
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

	$.each(track, function(type, list) {
		$('#bar').append('<div id="' + type + '"></div>');

		$.each(list, function(i, song) {
			try {
				var id = youtubeVid.exec(song)[1];

				$.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + key + '&part=snippet,contentDetails', function(data) {
					var title = data.items[0].snippet.title;

					$('#' + type).append('<a><li>' + title + '</li></a>');
				});
			}

			catch(err) {
				alert(err)
			}
		});
	});
});
