import * as base from "./client/base.js"
import { collection } from "./main.js";

/* Global variables (later they will be in one object) */
let users = [], cycle = ["upturn", "evolution", "alimentation", "extincion"], phase = -1, deathQueue = [], noofu = 0, liderind = -2, moveind = 0, id = 0, wss;

/* processing messages function */
export async function processmsg(wssa, ws, msg) {
    switch(msg.event) {
    /* connecting a new user */
    case "new user":
        if (phase == -1) {
            users[noofu++] = users[msg.name] = new base._user();
            if (liderind == -2) {
                users[msg.name].lider = true;
                liderind = -1;
                wss = wssa;
            }
            users[msg.name].name = msg.name;
        }
        break;

    /* one of users ends his turn in phase */
    case "ready":
        users[msg.name].ready = true;
        let flag = true;
        for (let user of users)
            if (user.ready == false)
                flag = false;
        if (noofu == 1)
            break;
        if (liderind == -1)
            for (let user of users)
                sendAll({event: "new user", user: user});
        /* if all users are ready, game starts */
        if (flag) {
            if (phase == -1) {
                let noofp = 0;

                /* choosing start number of plants from number of gamers */
                switch (noofu) {
                case 1:
                    break;
                case 2:
                    noofp = 2;
                    break;
                case 3:
                    noofp = 3;
                    break;
                case 3:
                    noofp = 4;
                    break;
                case 4:
                    noofp = 5;
                    break;
                default:
                    noofp = 6;
                    break;
                }

                /* setting plants */
                for (let i = 0; i < noofp; i++) {
                    let plant = base.plants[base.rand() % base.plants.length];
                    plant.id = id++;
                    if (i % 2 == 0) {
                        plant.continent = "laurazia";
                        addPlantity("laurazia", "plant", plant);
                        sendAll({event: "new plant", plant: plant});
                    }                        
                    else {
                        plant.continent = "gondvana";
                        addPlantity("gondvana", "plant", plant)
                        sendAll({event: "new plant", plant: plant});
                    }
                }
            }

            /* set new phase and leader, reset 'ready' status */
            phase = (phase + 1) % 4;
            liderind = (liderind + 1) % noofu;
            moveind = liderind;
            for (let user of users)
                user.ready = false;
            /* game start */
            cyclef();
        }
        break;

    /* next gamer move */
    case "next":
        moveind = (moveind + 1) % noofu;
        sendAll({event: "move", name: users[moveind].name, phase: cycle[phase]});
        break;
    /* the leader choosed continent for new plant */
    case "new plant":
        let plant = base.plants[base.rand() % base.plants.length];
        plant.id = id++;
        plant.continent = msg.continent;
        addPlantity(msg.continent, "plant", plant);
        sendAll({event: "new plant", plant: plant})
        break;
    case "new entity":
        let entity = new base._entity(msg.name);
        entity.id = id++;
        entity.continent = msg.continent;
        addPlantity(msg.continent, "entity", entity);
        sendAll({event: "new entity", entity: entity})
        break;
    case "new property":
        for await (let entity of collection.find({id: Number(msg.id)})) {
            entity.data.internals[msg.card.prop.name] = msg.card.prop.value;
            entity.data.necFood += msg.card.addStarv;
            changePlantity(Number(msg.id), "entity", entity.data, "change");
            sendAll({event: "new property", id: Number(msg.id), prop: msg.card.prop, addstarv: msg.card.addStarv});
        }
        break;
    case "death":
        addPlantity("deathQueue", msg.type, msg.data);
        break;
    }
}

