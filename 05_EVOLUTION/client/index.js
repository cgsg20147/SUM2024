import * as base from "./base.js"

let users = [], myname, laurazia = {plants: [], entities: []}, gondvana = {plants: [], entities: []}, ocean = {entities: []}, turn = false, phase, active, skip = false,
myid = [], target;

let socket = new WebSocket("ws://localhost:4747"), continent;
$(document).ready(function() {
    $("#viewt").css("display", "none");
    $("#laurazia").css("display", "none");
    $("#ocean").css("display", "none");
    $("#gondvana").css("display", "none");
    $("#skip").click(() => {
        ready = true;
        active = null;
        skip = true;
        socket.send(JSON.stringify({event: "ready", name: myname}));
        next();
    });
    $("#readyb").click(() => {
        ready();
        $("#readyb").css("display", "none");
        socket.send(JSON.stringify({event: "ready", name: myname}));
    });
    $("#viewt").click(() => {
        if ($("#viewt").val() == "карты") {
            $("#table").css("top", "0px");
            $("#viewt").val("назад");
        }
        else {
            $("#table").css("top", "-1000px");            
            $("#viewt").val("карты");
        }
    });
    $('#laurazia, #gondvana, #ocean').click((event) => {
        if (turn == false)
            return;
        $("#laurazia, #gondvana, #ocean").css("border", "0px");
            if (active == event.currentTarget.id) {
                event.currentTarget.style.border = "0px";
                event.stopPropagation();
                active = null;
            }
            else {
                if (active != null)
                    $("#" + active).css("border", "0px");
                event.currentTarget.style.border = "solid 10px red";
                active = event.currentTarget.id;
                event.stopPropagation();
            }
    });
    $("#laurazia").dblclick(() => {
            if (continent != "laurazia") {
                /* laurazia unfolding */
                $("#laurazia").css("max-width", "100%");
                $("#laurazia").css("max-height", "100%");
                $("#gondvana").css("display", "none");
                $("#ocean").css("display", "none");
                $("#laurazia").css("width", "1900px");
                $("#laurazia").css("height", "1000px");
                $("#laurazia").css("margin", "0");
                $("#laurazia").children().css("opacity", "1");
                window.setTimeout(() => {
                    $("#laurazia").children().css("display", "flex");
                }, 300);
                continent = "laurazia";
            }
            else {
                /* laurazia folding */
                $("#laurazia").css("max-width", "80%");
                $("#laurazia").css("max-height", "80%");
                $("#laurazia").css("width", "80%");
                $("#laurazia").css("height", "80%");
                $("#laurazia").css("margin-left", "10%");
                $("#laurazia").css("margin-top", "3%");
                $("#laurazia").children().css("opacity", "0");
                window.setTimeout(() => {
                    $("#laurazia").children().css("display", "none");
                }, 1500);
                $("#gondvana").css("display", "flex");
                $("#ocean").css("display", "flex");
                continent = null;
            }
    });
    $("#gondvana").dblclick(() => {
        if (continent != "gondvana") {
            /* Gondvana unfolding */
            $("#gondvana").css("max-width", "100%");
            $("#gondvana").css("max-height", "100%");
            $("#laurazia").css("display", "none");
            $("#ocean").css("display", "none");
            $("#gondvana").css("width", "1900px");
            $("#gondvana").css("height", "1000px");
            $("#gondvana").css("margin", "0");
            $("#gondvana").children().css("opacity", "1");
            window.setTimeout(() => {
                $("#gondvana").children().css("display", "flex");
            }, 300);
            continent = "gondvana";
        }
        else {
            /* Gondvana unfolding */
            $("#gondvana").css("max-width", "80%");
            $("#gondvana").css("max-height", "80%");
            $("#gondvana").css("width", "80%");
            $("#gondvana").css("height", "80%");
            $("#gondvana").css("margin-left", "10%");
            $("#gondvana").css("margin-bottom", "3%");
            $("#gondvana").children().css("opacity", "0");
            window.setTimeout(() => {
                $("#gondvana").children().css("display", "none");
            }, 1500);
            $("#laurazia").css("display", "flex");
            $("#ocean").css("display", "flex");
            continent = null;
        }
});
    $("#ocean").dblclick(() => {
        if (continent != "ocean") {
            /* Ocean unfolding */
            $("#ocean").css("max-width", "100%");
            $("#ocean").css("max-height", "100%");
            $("#laurazia").css("display", "none");
            $("#gondvana").css("display", "none");
            $("#ocean").css("width", "1900px");
            $("#ocean").css("height", "1000px");
            $("#ocean").css("margin", "0");
            $("#ocean").children().css("opacity", "1");
            window.setTimeout(() => {
                $("#ocean").children().css("display", "flex");
            }, 300);
            continent = "ocean";
        }
        else {
            /* Ocean folding */
            $("#ocean").css("max-width", "80%");
            $("#ocean").css("max-height", "80%");
            $("#ocean").css("width", "80%");
            $("#ocean").css("height", "80%");
            $("#ocean").css("margin-left", "10%");
            $("#ocean").css("margin-bottom", "3%");
            $("#ocean").children().css("opacity", "0");
            window.setTimeout(() => {
                $("#ocean").children().css("display", "none");
            }, 1500);
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
        case "room size":
            let a, flag = false;
            while (flag ==  false) {
                if ((a = window.prompt("Размер комнаты:")) == null || a > 8 || Number(a) == NaN || a < 2)
                    window.alert("Нельзя взять такое количество людей!");
                else
                    flag = true;
            }
            socket.send(JSON.stringify({event: "room size", size: Number(a)}));
            break;
        /* giving new cards for gamer */        
        case "cards":
            if (data.name == myname) {
                createCards(data.cards);
                users[myname].cards = users[myname].cards.concat(data.cards);
            }
            break;
        /* adding new user(only before game start) */
        case "new user":
            users[data.user.name] = data.user;
            break;
        /* creating new entity */
        case "new entity":
            createEnt(data.entity, "entity");
            break;
        /* creating new plant */
        case "new plant":
            if (data.plant.continent == "laurazia")
                laurazia.plants.push(data.plant);
            else
                gondvana.plants.push(data.plant);
            createEnt(data.plant, "plant");
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
            if (phase != data.phase) {
                phase = data.phase;
                window.alert(`Фаза ${data.phase == "evolution" ? 'эволюции' : 'кормления'}`);
                if (data.phase == "alimentation") {
                    for (let i = 0; i < laurazia.entities.length; i++)
                        laurazia.entities[i].starvation = laurazia.entities[i].necFood;
                    for (let i = 0; i < gondvana.entities.length; i++)
                        gondvana.entities[i].starvation = gondvana.entities[i].necFood;
                    for (let i = 0; i < ocean.entities.length; i++)
                        ocean.entities[i].starvation = ocean.entities[i].necFood;
                    $(".e_food").css("display", "block");
                }
                else {
                    for (let i = 0; i < laurazia.entities.length; i++)
                        laurazia.entities[i].starvation = 0;
                    for (let i = 0; i < gondvana.entities.length; i++)
                        gondvana.entities[i].starvation = 0;
                    for (let i = 0; i < ocean.entities.length; i++)
                        ocean.entities[i].starvation = 0;
                    $(".e_food").css("display", "block");
                }
            }
            if (myname != data.name)
                break;
            else {
                phase = data.phase;
                window.alert("Ваш ход");
                turn = true;
                skip = false;
            }
            if (phase == "alimentation" || phase == "evolution")
                $("#skip").css("display", "block");
            else
                $("#skip").css("display", "none");
            break;
        /* growing all plants */
        case "grow":
            for (let i = 0; i < laurazia.plants.length; i++)
                base.grow(laurazia.plants[i]);
            for (let i = 0; i < gondvana.plants.length; i++)
                base.grow(gondvana.plants[i]);
            break;
        case "new property":
            let entity = null;
            for (let i = 0; i < laurazia.entities.length; i++)
                if (laurazia.entities[i].id == '_' + data.id)
                    entity = laurazia.entities[i];
            if (entity == null)
                for (let i = 0; i < gondvana.entities.length; i++)
                    if (gondvana.entities[i].id == '_' + data.id)
                        entity = gondvana.entities[i];
            if (entity == null)
                for (let i = 0; i < ocean.entities.length; i++)
                    if (ocean.entities[i].id == '_' + data.id)
                        entity = ocean.entities[i];
            if (entity.internals[data.prop.name] == true) {
                window.alert("У выбранного животного уже есть это свойство!");
                return;
            }
            entity.internals[data.prop.name] = data.prop.value;
            entity.necFood += data.addstarv;
            if (data.prop.name == "carnivorous")
                $("#" + entity.id).prop("class", `${myid.lastIndexOf(entity.id) == -1 ? 'e' : 'f'}_c_entity`);
            else
                $("#" + entity.id).html($("#" + entity.id).html() + `<p class = "property">${data.prop.name}</p>`);
            break;
        }

    };
});
/* creating entity DOM function(not ready yet) */
function createEnt(entity, type) {
    entity.id = '_' + entity.id;
    if (type == "entity")
        users[entity.owner].entity.push(entity);
    let e;
    if (entity.continent == "laurazia")
        if (type == "entity")
            laurazia.entities.push(entity);
        else
            laurazia.plants.push(entity);
    else if (type == entity)
        gondvana.entities.push(entity);
    else
        gondvana.plants.push(entity);
    if (type == "entity" && entity.owner != myname) {
        let flag = false;
        e = $(`<div class = 'e_l_entity' id = ${entity.id}></div>`);
        e.appendTo("#" + entity.continent[0] + "_entities");
        e.dblclick((event) => {
            if (flag) {
                event.currentTarget.style.transform = "rotateY(0deg)";
                flag = false;
            }
            else {
                event.currentTarget.style.transform = "rotateY(-180deg)";
                flag = true;
            }
            event.stopPropagation();
        });
        e.click((event) => {
            if (phase == "alimentation" && active != null) {
                let ent1 = null, ent2 = null;
                for (let i = 0; i < laurazia.entities.length; i++)
                    if (event.currentTarget.id == laurazia.entities[i].id)
                        ent2 = laurazia.entities[i];
                    if (active == laurazia.entities[i].id)
                        ent1 = laurazia.entities[i];
                if (ent1 == null || ent2 == null)
                    for (let i = 0; i < gondvana.entities.length; i++)
                        if (event.currentTarget.id == gondvana.entities[i].id)
                            ent2 = gondvana.entities[i];
                        if (active == gondvana.entities[i].id)
                            ent1 = gondvana.entities[i];
                if (ent1 == null || ent2 == null)
                    for (let i = 0; i < ocean.entities.length; i++)
                        if (event.currentTarget.id == ocean.entities[i].id)
                            ent2 = ocean.entities[i];
                        if (active == ocean.entities[i].id)
                            ent1 = ocean.entities[i];
                if (ent1 != null && ent2 != null) {
                    if (ent1.internals["carnivorous"] != true) {
                        window.alert("Это животное не хищное и не может атааковать");
                        event.stopPropagation();
                        return;
                    }
                    if (canAttack(ent1, ent2))
                        socket.send(JSON.stringify({event: "attack", entity: Number(ent1.id.substr(1)), target: Number(ent2.id.substr(1))}));
                    else
                        window.alert("Нельзя атаковать это животное!");
                    }
                event.stopPropagation();
            }
        });
    }
    else if (type == "entity") {
        let flag = false;
        e = $(`<div class = 'f_l_entity' id = ${entity.id}><p class = "e_food">${entity.maxFood - entity.starvation}/${entity.maxFood}</p></div>`);
        e.appendTo("#" + entity.continent[0] + "_entities");
        myid.push(entity.id);
        e.dblclick((event) => {
            if (flag) {
                event.currentTarget.style.transform = "rotateY(0deg)";
                flag = false;
            }
            else {
                event.currentTarget.style.transform = "rotateY(-180deg)";
                flag = true;
            }
            event.stopPropagation();
        });
        e.click((event) => {
            let ind = myid.lastIndexOf(event.currentTarget.id);
            if (ind == -1 || turn == false) {
                event.stopPropagation();
                return;
            }
            if (active == myid[ind]) {
                event.currentTarget.style.border = "0px";
                event.stopPropagation();
                active = null;
                return;
            }
            if (active != null);
                $("#" + active).css("border", "0px");
            $("#" + myid[ind]).css("border", "5px solid red");
            active = myid[ind];
            event.stopPropagation();
        });
    }
    else {
        e = $(`<div class = 'plant' id = ${entity.id} style = "${entity.carnivorous == true ? 'background-color: indianred' : 'backgroun-color: darkseagreen'}"></div>`);
        e.html(`<div class = "p_name">${entity.name} &nbsp&nbsp <p class = "food">${entity.food}/${entity.maxFood}<p class = "shield">${entity.shield}/${entity.maxShield}</p></p></div>` + 
            `<div class = "p_description></div>"`);
        e.appendTo("#" + entity.continent[0] + "_plants");
        if (entity.carnivorous == true)
            e.click((event) => {
                if (turn == false || phase != "alimentation") {
                    event.preventDefault();
                    return;
                }
                if (active == event.currentTarget.id) {
                    event.currentTarget.style.border = "0px";
                    active = null;
                    event.preventDefault();
                    return;
                }
                if (active != null) {
                    $("#" + active).css("border", "0px");
                }
                active = event.currentTarget.id;
                $("#" + active).css("border", "7px solid red");
                event.preventDefault();
        });
        myid.push(entity.id);
    }
    e.get(0).id = entity.id;
}
/* ending turn and move to next player */
function next() {
    turn = false;
    continent = null;
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
        c.click(() => {
            if (turn == false)
                return;
            if (phase == "evolution" && active != null && active[0] != '_' && window.confirm(`Положить ${cards[i].name} на ${active == "laurazia" ? "Лавразию" : "Гондвану"} как новое животное?`)) {
                $("#table").css("top", "-1000px");
                $("#viewt").val("карты");
                c.remove();
                $("#" + active).css("border", "0px");
                socket.send(JSON.stringify({event: "new entity", continent: active, name: myname}));
                active = null;
                next();
                delete cards[i];
            }
            else if (phase == "evolution" && active != null && active[0] == '_' && window.confirm(`Добавить свойство ${cards[i].name}?`)) {
                $("#table").css("top", "-1000px");
                $("#viewt").val("карты");
                c.remove();
                $("#" + active).css("border", "0px");
                socket.send(JSON.stringify({event: "new property", id: active.substr(1), card: cards[i]}))
                active = null;
                next();
                delete cards[i];
            }
            if (cards.length == 0)
                socket.send(JSON.stringify({event: "ready", name: myname}));
        });
        c.appendTo($("#table"));
    }
}
function canAttack(ent1, ent2) {

}