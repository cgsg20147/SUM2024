import { fs } from "./main.js";
let rawchats, nrawchats, chats = [], str;

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
    nrawchats = String(rawchats);
    nrawchats = nrawchats.split('♠');
    for (let i = 0, j = 0; i <nrawchats.length; i++, j = 0) {
        if (nrawchats[i][0] == undefined)
            continue;
        let user1 = [], user2 = [], msg = [], a;
        while (nrawchats[i][j] != '♦')
            user1[j] = nrawchats[i][j++];
        a = ++j;
        while (nrawchats[i][j] != '♣')
            user2[j - a] = nrawchats[i][j++];
        a = ++j;
        while (nrawchats[i][j] != undefined)
            msg[j - a] = nrawchats[i][j++];        
        addmsg(msg.join(''), user1.join(''), user2.join(''));
    }
    return chats;
}
export async function LoadChats() {
    rawchats = await fs.readFile("./base.txt");
    str = String(rawchats);
}