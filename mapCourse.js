var MapCourse = function( s, signal, styles ){ 
	
	var styles = styles;
	
	var highlightID, trackThis;
	
	
	
	
	var id = s;
	var subject = s;
	
	
	var scale = d3.scale.linear()	
	scale.domain([-.8, 0]);
	scale.range([0, 255]);


	var map = new MapD3(s, signal, styles, scale );
	var list = new List(s, signal, styles, scale );

}


