var MapLeaflet = function( id, signal, styles, scale  ){

	this.id = id;
	this.signal = signal;
	this.styles = styles;
	this.subject = id;
	this.scale = scale;
	this.marker;
	this.highlightLayer;
	this.selectedID;

	
	
	this.map = L.map("map_"+id, { scrollWheelZoom: false, doubleClickZoom: false, zoomControl: false} ).setView([44.62,-86.1], 6.6);
	this.zoomStatus = "OUT";
	this.layerlist = [];

	this.render()
	

}

MapLeaflet.prototype.render = function(){
	$("#" + this.id + " .map" ).css("background-color", this.styles[this.subject].map);
	var me = this;
	this.signal.rollOverFromMap.add(function(id){ 		
		me.highlightID = id;
		me.highlightLayer( me.styles[me.subject].bright ); 
		//highlightList();
		//scrollToListItem();
	})

	this.signal.rollOutFromMap.add(function(e){ 
		me.highlightLayer( me.styles[me.subject].dark ); 
		//me.resetList();		
	});

	if(this.marker) map.removeLayer(marker);


	var icon = L.icon({
		iconUrl: this.subject+'.png',		    
		iconSize:[125, 26], // size of the icon
	});		
	this.marker = L.marker([43.5, -88.5], {icon: icon}).addTo(this.map);


	var geojson = L.geoJson(statesData, {
		style: $.proxy(this.style, this),
		onEachFeature: $.proxy(this.onEachFeature, this)
	});				
	geojson.addTo(this.map);
}

MapLeaflet.prototype.highlightLayer = function (color){
	this.getLayer(this.highlightID).bringToFront();
	this.getLayer(this.highlightID).setStyle({ color: color });
}

MapLeaflet.prototype.getLayer = function(id){
	for(var i=0; i<this.layerlist.length; i++){
		if(this.layerlist[i].id == id){
			return this.layerlist[i];
		}
	}
}

MapLeaflet.prototype.style = function (feature) {					
	var grade = feature.properties[this.trackThis];
	return {				
		opacity: 1,
		weight: 1,
		color: this.styles[this.subject].dark,
		fillOpacity: (grade=="NA") ? 0 : 1,
		fillColor: this.getColor(feature.properties[this.trackThis])
	};
}

MapLeaflet.prototype.onEachFeature = function(feature, layer) {
	layer.id = this.layerlist.length;
	this.layerlist.push(layer);
	var me = this;
	layer.on({
		mouseover: function(){ me.signal.rollOverFromMap.dispatch(layer.id); },
		mouseout: function(){ me.signal.rollOutFromMap.dispatch(layer.id); },
		click: function(){			
			if(selectedID == layer.id){					
				if( zoomStatus=="OUT" ){
					me.signal.zoomIn.dispatch(layer.id);
				}else{
					me.signal.zoomOut.dispatch(layer.id);	
				}					
			}else{
				me.signal.zoomIn.dispatch(layer.id);					
			}
			selectedID = layer.id;
		},
	});				
}

MapLeaflet.prototype.getColor = function(d) {
	if (d=="NA") return;
	var c = Math.round(this.scale(d));
	return 'rgb('+c+','+c+','+c+')';
}


/*	
	

	




	
			
	

	

	

	function zoomToFeature(layerID) {
		zoomStatus = "IN";
		map.fitBounds( getLayer( layerID ).getBounds() );
	}
	function zoomOut(layerID) {
		zoomStatus = "OUT";
		map.setView([44.62,-86.1], 6.6);
	}

	

	
*/
