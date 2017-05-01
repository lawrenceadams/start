// Finds current time and date, formats it properly
function startTime() {
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var now = new Date();
	var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
	var date = [now.getDate(), now.getDay(), now.getMonth(), now.getFullYear()];
	var hour = time[0];
	var mins = time[1];
	var secs = time[2];
	var ampm = hour >= 12 ? 'PM' : 'AM';
	var day = date[0];
	var weekday = dayNames[date[1]];
	var month = monthNames[date[2]];
	var year = date[3];
	hour = hour % 12;
	hour = hour ? hour : 12;
	mins = mins < 10 ? '0' + mins : mins;
	secs = secs < 10 ? '0' + secs : secs;
	document.getElementById('time').innerHTML = hour + ':' + mins + ':' + secs + ' ' + ampm;
	document.getElementById('date').innerHTML = weekday + ', ' + month + ' ' + day + ', ' + year;
	var t = setTimeout(startTime, 500);
}

// Random quote function. Important: Make sure each quote has a corresponding "quoted".
function randomQuote() {
	var quotes = ["If you are depressed you are living in the past. If you are anxious you are living in the future. If you are at peace you are living in the present.", "Madness, as you know, is a lot like gravity, all it takes is a little push.", "The surest way to corrupt a youth is to instruct him to hold in higher esteem those who think alike than those who think differently.", "Life has many ways of testing a person's will, either by having nothing happen at all or by having everything happen all at once.", "There is no excellent beauty that hath not some strangeness in its proportions.", "Children are fantastic little creatures, because next to drunk people, they are the only truly honest people on earth.", "I begin with an idea, and then it becomes something else.", "Be who you are and say what you feel because those who mind don't matter and those who matter don't mind.", "You can make more friends in two months by becoming interested in other people than you can in two years by trying to get people interested in you.", "An essential aspect of creativity is not being afraid to fail.", "Antisocial behavior is a trait of intelligence in a world of conformists.", "What you do today can improve all your tomorrows.", "A creative man is motivated by the desire to achieve, not by the desire to beat others.", "Don't watch the clock; do what it does. Keep going.", "If you can dream it, you can do it.", "You can't build a reputation on what you're going to do."];

	var quoted = ["Lao Tzu", "Joker", "Friedrich Nietzsche", "Paulo Coelho", "Sir Francis Bacon", "Mads Nipper", "Pablo Picasso", "Dr. Seuss", "Dale Carnegie", "Edwin Land", "Nikola Tesla", "Ralph Marston", "Ayn Rand", "Sam Levenson", "Walt Disney", "Henry Ford"];
	var randNumQuotes = Math.floor((Math.random() * quotes.length));
	document.getElementById('quote').innerHTML = '&ldquo;' + quotes[randNumQuotes] + '&rdquo; &mdash; ' + '<small>' + quoted[randNumQuotes] + '</small>';
}

function randomBackground(time) { // daily, weekly, or every time
	var categories = ['buildings', /*'food',*/ 'nature', /*'people', 'technology',*/ 'objects'];
	var randomCategory = Math.floor((Math.random() * categories.length));
	var photo = new UnsplashPhoto();

	if (time == 'daily' || time == 'weekly')
		photo.all().randomize(time).fromCategory(categories[randomCategory]).fetch();
	else
		photo.all().fromCategory(categories[randomCategory]).fetch();

	document.body.style.backgroundImage = "url(" + photo.url + ")";
}

