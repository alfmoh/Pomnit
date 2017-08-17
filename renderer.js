let $ = require("jquery");
let Kalendae = require("kalendae");
let datetimepicker = require("eonasdan-bootstrap-datetimepicker");
let notyf = require("notyf");
let moment = require("moment");

 
let note = new notyf();

$("#date").datetimepicker({
    format: "L"
})

$("#time").datetimepicker({
    format: "LT"
});



function Logic () {
    {
        var eventIds = {};
        var eventDateAndContent = {};
        var arr = [];
        var listItems = $("#event-list li");
        if (listItems) {
            listItems.each(function(li) {
                var that = $(this);
                var listArray = (Array.from($(this).text()));
                var timeDateSlice = listArray.slice(listArray.indexOf("~")+2,listArray.length);
                var dateSlice = timeDateSlice.slice(0,timeDateSlice.indexOf("~"));
                var timeSlice = timeDateSlice.slice(timeDateSlice.indexOf("~")+2, timeDateSlice.length);

                var dateExtract = dateSlice.join("").trim();
                var timeExtract = timeSlice.join("").trim();

                var dateConvertToJsFormat = moment(dateExtract,"dddd, MMMM Do YYYY").format("MM/DD/YYYY");

                  var datez = dateConvertToJsFormat + " " + ConvertTo24(timeExtract);

                var getTime = new Date(datez).getTime();
                var eventId = (that.attr("id"));
               
                eventIds[eventId.toString()] = 
                Object.defineProperty(eventDateAndContent,getTime.toString(),{
                    value: that.text(),
                    writable:true,
                    enumerable:true,
                    configurable:true
                });

                Notify(eventIds);
    
            });
        }
    }
}

setInterval(Logic,1000);

function Notify(dict) {
    
    if (dict) {
        for(var item in dict){

            for(var item2 in dict[item]){

                if (+Math.floor(item2/1000) ==Math.floor( Date.now()/1000)) {
                    console.log("Hurray");
                    return;
                }
                
            }
            return;
        }    
    }
}

 
var count = 0;
$("#add-button").on("click", ()=>{
    let eventTitle = $("#event-title").val();
    let date = $("#date"). val();
    let time = $("#time").val();
    let dateTime = date + " "+ ConvertTo24(time);

    let dateConvert = new Date(dateTime).getTime()




function GetListValues(){
    if (($("#event-list").length !==0)) {


    }else{return;}
}

    if ((eventTitle.trim() && date && time) !== ""  && !eventTitle.includes("~")) {
     $("#event-list").append("<li class='list-group-item' id ='list-item" + (count++) + "'"+ ">"
     +eventTitle + ' -  Date & Time ~ '+ moment(date).format("dddd, MMMM Do YYYY") + ' ~ ' + time + "</li>") 

       note.confirm("+Added")

    } 
    else if(eventTitle.includes("~")){
        note.alert("Oops! '~' isn't allowed");
        return;
    }
    
    else{
        
        note.alert("Oops! Please fill all boxes");
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