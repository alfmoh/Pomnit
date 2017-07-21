let $ = require("jquery");
let Kalendae = require("kalendae");
let datetimepicker = require("eonasdan-bootstrap-datetimepicker");
let notyf = require("notyf");


new Kalendae.Input("date",{});
 
let note = new notyf();

$("#time").datetimepicker({
    format: "LT"
});


$("#add-button").on("click", ()=>{
    let eventTitle = $("#event-title").val();
    let date = $("#date"). val();
    let time = $("#time").val();
    let dateTime = date + " "+ ConvertTo24(time);
    console.log(ConvertTo24(time))
    let dateConvert = new Date(dateTime).getTime()
        console.log(dateConvert)



    if (eventTitle.trim() !== "") {
     $("#event-list").append("<li class='list-group-item'>"+eventTitle +"</li>") 
       note.confirm("Added")
    }  
    else{
        
        //note.alert("Hey, you left something out")
    }

});

 function ConvertTo24(time){
        let timeToArr = Array.from(time);
        let ending = timeToArr[timeToArr.length-2] + timeToArr[timeToArr.length-1];
        let firstTwo = timeToArr[0] + timeToArr[1];

        if (firstTwo === "12" && ending === "AM") 
        {
            let converted = (parseInt(firstTwo) - 12).toString() + "0";
            timeToArr.splice(0,2,converted)
            return timeToArr.slice(0,5).join("").trim();
        }

        if(ending === "PM" && firstTwo !== "12"){
            let converted = parseInt(timeToArr.slice(0,timeToArr.indexOf(":")).join("")) + 12;
            let newArr = timeToArr.slice(timeToArr.indexOf(":"), timeToArr.length)
            newArr.unshift(converted.toString())
            return newArr.slice(0,5).join("").trim();
        }

           return  timeToArr.slice(0,5).join("").trim(); 
    }