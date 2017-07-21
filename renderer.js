let $ = require("jquery")
//require("bootstrap-datepicker")
let Kalendae = require("kalendae")
let datetimepicker = require("eonasdan-bootstrap-datetimepicker")

new Kalendae.Input("date",{});
 
$("#time").datetimepicker({
    format: "LT"
})


