class _chat {
  constructor(user, to) {
    this.to = String(to);
    this.user = String(user);
    this.messages = [];    
  }
  addmsg(msg) {
    let m = $('<div class="message_entry"></div>');
  
    const date = new Date();
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    const t = dateFormatter.format(date);
    
    m.html("<div class='message_head' style = 'font-size: 10px; color: black; background-color: red;'>" + 
      this.user + "</div><div class='message_body'><p class='msg'>" + msg + "</p><div style = 'text-align: right; font-size: 7px'>" + t + "</div></div>");
    m.click(e => {
      $(e.target).next().slideToggle("fast");
      $(e.target).toggleClass("message_head_collapse");
      return false;
    });
    m.slideUp().appendTo("#mlist").slideDown("fast");
    $("#txt").appendTo("#mlist");
    $("#send").appendTo("#mlist")
    $("#txt").val("");
    this.messages[this.messages.length] = {msg: m, from: this.user, to: this.to};
    socket.send(this.messages[this.messages.length - 1]);
  }
  hide() {
    for (let i = 0; i < this.messages.length; i++) {
      this.messages[i].msg.hide();
    }
  }
  show() {
    for (let i = 0; i < this.messages.length; i++) {
      this.messages[i].msg.show();
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
    for (let i = 0; i < this.chats.length; i++) {
      if (this.chats[i].to == to)
        newc = this.chats[i];
    }
    if (this.active != null)
      this.active.hide();
    if (newc != null) {
      newc.show();
      this.active = newc;
    }
    else
      this.active = this.chats[this.chats.length] = createChat(this.name, to);
  }
}
export function addUser(name) {
  return new _user(name);
}

let socket = new WebSocket("ws://localhost:4747");;
let users = [];
let user = null;

$(document).ready(function() {
    $("#send").click((e) => {
      if ($("#nic").val() == "" || $("#txt").val() == "" || $("#nic2").val() == "")
        return;
      let buf = $("#nic").val() + "_to_" + $("#nic2").val() + ":" + $("#txt").val();
      if (user != null && user.name != $("#nic").val()) {
        user.active.hide();
        user = null;
        for (let i = 0; i < users.length; i++) {
          if (users[i].name == $("#nic").val())
            user = users[i];
        }
      }
      if (user == null) {
        users[users.length] = user = new _user($("#nic").val());
      }
      user.switchChat($("#nic2").val());
      user.active.addmsg($("#txt").val());
  });
});