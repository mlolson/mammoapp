//Returns true of element has class, otherwise false
function hasClass(element, className) {
	return (element.className).indexOf(className) > -1;
}
//Adds class to element if it doesn't exist
function addClass(element, className) {
	if (hasClass(element, className)) {
		return;
	}
	element.className += (element.className ? ' ' : '') + className;
}
//Removes class from element if it exists.
function removeClass(element, className) {
	if (!hasClass(element, className)) {
		return;
	}
	element.className -= (element.className ? ' ' : '') + className;
}
