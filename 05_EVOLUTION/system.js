import * as base from "./client/base.js"

/* Global variables (later they will be in one object) */
let users = [], cycle = ["upturn", "evolution", "alimentation", "extincion"], phase = -1, deathQueue = [], 
    laurazia = {plants: [], entities: []}, gondvana = {plants: [], entities: []}, ocean = {entities: []}, noofu = 0, liderind = -1, moveind = 0;

/* processing messages function */
export function processmsg(wss, ws, msg) {
    switch(msg.event) {
    /* connecting a new user */
    case "new user":
        if (phase == -1) {
            users[noofu++] = users[msg.name] = new base._user();
            if (liderind == -1) {
                users[msg.name].lider = true;
                liderind = 0;
            }
            for (let client of wss.clients)
                if (client != ws)
                    client.send(JSON.stringify({event: "new user", user: msg.name}));
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

        /* if all users are ready, game starts */
        if (flag) {
            if (phase == -1) {
                let noofp = 0;

                /* choosing start number of plants from number of gamers */
                switch (noofu) {
                case 1:
                    break;
                case 2:
                    noofp = 3;
                    break;
                case 3:
                    noofp = 4;
                    break;
                case 3:
                    noofp = 5;
                    break;
                case 4:
                    noofp = 6;
                    break;
                default:
                    noofp = 10;
                    break;
                }

                /* setting plants */
                for (let i = 0; i < noofp; i++)
                    if (i % 2 == 0) {
                        laurazia.plants.push(base.plants[base.rand() % base.plants.length])
                        sendAll({event: "new plant", plant: laurazia.plants[laurazia.plants.length - 1]});
                    }                        
                    else {
                        gondvana.plants.push(base.plants[base.rand() % base.plants.length])
                        sendAll({event: "new plant", plant: gondvana.plants[gondvana.plants.length - 1]});
                    }
            }

            /* set new phase and leader, reset 'ready' status */
            phase += (phase + 1) % 4;
            liderind = (liderind + 1) % noofu;
            moveind = liderind;
            for (let user of users)
                user.ready = false;

            /* game start */
            cyclef(wss, phase);
        }
        break;

    /* next gamer move */
    case "next":
        moveind = (moveind + 1) % noofu;
        for (let client of wss.clients)
        break;

    /* the leader choosed continent for new plant */
    case "new plant":
        break;
    case "new entity":
        break;
    }
}

/* starting new cycle function */
function cyclef(wss, phase) {
    /* choosing next mover from current phase */
    switch (phase) {
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
                for (j = 0; j < cnt; j++)
                    cards[i] = base.cards[base.rand() % base.cards.length];
                sendAll({event: "cards", name: user.name, cards: cards});

                /* creating entities from r-strategy entities */
                if (c > 0)
                    for (let k = 0; k < c; k++)
                        sendAll({event: "new entity", name: user.name, continent: continents[k]});
            }

            /* growing all plants */
            for (let i = 0; i < laurazia.plants.length; i++)
                laurazia.plants[i].grow();
            for (let i = 0; i < gondvana.plants.length; i++)
                gondvana.plants[i].grow();
            sendAll({event: grow});

            /* setting new plants */
            if (laurazia.plants.length > gondvana.plants.length) {
                gondvana.plants.push(base.plants[base.rand() % base.plants.length]);
                sendAll({event: "new plant", plant: gondvana.plants[gondvana.plants.length - 1]});
            }
            else if (gondvana.plants.length > laurazia.plants.length) {
                laurazia.plants.push(base.plants[base.rand() % base.plants.length]);
                sendAll({event: "new plant", plant: laurazia.plants[gondvana.plants.length - 1]});
            }
            else
                sendAll({event: "choose plant"}); /* lider is choosing place for new plant */
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
                sendAll({event: "death", entype: dead.entype});
            deathQueue = [];
            break;
        }
}
/* sending message to all users function */
function sendAll(msgobj) {
    for (let client of wss.clients)
        client.send(JSON.stringify(msgobj));
}