let $ = require("jquery");
let datetimepicker = require("eonasdan-bootstrap-datetimepicker");
let notyf = require("notyf");
let moment = require("moment");
let notifier = require("node-notifier");
const {
    dialog
} = require("electron").remote;
let fs = require("fs");
const remote = require("electron").remote;


var eventData = remote.getGlobal("eventData");

$("#date").datetimepicker({
    format: "L"
})

$("#time").datetimepicker({
    format: "LT"
});


var dataFromDb = (function thisIiffe() {
    eventData.find({}).sort({
        timeStamp: 1
    }).exec((err, docs) => {
        docs.forEach((item, index) => {

            $("#event-list").append(

                "<a class='btn btn-danger btn-sm list-group-item-btn " +
                (item._id) + "'" + " id = '" + (item._id) + "'" +
                ">Delete</a>" +
                "<li class='list-group-item " + (item._id) + "'" +
                " id = '" + (item._id) + "'" + ">" +
                "<strong>" + item.event + "</strong>" + "</strong>" + ' ~ ' +
                moment(item.date).format("dddd, MMMM Do YYYY") +
                ' ~ ' + "<strong><i>" + item.time + "</i></strong>" + "</li>"
            )

        })

        $(".list-group-item-btn").click(function () {
            let listId = $(this).attr("id");

            $(("." + listId)).fadeOut("slow", function () {
                $(this).remove();
                eventData.remove({ _id: listId }, {}, function (err, numRemoved) {
                })
            })
        })

        $(".list-group-item").on('click', function () {

            let slidingValue = $(this).css("right") === '100px' ? 0 : '100px';

            $(this).animate({
                right: slidingValue,

            }, 600)
        })
    })

    // if ($('#event-list li').length === 0) {$("#event-list").append("<p id='empty-list'>Your event list is empty</p>")}
    return thisIiffe;
}())

let note = new notyf();

function Logic() {
    {
        let eventObjects = {};
        var eventDateAndContent = {};
        var arr = [];
        var listItems = $("#event-list li");
        if (listItems) {
            listItems.each(function (li) {
                var that = $(this);
                var listArray = (Array.from($(this).text()));
                var timeDateSlice = listArray.slice(listArray.indexOf("~") + 2, listArray.length);
                var dateSlice = timeDateSlice.slice(0, timeDateSlice.indexOf("~"));
                var timeSlice = timeDateSlice.slice(timeDateSlice.indexOf("~") + 2, timeDateSlice.length);

                var dateExtract = dateSlice.join("").trim();
                var timeExtract = timeSlice.join("").trim();

                var dateConvertToJsFormat = moment(dateExtract, "dddd, MMMM Do YYYY").format("MM/DD/YYYY");

                var datez = dateConvertToJsFormat + " " + ConvertTo24(timeExtract);

                var getTime = new Date(datez).getTime();
                var eventId = (that.attr("id"));

                eventObjects[eventId.toString()] =
                    Object.defineProperty(eventDateAndContent, getTime.toString(), {
                        value: that.text(),
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                Notify(eventObjects);

            });
        }
    }
}

setInterval(Logic, 1000);

function Notify(eventObjects) {

    if (eventObjects) {
        for (var item in eventObjects) {
            for (var item2 in eventObjects[item]) {

                if (+Math.floor(item2 / 1000) == Math.floor(Date.now() / 1000)) {

                    //console.log((eventObjects[item])[item2]);

                    notifier.notify({
                        title: "Notifyy",
                        message: (eventObjects[item])[item2],
                        wait: true
                    })

                    return;
                }

            }
        }
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

        $("#event-list").empty();

        eventData.insert(dateTimeArray, function (err, docs) {
            docs.forEach(function (d) {
                eventFromDb = d.event;
            });
        });

        dataFromDb();

        note.confirm("&nbsp&#8227&nbspAdded")

    } else if (eventTitle.includes("~")) {
        note.alert("Oops! '~' isn't allowed");
        return;
    } else {

        note.alert("Oops! Please fill all boxes");
    }

    $("#event-title").val("");
    $("#date").val("")
    $("#time").val("");

});


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