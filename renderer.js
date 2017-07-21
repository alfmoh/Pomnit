let $ = require("jquery")
//require("bootstrap-datepicker")
let Kalendae = require("kalendae")
let datetimepicker = require("eonasdan-bootstrap-datetimepicker")
let notyf = require("notyf")

new Kalendae.Input("date",{});
 
let note = new notyf()

$("#time").datetimepicker({
    format: "LT"
})


$("#add-button").on("click", ()=>{
    let value = $("#event-title").val()
    if (value.trim() !== "") {
     $("#event-list").append("<li class='list-group-item'>"+value +"</li>") 
       note.confirm("Added")
    }  
    else{
        
        note.alert("Hey, you left something out")
    }  
})