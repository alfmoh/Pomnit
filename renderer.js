let $ = require("jquery");
let datetimepicker = require("eonasdan-bootstrap-datetimepicker");
let notyf = require("notyf");
let moment = require("moment");
let notifier = require("node-notifier");
let Dialogs = require("dialogs");

var dialogs = Dialogs({
    cancel: 'No',
    ok: 'Yes'
})

const {
    dialog
} = require("electron").remote;
let fs = require("fs");
const remote = require("electron").remote;


var eventData = remote.getGlobal("eventData");

$("#date").datetimepicker({
    format: "L",
    minDate: Date.now(),
    defaultDate: Date.now(),
    showTodayButton: true,
    showClose: true,
    showClear: true
})

$("#time").datetimepicker({
    format: "LT",
    defaultDate: new Date().getTime(),
    showTodayButton: true,
    showClose: true,
    showClear: true,
    toolbarPlacement: 'bottom'
});


$("#refresh").click(()=>{
    $("#event-list").empty();
    dataFromDb();
})

$("#clear-all").click(()=>{
    dialogs.confirm("Are you sure you want to delete all your events?", function(ok){
        if(!ok) return;

        $("#event-list").empty();
        eventData.remove({}, { multi: true }, function (err, numRemoved) {
        });
    })
})


var dataFromDb = (function thisIiffe() {
    eventData.find({}).sort({
        timeStamp: 1
    }).exec((err, docs) => {
        docs.forEach((item, index) => {

            $("#event-list").append(

                listingLogic(item)
            )

        })


    })

    // if ($('#event-list li').length === 0) {$("#event-list").append("<p id='empty-list'>Your event list is empty</p>")}
    return thisIiffe;
}())

let note = new notyf();

function Logic() {
    {

        eventData.find({}, function (err, docs) {
            docs.forEach(function (item, index) {
                let dateAndTimeExtractAndConvert = new Date(item.date + " " + ConvertTo24(item.time)).getTime();

                let eventObject = {
                    id: item._id,
                    event: item.event,
                    dateDue: dateAndTimeExtractAndConvert
                }


                Notify(eventObject);
            })
        });
    }
}

setInterval(Logic, 1000);

function Notify(eventObjects) {

    if (+Math.floor(eventObjects.dateDue / 1000) === Math.floor(Date.now() / 1000)) {


        let listItems = $("#event-list li");
        let eventFromUIList = $("#event-list").find("." + eventObjects.id);

        eventFromUIList.fadeOut(500, function () {
            eventFromUIList.remove()
        });

        notifier.notify({
            title: "Pomnit",
            message:  "It's "+ (eventObjects.event) + " time",
            wait: true
        })

        eventData.remove({ _id: eventObjects.id }, function (err, numberRemoved) {
        });

    }
}

let eventFromDb;
let count = 0;
$("#add-button").on("click", (e) => {


    let eventTitle = $("#event-title").val();
    let date = $("#date").val();
    let time = $("#time").val();
    let dateTime = date + " " + ConvertTo24(time);
    let timeStamp = new Date(moment(`${date + ' ' + time}`).format("LLL")).getTime();

    let dateConvert = new Date(dateTime).getTime()

    let dateTimeObject = {
        event: eventTitle,
        date: date,
        time: time,
        timeStamp: timeStamp
    }

    let dateTimeArray = [];
    dateTimeArray.push(dateTimeObject);


    if ((eventTitle.trim() && date && time) !== "" && !eventTitle.includes("~")) {


        eventData.insert(dateTimeArray, function (err, docs) {


            let listing = listingLogic(docs['0'])

            $("<div />", {
                class: "",
                html: listing
            }).hide().prependTo("#event-list").fadeIn();



            docs.forEach(function (d) {
                eventFromDb = d.event;
            });
        });

        note.confirm("&nbsp&#8227&nbspAdded")

    } else if (eventTitle.includes("~")) {
        note.alert("Oops! '~' isn't allowed");
        return;
    } else {

        note.alert("Oops! Please fill all boxes");
    }

    $("#event-title").val("");

});

$("#event-list").on('click', "li", function () {

    let slidingValue = $(this).css("right") === '100px' ? 0 : '100px';

    $(this).animate({
        right: slidingValue,

    }, 600)
})


$("#event-list").on("click", "a", function () {
    let listId = $(this).attr("id");

    $(("." + listId)).fadeOut("slow", function () {
        $(this).remove();
        eventData.remove({ _id: listId }, {}, function (err, numRemoved) {
        })
    })
})

function listingLogic(docs) {
    return ("<a class='btn btn-danger list-danger btn-sm list-group-item-btn " +
        (docs._id) + "'" + " id = '" + (docs._id) + "'" +
        ">Delete</a>" +
        "<li class='list-group-item " + (docs._id) + "'" +
        " id = '" + (docs._id) + "'" + ">" +
        "<strong>" + docs.event + "</strong>" + "</strong>" + ' ~ ' +
        moment(docs.date).format("dddd, MMMM Do YYYY") +
        ' ~ ' + "<strong><i>" + docs.time + "</i></strong>" + "</li>");
}

function ConvertTo24(time) {
    let timeToArr = Array.from(time);
    let ending = timeToArr[timeToArr.length - 2] + timeToArr[timeToArr.length - 1];
    let firstTwo = timeToArr[0] + timeToArr[1];

    if (firstTwo === "12" && ending === "AM") {
        let converted = (parseInt(firstTwo) - 12).toString() + "0";
        timeToArr.splice(0, 2, converted)
        return timeToArr.slice(0, 5).join("").trim();
    }

    if (ending === "PM" && firstTwo !== "12") {
        let converted = parseInt(timeToArr.slice(0, timeToArr.indexOf(":")).join("")) + 12;
        let newArr = timeToArr.slice(timeToArr.indexOf(":"), timeToArr.length)
        newArr.unshift(converted.toString())
        return newArr.slice(0, 5).join("").trim();
    }

    return timeToArr.slice(0, 5).join("").trim();
}