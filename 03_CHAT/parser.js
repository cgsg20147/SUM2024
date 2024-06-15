import { fs } from "./main.js";
let rawchats, chats = [], str;

export async function write(msg, from, to) {
    str += from + '♦' + to + '♣' + msg + '♠';
    await fs.writeFile("./base.txt", str)
}
function addmsg(msg, from, to) {
    for (let i = 0; i < chats.length; i++)
        if ((from == chats[i].user1 || from == chats[i].user2) && (to == chats[i].user1 || to == chats[i].user2)) {
            chats[i].messages[chats[i].messages.length] = {msg: msg, from: from, to: to};
            return;
        }
    chats[chats.length] = {user1: from, user2: to, messages: []}
    chats[chats.length - 1].messages[0] = {msg: msg, from: from, to: to};
}
export function processRaw() {
    rawchats = String(rawchats);
    rawchats = rawchats.split('♠');
    for (let i = 0, j = 0; i < rawchats.length; i++, j = 0) {
        if (rawchats[i][0] == undefined)
            continue;
        let user1 = [], user2 = [], msg = [], a;
        while (rawchats[i][j] != '♦')
            user1[j] = rawchats[i][j++];
        a = ++j;
        while (rawchats[i][j] != '♣')
            user2[j - a] = rawchats[i][j++];
        a = ++j;
        while (rawchats[i][j] != undefined)
            msg[j - a] = rawchats[i][j++];        
        addmsg(msg.join(''), user1.join(''), user2.join(''));
    }
    return chats;
}
export async function LoadChats() {
    rawchats = await fs.readFile("./base.txt");
    str = String(rawchats);
}