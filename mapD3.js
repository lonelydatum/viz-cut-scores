var MapD3 = function( id, signal, styles, scale  ){

	this.id = id;
	this.signal = signal;
	this.styles = styles;
	this.subject = id;
	this.scale = scale;
	this.marker;
	
	this.marker;
	this.d3Paths;
	this.selectedID;
	this.highlightID;
	
	this.selectedView;


	var me = this;
	this.signal.over.add(function(index, target){ 
		me.highlightID = index;				
		me.selectedView = d3.select("#"+me.id+"_"+me.highlightID);		
		me.selectedView.moveToFront();
		me.highlightLayer( ); 		
	})
	this.signal.out.add(function(e){ 
		me.highlightID = e;		
		me.resetLayer( ); 		
	})
	this.signal.subjectChange.add(function(newSubject, colID){
		if($("#"+me.id).index() == colID){
			me.setSubject(newSubject);		
		}		
	})

	
	this.map = new L.Map("map_"+this.subject, { scrollWheelZoom: false, doubleClickZoom: false, zoomControl: false} )
		.setView(new L.LatLng(44.7,-86.5), 6.68);
	
	this.setSubject(this.subject);
	
	this.svg = d3.select(this.map.getPanes().overlayPane).append("svg");
    this.g = this.svg.append("g").attr("class", "leaflet-zoom-hide");
    
    var me = this;
    this.path = d3.geo.path().projection(function(x){
    	 var point = me.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
	    return [point.x, point.y];
    });

    this.bounds = d3.geo.bounds(collection);


    
    d3.selection.prototype.moveToFront = function() { 

    	if(!$.browser.msie || $.browser.msie==undefined){    		
    		return this.each(function() { 
				this.parentNode.appendChild(this); 
			}); 	
    	}		
	}; 

    

    
    var me = this;
	this.d3Paths = this.g.selectAll("path")
		.data(collection.features)
		.enter().append("path")
		.attr("class", 'map_layer')
		.attr("id", function(d, i){
	        return me.id+"_"+d.properties.ET_ID;
	    })
	    .style('fill', function(d){
	    	return me.getColor(d.properties[me.trackThis])
	    })
	    .style("fill-opacity", function(d){
	    	return (d.properties[me.trackThis]=="NA") ? 0 : 1;
	    })
	    .style('stroke', this.styles[this.subject].dark)
		.on("mouseover", function(d, i){	
		    me.signal.over.dispatch(d.properties.ET_ID, this);
		})
		.on("mouseout", function(d, i){		    	
		    me.signal.out.dispatch(d.properties.ET_ID);
		});

	

	
	this.map.on("viewreset", this.reset);
	this.reset();
	




	this.zoomStatus = "OUT";

}
MapD3.prototype.project = function(x) {	
	var point = this.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
	return [point.x, point.y];
}
MapD3.prototype.reset = function() {
	
	var bottomLeft = this.project(this.bounds[0]);
	var topRight = this.project(this.bounds[1]);

	this.svg.attr("width", topRight[0] - bottomLeft[0])
		.attr("height", bottomLeft[1] - topRight[1])
		.style("margin-left", bottomLeft[0] + "px")
		.style("margin-top", topRight[1] + "px");

	this.g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
	this.d3Paths.attr("d", this.path);
}



MapD3.prototype.getColor = function(d) {
	if (d=="NA") return;
	var c = Math.round(this.scale(d));
	var rgb = 'rgb('+c+','+c+','+c+')';
	return rgb;
}

MapD3.prototype.highlightLayer = function (){		
	this.selectedView.style("stroke", this.styles[this.subject].bright)	
	this.selectedView.style("stroke-width", 1.2)	
}
MapD3.prototype.resetLayer = function (){		
	this.selectedView.style("stroke", this.styles[this.subject].dark)	
	this.selectedView.style("stroke-width", .8)	

}
MapD3.prototype.setSubject = function (newSubject){
	this.subject = newSubject;
	var capital = this.subject.charAt(0).toUpperCase() + this.subject.slice(1);
	this.trackThis = capital + " Change";
	$("#" + this.id + " .map" ).css("background-color", this.styles[this.subject].map);

	var me = this;

	if(this.d3Paths){
		this.d3Paths = this.g.selectAll("path")
		.data(collection.features)
		.style('stroke', this.styles[this.subject].dark)
		.style('fill', function(d){						
	    	return me.getColor(d.properties[me.trackThis]);
	    })
	    .attr("id", function(d, i){
	        return me.id+"_"+d.properties.ET_ID;
	    })
	    .style("fill-opacity", function(d){
	    	return (d.properties[me.trackThis]=="NA") ? 0 : 1;
	    })

	    this.reset();
	}

	if(this.marker){
		this.map.removeLayer(this.marker)
	}

	
	var icon = L.icon({
		iconUrl: 'assets/images/'+this.subject+'.png',		    
		iconSize:[125, 26]
	});
		
	this.marker = L.marker([43.5, -88.5], {icon: icon}).addTo(this.map);
	
}




