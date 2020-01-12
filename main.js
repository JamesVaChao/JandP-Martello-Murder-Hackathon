


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


/*Features to add

- Click on room and gives a history of whose been there
- Door tracking of opening and closing states
- Wifi connection implementation
- Cross referencing information to rank probability of killer

*/

console.log("Hello Jams");
colorList = ['red', 'orange','lime','green','blue','purple','pink','grey','brown','aqua']
data = [{room: "156", name:"Veronica"}, {room: "156", name:"James"},{room: "156", name:"P"}]
peopleList = new Map();

colorCount = 0;
idCount=1;
for (d of data){
    if(!peopleList.has(d.name)){
        var newObj = {room: d.room,color: colorList[colorCount],id:idCount}
        idCount++;
        colorCount++;
        peopleList.set(d.name,newObj)

    }
    else{
        var oldObj = peopleList.get(d.name)
        oldObj.room = d.room;
        peopleList.set(d.name,oldObj)
    }
}

//go through the data and make a room list
/*
roomList = new Map();
var peopleCount = 0;
var currX = peopleCount * 5;
var currY = 0;
for (d of data){
    if(!roomList.has(d.room)){
        var newObj = {people: peopleCount,x:currX,y:currY}
        peopleCount++;
        roomList.set(d.room,newObj)
    }
    else{
        var oldObj = peopleRoom.get(d.room)
        peopleList.set(d.room,oldObj)
    }
}
*/

roomList = new Map(Object.entries({

    //first floor

    "110" : {x: 200, y: 200, peopleCount: 0}, 
    "130" : {x: 200, y: 510, peopleCount: 0}, 
    "100": {x: 200, y: 410, peopleCount: 0},
    "reception": {x: 200, y: 665, peopleCount: 0},
    "101" : {x: 715, y: 185, peopleCount: 0}, 
    "151" : {x: 715, y: 225, peopleCount: 0},
    "155" : {x: 880, y: 185, peopleCount: 0}, 
    "150" : {x: 1050, y: 390, peopleCount: 0},
    "105" : {x: 430, y: 520, peopleCount: 0} ,
    "elevator" : {x: 480, y: 380, peopleCount: 0},
    "152" : {x: 715, y: 520, peopleCount: 0},
    "154" : {x: 830, y: 520, peopleCount: 0},
    "156" : {x: 940, y: 520, peopleCount: 0},
    "156B" : {x: 940, y: 620, peopleCount: 0},

    //second floor
    "210" : {x: 210, y: 760, peopleCount: 0},  
    "231" : {x: 350, y: 760, peopleCount: 0}, 
    "233" : {x: 490, y: 760, peopleCount: 0},
    "235" : {x: 630, y: 760, peopleCount: 0}, 
    "241" : {x: 780, y: 760, peopleCount: 0}, 
    "247" : {x: 910, y: 760, peopleCount: 0},
    "248" : {x: 910, y: 1090, peopleCount: 0}, 
    "244" : {x: 780, y: 1090, peopleCount: 0},
    "236" : {x: 640, y: 1110, peopleCount: 0}, 
    "234" : {x: 480, y: 1110, peopleCount: 0}, 
    "232" : {x: 350, y: 1110, peopleCount: 0}, 
    "elevator" : {x: 490, y: 950, peopleCount: 0},  
    "250" : {x: 1050, y: 950, peopleCount: 0},  
    "200" : {x: 780, y: 950, peopleCount: 0},  
}));

//The final result looks like 
//roomList = {"155" : {peopleCount: 0, x: 100, y: 200}} //x and y are based off where the circle is

//for people in peoplelist
    //playerx = roomlist.get (people.room).x + roomlist.get (people.room).people * 5
    //playerty = roomlist.get (people.room).y
  //$(id).attr(cx, playerx)
  //$(id).attr(fill, people.color)

for (p of peopleList){
    var currRoom = p[1].room;
    var playerX = roomList.get(currRoom).x + roomList.get(currRoom).peopleCount*10
    roomList.get(currRoom).peopleCount++;
    var playerY = roomList.get(currRoom).y
    $('#c'+p[1].id).attr("fill", p[1].color)
    $('#c'+p[1].id).attr("cx", playerX);
    $('#c'+p[1].id).attr("cy", playerY);
}
  



/*
cont = 0;
for d in data
    if (d.name not in peoplelist){
        
    }
/*
console.log people map
/*
using data set, plot points in those rooms.
start with data (data object)
//create empty list of people and location,k peoplelocationlist
//go through main list of data murderdata
//fill an object with people
peopleList = {"Veronica" : {location: "room", color: "red"}, "James": {location: "room"}}
peopleList.Veronica
peopleList.Veronica.location
peopleList.Veronica.color
//for each event
    //check if person already exist in the list peoplelocationlist
        //if there we update person location to new room
    //if not, we add their info to list
*/

///
//data = [{room: "110", name:"Veronica"}, {room: "110", name:"James"}]