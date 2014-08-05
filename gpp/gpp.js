PP.Data = {};
PP.Data.User = {};
PP.Data.Repo = {};

PP.User = "";

PP.Score = {};
PP.Score.Repo = [];

PP.GithubAPI = {};
PP.GithubAPI.ClientID = "4d423a457f60a3990290";
PP.GithubAPI.ClientSecret = "aaf889f63552fb52837a29489764895961ea3d8d";

PP.FetchUserData = function(callback) {
    var thing = $.get("https://api.github.com/users/" + PP.User + "?client_id=" + PP.GithubAPI.ClientID + "&client_secret=" + PP.GithubAPI.ClientSecret, function(data) {
        PP.Data.User = data;
        $("#results").append("<p><span class='label label-success'>SUCCESS</span> User data fetched</p>");
        callback();
    }, "jsonp");
};

PP.FetchRepoData = function(callback) {
    var thing = $.get("https://api.github.com/users/" + PP.User + "/repos?type=all&sort=pushed&direction=desc&client_id=" + PP.GithubAPI.ClientID + "&client_secret=" + PP.GithubAPI.ClientSecret, function(data) {
        PP.Data.Repo = data;
        $("#results").append("<p><span class='label label-success'>SUCCESS</span> Repository data fetched</p>");
        callback();
    }, "jsonp");
};

PP.CalculateRepoPP = function(callback) {
    var promises = [];
    for(var i=0;i<PP.Data.Repo.data.length;i++) {
        var obj = PP.Data.Repo.data[i];
        var res = {};
        
        $("#results").append("<p><span class='label label-warning'>WORKING</span> Fetching \"" + PP.Data.Repo.data[i].name + "\" data...</p>");
        var thing = $.get("https://api.github.com/repos/" + PP.User + "/" + PP.Data.Repo.data[i].name + "/stats/commit_activity?client_id=" + PP.GithubAPI.ClientID + "&client_secret=" + PP.GithubAPI.ClientSecret, function(data) {
            
            res.name = obj.name;
            res.commits = 0;

            PP.Score.Repo.push(res);
            $("#results").append("<p><span class='label label-success'>SUCCESS</span> \"" + obj.name + "\" data fetched</p>");
            
        }, "jsonp");
        promises.push(thing);
    }
    $.when.apply(null, promises).done(function() {
        callback();
    });
};

PP.StartAnalysis = function() {
    PP.Data = {};
    PP.Data.User = {};
    PP.Data.Repo = {};

    PP.User = "";

    PP.Score = {};
    PP.Score.Repo = [];

    if ($("#githubusername").val().length <= 0) {
        $("#githubusername").val("failedxyz");
    }
    
    $("#results").html("<p>Loading...</p>");
    $("#resultspanel").slideUp("slow", function() {
        var username = document.getElementById("githubusername").value;
        PP.User = username;
        $("#resultspanel .panel-title").html("Results for <span class='text-success'>" + PP.User + "</span>");
        $("#resultspanel").slideDown("slow");

        PP.FetchUserData(function() {
            if (PP.Data.User.data.name.length > 0) {
                $("#resultspanel .panel-title").html("Results for <span class='text-success' title='" + PP.User + "'>" + PP.Data.User.data.name + "</span>");
            }
            PP.FetchRepoData(function() {
                PP.CalculateRepoPP(function() {
                    var RepoPPTable = "<div class='col-md-7'><ul class='list-group'>";
                    for(var i=0;i<PP.Score.Repo.length;i++) {
                        RepoPPTable += "<li class='list-group-item'>" + PP.Score.Repo[i].name + " " + PP.Score.Repo[i].commits + "</li>";
                    }
                    RepoPPTable += "</ul></div>";
                    $("#results").append(RepoPPTable);
                });
            });
        });
    });
};