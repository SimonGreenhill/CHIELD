// onItemUpdated fires when user manually changes data, 
// or when data is changed automatically by the script.
// Changes to the network GUI need to be reflected in the
// grid, but this fires the onItemUpdated function, which
// calls the function to update the grid.
// To avoid a loop, we temporarily set a variable that marks
// whether the update has come from the script
var calledGridUpdateFromScript = false;


function prepareTable(){

    $("#jsGrid").jsGrid({
        width: "100%",
        height: "400px",
 
        inserting: true,
        editing: true,
        sorting: true,
        paging: false,
 
        data: [],
 
        fields: dataHeaders,

        onItemUpdated: gridUpdated,
        onItemInserted: redrawGUIfromGrid,
        onItemDeleted: redrawGUIfromGrid
    });
}

function gridUpdated(item){

	console.log("Update");
	console.log(calledGridUpdateFromScript);

	if(calledGridUpdateFromScript){
		// The update comes from the script, and we don't want to
		//  check for updates
		calledGridUpdateFromScript = false;  // reset variable
		return(null);
	}

	console.log(item);
	// The only things that will affect the network are:
	// Variable names
	// Direction / type of arrow

	
	var newItem = item.item;
	var oldItem = item.previousItem;

	console.log(newItem.Var1);
	console.log(oldItem.Var1);

	// TODO: check that new var1 is not equal to new Var2 
	// (i.e. we're not adding a link to itself)

	var fields = ["Var1",'Var2'];
	for(var i=0;i<fields.length;++i){
		var field = fields[i];
		// Check if node names have changed
		if(newItem[field]!= oldItem[field]){
			// Update the GUI
			
			
			var numAppearancesOld = variableAppearancesInGrid(oldItem[field]);
			var numAppearancesNew = variableAppearancesInGrid(newItem[field]);
			console.log("OLD "+numAppearancesOld);
			console.log(numAppearancesNew);
			if(numAppearancesOld==1 && numAppearancesNew==0){
				// only one appearance, so just change the label
				networkUpdateNodeName(oldItem[field], newItem[field]);
			} else{
				// We also need to change the node name in all the other entries
				// Give option not to do this
				if (confirm('Update variable change for all rows?')) {
					updateGridVariables(oldItem[field], newItem[field]);
					redrawGUIfromGrid();
				} else{
					// we're not updating all entires of a variable, so actually we need to create a new node
					// Maybe just compeletely re-draw the vis graph based on the current gridData.
					redrawGUIfromGrid();
				}
			}
		}
	}
	
	// Updating relation type
	if(newItem.Relation != oldItem.Relation){
		// For now, just take the easy option:
		redrawGUIfromGrid();
	}

	saveProgressCookie();

}

function variableAppearancesInGrid(varName){
	var varCount = 0;
	for(var row=0; row < $('#jsGrid').data().JSGrid.data.length; ++row){
		if($('#jsGrid').data().JSGrid.data[row].Var1==varName){
			varCount += 1;
		}
		if($('#jsGrid').data().JSGrid.data[row].Var2==varName){
			varCount += 1;
		}
	}
	return(varCount);
}


function updateGridVariables(oldItem,newItem){
	// go through data and change all instances

	for(var row=0; row < $('#jsGrid').data().JSGrid.data.length; ++row){
		if($('#jsGrid').data().JSGrid.data[row].Var1==oldItem){
			$('#jsGrid').data().JSGrid.data[row].Var1 = newItem;
		}
		if($('#jsGrid').data().JSGrid.data[row].Var2==oldItem){
			$('#jsGrid').data().JSGrid.data[row].Var2 = newItem;
		}
	}
	// update grid
	$("#jsGrid").jsGrid("refresh");
}


function addEdgeToGrid(selectedVar1,causal_relation,selectedVar2){
	// Add edge from GUI to grid

	// new row object
	var rowData = {
		Var1: selectedVar1,
		Relation: causal_relation,
		Var2: selectedVar2
	};

	// fill out rest of edge details
	var fieldNames = [];
	var fields = $("#jsGrid").jsGrid().data().JSGrid.fields;
	for(var i=3;i<fields.length;++i){
		var fieldName = fields[i].name;
		rowData[fieldName] = "";
	}
	
	
	// Insert into grid.
	// First, we set 'calledGridUpdateFromScript' to true
	// so the script knows not to update the GUI after the grid is updated
	calledGridUpdateFromScript = true;
	$("#jsGrid").jsGrid("insertItem", rowData).done(function() {
   			 console.log("insertion completed");
   			 calledGridUpdateFromScript = false;
		});

}