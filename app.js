(function(){
  "use strict";

  var Moosipurk = function() {

    // SINGLETON PATTERN
    if(Moosipurk.instance) {
      return Moosipurk.instance;
    }

    Moosipurk.instance = this; // this viitab moosipurgile

    this.routes = Moosipurk.routes;

    console.log(this);
    //console.log('moosipurgi sees');
    //Kõik muutujad, mis on üldised ja muudetavad
    this.currentRoute = null; // Hoian meeles, mis lehel olen
    this.interval = null;

    //Hoian kõiki purke siin
    this.jars = [];

    // Panen rakenduse tööle
    this.init();
    };

    // Kirjeldatud kõik lehed
    Moosipurk.routes = {
      "home-view": {
        render: function() {
          //Käivitan siis kui jõuan lehele
          console.log('JS avalehel');

          var seconds = 0;

          if(this.interval) {
            clearInterval(this.interval);
          }

          this.interval = window.setInterval(function() {
            seconds++;
            document.getElementById('counter').innerHTML = seconds;

          }, 1000);

          // Kui jõuan avalehele, käivitub timer, mis hakkab trükkima kulunud sekundeid
          // divi sisse #counter
          // hakkab 0st


        }
      },
      "list-view": {
        render: function() {
          console.log('JS loend');
        }
      },
      "manage-view": {
        render: function() {
          console.log('JS haldus');
        }
      }
    };

    //Kõik moosipurgi fn tulevad siia sisse
    Moosipurk.prototype = {
      init: function() {
        console.log('Rakendus OK');
        //Siia tuleb esialgne loogika

        //Vaatan, mis lehel olen, kui ei ole hashi lisan avalehe

        window.addEventListener('hashchange', this.routeChange.bind(this));

        console.log(window.location.hash);
        if(!window.location.hash) {
          window.location.hash = '#home-view';
        } else {
          //hash oli, käivitan routeChange function
          this.routeChange();
        }
        // Saan kätte purgid localStoragest, kui on
        if(localStorage.jars) {
          //Võtan stringi ja teen tagasi objektideks
          this.jars = JSON.parse(localStorage.jars);
          //console.log('laadisin localStoragest massiiivi ' + this.jars.length);

          //Tekitan loendi htmli
          this.jars.forEach(function(jar) {

            var new_jar = new Jar(jar.id, jar.title, jar.ingredients, jar.date);

            var li = new_jar.createHtmlElement();
            document.querySelector('.list-of-jars').appendChild(li);
          });
        } else {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
             console.log(xhttp.responseText);
             Moosipurk.instance.jars = JSON.parse(xhttp.responseText);

             Moosipurk.instance.jars.forEach(function(jar) {

               var new_jar = new Jar(jar.id, jar.title, jar.ingredients, jar.date);

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);
             });

             localStorage.setItem('jars', JSON.stringify(Moosipurk.instance.jars));

            }
          };
          xhttp.open("GET", "save.php", true);
          xhttp.send();

        }

        //Hakka kuulama hiireklõpse
        this.bindEvents();
      },
      bindEvents: function() {
        document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));

        // Kuulan trükkimist otsimisel
        document.querySelector('.search').addEventListener('keyup', this.search.bind(this));
      },

      search: function(event) {
        // otsikasti väärtus
        var needle = document.querySelector('.search').value.toLowerCase();
        console.log(needle);

        var list = document.querySelectorAll('ul.list-of-jars li');
        console.log(list);

        for(var i = 0; i < list.length; i++) {

          var li = list[i];

          //Yhe listitemi sisu tekst
          var stack = li.querySelector('.content').innerHTML.toLowerCase();
          // Kas otsisõna on sisus olemas
          if(stack.indexOf(needle) !== -1) {
            //olemas
            li.style.display = 'list-item';
          } else {
            // Ei ole
            li.style.display = 'none';
          }
        }
      },

      addNewClick: function(event) {
        //Lisa uus purk
        var title = document.querySelector('.title').value;
        var ingredients = document.querySelector('.ingredients').value;
        var date = document.querySelector('.date').value;
        if(title === "" || ingredients === "" || date === "") {
          this.showAnswer(false);
        } else {

          this.showAnswer(true);
          //console.log(title + ' ' + ingredients + ' ' + date);
          var id = guid();
          var new_jar = new Jar(id, title, ingredients, date);
          //console.log(new_jar);

          //Lisan massiivi purgi
          this.jars.push(new_jar);
          console.log(JSON.stringify(this.jars));
          // JSONI stringina salvestan localStorage'sse
          localStorage.setItem('jars', JSON.stringify(this.jars));

          //AJAX
          var xhttp = new XMLHttpRequest();

          //Mis juhtub kui päring lõppeb
          xhttp.onreadystatechange = function() {
            //console.log(xhttp.readyState);
            if (xhttp.readyState == 4 && xhttp.status == 200) {
             console.log(xhttp.responseText);
            }
          };

          //Teeb päringu
          xhttp.open("GET", "save.php?id="+ id +"&title="+ title +"&ingredients="+ ingredients +"&date="+ date +"", true);
          xhttp.send();


          var li = new_jar.createHtmlElement();
          document.querySelector('.list-of-jars').appendChild(li);
        }

      },
      showAnswer: function(bool) {
        if(bool === true) {
          document.querySelector('.answer').innerHTML = "<strong><p style='color: green;'>Salvestatud!</p></strong>";
        } else {
          document.querySelector('.answer').innerHTML = "<strong><p style='color: red;'>Palun täida kõik lahtrid!</p></strong>";
        }
      },
      routeChange: function(event) {
        this.currentRoute = window.location.hash.slice(1);

        // kas leht on olemas
        if(this.routes[this.currentRoute]) {

          this.updateMenu();

          console.log('>>> ' + this.currentRoute);
          //Käivitan selle lehe jaoks ettenähtud js
          this.routes[this.currentRoute].render();
        } else {
          // 404
          console.log("404");
          window.location.hash = "#home-view";
        }
      },
      updateMenu: function() {
        // Kui on mingil menüül klass active-menu siis võtame ära
        document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', "");

        // Käesolevale lehele lisan juurde
        document.querySelector('.' + this.currentRoute).className += " active-menu";


      },

      deleteJar: function(event) {
        //Span
        /*console.log(event.target);

        //Li
        console.log(event.target.parentNode);

        //UL
        console.log(event.target.parentNode.parentNode);

        //id
        console.log(event.target.dataset);*/

        var c = confirm("Oled kindel?");

        //Ei
        if(!c) {
          return;
        }

        var ul = event.target.parentNode.parentNode;
        var li = event.target.parentNode;

        ul.removeChild(li);

        var delete_id = event.target.dataset.id;

        //Kustutan objekti
        for(var i = 0; i < this.jars.length; i++) {
          if(this.jars[i].id == delete_id) {
            this.jars.splice(i, 1);
            break;
          }
        }


        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
           console.log("Kustutan " + delete_id);
          }
        };
        xhttp.open("GET", "save.php?delete=" + delete_id, true);
        xhttp.send();

        localStorage.setItem("jars", JSON.stringify(this.jars));


      }




    };

    var Jar = function(new_id, title, ingredients, date) {
      this.id = new_id;
      this.title = title;
      this.ingredients = ingredients;
      this.date = date;
    };

    Jar.prototype = {
      createHtmlElement: function() {
        // Anda tagasi ilus html
        // li
        //  span.letter
        //    M
        //  span.content
        //    title | ingredients

        var li = document.createElement('li');

        var span = document.createElement('span');
        span.className = 'letter';

        var letter = document.createTextNode(this.title.charAt(0));
        span.appendChild(letter);

        li.appendChild(span);

        var content_span = document.createElement('span');
        content_span.className = 'content';

        var content = document.createTextNode(this.title + ' | ' + this.ingredients + ' | ' + this.date);
        content_span.appendChild(content);

        li.appendChild(content_span);

        var span_delete = document.createElement('span');
        span_delete.style.color = "#FF0000";
        span_delete.style.cursor = "pointer";

        span_delete.setAttribute("data-id", this.id);

        span_delete.innerHTML = " Delete";
        li.appendChild(span_delete);

        span_delete.addEventListener("click", Moosipurk.instance.deleteJar.bind(Moosipurk.instance));

        return li;
      }
    };

    //Helper funktsioonid
    function guid(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
          d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }

    window.onload = function() {
      var app = new Moosipurk();

    };



}) ();
