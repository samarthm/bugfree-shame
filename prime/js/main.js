/**
  * (c) 2014 by Michael Zhang
  */

var globalData = null;

var px = 2, py = 2;
var ex = 1, ey = 0, ed = 1;
var eating = false;

var score = 0, displayScore = 0;
var level = 1, nextLevel = 6;
var percent = 0, displayPercent = 0;

var rektStatus = "rekt";

var uplevel = 0;

var frames = 0;

var lose = false;
var positioned = false;
var paused = false;

var loop = function() {
	if (!lose) {
		if (!paused) frames += 1;
		if (!positioned) positionBoard();
		
		if (globalData == null) {
			generateData();
		}
		
		var tableString = generateTableString(); $("#board").html(tableString);
		adjustPlayerSize();
	
		if (!paused) updateScoreboard(score, level);
		if (uplevel > 0) uplevel -= 1;
		if (!paused) recalcScore();
		
		if (!paused) processEating();
		if (!paused) moveEnemy();
	} else {
		// gg
	}
};

var doLose = function() {
	clearInterval(interval);
	$("#board-overlay").fadeIn("slow");
	saveScore(prompt("Enter your name", "your princess is in another castle").replace(",","").replace("|",""), score, level);
	lose = true;
};

var boardHasNoPrimes = function() {
	// need to refresh prime list
	var count = 0;
	for (var i=0; i<25; i++) {
		if (valid(globalData[i])) {
			count += 1;
		}
	}
	return count < 3;
};

var updateMeter = function() {	
	$("#meterFill").width(percent+"%");
	$("#meterFill").css("background-color", uplevel>0?"#FFF":"#3A3");
};

var recalcScore = function() {
	
	if (percent > 100) {
		percent = 0;
		level += 1;
		uplevel = 5;
	}
	if (percent < 0) {
		percent = 0;
	}
	
	nextLevel = 3 * level * (level + 1);
	percent = score * 100 / nextLevel;
	updateMeter();
	
	if (displayPercent != percent) {
		if (Math.abs(displayPercent - percent) < 2) {
			displayPercent = percent;
		} else {
			displayPercent = (displayPercent + percent) / 2;
		}
	}
	
	$("#score").html(score);
	$("#level").html("Level "+level);
};

var moveEnemy = function() {
	if (px == ex && py == ey) {
		doLose();
	}
	if (level < 7) {
		if (frames % 50 == 0) {
			if (ed == 0) {
				if (ey > 0) {
					ey -= 1;
				} else {
					ex += 1;
					ed = 1;
				}
			} else if (ed == 1) {
				if (ex < 4) {
					ex += 1;
				} else {
					ey += 1;
					ed = 2;
				}
			} else if (ed == 2) {
				if (ey < 4) {
					ey += 1;
				} else {
					ex -= 1;
					ed = 3;
				}
			} else if (ed == 3) {
				if (ex > 0) {
					ex -= 1;
				} else {
					ey -= 1;
					ed = 0;
				}
			}
		}
	} else {
		var delay = Math.floor((Math.floor(-1
				* (Math.log(level) / (Math.log(15) - Math.log(14)))
				+ 65.5)));
		if (frames % delay == 0) {
			if (px == ex && py != ey) {
				if (py < ey)
					ey -= 1;
				else if (py > ey)
					ey += 1;
			} else if (py == ey && px != ex) {
				if (px < ex)
					ex -= 1;
				else if (px > ex)
					ex += 1;
			} else {
				var area1 = 0, area2 = 0;
				if (px < ex) {
					if (py > ey) {
						area1 = (ex) * (5 - ey); // UP;
						area2 = (ex + 1) * (4 - ey); // RIGHT;
					} else if (py < ey) {
						area1 = (ex) * (ey + 1); // UP;
						area2 = (ex + 1) * (ey); // LEFT;
					}
				} else if (px > ex) {
					if (py > ey) {
						area1 = (4 - ex) * (5 - ey); // DOWN;
						area2 = (5 - ex) * (4 - ey); // RIGHT;
					} else if (py < ey) {
						area1 = (4 - ex) * (ey + 1); // DOWN;
						area2 = (5 - ey) * (ey); // LEFT;
					}
				}

				if (area1 > area2) { // VERTICAL
					if (px < ex)
						ex -= 1;
					else if (px > ex)
						ex += 1;
				} else if (area2 > area1) { // HORIZONTAL
					if (py < ey)
						ey -= 1;
					else if (py > ey)
						ey += 1;
				} else if (area1 == area2) { // RANDOM
					if (Math.floor(Math.random() * 2) == 1) {
						if (px < ex)
							ex -= 1;
						else if (px > ex)
							ex += 1;
					} else {
						if (py < ey)
							ey -= 1;
						else if (py > ey)
							ey += 1;
					}
				}
			}
		}
	}
};

