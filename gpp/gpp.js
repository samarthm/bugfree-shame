PP.Data = {};
PP.Data.User = {};
PP.Data.Repo = {};

PP.User = "";

PP.GithubAPI = {};
PP.GithubAPI.ClientID = "4d423a457f60a3990290";
PP.GithubAPI.ClientSecret = "aaf889f63552fb52837a29489764895961ea3d8d";

PP.Score = {};
PP.Score.Repo = [];

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

PP.CalculateRepoPP = function() {
    for(var i=0;i<PP.Data.Repo.data.length;i++) {
        var obj = PP.Data.Repo.data[i];
        var res = {};
        
        res.name = obj.name;
        res.commits = 0;
        
        PP.Score.Repo.push(res);
    }
};

PP.StartAnalysis = function() {
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
                console.dir(PP.Data.Repo);
                PP.CalculateRepoPP();
                var RepoPPTable = "<div class='col-md-7'><ul class='list-group'>";
                for(var i=0;i<PP.Score.Repo.length;i++) {
                    RepoPPTable += "<li class='list-group-item'>" + PP.Score.Repo[i].name + " " + PP.Score.Repo[i].commits + "</li>";
                }
                RepoPPTable += "</ul></div>";
                $("#results").append(RepoPPTable);
            });
        });
    });
};