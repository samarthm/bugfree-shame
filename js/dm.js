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

loadScript("https://parse.com/downloads/javascript/parse-1.3.5.js", function() {
	console.log("loaded.");
});
