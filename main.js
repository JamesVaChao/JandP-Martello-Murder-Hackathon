console.log("Hello Jams");
exampleData = new Date(1578151801 * 1000);
var currentTimeDOM;
var currentNameDOM;
var murderData = [];
var count = 0;
var timeline;
var currentTime;

function createPage() {
    createTable();
    createTimeline();

    updateInfoDOM(murderData[0])

    currentTime = murderData[0].time;
}

function updateInfoDOM(data){
    currentTimeDOM = document.getElementById("currentTime");
    currentTimeDOM.innerHTML = data.displayableTime;

    currentNameDOM = document.getElementById("currentName");
    currentNameDOM.innerHTML = data.guest_id;
}
for (var key in murderDataJSON) {
    if (murderDataJSON.hasOwnProperty(key)) {
        let date = new Date(key * 1000);
        murderData.push({
            id: count++,
            time: date,
            displayableTime: `${date.toDateString()} at ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`,
            epochTime: key,
            device: murderDataJSON[key].device,
            device_id: murderDataJSON[key]["device-id"],
            event: murderDataJSON[key].event,
            guest_id: murderDataJSON[key]["guest-id"]
        });
    }
}

function createTable() {
    var table = new Tabulator("#dataTable", {
        data: murderData, //set initial table data
        height: "311px",
        layout: "fitDataStretch",
        columns: [{
                title: "Event Order",
                field: "id"
            },
            {
                title: "Time",
                field: "displayableTime"
            },
            {
                title: "Device",
                field: "device"
            },
            {
                title: "Device ID",
                field: "device_id"
            },
            {
                title: "Event",
                field: "event"
            },
            {
                title: "Guest ID",
                field: "guest_id"
            },
        ],
        rowClick:function(e, row){
            updateInfoDOM(murderData[row._row.data.id]);
            },
    });

    table.setData(murderData);

}

peopleInfo = {
    "Veronica": {
        group: 1
    },
    "Thomas": {
        group: 2
    },
    "Eugene": {
        group: 3
    },
    "Salina": {
        group: 4
    },
    "Rob": {
        group: 5
    },
    "Kristina": {
        group: 6
    },
    "Alok": {
        group: 7
    },
    "n/a": {
        group: 8
    },
    "Marc-Andre": {
        group: 9
    },
    "Jason": {
        group: 10
    },
    "Dave": {
        group: 11
    },
    "Harrison": {
        group: 12
    }
}

function createTimeline() {
    var container = document.getElementById("timeline-embed");
    timelineList = [];
    for (let data of murderData) {
        try {
            item = {
                start: data.time,
                end: new Date(data.time.getTime() + 1 * 10000),
                group: peopleInfo[data.guest_id].group,
                subgroup: 0,
                content: `${data.guest_id} detected via ${data.device} with id: ${data.device_id} and event: ${data.event} and time: ` + data.displayableTime,
                id: data.id,

            };
        } catch {
            debugger;
        }
        timelineList.push(item);
    }

    var items = new vis.DataSet(timelineList);

    //TODO: make max and min dynamic based on data 
    var options = {
        margin: {
            item: {
                horizontal: -1,
                vertical: 5
            },
            axis: 0
        },
        maxHeight: 600,
        stack: false,
        max: new Date(1578236760 * 1000),
        min: new Date(1578151800 * 1000),
        groupHeightMode: 'fixed',
        maxMinorChars: 4,
        tooltip: {
            template: function (data, parsedItemData) {
                return `<span >${data.content}</span>`;
            }
        }
    };
    var groups = [];
    for (key in peopleInfo) {
        groups.push({
            id: peopleInfo[key].group,
            content: key
        });
    }
    timeline = new vis.Timeline(container, items, groups, options);

    timeline.on("click", function (properties) {
        if (properties.item != null) {
            //Update current time DOM
          
            updateInfoDOM(murderData[properties.item]);
            //Take all data before this event
            murderDataBeforeTime = murderData.slice(0, properties.item)
            //TODO give it to paulina's code.

        }




    });


    //Old code using timeline.js
    /*
    timelineJSON = {events : []}; //json format for slideshow
    
    for (let data of murderData){
        let dateObj = {
            year : data.time.getFullYear(),
            month : data.time.getMonth(), 
            day : data.time.getDay(),
            hour : data.time.getHours(),
            minute : data.time.getMinutes(),
            seconds : data.time.getSeconds() 
        };
        
        //dateObj.display_date //TODO: Enable for customized display format //https://timeline.knightlab.com/docs/json-format.html#json-date

        let slideObj = {start_date : dateObj};
        slideObj.unique_id = data.id;
        slideObj.text = {
            headline: `${data.guest_id} detected via ${data.device}`,
            text: `${data.guest_id} detected via ${data.device} with id: ${data.device_id} and event: ${data.event}`
        }
        
        timelineJSON.events.push(slideObj);

    }

    timeline = new TL.Timeline(
        'timeline-embed',
        timelineJSON,
        //options
        { 
            timenav_position: 'top',
            scale_factor: 400,
            optimal_tick_width: 100
        }
    );
    */
}


window.onload = createPage;