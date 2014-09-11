// Generated by CoffeeScript 1.7.1
var App, FBScript, PageScript;

App = {};

window.publishHelloWorld = (function(_this) {
  return function(page_id) {
    var pageToken;
    pageToken = document.getElementById("pageToken").innerHTML;
    return FB.api("/" + page_id + "/feed", "post", {
      message: "Hello, world! " + (Math.random(1000)),
      access_token: pageToken
    }, function(response) {
      return document.getElementById("publishBtn").innerHTML = "API response is " + response.id;
    });
  };
})(this);

window.pageLogin = (function(_this) {
  return function() {
    return FB.api("/me/accounts?fields=name,access_token,link", function(response) {
      var ALWAYS_FIRST_PAGE, autoSelected, i, li, list;
      list = document.getElementById("pagesList");
      if (response.error != null) {
        setPageMask('.loadingLogin');
      } else if (response.data != null) {
        i = 0;
        ALWAYS_FIRST_PAGE = true;
        if (response.data.length === 1 || ALWAYS_FIRST_PAGE) {
          autoSelected = response.data[0];
          document.getElementById("pageName").innerHTML = "<a href=\"" + autoSelected.link + "\">" + "<i class=\"fa fa-facebook-square\"></i>" + "</a> " + autoSelected.name;
          initApp(autoSelected.id);
        } else {
          while (i < response.data.length) {
            li = document.createElement("li");
            li.innerHTML = "<a href=\"" + response.data[i].link + "\">" + "<i class=\"fa fa-facebook-square\"></i>" + "</a> " + response.data[i].name;
            li.dataset.token = response.data[i].access_token;
            li.dataset.link = response.data[i].link;
            li.dataset.id = response.data[i].id;
            li.className = "btn-mini";
            li.onclick = function() {
              document.getElementById("pageName").innerHTML = this.innerHTML;
              initApp(this.dataset.id);
            };
            list.appendChild(li);
            i++;
          }
        }
      }
    });
  };
})(this);

window.requestPermission = function() {
  $('#pageName').text('');
  return $('#pageError').text('Please give this app requested permissions to use it :)');
};

window.requestLogin = function() {
  $('#pageName').text('');
  return $('#pageError').text('Please login to this app to use it :)');
};

window.setPageMask = (function(_this) {
  return function(maskSelector) {
    var am, nm;
    am = $('.activeMask');
    nm = $(maskSelector + "");
    if ($(am)[0] === $(nm)[0]) {
      return console.error("no change in mask");
    } else {
      am.velocity("transition.flipXOut");
      am.removeClass('activeMask');
      nm.velocity("transition.flipXIn");
      return nm.addClass('activeMask');
    }
  };
})(this);

window.initApp = (function(_this) {
  return function(page_id) {
    return FB.api("/" + page_id + "/promotable_posts", function(data) {
      if (data.data != null) {
        _this.feed = new App.FeedCollectionView({
          collection: new App.FeedCollection(_.map(data.data, function(s) {
            return new App.PostModel(s);
          }))
        });
        _this.feed.render();
        return $('#compose-btn').click(function() {
          this.compose = new App.ComposeView({
            model: new Backbone.Model({
              page_id: page_id
            })
          });
          return this.compose.renderComposeSelection();
        });
      }
    });
  };
})(this);

window.fetchInsightData = (function(_this) {
  return function(page_id) {
    console.log('pid');
    console.log(page_id);
    return FB.api("/" + page_id + "/insights/post_impressions?since=1410015034&until=1410315034", function(data) {
      if (data.error != null) {
        data.data = data.error;
      }
      if (data != null) {
        console.log(data);
        this.insighter = new App.PostInsightView({
          model: new Backbone.Model(data)
        });
        return this.insighter.render();
      }
    });
  };
})(this);

window.fbAsyncInit = (function(_this) {
  return function() {
    FB.init({
      appId: document.getElementById("fb-root").getAttribute("data-app-id"),
      status: true,
      cookie: true,
      xfbml: true
    });
    FB.Event.subscribe('auth.login', function(response) {
      return window.location = window.location;
    });
    FB.Canvas.setAutoGrow();
    return FB.getLoginStatus(function(data) {
      var accessToken, uid;
      if (data.status === "connected") {
        console.log("connected data");
        console.log(data);
        uid = data.authResponse.userID;
        accessToken = data.authResponse.accessToken;
        return FB.api("/me", function(data) {
          setPageMask('.content');
          return pageLogin();
        });
      } else if (data.status === "not_authorized") {
        return setPageMask('.loadingPermission');
      } else {
        return setPageMask('.loadingLogin');
      }
    });
  };
})(this);

PageScript = document.getElementsByTagName("script")[0];

if (document.getElementById("FBScript")) {
  return;
}

FBScript = document.createElement("script");

FBScript.id = "FBScript";

FBScript.async = true;

FBScript.src = "//connect.facebook.net/en_US/all.js";

PageScript.parentNode.insertBefore(FBScript, PageScript);