// Loop through the user's first 6 bookmark folders
function fetchBookmarks() {
	var count = 6;
	chrome.bookmarks.getTree(function (itemTree) {                // gets list of bookmarks
		itemTree.forEach(function (item) {                        // loops through them all
			item.children[0].children.forEach(function (child) { // filters to only bookmarks in the bookmarks bar
				if (child.children && count >= 1) {             // filters to folders on bookmarks bar and limits to 6
					console.log(child.title + ' ' + child.title.charAt(0).toLowerCase()); // get folder title and first letter
					child.children.forEach(function (bookmark) {
						var matches = bookmark.title.match(/\[(.*?)\]/); // fetch character between [] for keyboard shortcut
						if (matches)
							console.log(bookmark.title + ' ' + bookmark.url + ' ' + bookmark.title.match(matches[1]));
					});
					console.log('');
					count--;
				}
			});
		});
	});

	var left = document.createElement('div');
	left.className = 'left';
	document.getElementById('box').appendChild(left);
	var right = document.createElement('div');
	right.className = 'right';
	document.getElementById('box').appendChild(right);
}

// Initializes keyboard nav
function bindMousetraps() {
	// Loops through parent cells, opening those on request
	$.each($('.parent'), function (i, val) {
		Mousetrap.bind($(val).attr('data-key'), function (e) {
			$('a#' + $(val).attr('id')).toggleClass('active').next().slideToggle(150);

			// Binds key shortcuts for parent cell children when opened
			$.each($(val).parent().find('.tab'), function (i, val) {
				// Go to link URL
				Mousetrap.bind($(val).attr('data-key'), function (e) {
					window.location.href = $(val).attr('href');
				});

				// Go to link URL in new tab
				Mousetrap.bind($(val).attr('data-key').toUpperCase(), function (e) {
					window.open($(val).attr('href'), '_blank');
				});
			});

			// Resets key shortcuts when parent cell key pressed twice
			Mousetrap.bind($(val).attr('data-key'), function (e) {
				resetMousetraps();
			});
		});
	});

	// Resets on ESC
	Mousetrap.bind('esc', function () {
		resetMousetraps();
	});

	// Binds Weather link
	Mousetrap.bind('w', function () {
		window.location.href = document.getElementById('weatherlink');
	});

	// Binds secret GitHub links
	Mousetrap.bind('g', function () {
		window.location.href = 'https://github.com/lozinge/start';
	});
	Mousetrap.bind('shift+g', function () {
		window.location.href = 'https://github.com/lozinge';
	})
	Mousetrap.bind('alt+g', function () {
		window.location.href = 'https://github.com/lozinge/start/projects/2?fullscreen=true';
	});

	// Binds keyboard shortcut helper modal
	Mousetrap.bind('?', function () {
		openModal();
	});
}

// Keyboard shortcuts modal
function openModal() {
	if (document.getElementById('modal').style.display == '')
		document.getElementById('modal').style.display = 'block';
	else
		closeModal();
}
function closeModal() {
	document.getElementById('modal').style.display = '';
}

// Closes cells, rebinds keyboard shortcuts
function resetMousetraps() {
	$('.subMenu').slideUp(150);
	$('li a').removeClass('active');
	Mousetrap.reset();
	bindMousetraps();
	document.getElementById('modal').style.display = '';
}

// Gets weather for requested location, appends to page
function getWeather(location) {
	var API_key = 'd40dbddf287175e390554fddbbdbcbf1';
	var exclusions = 'flags,daily,minutely,alerts';
	var darkSkyURL = 'https://api.darksky.net/forecast/' + API_key + '/' + location + '?exclude=' + exclusions + '&units=si';

	function processWeather(weather) {
		var weatherIcon = '';
		if (weather.currently.icon == 'clear-day')
			weatherIcon = 'sun';
		else if (weather.currently.icon == 'clear-night')
			weatherIcon = 'moon';
		else if (weather.currently.icon == 'rain')
			weatherIcon = 'rain';
		else if (weather.currently.icon == 'snow')
			weatherIcon = 'snow';
		else if (weather.currently.icon == 'sleet')
			weatherIcon = 'sleet';
		else if (weather.currently.icon == 'wind')
			weatherIcon = 'wind';
		else if (weather.currently.icon == 'fog')
			weatherIcon = 'fog';
		else if (weather.currently.icon == 'cloudy')
			weatherIcon = 'cloud';
		else if (weather.currently.icon == 'partly-cloudy-day')
			weatherIcon = 'cloud sun';
		else if (weather.currently.icon == 'partly-cloudy-night')
			weatherIcon = 'cloud moon';

		if (weather.currently.icon == 'snow' || weather.currently.icon == 'sleet')
			participate('snow');
		else if (weather.currently.icon == 'rain')
			participate('rain');

		document.getElementById('weather').innerHTML = '<a id="weatherlink" href="https://darksky.net/forecast/' + location + '"><span class="climacon ' + weatherIcon + '"></span> ' + weather.currently.summary + ', ' + Math.round(weather.currently.temperature) + '&deg;</a>';
		document.getElementById('details').innerHTML = weather.hourly.summary.replace(',', ',<br/>');
	}

	$.ajax({
		url: darkSkyURL,
		dataType: "jsonp",
		success: function (data) {
			processWeather(data);
		}
	});
}

