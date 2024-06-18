import * as base from "./base.js"

let users = [], user, laurazia = {plants: [], entities: []}, gondvana = {plants: [], entities: []}, ocean = {entities: []}, turn = false;

let socket = new WebSocket("ws://localhost:4747"), continent;
$(document).ready(function() {    
    $("#laurazia").click(() => {
            if (continent != "laurazia") {
                /* laurazia unfolding */
                $("#laurazia").css("width", "1900px");
                $("#laurazia").css("height", "1000px");
                $("#laurazia").css("margin", "0");
                $("#gondvana").css("display", "none");
                continent = "laurazia";
            }
            else {
                /* laurazia folding */
                $("#laurazia").css("width", "80%");
                $("#laurazia").css("height", "80%");
                $("#laurazia").css("margin-left", "10%");
                $("#laurazia").css("margin-top", "3%");
                $("#gondvana").css("display", "flex");
                continent = null;
            }
    });
    $("#gondvana").click(() => {
        if (continent != "gondvana") {
            /* Gondvana unfolding */
            $("#gondvana").css("width", "1900px");
            $("#gondvana").css("height", "1000px");
            $("#gondvana").css("margin", "0");
            $("#laurazia").css("display", "none");
            $("#ocean").css("display", "none");
            continent = "gondvana";
        }
        else {
            /* Gondvana unfolding */
            $("#gondvana").css("width", "85%");
            $("#gondvana").css("height", "85%");
            $("#gondvana").css("margin-left", "7.5%");
            $("#gondvana").css("margin-bottom", "3%");
            $("#laurazia").css("display", "flex");
            $("#ocean").css("display", "flex");
            continent = null;
        }
});
    $("#ocean").click(() => {
        if (continent != "ocean") {
            /* Ocean unfolding */
            $("#ocean").css("width", "1900px");
            $("#ocean").css("height", "1000px");
            $("#ocean").css("margin", "0");
            $("#laurazia").css("display", "none");
            $("#gondvana").css("display", "none");
            continent = "ocean";
        }
        else {
            /* Ocean folding */
            $("#ocean").css("width", "85%");
            $("#ocean").css("height", "85%");
            $("#ocean").css("margin-left", "7.5%");
            $("#ocean").css("margin-bottom", "3%");
            $("#laurazia").css("display", "flex");
            $("#gondvana").css("display", "flex");
            continent = null;
        }
    });
    /* processing messages function */
    socket.onmessage = (msg) => {
        /* gettind object data from message */
        let data = JSON.parse(msg.toString());
        switch (data.event) {
        /* giving new cards for gamer */
        case "cards":
            users[data.name].cards = users[data.name].cards.concat(data.cards);
            break;
        /* adding new user(only before game start) */
        case "new user":
            users[data.name] = new base._user();
            break;
        /* creating new entity */
        case "new entity":
            let entity = new base._entity()
            users[data.name].entity.push(entity);
            entity.continent = data.continent;
            if (data.continent == "laurazia")
                laurazia.entities.push(entity);
            else
                gondvana.entities.push(entity);
            break;
        /* creating new plant */
        case "new plant":
            if (data.plant.continent == "laurazia")
                laurazia.plants.push(data.plant);
            else
                gondvana.plants.push(data.plant);
            break;
        /* lider choose continent for new plant */
        case "choose plant":
            if (user.lider == true) {
                let flag = none;                
                while (flag != true || flag != false) {
                    /* call choosing window */
                    let a = window.prompt("Континент для нового растения:", "Лавразия/Гондвана");
                    if (a == "Лавразия")
                        flag = true;
                    else if (a == "Гондвана")
                        flag = false;
                    else
                        window.alert("Нет такого континента!");
                }
                /* send lider's choose */
                socket.send(JSON.stringify({event: "new plant", continent: flag == true ? "laurazia" : "gondvana"}));
            }
            break;
        /* setting new lider */
        case "new lider":
            for (let us of users)
                if (us.lider == true)
                    us.lider = false;
            users[data.name].lider = true;
            break;
        /* gamer's turn */
        case "move":
            if (user.name != data.name)
                break;
            else {
                window.alert("Your turn");
                turn = true;
            }
            break;
        /* growing all plants */
        case "grow":
            for (let i = 0; i < laurazia.plants.length; i++)
                laurazia.plants[i].grow();
            for (let i = 0; i < gondvana.plants.length; i++)
                gondvana.plants[i].grow();
            break;
        }

    };
});
/* creating entity DOM function(not ready yet) */
function createEnt() {
    let e = $('<div class = "entity"></div>')
}
/* ending turn and move to next player */
function next() {
    turn = false;
    socket.send(JSON.stringify({event: "next"}));
}