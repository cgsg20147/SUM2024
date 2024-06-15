let flag = true;
class _chat {
  constructor(user1, user2) {
    this.user2 = String(user2);
    this.user1 = String(user1);
    this.messages = [];    
  }
  addmsg(msg, from, to) {    
    let m
    const date = new Date();
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    const t = dateFormatter.format(date);

    if (user.name == from) {
      m = $('<div class="message_entry" style = "border-radius: 30px 0px 30px 30px;"></div>');
      m.html(`<div class='message_head' style = 'font-size: 10px; margin-left: calc(100% - ${from.length}ex - 7px);'>` + 
        from + "</div><div class='message_body'><p class='msg'>" + msg + "</p><div style = 'text-align: right; font-size: 7px; padding-right: 15px;color: gray;opacity: 0.7'>" + t + "</div></div>");
    }
    else {
      m = $('<div class="message_entry" style = "border-radius: 0px 30px 30px 30px;"></div>');
      m.html("<div class='message_head' style = 'font-size: 10px; margin-left: 7px'>" + 
        from + "</div><div class='message_body'><p class='msg'>" + msg + "</p><div style = 'text-align: right; font-size: 7px; padding-right: 15px;color: gray;opacity: 0.7'>" + t + "</div></div>");
    }
    m.dblclick(() => {
      m.remove();
    });
    m.prependTo("#messages");
    //$("#txt").appendTo("#mlist");
    //$("#send").appendTo("#mlist");
    $("#txt").val("");
    this.messages[this.messages.length] = {msg: m, from: from, to: to};
  }
  unshow() {
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].msg == undefined)
        this.messages.splice(i, 1)
      else
        this.messages[i].msg.hide();
    }
  }
  show() {
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].msg == undefined)
        this.messages.splice(i, 1);
      else if (this.messages[i].msg.from == user.name) {
        this.messages[i].msg.css("border-radius", "30px 0px 30px 30px;")
        this.messages[i].msg.show();
      }
      else {
        this.messages[i].msg.css("border-radius", "0px 30px 30px 30px;");
        this.messages[i].msg.show();
      }
    }
  }
}
function createChat(...args) {
  return new _chat(...args);
}

class _user {
  constructor(name) {
    this.name = String(name);
    this.chats = [];
    this.active = null;
  }
  switchChat(to) {
    let newc = null;
    newc = this.findChat(to);
    if (this.active != null)
      this.active.unshow();
    if (newc != null) {
      newc.show();
      this.active = newc;
    }
    else
      this.active = this.chats[this.chats.length] = createChat(this.name, to);
  }
  findChat(uname) {
    for (i = 0; i < this.chats.length; i++)
      if (this.chats[i].user1 == uname || this.chats[i].user2 == uname)
        return this.chats[i];
    this.chats[this.chats.length] = new _chat(this.name, uname);
    return this.chats[this.chats.length - 1];
  }
  indChat(uname) {
    for (i = 0; i < this.chats.length; i++)
      if (this.chats[i].user1 == uname || this.chats[i].user2 == uname)
        return i;
    return -1;
  }
}
function addUser(name) {
  for (i = 0; i < users.length; i++)
    if (users[i].name == name)
      return users[i];
  users[users.length] = new _user(name);
  return users[users.length - 1];
}

let socket = new WebSocket("ws://localhost:4747");;
let users = [];
let user = null, user2 = null;

$(document).ready(function() {
  socket.onmessage = (msg) => {
    let data = JSON.parse(msg.data.toString());
    if (user != null) {
      if (data.from != user.name && user.name != data.to) {
        let newuser = addUser(data.from);
        newuser.switchChat(data.to);
        newuser.active.addmsg(data.msg, data.from, data.to);
        let newuser2 = addUser(data.to);
        let i = newuser2.indChat(data.from);
        newuser2.chats[i == -1 ? newuser2.chats.length : i] = newuser.active;
        newuser.active.unshow();
        newuser.active = null;
        }
      else if (user2.name != data.from && user.name != data.from) {
        let newuser2 = addUser(data.from);
        let to;
        if (user.name == user.active.user1)
          to = user.active.user2;
        else
          to = user.active.user1;
        user.switchChat(data.from);
        user.active.addmsg(data.msg, data.from, data.to);
        let i = newuser2.indChat(data.from);
        newuser2.chats[i == -1 ? newuser2.chats.length : i] = user.active;
        user.switchChat(to);
      }
      else if (user.active.user1 != data.to && user.active.user2 != data.to) {
        let to;
        if (user.name == user.active.user1)
          to = user.active.user2;
        else
          to = user.active.user1;
        user.switchChat(data.to);
        user.active.addmsg(data.msg, data.from, data.to);          
        user.switchChat(to);
        }
      else
        user.active.addmsg(data.msg, data.from, data.to);
      }
    else {
      user = addUser(data.to);
      user2 = addUser(data.from);
      user.switchChat(user2.name);
      user.active.addmsg(data.msg, data.from, data.to);
      let i = user2.indChat(user.name);      
      user2.chats[i == -1 ? user2.chats.length : i] = user.findChat(user2.name);
      if ((data.to != $("#nic").val() || data.from != $("#nic2").val()) && (data.to != $("#nic2").val() || data.from != $("#nic").val())) {
        user.active.unshow();
        user.active = null;
        user = null;
        user2 = null;
      }
    }
    }
    $("#send").click((e) => {
      if (flag) {
        socket.send(JSON.stringify({msg: "sysload"}));
        flag = false;
      }
      if ($("#nic").val() == "" || $("#txt").val() == "" || $("#nic2").val() == "")
        return;
      if (user != null && (user.name != $("#nic").val() || user2.name != $("#nic2").val()))
        user.active.unshow();
      user = addUser($("#nic").val());
      user2 = addUser($("#nic2").val());
      let i = user2.indChat(user.name);
      user2.chats[i == -1 ? user2.chats.length : i] = user.findChat(user2.name);
      user.switchChat(user2.name);
      socket.send(JSON.stringify({msg: $("#txt").val(), from: user.name, to: user2.name}));
      user.active.addmsg($("#txt").val(), user.name, user2.name);
  });
});