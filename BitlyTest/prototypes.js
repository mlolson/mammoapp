function Bitly(fishname, fishtype) {
	this.fishname = fishname;
	this.fishtype = fishtype;
	this.isfish1 = (fishname == "eric");
}
///Not sure if this is what you are looking for? Seems too simple..
Bitly.prototype.swim = function() {
	var s = "Yay!, " + this.fishname + " " + this.fishtype + " can swim!";
	if (this.isfish1) {
		s += " It is wonderful to see you again!";
	}
	return s;
};
