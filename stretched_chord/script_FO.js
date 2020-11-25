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
	datasplit = 0.8; // suggested by Nadieh in email May 2020 to address strange drawing issue

	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["PINK SALMON","CHUM SALMON","SOCKEYE SALMON","CHINOOK SALMON","EULACHON","WALLEYE POLLOCK","THREESPINE STICKLEBACK","PRICKLEBACKS","SNAKE PRICKLEBACK","PACIFIC SAND LANCE","KELP GREENLING","LINGCOD","PACIFIC LAMPREY (freshwater)","PACIFIC HERRING","","Amphipod","Barnacle","Calanoid","Cladoceran","Ctenophore","decapod","eggs","euphasiid","fish","insects","isopod","ostracod","polychaete","Sagittoid","trematode","tunicates","Unknown","cumacean","Miscellaneous","mollusc","mysiid","Nematode","cestoda","Pycnogonida","phytoplankton",""]
//var Names = ["PINK SALMON","CHUM SALMON","SOCKEYE SALMON","CHINOOK SALMON","EULACHON","WALLEYE POLLOCK","THREESPINE STICKLEBACK","PRICKLEBACKS","SNAKE PRICKLEBACK","PACIFIC SAND LANCE","KELP GREENLING","LINGCOD","PACIFIC LAMPREY (freshwater)","PACIFIC HERRING","","Amphipod","Barnacle","Calanoid","Cladoceran","Ctenophore","decapod","eggs","euphasiid","fish","insects","isopod","ostracod","polychaete","Sagittoid","trematode","tunicates","Unknown","cumacean","Miscellaneous","mollusc","mysiid","Nematode","cestoda","Pycnogonida",""]
//var Colors1 = ["Blue","Gray","Pink","Orange","Red","Green","Purple","Black","Blue","Gray","Pink","Orange","Red","Green","Purple","","Amphipod","Barnacle","Calanoid","Cladoceran","Ctenophore","decapod","eggs","euphasiid","fish","insects","isopod","ostracod","polychaete","Sagittoid","trematode","tunicates","Unknown","cumacean","Miscellaneous","mollusc","mysiid","Nematode","cestoda","Pycnogonida",""]; //separate prey / pred and end list with ""
var Colors1 = ["Blue","Gray","Pink","Orange","Red","Green","Purple","Black","Blue","Gray","Pink","Orange","Red","Green","Purple"];


var respondents = 2100, //Total number of respondents (i.e. the number that makes up the total group) / determined rotation!
	emptyPerc = 0.5, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 
var matrix = [

    // actual values in FO %
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32.95,4.92,79.92,1.89,1.14,16.29,4.55,5.68,18.94,48.86,0.38,4.17,2.65,7.95,0.38,6.06,0.38,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43.81,3.49,27.62,9.21,7.3,15.56,4.44,5.71,32.06,86.03,0.32,7.62,1.27,5.71,1.27,14.6,0,1.59,0.63,0.95,0.32,0.32,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,54.9,2.94,8.33,6.37,0,21.57,0.49,11.76,49.51,71.57,1.47,13.73,2.94,8.33,0,17.16,1.47,0,1.96,4.41,0,0.49,2.45,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19.75,0,1.23,1.23,0,33.33,0,8.64,69.14,96.3,1.23,0,0,0,0,1.23,0,0,2.47,2.47,0,1.23,0,1.23,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.9,6.31,10.81,9.91,0,1.8,6.31,0,0,0,0,0,0,0,8.11,0.9,0,0,1.8,0,0.9,0.9,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,62.46,0.35,0,0,20.7,0,0,0,0,0,0,0,0.35,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38.6,2.63,34.21,4.39,0,10.53,2.63,7.02,15.79,21.05,0,5.26,3.51,2.63,1.75,17.54,0,0.88,0,7.89,0,2.63,0.88,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,148.61,0,0,0,34.72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,67.47,0,0,0,18.07,0,0,0,0,0,0,0,7.23,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.27,1.48,65.61,3.8,0,1.9,20.89,0.84,6.33,0,0.21,1.48,1.9,0,5.7,4.85,0,0,0.84,0,0.63,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20.86,0.72,126.62,2.88,0,3.6,2.88,2.16,8.63,0,1.44,2.88,0,0,0.72,7.19,0,0,0,0,0,2.16,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.79,0,142.86,0,0,1.19,18.45,1.79,3.57,0,0,0,0,0,1.79,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.54,0,1.03,10.26,0,0,13.33,0,0,0,0,1.54,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17.06,6.42,8.81,28.07,0,19.45,6.79,6.24,19.82,1.28,0.55,11.56,5.32,0.18,8.62,6.61,0,0.18,1.28,8.99,0.55,0.18,0.37,0,1.65,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
	[32.95,43.81,54.9,19.75,0.9,0,38.6,0,0,1.27,20.86,1.79,1.54,17.06,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[4.92,3.49,2.94,0,6.31,0,2.63,0,0,1.48,0.72,0,0,6.42,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[79.92,27.62,8.33,1.23,10.81,62.46,34.21,148.61,67.47,65.61,126.62,142.86,1.03,8.81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1.89,9.21,6.37,1.23,9.91,0.35,4.39,0,0,3.8,2.88,0,10.26,28.07,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1.14,7.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[16.29,15.56,21.57,33.33,1.8,0,10.53,0,0,1.9,3.6,1.19,0,19.45,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[4.55,4.44,0.49,0,6.31,20.7,2.63,34.72,18.07,20.89,2.88,18.45,13.33,6.79,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[5.68,5.71,11.76,8.64,0,0,7.02,0,0,0.84,2.16,1.79,0,6.24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[18.94,32.06,49.51,69.14,0,0,15.79,0,0,6.33,8.63,3.57,0,19.82,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[48.86,86.03,71.57,96.3,0,0,21.05,0,0,0,0,0,0,1.28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.38,0.32,1.47,1.23,0,0,0,0,0,0.21,1.44,0,0,0.55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[4.17,7.62,13.73,0,0,0,5.26,0,0,1.48,2.88,0,1.54,11.56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[2.65,1.27,2.94,0,0,0,3.51,0,0,1.9,0,0,0,5.32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[7.95,5.71,8.33,0,0,0,2.63,0,0,0,0,0,0,0.18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.38,1.27,0,0,8.11,0.35,1.75,0,7.23,5.7,0.72,1.79,0,8.62,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[6.06,14.6,17.16,1.23,0.9,0,17.54,0,0,4.85,7.19,0,0,6.61,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.38,0,1.47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1.59,0,0,0,0,0.88,0,0,0,0,0,0,0.18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.63,1.96,2.47,1.8,0,0,0,0,0.84,0,0,0,1.28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.95,4.41,2.47,0,0,7.89,0,0,0,0,0,0,8.99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.32,0,0,0.9,0,0,0,0,0.63,0,0,0,0.55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.32,0.49,1.23,0.9,0,2.63,0,0,0,2.16,0,0,0.18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,2.45,0,0,0,0.88,0,0,0,0,0,0,0.37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,1.23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1.65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]


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
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > datasplit * Math.PI ? -1 : 1);
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
