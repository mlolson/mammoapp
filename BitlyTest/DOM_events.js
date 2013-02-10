var roster = [ {
	first_name : "Bit",
	last_name : "Lee",
	website : "http://bitly.com"
}, {
	first_name : "Face",
	last_name : "Book",
	website : "http://facebook.com"
}, {
	first_name : "Ama",
	last_name : "Zon",
	website : "http://amazon.com"
}, {
	first_name : "Twit",
	last_name : "Ter",
	website : "http://twitter.com"
} ];

document.onclick = function(e) {
	e = e || window.event;
	var element = e.target || e.srcElement;

	if (element.tagName == 'A') {

		for ( var i = 0; i < roster.length; i++) {
			if (element.href == roster[i].website + "/") {
				alert(roster[i].first_name + " " + roster[i].last_name);
			}
		}
	}
	return false;
};