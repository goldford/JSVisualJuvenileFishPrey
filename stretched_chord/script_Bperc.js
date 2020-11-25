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
	pullOutSize = (mobileScreen? 40 : 20), // default 40: 50
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


var respondents = 1500, //Total number of respondents (i.e. the number that makes up the total group)
	emptyPerc = 0.7, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 
var matrix = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3.92,0.15,6.85,0.01,0.01,2.62,0.22,0.63,76.14,2.25,0,0.06,0.23,0.09,0,6.82,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.01,0.61,19.18,2.45,0.64,1.33,0.36,0.63,49.83,6.25,0.01,0.07,1.07,0.15,0,13.17,0,0.03,0.01,0.01,2.16,0.02,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.1,0.02,52.3,0.52,0,0.66,0,1.83,30.3,5.79,0.02,0.17,0.3,3.17,0,2.8,0,0,0.01,0,0,0,0.01,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.19,0,6.29,0,0,1.11,0,0.75,88.99,2.34,0,0,0,0,0,0.25,0,0,0.01,0.06,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.33,0.03,87.96,0.6,0,2.55,3.51,0,0,0,0,0,0,0,0.53,1.33,0,0,0.73,0,0.33,1.11,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,63.01,0.01,0,0,36.97,0,0,0,0,0,0,0,0.01,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.88,0.01,66.65,0.01,0,0.64,0.08,1.98,1.53,2.23,0,0.01,0.31,1.66,0,18.32,0,0.05,0,0,0,0.32,0.32,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,70.31,0,0,0,29.69,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,81.86,0,0,0,17.93,0,0,0,0,0,0,0,0.2,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.04,0.01,47.32,1.45,0,0.51,14.12,0.14,10.07,0,0,0.02,1.58,0,0.04,24.63,0,0,0.04,0,0.03,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.04,0,76.1,0.73,0,0.4,2.19,0.47,5.41,0,1.17,0.65,0,0,0,8.22,0,0,0,0,0,2.61,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.09,0,76.13,0,0,0.12,10.01,0.26,13.37,0,0,0,0,0,0.01,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.2,0,87.99,1.82,0,0,8.87,0,0,0,0,0.12,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.17,0.04,68.82,1.18,0,3.51,9.77,5.88,6.22,0.05,0,0.09,0.16,0,0.02,2.04,0,0.01,0,0,0.01,0.02,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
	[3.92,2.01,2.1,0.19,1.33,0,5.88,0,0,0.04,2.04,0.09,1.2,2.17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.15,0.61,0.02,0,0.03,0,0.01,0,0,0.01,0,0,0,0.04,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[6.85,19.18,52.3,6.29,87.96,63.01,66.65,70.31,81.86,47.32,76.1,76.13,87.99,68.82,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.01,2.45,0.52,0,0.6,0.01,0.01,0,0,1.45,0.73,0,1.82,1.18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.01,0.64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[2.62,1.33,0.66,1.11,2.55,0,0.64,0,0,0.51,0.4,0.12,0,3.51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.22,0.36,0,0,3.51,36.97,0.08,29.69,17.93,14.12,2.19,10.01,8.87,9.77,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.63,0.63,1.83,0.75,0,0,1.98,0,0,0.14,0.47,0.26,0,5.88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[76.14,49.83,30.3,88.99,0,0,1.53,0,0,10.07,5.41,13.37,0,6.22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[2.25,6.25,5.79,2.34,0,0,2.23,0,0,0,0,0,0,0.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.01,0.02,0,0,0,0,0,0,0,1.17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.06,0.07,0.17,0,0,0,0.01,0,0,0.02,0.65,0,0.12,0.09,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.23,1.07,0.3,0,0,0,0.31,0,0,1.58,0,0,0,0.16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0.09,0.15,3.17,0,0,0,1.66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0.53,0.01,0,0,0.2,0.04,0,0.01,0,0.02,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[6.82,13.17,2.8,0.25,1.33,0,18.32,0,0,24.63,8.22,0,0,2.04,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.03,0,0,0,0,0.05,0,0,0,0,0,0,0.01,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.01,0.01,0.01,0.73,0,0,0,0,0.04,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.01,0,0.06,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,2.16,0,0,0.33,0,0,0,0,0.03,0,0,0,0.01,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0.02,0,0,1.11,0,0.32,0,0,0,2.61,0,0,0.02,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0.01,0,0,0,0.32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > datasplit*Math.PI ? -1 : 1);
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
	.text(function(d, i) {return Math.round(d.value) + " g prey Biomass " + Names[i];});
	
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
