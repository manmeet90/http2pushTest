"use strict";

var app ={
    "onLoad" : function(){
        console.info("DOMContentLoaded event fired");
        app.bindEvents();
        app.updateUsersList();
    },

    "bindEvents" : function(){
        document.getElementById("btnSave").addEventListener("click", function(e){
            e.preventDefault();
            console.log(e);
            let formData = new FormData(document.getElementById("userForm"));
            if(formData){
                let user = new Person(formData.get("fname"), formData.get("lname"), formData.get("age"));
                app.users.push(user);
                app.updateUsersList();
            }
        }, false);
    },

    "updateUsersList" : function(){
        var nodes = [];
        app.users.forEach(user => {
            let _node = document.createElement("li");
            _node.innerText = user.getInfo();
            nodes.push(_node);
        });
        let root = document.getElementById("users");
        if(!root)
        return;
        root.innerHTML = "";
        nodes.forEach(_node => {
            root.appendChild(_node);
        });
        
    },

    "users" : []
};

document.addEventListener("DOMContentLoaded", app.onLoad, false);

