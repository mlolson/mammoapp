require([
         "dojox/grid/DataGrid",
         "dojo/store/Memory",
         "dojo/data/ObjectStore",
         // "dojo/data/ItemFileWriteStore",
         "dojo/request",
         "dojo/domReady!",
         "dojo/parser",
	     "dijit/form/Select",
	     "dijit/form/NumberSpinner", 
	     "dijit/form/TextBox",
	     "dijit/form/SimpleTextarea",
	     "dijit/form/RadioButton", 
	     "dojo/on", 
	     "dijit/registry",
	     "dijit/form/CheckBox",
	     "dojo/date/stamp",
     ], function(DataGrid, Memory, ObjectStore, request){
			
			Dajaxice.formapp.getRecord1List(callback_getAllRecords,{});
        
     });
require(["dojo/ready", "dijit/form/Button", "dojo/dom"], function(ready, Button, dom){
    ready(function(){
        // Create a button programmatically:
        var newRecordBtn = new Button({
            label: "Create New Record",
            onClick: function(){
            	createNewRecord();
            }
        }, "createRecordBtn");
        var saveBtn = new Button({
            label: "Save",
            onClick: function(){
            	saveRecord();
            }
        }, "saveBtn");
        var deleteBtn = new Button({
            label: "Delete",
            onClick: function(){
            	deleteRecord();
            }
        }, "deleteBtn");
        var exportRecordsBtn = new Button({
            label: "Export Records as .CSV",
            onClick: function(){
            	window.location.href='/form/export/';
            }
        }, "exportRecordsBtn");
    });
});    
     
var Grid, Store, Ostore,CurrentRecord;