// Geolocates the user, otherwise defaulting to Pittsburgh
function geolocWeather() {
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(function (position) {
			getWeather(position.coords.latitude + ',' + position.coords.longitude);
		});

	} else { getWeather('40.4406, -79.9959'); }
}

// Loads options from Google Chrome
function getOptions() {
	chrome.storage.sync.get({
		categoryBuildings: 'category/buildings',
		categoryFood: 'category/food',
		categoryNature: 'category/nature',
		categoryPeople: 'category/people',
		categoryTechnology: 'category/technology',
		categoryObjects: 'category/objects',
		backgroundRefresh: 'daily',
	}, function (items) {
		console.log(items);
	});
}

// Generate snow/rain with canvas tag
// https://github.com/HermannBjorgvin/SnowJs
function participate(type) {
	var canvas = document.getElementById("snow");
	var ctx = canvas.getContext("2d");
	var flakeArray = [];
	canvas.style.pointerEvents = "none";
	canvas.style.position = "fixed";
	canvas.style.top = 0;
	canvas.style.left = 0;
	canvas.style.width = "100vw";
	canvas.style.height = "100vh";
	function canvasResize() {
		canvas.height = canvas.offsetHeight;
		canvas.width = canvas.offsetWidth;
	}
	canvasResize();
	window.onresize = function () {
		canvasResize();
	};
	var MyMath = Math;
	setInterval(function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		var random = MyMath.random();
		var distance = .05 + .95 * random;
		flake = {};
		flake.x = 1.5 * canvas.width * MyMath.random() - .5 * canvas.width;
		flake.y = -9;
		flake.velX = 2 * distance * (MyMath.random() / 2 + .5);
		flake.velY = (4 + 2 * MyMath.random()) * distance;
		flake.radius = MyMath.pow(5 * random, 2) / 5;
		flake.update = function () {
			var t = this;
			t.x += t.velX;
			t.y += t.velY;
			ctx.beginPath();
			ctx.arc(t.x, t.y, t.radius, 0, 2 * MyMath.PI, !1);
			if (type == 'snow')
				ctx.fillStyle = "#FFF";
			else if (type == 'rain')
				ctx.fillStyle = "#00F";
			ctx.fill()
		};
		flakeArray.push(flake);
		for (b = 0; b < flakeArray.length; b++) {
			flakeArray[b].y > canvas.height ? flakeArray.splice(b, 1) : flakeArray[b].update()
		}
	}, 16);
}

// Initializes everything on page load
$(function () {
	startTime();
	randomQuote();
	randomBackground();
	bindMousetraps();
	geolocWeather();

	// In development
	// fetchBookmarks();
	// getOptions();

	// Binds click events for opening tabs and background click to close
	$('li a.parent').click(function () {
		$(this).parent('li').find('ul').slideToggle(150);
		$(this).toggleClass('active');
	});

	// Binds click events to close cells and keyboard modal
	document.getElementById('background').addEventListener('click', resetMousetraps, false);
	document.getElementById('modal').addEventListener('click', closeModal, false);
});