/* starting new cycle function */
async function cyclef() {
    /* choosing next mover from current phase */
    switch (cycle[phase]) {
    /* first resource allocation phase */
    case "upturn":
        /* cheking users entities for number of new cards */
        let cnt = 0, continents = [], c = 0;
        for (let user of users) {
            for (let i = 0; i < user.entity.length; i++)
                if (user.entity[i].r_strategy != true)
                    cnt++;
                else {
                    continents[c++] = user.entity[i].continent;
                    continents[c++] = user.entity[i].continent;
                }
            if (cnt == 0)
                cnt = 10;

            /* setting cards */
            let cards = [];
            for (let j = 0; j < cnt; j++)
                cards[j] = base.cards[base.rand() % base.cards.length];
            sendAll({event: "cards", name: user.name, cards: cards});

            /* creating entities from r-strategy entities */
            if (c > 0)
                for (let k = 0; k < c; k++)
                    sendAll({event: "new entity", name: user.name, continent: continents[k]});
        }
        /* growing all plants */
        for await (let continent of collection.find({continent: "laurazia"}))
            for (let k = 0; k < continent.plants.length; k++) {
                base.grow(continent.plants[k]);
                changePlantity(continent.plants[k].id, "plant", continent.plants[k], "change")
            }
        for await (let continent of collection.find({continent: "gondvana"}))
            for (let k = 0; k < continent.plants.length; k++) {
                base.grow(continent.plants[k]);
                changePlantity(continent.plants[k].id, "plant", continent.plants[k], "change")
            }
            sendAll({event: "grow"});

            /* setting new plants */
            for await (let laurazia of collection.find({continent: "laurazia"}))
                for await (let gondvana of collection.find({continent: "gondvana"}))
                    if (laurazia.plants.length > gondvana.plants.length) {
                        let plant = base.plants[base.rand() % base.plants.length];
                        plant.id = id++;
                        addPlantity("gondvana", "plant", plant)
                        sendAll({event: "new plant", plant: plant});
                    }
                    else if (gondvana.plants.length > laurazia.plants.length) {
                        addPlantity("laurazia", "plant", plant);
                        sendAll({event: "new plant", plant: plant});
                        let plant = base.plants[base.rand() % base.plants.length];
                        plant.id = id++;
                    }
                    else
                        sendAll({event: "choose plant"}); /* lider is choosing place for new plant */
            phase++;
            cyclef();
            break;
        /* evolution phase */
        case "evolution":    
            /* start evolution gamers movecycle */
            sendAll({event: "move", name: users[liderind].name, phase: "evolution"});
            break;
        /* alimentation phase */
        case "alimentation":
            /* start alimentation gamers movecycle */
            sendAll({event: "move", name: users[liderind].name, phase: "alimentation"});
            break;
        /* axtincion phase */
        case "extincion":
            /* clearing deathQueue */
            for (let dead of deathQueue)
                sendAll({event: "death", id: dead.id});
            deathQueue = [];
            break;
        }
}
/* sending message to all users function */
function sendAll(msgobj) {
    for (let client of wss.clients)
        client.send(JSON.stringify(msgobj));
}
function getPlantity(pid) {
    for (let plantity of collection.find({id: pid}))
        return plantity;
}
async function changePlantity(pid, type, data, move) {
    if (move == "change") 
            collection.replaceOne({id: pid, type: type}, {id: pid, type: type, data: data});
    else
        collection.deleteOne({id: pid});
    let oldplantity;
    for await (oldplantity of collection.find({id: pid}))
        for await (let plantity of collection.find({continent: oldplantity.data.continent})) {
            for (let i = 0; i < plantity.plants.length; i++)
                if (plantity.plants[i].id == pid) {
                    if (move == "change")
                        plantity.plants[i] = data;
                    else
                        plantity.plants = plantity.plants.splice(i, 1);
                    delete plantity._id;
                    collection.replaceOne({continent: oldplantity.data.continent}, plantity);
                }
            for (let i = 0; i < plantity.entities.length; i++)
                if (plantity.entities[i].id == pid) {
                    if (move == "change")
                        plantity.entities[i] = data;
                    else
                        plantity.entities = plantity.entities.splice(i, 1);
                    delete plantity._id;
                    collection.replaceOne({continent: oldplantity.data.continent}, plantity);
                }
    }
}
async function addPlantity(continent, type, data) {
    if (continent == "laurazia" || continent == "gondvana") {
        for await (let plantity of collection.find({continent: continent})) {
            if (type == "plant") {
                plantity.plants.push(data);
                delete plantity._id;
                collection.replaceOne({continent: continent}, plantity);
            }
            else {
                plantity.entities.push(data);
                delete plantity._id;
                collection.replaceOne({continent: continent}, plantity);
            }
        }        
    }
    else if (continent == "ocean")
        for await (let plantity of collection.find({continent: continent}))     {
            plantity.entities.push(data);
            delete plantity._id;
            collection.replaceOne({continent: continent}, plantity);
    }
    else if (continent == "deathQueue")
        for await (let plantity of collection.find({continent: "deathQueue"})) {
            changePlantity(data, "delete")
            plantity.queue.push(data);
            delete plantity._id;
            collection.replaceOne({continent: continent}, plantity);
    }
    collection.insertOne({type: type, data: data, id: data.id});
}