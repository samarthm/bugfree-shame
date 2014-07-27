Metro.Tile = function(_Name, _Icon, _Live, _Color) {
	this.Name = _Name;
	this.Icon = _Icon;
	this.Live = _Live;
	this.Color = _Color;
};

Metro.TileGroup = function(_Name, _Tiles) {
	this.Name = _Name;
	this.Tiles = _Tiles;
}

Metro.GetElements = function() {
	Metro.Elements = {};
	
	Metro.Elements.Wrapper = document.getElementById("wrapper");
	Metro.Elements.TileTable = document.getElementById("tiles");
	Metro.Elements.TileTableRow = document.getElementById("tilesRow");
};

Metro.OverrideRightClick = function() {
	if (document.addEventListener) {
		document.addEventListener("contextmenu", function(e) {
			e.preventDefault();
		}, false);
	} else {
		document.attachEvent("oncontextmenu", function() {
			window.event.returnValue = false;
		});
	}
};

Metro.OpenApp = function(Name) {
	$("#app-content").html("");
	$.ajax({
		url: "subpages/" + Name + ".html",
		dataType: "html",
		data: {},
		type: "GET",
		success: function(content) {
			$("#app-content").html(content);
			$("#mask2").fadeIn("fast");
			$("#wrapper").addClass("moved");
			setTimeout(function() {
				$("#app-page").addClass("opened");
				setTimeout(function() {
					$("#app-page").removeClass("closed");
				}, 300);
			}, 600);
		},
	});
};

Metro.CloseApp = function() {
	$("#app-content").html("");
	$("#app-page").addClass("closed");
	setTimeout(function() {
		$("#app-page").removeClass("opened");
		setTimeout(function() {
			$("#wrapper").removeClass("moved");
			$("#mask2").fadeIn("fast");
		}, 600);
	}, 300);
};

Metro.LoadTiles = function(callback) {
	Metro.Tiles = [];
	
	$.ajax({
		url: "data/tiles.json",
		type: "GET",
		success: function(content) {
			for(var i=0;i<content.length;i++) {
				var tile = new Metro.Tile();
				for(asdf in content[i]) {
					tile[asdf] = content[i][asdf];
				}
				Metro.Tiles.push(tile);
			}
			callback();
		},
		error: function() {
			console.log("SHIT SOMETHING FUCKED UP");
		},
	});
};

Metro.LoadTileGroups = function(callback) {
	Metro.TileGroups = [];
	
	$.ajax({
		url: "data/tile-groups.json",
		type: "GET",
		success: function(content) {
			for(var i=0;i<content.length;i++) {
				var tile = new Metro.TileGroup();
				for(asdf in content[i]) {
					tile[asdf] = content[i][asdf];
				}
				Metro.TileGroups.push(tile);
			}
			callback();
		},
		error: function() {
			console.log("SHIT SOMETHING FUCKED UP");
		}
	});
};

Metro.DisplayTiles = function(callback) {
	var tileN = 0;
	for(var i=0;i<Metro.TileGroups.length;i++) {
		var tile = Metro.TileGroups[i];
		var group = document.createElement("td");
		
		var table = document.createElement("table");
		var trheader = document.createElement("tr");
		var tdheader = document.createElement("th");
		tdheader.innerHTML = tile.Name;
		trheader.appendChild(tdheader);
		tdheader.style.paddingBottom = "20px";
		table.appendChild(trheader);
		
		var totalRows = 3;
		var rowCounter = 0;
		var rows = [];
		for(var j=0;j<totalRows;j++) {
			rows.push(document.createElement("tr"));
		}
		for(var j=0;j<tile.Tiles.length;j++) {
			var t = Metro.Tiles[tile.Tiles[j]];
			var el = document.createElement("td");
			var a = document.createElement("a");
			a.setAttribute("target", "_blank");
			a.setAttribute("href", "javascript:Metro.OpenApp($(this).attr(\"title\"));");
			a.className = "tileLink";
			var tileElement = document.createElement("div");
			var div = document.createElement("div");
			var label = document.createElement("span");
			tileElement.className = "tile";
			tileElement.id = "tile"+tileN;
			el.className = "tileTD";
			el.setAttribute("title", t.Name);
			div.className = "tileDiv";
			div.style.backgroundColor = t.Color;
			if (t.Icon.length>0) div.style.backgroundImage = "url(images/icons/"+t.Icon+")";
			if (t.Link.length>0) a.setAttribute("href", t.Link);
			div.style.backgroundSize = "cover";
			label.className = "label";
			label.innerHTML = t.Name;
			div.appendChild(label);
			tileElement.appendChild(div);
			a.appendChild(tileElement);
			el.appendChild(a);
			rows[rowCounter%rows.length].appendChild(el);
			rowCounter += 1;
			tileN += 1;
		}
		for(var j=0;j<totalRows;j++) {
			table.appendChild(rows[j]);
		}
		
		group.appendChild(table);
		
		Metro.Elements.TileTableRow.appendChild(group);
	}
	Metro.TotalTiles = tileN;
	callback();
};

Metro.InitializeMetro = function(callback) {
	Metro.GetElements();
	Metro.OverrideRightClick();
	
	Metro.Theme = {};
	Metro.Theme.Current = {};
	
	Metro.Theme.Current.ImageID = Math.floor(Math.random()*16);
	Metro.Theme.Current.Background = "#000000";
	Metro.Theme.Current.Foreground = "#0066CC";
	
	Metro.Elements.Wrapper.style.backgroundImage = "url('images/background/" + Metro.Theme.Current.ImageID + ".jpg')";
	Metro.Elements.Wrapper.style.backgroundPosition = "center";
	Metro.Elements.Wrapper.style.backgroundSize = "cover";
	
	Metro.LoadTiles(function() {
		Metro.LoadTileGroups(function() {
			Metro.DisplayTiles(callback);
		});
	});
};

Metro.FadeInFromBlack = function() {
	$("#mask").fadeOut(1250, "swing", null);
};

Metro.ShowTiles = function() {
	for(var i=0;i<Metro.TotalTiles;i++) {
		$("#tile"+i).animate({
			left: "30px",
			opacity: 1
		}, 100 + i*100, "swing");
	}
};

Metro.InitializeMetro(function() {
	console.log("Done initializing.");
	$(document).ready(function() {
		$("#close-btn").click(function() {
			Metro.CloseApp();
		});
		Metro.FadeInFromBlack();
		Metro.ShowTiles();
		console.dir(Metro);
	});
});