function callback_getAllRecords(data){
	Store = new dojo.store.Memory({ data: data.records });
	//Store = new dojo.data.ItemFileWriteStore({data: data.records});
	Ostore = new dojo.data.ObjectStore({ objectStore:Store });
	makeGrid();	
}
function createNewRecord(){
	displayRecord(-1);	
	//Can change to accomodate log ins
	CurrentRecord.id="";
	dijit.byId("saveBtn").set('disabled', false);
	dijit.byId("deleteBtn").set('disabled', false);
	dojo.byId("id_lbl").innerHTML = "  <b>New Unsaved record</b>";
	dojo.byId("creator_lbl").innerHTML =  "  <b>Guest</b>";
	var date = new Date();
	var datestr = dojo.date.stamp.toISOString(date).split("T")[0];
	dojo.byId("date_lbl").innerHTML = "  <b>"+datestr +"</b>";
}
function saveRecord(){

	if(CurrentRecord.id=="none"){
		return;
	}
	
	var isNewRecord = ((CurrentRecord.id)=="");
	if(isNewRecord){
		CurrentRecord.date_last_updated = dojo.date.stamp.toISOString(new Date()).split("T")[0];
		CurrentRecord.last_to_update = "Anonymous";
	}
	
	CurrentRecord.description = dojo.byId("description").value;
	CurrentRecord.text_data = dojo.byId("text1").value;
	CurrentRecord.number1 = dojo.byId("num1").value.replace(",","");
	CurrentRecord.number2 = dojo.byId("num2").value.replace(",","");	
	
	var radio_choice = -1;
	if(dijit.byId("radio1").checked){
		radio_choice = 0;
	}else if(dijit.byId("radio2").checked){
		radio_choice = 1;
	}else if(dijit.byId("radio3").checked){
		radio_choice = 2;
	}
	
	CurrentRecord.radio_choice = radio_choice;
	
	var cbchoices = "";
	for(var i=0;i<3;i++){
		if(dijit.byId("cbox"+i).checked){
			cbchoices += i+","
		}
	}
	if(cbchoices.indexOf(",")>0){
		cbchoices = cbchoices.substring(0, cbchoices.length - 1);
	}
	CurrentRecord.checkbox_choices= cbchoices.split(",");
	
	var params = {"isNewRecord":isNewRecord,
				"idn":CurrentRecord.id,
				"date_updated":CurrentRecord.date_last_updated,
				"last_to_update":CurrentRecord.last_to_update,
				"description":CurrentRecord.description,
				"text_data":CurrentRecord.text_data,
				"number1":CurrentRecord.number1,
				"number2":CurrentRecord.number2,
				"radio_choice":CurrentRecord.radio_choice,
				"checkbox_choices":cbchoices
	}
	
	Dajaxice.formapp.saveRecord(callback_SaveRecord,params);
	dojo.style(dojo.byId('ajax_gif'), "display", "block");
	dijit.byId("saveBtn").set('disabled', true);
	dijit.byId("deleteBtn").set('disabled', true);


}
function callback_SaveRecord(data){
	dojo.style(dojo.byId('ajax_gif'), "display", "none");
	dijit.byId("saveBtn").set('disabled', false);
	dijit.byId("deleteBtn").set('disabled', false);
	var record = {id:data.newid,
			last_to_update:data.last_to_update,
			date_last_updated:data.date_last_updated,
			description:data.description,
			text_data:data.text_data,
			number1:data.number1,
			number2:data.number2,
			radio_choice:data.radio_choice,
			checkbox_choices:data.checkbox_choices,
			forEach:function(method){
				method(this);					
			}
				};
	
	if(data.isNewRecord){		
		//Store.put(CurrentRecord,{overwrite:false});
		Store.put(record,{overwrite:false});
		Grid._refresh();
		Grid.scrollToRow(0);
        Grid.selection.setSelected(Grid.selection.selectedIndex, false);
		Grid.selection.setSelected(0, true);
		Grid.render();

	}else{
		//Store.query({id:id}) = CurrentRecord;
		Store.put(record);
		//Store.put(CurrentRecord);
		Grid.update();
		//Grid._refresh();
	}
	displayRecord(data.newid);
	
	
}
function deleteRecord(){
	
	if(CurrentRecord.id=="none"){
		return;
	}
	if(CurrentRecord.id==""){
		displayRecord(-1);
		return;
	}else{
		Dajaxice.formapp.deleteRecord(callback_deleteRecord,{'idn':CurrentRecord.id});
		dojo.style(dojo.byId('ajax_gif'), "display", "block");
		dijit.byId("saveBtn").set('disabled', true);
		dijit.byId("deleteBtn").set('disabled', true);
	}
	
}
function callback_deleteRecord(data){
	
	dijit.byId("saveBtn").set('disabled', false);
	dijit.byId("deleteBtn").set('disabled', false);
	dojo.style(dojo.byId('ajax_gif'), "display", "none");
	if(data.message != "Saved"){
		alert(data.message);
		return;
	}
	console.log("data.id ="+data.id+"   "+(data.id+1));
	Store.query({id:data.id}).forEach(function(rec){
		//console.log("removige id "+Store.getIdentity(rec));
		  Store.remove(Store.getIdentity(rec));
	});	
	
	Grid._refresh();
	//Grid.render();
	//Grid.update();
	displayRecord(-1);
	

}
//If ID>0 display record, otherwise blank out the form.
function displayRecord(targid){
	var record
	if(targid>0){
		record = Store.query({id:targid});
		dijit.byId("saveBtn").set('disabled', false);
		dijit.byId("deleteBtn").set('disabled', false);
	}else{
		Grid.selection.setSelected(Grid.selection.selectedIndex, false);
	    Grid.render();
	    dijit.byId("saveBtn").set('disabled', true);
		dijit.byId("deleteBtn").set('disabled', true);
	    
		record = {id:"none",
				last_to_update:"",
				date_last_updated:"",
				description:"",
				text_data:"",
				number1:"",
				number2:"",
				radio_choice:-1,
				checkbox_choices:"",
				forEach:function(method){
					method(this);					
				}
					};
		CurrentRecord = record;
	}
	record.forEach(function(rec){
		CurrentRecord = rec;
		dojo.byId("id_lbl").innerHTML = "  <b>"+rec.id +"</b>";
		dojo.byId("creator_lbl").innerHTML =  "  <b>"+rec.last_to_update+"</b>";
		dojo.byId("date_lbl").innerHTML =  "  <b>"+ rec.date_last_updated+"</b>";
		dojo.byId("description").value = rec.description;
		dojo.byId("text1").value = rec.text_data;
		dojo.byId("num1").value = rec.number1;
		dojo.byId("num2").value = rec.number2;
		console.log("rec.radio_choice = "+rec.radio_choice);
		if(rec.radio_choice ==0){
			dijit.byId("radio1").set("checked",true);
			dijit.byId("radio2").set("checked",false);
			dijit.byId("radio3").set("checked",false);
		}else if(rec.radio_choice ==1){
			dijit.byId("radio1").set("checked",false);
			dijit.byId("radio2").set("checked",true);
			dijit.byId("radio3").set("checked",false);
		}else if(rec.radio_choice ==2){
			dijit.byId("radio1").set("checked",false);
			dijit.byId("radio2").set("checked",false);
			dijit.byId("radio3").set("checked",true);
		}else{
			dijit.byId("radio1").set("checked",false);
			dijit.byId("radio2").set("checked",false);
			dijit.byId("radio3").set("checked",false);
		}
		dijit.byId("cbox0").set("checked",false);
		dijit.byId("cbox1").set("checked",false);
		dijit.byId("cbox2").set("checked",false);
		var cbchoices = rec.checkbox_choices.split(",");
		//console.log("rec.checkbox_choices"+rec.checkbox_choices+", length="+cbchoices.length);
		for(var i=0;i<cbchoices.length;i++){
				if(dijit.byId("cbox"+cbchoices[i])){
					dijit.byId("cbox"+cbchoices[i]).set("checked",true);	
				}
		}
		

	});
    dojo.byId("grid_lbl").innerHTML = "<b>Records in Database ("+Grid.rowCount+"):</b>";
}


function makeGrid(){
    
    Grid = new dojox.grid.DataGrid({
        store: Ostore,
        query: { id: "*" },
        queryOptions: {},
        structure: [
			{ name: "ID", field: "id", width: "5%" },        
            { name: "Created By", field: "last_to_update", width: "15%" },
            { name: "Date", field: "date_last_updated", width: "15%" },
            { name: "Description", field: "description", width: "20%" },
            { name: "Text Data", field: "text_data", width: "20%" },
            { name: "Int Data 1", field: "number1", width: "10%" },
            { name: "Int Data 2", field: "number2", width: "10%" }
            
        ],
        selectionMode:"single",
        
    }, "grid");
    dojo.connect(Grid, "onRowClick", function(e) {
    	var item = Grid.selection.getSelected();
    	displayRecord(item[0].id);
   	});
    
    Grid.startup();
    Grid.setSortIndex(0, false);
    Grid.sort();   
    
    dojo.byId("grid_lbl").innerHTML = Grid.rowCount + " Records in server:";
	displayRecord(-1);
	CurrentRecord = {id:"none"};

}
