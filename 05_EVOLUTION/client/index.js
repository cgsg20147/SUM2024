import * as base from "./base.js"

let users = [], myname, laurazia = {plants: [], entities: []}, gondvana = {plants: [], entities: []}, ocean = {entities: []}, turn = false, phase;

let socket = new WebSocket("ws://localhost:4747"), continent;
$(document).ready(function() {
    $("#viewt").css("display", "none");
    $("#laurazia").css("display", "none");
    $("#ocean").css("display", "none");
    $("#gondvana").css("display", "none");
    $("#readyb").click(() => {
        ready();
        $("#readyb").css("display", "none");
        socket.send(JSON.stringify({event: "ready", name: myname}));
    });
    $("#viewt").click(() => {
        if ($("#viewt").val() == "карты") {
            $("#laurazia").css("display", "none");
            $("#ocean").css("display", "none");
            $("#gondvana").css("display", "none");
            $("#table").css("display", "flex");
            $("#viewt").val("назад");
        }
        else {
            $("#laurazia").css("display", "flex");
            $("#ocean").css("display", "flex");
            $("#gondvana").css("display", "flex");
            $("#table").css("display", "none");
            $("#viewt").val("карты");
        }
    });
    $("#laurazia").dblclick(() => {
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
    $("#gondvana").dblclick(() => {
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
    $("#ocean").dblclick(() => {
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
        let data = JSON.parse(msg.data.toString());
        switch (data.event) {
        /* giving new cards for gamer */
        case "cards":
            users[data.name].cards = users[data.name].cards.concat(data.cards);
            if (data.name == myname)
                createCards(data.cards);
            break;
        /* adding new user(only before game start) */
        case "new user":
            users[data.user.name] = data.user;
            break;
        /* creating new entity */
        case "new entity":
            createEnt(data.name, data.continent);
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
            if (users[myname].lider == true) {
                let flag = undefined;                
                while (flag != true && flag != false) {
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
            $("#laurazia").css("display", "flex");
            $("#ocean").css("display", "flex");
            $("#gondvana").css("display", "flex");
            $("#viewt").css("display", "block");
            if (myname != data.name)
                break;
            else {
                phase = data.phase;
                window.alert("Ваш ход");
                turn = true;
            }
            break;
        /* growing all plants */
        case "grow":
            for (let i = 0; i < laurazia.plants.length; i++)
                base.grow(laurazia.plants[i]);
            for (let i = 0; i < gondvana.plants.length; i++)
                base.grow(gondvana.plants[i]);
            break;
        }

    };
});
/* creating entity DOM function(not ready yet) */
function createEnt(name, continent) {
    let entity = new base._entity();
    users[data.name].entity.push(entity);
    entity.continent = data.continent;
    if (data.continent == "laurazia")
        laurazia.entities.push(entity);
    else
        gondvana.entities.push(entity);
    let e = $('<div class = "entity"></div>');
    e.appendTo("#" + continent);
}
/* ending turn and move to next player */
function next() {
    turn = false;
    socket.send(JSON.stringify({event: "next"}));
}
function ready() {
    myname = null
    let flag = false;
    while (flag == false) {
        if ((myname = window.prompt("Введите имя")) == null || myname == "")
            window.alert("Нельзя играть, не представившись!")
        else
            flag = true;
    }
    users[myname] = new base._user();
    socket.send(JSON.stringify({event: "new user", name: myname}));
}
function createCards(cards) {
    for (let i = 0; i < cards.length; i++) {
        let c = $('<div class = "card"></div>');
        let flag = cards[i].addStarv == 0 ? false : true;
        if (flag)
            c.html(`<div class = "cardName">${cards[i].name}` + 
                `<p class = "addStarv">+${cards[i].addStarv}</p></div>` +
                `<div class = "description" style = "margin-top: 80%">${cards[i].description}</div>`);
        else
            c.html(`<div class = "cardName">${cards[i].name}` +
                `<div class = "description" style = "margin-top: 100%">${cards[i].description}</div>`);
        c.appendTo($("#table"));
    }
}