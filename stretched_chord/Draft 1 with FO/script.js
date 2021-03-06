////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////
var screenWidth = $(window).width(),
	mobileScreen = (screenWidth > 400 ? false : true);

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.96,
	pullOutSize = (mobileScreen? 40 : 50),
	opacityDefault = 0.7, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over
	textoffset = 10; 
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["Sockeye","Chum","Pink","Coho","Chinook","Pacifc Herring","Eulachon","","Amphipods","Barnacles","Calanoids","Chaetognaths","Cladocerans","Ctenophores","Decapods","Eggs","Euphausiids","Fish","Insects","Larvaceans","Molluscs","Ostracods","Phytoplankton","Polychaetes","Other",""]; //separate prey / pred and end list with ""
var Colors1 = ["Blue","Gray","Pink","Orange","Red","Green","Purple","","Amphipods","Barnacles","Calanoids","Chaetognaths","Cladocerans","Ctenophores","Decapods","Eggs","Euphausiids","Fish","Insects","Larvaceans","Molluscs","Ostracods","Phytoplankton","Polychaetes","Other",""]; //separate prey / pred and end list with ""


var respondents = 1400, //Total number of respondents (i.e. the number that makes up the total group)
	emptyPerc = 0.5, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 
var matrix = [

    // actual values in FO %
	[0,0,0,0,0,0,0,0,37,3,64,7,6,0,19,1,12,36,38,17,4,14,0,3,2,0],
	[0,0,0,0,0,0,0,0,34,4,65,6,8,8,13,5,6,23,48,14,1,7,1,1,2,0],
	[0,0,0,0,0,0,0,0,27,5,81,8,2,1,12,4,6,13,27,5,0,4,0,2,0,0],
	[0,0,0,0,0,0,0,0,32,2,22,3,3,0,32,3,22,58,32,0,2,2,0,2,3,0],
	[0,0,0,0,0,0,0,0,14,0,27,0,1,0,25,1,9,51,48,1,3,0,0,0,3,0],
	[0,0,0,0,0,0,0,0,14,7,70,0,27,0,14,7,6,14,1,7,9,11,2,4,2,0],
	[0,0,0,0,0,0,0,0,1,6,73,0,13,0,2,6,0,1,0,1,1,2,6,2,2,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
	[37,34,27,32,14,14,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[3,4,5,2,0,7,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[64,65,81,22,27,70,73,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[7,6,8,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[6,8,2,3,1,27,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[19,13,12,32,25,14,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,5,4,3,1,7,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[12,6,6,22,9,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[36,23,13,58,51,14,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[38,48,27,32,48,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[17,14,5,0,1,7,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[4,1,0,2,3,9,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[14,7,4,2,0,11,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,0,0,0,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[3,1,2,2,0,4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[2,2,0,3,3,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    // only one direction
	// [0,0,0,0,0,0,0,0,37,3,64,7,6,0,19,1,12,36,38,17,4,14,0,3,2,0],
	// [0,0,0,0,0,0,0,0,34,4,65,6,8,8,13,5,6,23,48,14,1,7,1,1,2,0],
	// [0,0,0,0,0,0,0,0,27,5,81,8,2,1,12,4,6,13,27,5,0,4,0,2,0,0],
	// [0,0,0,0,0,0,0,0,32,2,22,3,3,0,32,3,22,58,32,0,2,2,0,2,3,0],
	// [0,0,0,0,0,0,0,0,14,0,27,0,1,0,25,1,9,51,48,1,3,0,0,0,3,0],
	// [0,0,0,0,0,0,0,0,14,7,70,0,27,0,14,7,6,14,1,7,9,11,2,4,2,0],
	// [0,0,0,0,0,0,0,0,1,6,73,0,13,0,2,6,0,1,0,1,1,2,6,2,2,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	
	//[0,0,0,0,0,0,0,0,14,1,24,3,2,0,7,0,5,14,14,6,2,5,0,1,1,0],
	//[0,0,0,0,0,0,0,0,14,2,26,2,3,3,5,2,2,9,20,6,0,3,0,0,1,0],
	//[0,0,0,0,0,0,0,0,14,3,41,4,1,1,6,2,3,7,14,3,0,2,0,1,0,0],
	//[0,0,0,0,0,0,0,0,15,1,10,1,1,0,15,1,10,27,15,0,1,1,0,1,1,0],
	//[0,0,0,0,0,0,0,0,8,0,15,0,1,0,14,1,5,28,26,1,2,0,0,0,2,0],
	//[0,0,0,0,0,0,0,0,7,4,36,0,14,0,7,4,3,7,1,4,5,6,1,2,1,0],
	//[0,0,0,0,0,0,0,0,1,5,63,0,11,0,2,5,0,1,0,1,1,2,5,2,2,0],
	//[0,0,0,0,0,0,0,0,11,2,31,2,6,1,7,2,3,10,11,4,2,4,0,1,1,0],
	//[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
	//[23,21,17,20,9,9,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[11,15,19,7,0,26,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[16,16,20,5,7,17,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[29,25,33,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[10,13,3,5,2,45,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[0,89,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[16,11,10,27,21,12,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[4,19,15,11,4,26,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[20,10,10,36,15,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[18,12,7,30,26,7,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[20,25,14,16,25,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[38,31,11,0,2,16,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[20,5,0,10,15,45,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[35,18,10,5,0,28,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[0,11,0,0,0,22,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[21,7,14,14,0,29,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	//[14,14,0,21,21,14,14,emptyStroke,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    // [0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0],
	// [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,0],
	// [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0],
	// [0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0],
	// [0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0,0,1,0],
	// [0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0],
	// [0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,1,0,1,0,1,1,1,1,1,1,0],
	// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
	// [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// [1,1,0,1,1,1,1,emptyStroke,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

];
//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically
var offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

//Custom sort function of the chords to keep them in the original order
function customSort(a,b) {
	return 1;
};

//Custom sort function of the chords to keep them in the original order
var chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
	.padding(.02)
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);
	
var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
	.endAngle(endAngle);

var path = stretchedChord()
	.radius(innerRadius)
	.startAngle(startAngle)
	.endAngle(endAngle)
	.pullOutSize(pullOutSize);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("fill", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	.attr("transform", function(d, i) { //Pull the two slices apart
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
				return "translate(" + d.pullOutSize + ',' + 0 + ")";
	});


////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + textoffset + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
  .text(function(d,i) { return Names[i]; });

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
var chords = wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	//.style("fill", "#C4C4C4")
	.style("fill", function(d){ return(Colors1[d.source.index]) })
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path);	

////////////////////////////////////////////////////////////
///////////////////////// Tooltip //////////////////////////
////////////////////////////////////////////////////////////

//Arcs
g.append("title")	
	.text(function(d, i) {return Math.round(d.value) + " FO in " + Names[i];});
	
//Chords
chords.append("title")
	.text(function(d) {
		return [Math.round(d.source.value), " from ", Names[d.target.index], " to ", Names[d.source.index]].join(""); 
	});
	
////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	svg.selectAll("path.chord")
		.filter(function(d) { return d.source.index !== i && d.target.index !== i && Names[d.source.index] !== ""; })
		.transition("fadeOnArc")
		.style("opacity", opacity);
  };
}//fade
