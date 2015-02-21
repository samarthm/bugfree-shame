document.write("We are the Donut Mafia.");

function loadScript(url, callback)
{
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	
	script.onreadystatechange = callback;
	script.onload = callback;
	
	head.appendChild(script);
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

loadScript("https://parse.com/downloads/javascript/parse-1.3.5.js", function() {
	console.log("Loaded.");
	Parse.initialize("VvDd6NlfRFl1OabXJuCUOSc3wXWPCyKPIeOB2Q3G", "mF1dRsUvFuesztncj6vre4FGgaxvuGogLPLcYudb");
	var TestObject = Parse.Object.extend("TestObject");
	var testObject = new TestObject();
	
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "http://api.ipify.org?format=json", false );
	xmlHttp.send( null );
	testObject.save({
		ip: xmlHttp.responseText
	}).then(function(object) {
		console.log("Saved.");
	});
});
