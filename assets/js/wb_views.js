// Generated by CoffeeScript 1.7.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Handlebars.registerHelper("relativeTime", function(timeString) {
  return moment(timeString).fromNow();
});

window.renderData = (function(_this) {
  return function() {
    return $('body').append(template(data));
  };
})(this);

App.PostModel = (function(_super) {
  __extends(PostModel, _super);

  function PostModel() {
    return PostModel.__super__.constructor.apply(this, arguments);
  }

  PostModel.prototype.initialize = function(options) {
    if ((options.is_published != null) && options.is_published === false) {
      return this.set('timestamp', options.scheduled_publish_time * 1000);
    } else {
      return this.set('timestamp', options.updated_time);
    }
  };

  return PostModel;

})(Backbone.Model);

App.PostView = (function(_super) {
  __extends(PostView, _super);

  function PostView() {
    return PostView.__super__.constructor.apply(this, arguments);
  }

  PostView.prototype.className = 'post-bar';

  PostView.prototype.tagName = 'li';

  PostView.prototype.initialize = function() {
    return _.bindAll(this, 'selectPost');
  };

  PostView.prototype.events = {
    'click': 'selectPost'
  };

  PostView.prototype.selectPost = function() {
    if (!this.$el.hasClass('selected')) {
      this.$el.siblings().removeClass('selected');
      this.$el.addClass('selected');
      return this.renderPostSelection();
    }
  };

  PostView.prototype.renderPostSelection = function() {
    var detail;
    detail = new App.PostDetailView({
      model: this.model
    });
    return $('#app-right').velocity("transition.slideUpOut", {
      duration: 150,
      complete: (function(_this) {
        return function() {
          fetchInsightData(_this.model.get('id'));
          $('#post-detail').empty();
          $('#post-detail').append(detail.render());
          return $('#app-right').velocity("transition.slideUpIn", {
            stagger: 100
          });
        };
      })(this)
    });
  };

  return PostView;

})(Backbone.View);

App.PostInsightView = (function(_super) {
  var postInsightTemplate;

  __extends(PostInsightView, _super);

  function PostInsightView() {
    this.render = __bind(this.render, this);
    return PostInsightView.__super__.constructor.apply(this, arguments);
  }

  postInsightTemplate = Handlebars.compile($('#post-insight-template').html());

  PostInsightView.prototype.className = 'insight-view';

  PostInsightView.prototype.render = function() {
    console.log(this.model.toJSON);
    this.$el.html(postInsightTemplate(this.model.get('data')[0]));
    $('.insight-section').empty();
    $('.insight-section').append(this.$el);
    return this.$el;
  };

  return PostInsightView;

})(Backbone.View);

App.PostDetailView = (function(_super) {
  var postDetailTemplate;

  __extends(PostDetailView, _super);

  function PostDetailView() {
    this.render = __bind(this.render, this);
    return PostDetailView.__super__.constructor.apply(this, arguments);
  }

  postDetailTemplate = Handlebars.compile($('#post-detail-template').html());

  PostDetailView.prototype.render = function() {
    var sm;
    sm = JSON.stringify(this.model.toJSON(), null, 4);
    this.model.set('blob', sm);
    this.$el.html(postDetailTemplate(this.model.toJSON()));
    return this.$el;
  };

  return PostDetailView;

})(Backbone.View);

App.PostStatusView = (function(_super) {
  var postStatusTemplate;

  __extends(PostStatusView, _super);

  function PostStatusView() {
    this.render = __bind(this.render, this);
    return PostStatusView.__super__.constructor.apply(this, arguments);
  }

  postStatusTemplate = Handlebars.compile($('#status-post-template').html());

  PostStatusView.prototype.render = function() {
    if (!this.model.get('message')) {
      this.model.set('message', this.model.get('story'));
    }
    this.$el.html(postStatusTemplate(this.model.toJSON()));
    return this.$el;
  };

  return PostStatusView;

})(App.PostView);

App.PostPhotoView = (function(_super) {
  var postPhotoTemplate;

  __extends(PostPhotoView, _super);

  function PostPhotoView() {
    this.render = __bind(this.render, this);
    return PostPhotoView.__super__.constructor.apply(this, arguments);
  }

  postPhotoTemplate = Handlebars.compile($('#photo-post-template').html());

  PostPhotoView.prototype.render = function() {
    if (!this.model.get('story')) {
      this.model.set('story', this.model.get('message'));
    }
    this.$el.html(postPhotoTemplate(this.model.toJSON()));
    return this.$el;
  };

  return PostPhotoView;

})(App.PostView);

App.FeedCollection = (function(_super) {
  __extends(FeedCollection, _super);

  function FeedCollection() {
    return FeedCollection.__super__.constructor.apply(this, arguments);
  }

  return FeedCollection;

})(Backbone.Collection);

App.ComposeView = (function(_super) {
  var postComposeTemplate;

  __extends(ComposeView, _super);

  function ComposeView() {
    this.render = __bind(this.render, this);
    return ComposeView.__super__.constructor.apply(this, arguments);
  }

  postComposeTemplate = Handlebars.compile($('#post-compose-template').html());

  ComposeView.prototype.render = function() {
    this.$el.html(postComposeTemplate({}));
    return this.$el;
  };

  ComposeView.prototype.submitPost = function(ts) {
    var page_id, postObject;
    if (ts == null) {
      ts = 0;
    }
    page_id = this.model.get('page_id');
    postObject = {};
    postObject.message = $('#compose-message').text;
    if (postObject.message == null) {
      postObject.link = $('#compose-link').text;
      postObject.name = $('#compose-name').text;
      postObject.caption = $('#compose-caption').text;
      postObject.description = $('#compose-description').text;
    }
    if (ts = 0) {
      console.log('defaulting to now');
      return ts = moment();
    }
  };

  ComposeView.prototype.renderComposeSelection = function() {
    return $('#app-right').velocity("transition.slideUpOut", {
      duration: 150,
      complete: (function(_this) {
        return function() {
          fetchInsightData(_this.model.get('id'));
          $('#post-detail').empty();
          $('#post-detail').append(_this.render());
          return $('#app-right').velocity("transition.slideUpIn", {
            stagger: 100
          });
        };
      })(this)
    });
  };

  return ComposeView;

})(Backbone.View);

App.FeedCollectionView = (function(_super) {
  __extends(FeedCollectionView, _super);

  function FeedCollectionView() {
    return FeedCollectionView.__super__.constructor.apply(this, arguments);
  }

  FeedCollectionView.prototype.render = function() {
    $('.post-list').empty();
    this.collection.each((function(_this) {
      return function(post) {
        var postR;
        postR = (function() {
          switch (false) {
            case post.get('type') !== 'status':
              return new App.PostStatusView({
                model: post
              });
            case post.get('type') !== 'photo':
              return new App.PostPhotoView({
                model: post
              });
            case post.get('type') !== 'video':
              return new App.PostPhotoView({
                model: post
              });
            default:
              return null;
          }
        })();
        return $('.post-list').append(postR.render());
      };
    })(this));
    return $('.post-list li').velocity("transition.flipYIn", {
      stagger: 100
    });
  };

  return FeedCollectionView;

})(Backbone.View);