var processEating = function() {
	if (eating) {
		if (valid(globalData[py*5+px])) {
			score += level;
			globalData[py*5+px] += Math.ceil(Math.random()*level + level) + 1;
			if (boardHasNoPrimes()) {
				regenerateData();
			}
		} else {
			score -= level / 2;
		}
		eating = false;
	}
};

var adjustPlayerSize = function() {
	$("#player").width($("#player").height()+"px");
	$("#enemy").width($("#enemy").height()+"px");
};

var generateTableString = function() {
	var string = "";
	
	string += "<table>";
	for (var i=0; i<5; i++) {
		string += "<tr>";
		for (var j=0; j<5; j++) {
			string += "<td class='a'>";
			if (!paused) {
				if (j == px && i == py) {
					string += "<span id='player' class='circle'>"+globalData[i*5+j]+"</span>";
				} else if (j == ex && i == ey) {
					string += "<span id='enemy' class='circle'>"+globalData[i*5+j]+"</span>";
				} else {
					string += "<span id='normal' class='circle'>"+globalData[i*5+j]+"</span>";
				}
			} else {
				string += "<span class='circle'></span>";
			}
			string += "</td>";
		}
		string += "</tr>";
	}
	string += "</table>";
	
	return string;
};

var generateData = function() {
	globalData = new Array(25);
	for (var i=0; i<25; i++) {
		globalData[i] = Math.floor(Math.random() * 20) + 1;
	}
	shuffle(globalData);
};

var regenerateData = function() {
	for (var i=0; i<25; i++) {
		globalData[i] += Math.floor(Math.random() * level) + level;
	}
	shuffle(globalData);
	if (boardHasNoPrimes()) {
		regenerateData();
	}
};

var positionBoard = function() {
	var boardSize = window.innerHeight * 0.8;
	var centerY = window.innerHeight / 2;
	var centerX = window.innerWidth / 2;
	
	$("#board-overlay").css("height", boardSize + "px");
	$("#board-overlay").css("width", boardSize + "px");
	$("#board-overlay").css("top", centerY - boardSize/2 + "px");
	$("#board-overlay").css("left", centerX - boardSize/2 + "px");
	
	$("#board").css("height", boardSize + "px");
	$("#board").css("width", boardSize + "px");
	$("#board").css("top", centerY - boardSize/2 + "px");
	$("#board").css("left", centerX - boardSize/2 + "px");
	
	var sidebarSize = centerX - boardSize / 2 - 40;
	$("#stats, #scores").css("height", boardSize + "px");
	$("#stats, #scores").css("width", sidebarSize + "px");
	$("#stats, #scores").css("top", centerY - boardSize/2 + "px");
	$("#scores").css("left", 20 + "px");
	$("#stats").css("right", 20 + "px");
	
	updateScoreboard (score, level);
	
	positioned = true;
};

$(document).keyup(function(e) {
	if (!paused) {
		switch (e.keyCode) {
			case 38:
				if (py > 0) py -= 1;
				break;
			case 39:
				if (px < 4) px += 1;
				break;
			case 40:
				if (py < 4) py += 1;
				break;
			case 37:
				if (px > 0) px -= 1;
				break;
			case 32:
				eating = true;
				break;
		}
	}
	switch (e.keyCode) {
		case 27:
			paused = !paused;
			if (paused) {
				$("#pause-overlay").fadeIn("fast");
			} else {
				$("#pause-overlay").fadeOut("slow");
			}
			break;
	}
});

var interval = setInterval(loop, 40);