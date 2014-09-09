#
# You should add the Facebook App ID and the channel url (optional), in the #fb-root element, as a data- attribute:
#   <div id="fb-root" data-app-id="<%= ENV['FACEBOOK_APP_ID'] %>" data-channel-url="<%= url_no_scheme('/channel.html') %>"></div>
#


App = {}


window.publishHelloWorld = =>
    pageToken = document.getElementById("pageToken").innerHTML
    FB.api "/me/feed", "post",
        message: "Hello, world! #{Math.random(1000)}"
        access_token: pageToken
        , (response) ->
            console.log "API response"
            console.log response
            document.getElementById("publishBtn").innerHTML = "API response is " + response.id


window.pageLogin = =>
    FB.api "/me/accounts?fields=name,access_token,link", (response) ->
        console.log response
        list = document.getElementById("pagesList")
        
        if response.error?
            #call attention to the error
            setPageMask('.loadingLogin')
        else if response.data?
            i = 0

            #only page? auto-pick
            if response.data.length == 1
                autoSelected = response.data[0]
                document.getElementById("pageName").innerHTML =  "<a href=\"" + autoSelected.link + "\">" + autoSelected.name + "</a>"
                document.getElementById("pageToken").innerHTML = autoSelected.access_token
                initApp(autoSelected.access_token, autoSelected.id)
            else
                while i < response.data.length
                    li = document.createElement("li")
                    li.innerHTML = "<a href=\"" + response.data[i].link + "\">" + response.data[i].name + "</a>"
                    li.dataset.token = response.data[i].access_token
                    li.dataset.link = response.data[i].link
                    li.dataset.id = esponse.data[i].id
                    li.className = "btn btn-mini"
                    li.onclick = ->
                      document.getElementById("pageName").innerHTML = @innerHTML
                      document.getElementById("pageToken").innerHTML = @dataset.token
                      initApp(@dataset.token, @dataset.id)
                      return

                    list.appendChild li
                    i++
        

        return


window.requestPermission = ->
    $('#pageName').text ''
    $('#pageError').text 'Please give this app requested permissions to use it :)'


window.requestLogin = ->
    $('#pageName').text ''
    $('#pageError').text 'Please login to this app to use it :)'


window.setPageMask = (maskSelector) =>
    am = $('.activeMask')
    nm = $( maskSelector + "")
    console.log $(maskSelector)
    if $(am)[0] == $(nm)[0]
        console.log "no change"
    else
        #am transition out, nm transition in
        am
            .velocity("transition.flipXOut")
        am.removeClass 'activeMask'
        nm
            .velocity("transition.flipXIn")    
        #add activeMas
        nm.addClass 'activeMask'



window.initApp = (token, page_id) ->
    FB.api("/#{page_id}/feed", (data) ->
                # TODO: THESE ARE OUT POSTS
                if data.data?
                    @feed = new App.FeedCollectionView({collection: new App.FeedCollection( _.map(data.data, (s) -> new App.PostModel(s) ) )})
                    @feed.render()
                
            )

window.fetchInsightData = (page_id) ->
    FB.api("/#{page_id}/insights/page_impressions", (data) ->
                # TODO: THESE ARE OUT POSTS
                console.log "insight"
                console.log data
                if data.data.length is 0 then data.data = 'No data for this time period'
                if data.data?
                    @insight = new App.PostInsightView({model: new Backbone.Model({ insight: data.data})})
                    @insight.render()
                  
                
            )



window.fbAsyncInit = =>
    FB.init
        appId: document.getElementById("fb-root").getAttribute("data-app-id")
        status: true,
        cookie: true,
        xfbml: true
 
    FB.Event.subscribe('auth.login', (response) ->
        window.location = window.location
    )
    FB.Canvas.setAutoGrow()

    #set state to loading...

    

    FB.getLoginStatus((data) ->
        if(data.status == "connected")
       #     setPageMask('#content') #means no mask
            uid = data.authResponse.userID
            accessToken = data.authResponse.accessToken;
            FB.api("/me", (data) ->
                # TODO: INITIALIZE APP HERE.
                setPageMask('.content')
                pageLogin()
                
            )

        else if (data.status == "not_authorized")
           # requestPermission()
            setPageMask('.loadingPermission')

          # the user is logged in to Facebook,
          # but has not authenticated your app  
        else
            setPageMask('.loadingLogin')
          #  requestLogin()
          # the user isn't logged in to Facebook.       
        )

    
PageScript = document.getElementsByTagName("script")[0]
return if document.getElementById("FBScript")
FBScript = document.createElement("script")
FBScript.id = "FBScript"
FBScript.async = true
FBScript.src = "//connect.facebook.net/en_US/all.js"
PageScript.parentNode.insertBefore(FBScript, PageScript)