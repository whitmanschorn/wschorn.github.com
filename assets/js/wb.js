// Generated by CoffeeScript 1.7.1
var App, FBScript, PageScript;

App = {};

window.publishHelloWorld = (function(_this) {
  return function() {
    var pageToken;
    pageToken = document.getElementById("pageToken").innerHTML;
    return FB.api("/me/feed", "post", {
      message: "Hello, world! " + (Math.random(1000)),
      access_token: pageToken
    }, function(response) {
      console.log("API response");
      console.log(response);
      return document.getElementById("publishBtn").innerHTML = "API response is " + response.id;
    });
  };
})(this);

window.pageLogin = (function(_this) {
  return function() {
    return FB.api("/me/accounts?fields=name,access_token,link", function(response) {
      var autoSelected, i, li, list;
      console.log(response);
      list = document.getElementById("pagesList");
      if (response.error != null) {
        setPageMask('.loadingLogin');
      } else if (response.data != null) {
        i = 0;
        if (response.data.length === 1) {
          autoSelected = response.data[0];
          document.getElementById("pageName").innerHTML = "<a href=\"" + autoSelected.link + "\">" + autoSelected.name + "</a>";
          document.getElementById("pageToken").innerHTML = autoSelected.access_token;
          initApp(autoSelected.access_token, autoSelected.id);
        } else {
          while (i < response.data.length) {
            li = document.createElement("li");
            li.innerHTML = "<a href=\"" + response.data[i].link + "\">" + response.data[i].name + "</a>";
            li.dataset.token = response.data[i].access_token;
            li.dataset.link = response.data[i].link;
            li.dataset.id = esponse.data[i].id;
            li.className = "btn btn-mini";
            li.onclick = function() {
              document.getElementById("pageName").innerHTML = this.innerHTML;
              document.getElementById("pageToken").innerHTML = this.dataset.token;
              initApp(this.dataset.token, this.dataset.id);
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
    console.log($(maskSelector));
    if ($(am)[0] === $(nm)[0]) {
      return console.log("no change");
    } else {
      am.velocity("transition.flipXOut");
      am.removeClass('activeMask');
      nm.velocity("transition.flipXIn");
      return nm.addClass('activeMask');
    }
  };
})(this);

window.initApp = function(token, page_id) {
  return FB.api("/" + page_id + "/feed", function(data) {
    if (data.data != null) {
      this.feed = new App.FeedCollectionView({
        collection: new App.FeedCollection(_.map(data.data, function(s) {
          return new App.PostModel(s);
        }))
      });
      return this.feed.render();
    }
  });
};

window.fetchInsightData = function(page_id) {
  return FB.api("/" + page_id + "/insights/page_impressions", function(data) {
    console.log("insight");
    console.log(data);
    if (data.data.length === 0) {
      data.data = 'No data for this time period';
    }
    if (data.data != null) {
      this.insight = new App.PostInsightView({
        model: new Backbone.Model({
          insight: data.data
        })
      });
      return this.insight.render();
    }
  });
};

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
