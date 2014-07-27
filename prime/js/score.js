// utility classes from w3schools

var setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// score object

var Score = function (name, score, level) {
	this.name = name;
	this.score = score;
	this.level = level;
};

var You = new Score("You", 0, 1);

// debug
// var God = new Score("God", 5000000, 1000);

var scores = new Array();
scores.push(You);
// scores.push(God);

var otherScores = getCookie("scores").trim().split(",");
for (var i=0;i<otherScores.length;i++) {
	if (otherScores[i].trim().length > 0) {
		var part = otherScores[i].split("|");
		scores.push(new Score(part[0], part[1], part[2]));
	}
}

var updateScoreboard = function(score, level) {
	sortScoreboard();
	
	You.score = score;
	You.level = level;
	
	// debug
	// console.dir(scores);
	
	var display = generateDisplay();
	for(var i=0;i<display.length;i++) {
		var className = "score-fill";
		if (i==0) className += " first";
		if (scores[display[i]].name=="You") className += " you";
		$("#score-"+[i]).html("<div class='"+className+"'><span class='name'><span class='place'>#"+(display[i]+1)+"</span> "+scores[display[i]].name+"</span>"+scores[display[i]].score+" (level "+scores[display[i]].level+")</div>");
	}
};

var saveScore = function(name, score, level) {
	var value = getCookie("scores")+","+name+"|"+score+"|"+level;
	setCookie("scores", value, 365);
};

var generateDisplay = function() {
	var result = new Array();
	// result.push(God);
	if (scores.length <= 5) {
		for(var i=0;i<scores.length;i++) {
			result.push(i);
			// console.dir(result);
		}
	} else {
		result.push(0);
		if (scores.indexOf(You) < 5) {
			for(var i=1;i<5;i++) {
				result.push(i);
			}
		} else {
			var y = scores.indexOf(You);
			for(var i=y-3; i<=y; i++) {
				result.push(i);
			}
		}
	}
	return result;
};

var sortScoreboard = function() {
	// bubble sort
	var swapped;
	do {
		swapped = false;
		for (var i=0;i<scores.length-1;i++) {
			if (scores[i].score < scores[i+1].score) {
                var temp = scores[i];
                scores[i] = scores[i+1];
                scores[i+1] = temp;
                swapped = true;
            }
		}
	} while (swapped);
};