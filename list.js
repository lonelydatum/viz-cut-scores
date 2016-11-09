var List = function(subject, signal, styles){
	this.signal = signal;
	this.subject = subject;
	this.trackThis;
	this.id = subject;
	this.styles = styles;
	this.selectedView;
	this.d3List;


	    

	this.list = $("#"+this.id+" .list");
	
	

	//set the height
	var listHeight = $(window).height() - $("#" + this.id + " .map").height() - 85;
	listHeight = (listHeight<150) ? 150 : listHeight;	
	this.list.css("height", listHeight+"px");

	var me = this;
	this.signal.over.add(function(listIndex, target, index){ 		
		me.highlightID = listIndex;
		
		me.selectedView = $("#"+'list_'+me.id+"_"+me.highlightID);
		var targetClass = $(target).attr('class');		
		if(targetClass=='list_row'){			
			if(index != $("#"+me.id).index()) me.scrollToListItem();				
		}else if(targetClass=='map_layer'){
			me.scrollToListItem();
		}
		me.highlightList();
	});
	this.signal.out.add(function(e, index){ 
		me.resetList();
	});
	this.signal.subjectChange.add(function(newSubject, colID){		
		if($("#"+me.id).index() == colID){
			me.setSubject(newSubject);	
			_gaq.push(['_trackEvent', 'cutscores', 'change subject', newSubject])	
		}		
	})



	$("#"+this.id +" #sort_score").click($.proxy(this.sortByScores, this));
	$("#"+this.id +" #sort_district").click($.proxy(this.sortByDistrict, this));

	

	

	var me = this;
	this.d3List = d3.select("#"+this.id+" .list").selectAll("div")
	    .data(justGrades.features)
	    .enter()
	       
		.append("div")
	    .on("mouseover", function(d){
	    	me.signal.over.dispatch(d.properties.ET_ID, this, $("#"+me.id).index());
		})
		.on("mouseout", function(d, i){
		   	me.signal.out.dispatch(d.properties.ET_ID);
		})
	    .attr("class", "list_row")
	    .attr("id", function(d, i){	        	
	    	return 'list_'+me.id+"_"+d.properties.ET_ID;
	    })
	
	this.setSubject(this.subject);	        
}

List.prototype.setSubject = function(subject){
	this.subject = subject;
	var capital = this.subject.charAt(0).toUpperCase() + subject.slice(1);
	this.trackThis = capital + " Change";
	$("#" + subject + " select").val(capital);
		
	var me = this;
	$("#" + this.id + " select").change(function(){	

		me.signal.subjectChange.dispatch($(this).val().toLowerCase(), $("#"+me.id).index());
	});


	var me = this;
	me.d3List
		.data(justGrades.features)
		.attr("id", function(d, i){	        	
	    	return 'list_'+me.id+"_"+d.properties.ET_ID;
	    })
	    .html(function(d, i){        	
	        var score = d.properties[me.trackThis] * 100;
	        var name = d.properties.NAME;
	        var s = (!isNaN(parseFloat(score)) && isFinite(score)) ? score.toFixed(2) : 0;        	
	        var str = '<p width="100px" class="list_score">' + s + '</p><p  class="list_district">' + name + '</p>';        	
	        return str;
	    });
	this.sortByDistrict();
}


List.prototype.highlightList = function(){
	this.selectedView.css("background-color", this.styles[this.subject].map);
	//this.selectedView.style("background-color", this.styles[this.subject].map)	
}
List.prototype.resetList = function(){
	this.selectedView.css("background-color", 'white');
	//this.selectedView.style("background-color", 'white');
}
List.prototype.scrollToListItem = function(){
	var percent = (this.selectedView.index()+1) / collection.features.length;
	var pos = (this.list[0].scrollHeight * percent) - 35;	
	this.list.scrollTop(pos);
}









List.prototype.sortByScores = function(){
	_gaq.push(['_trackEvent', 'cutscores', 'sort by scores', this.trackThis])
	var me = this;	
	this.d3List.sort(function(a,b){
			if(a.properties[me.trackThis] == "NA") return 1;
			return (a.properties[me.trackThis] > b.properties[me.trackThis]) ? 1 : -1;
	});	
	$("#"+this.id+" #list_header #sort_district .sort_icon").hide();
	$("#"+this.id+" #list_header #sort_score .sort_icon").show();
}

List.prototype.sortByDistrict = function(){	
	_gaq.push(['_trackEvent', 'cutscores', 'sort by district', this.trackThis])
	this.d3List.sort(function(a,b){		
		return (a.properties.NAME > b.properties.NAME) ? 1 : -1;				
	})

	$("#"+this.id+" #list_header #sort_district .sort_icon").show();
	$("#"+this.id+" #list_header #sort_score .sort_icon").hide();
}
