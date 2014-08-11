PP.Data = {};
PP.Data.User = {};
PP.Data.Repo = {};

PP.User = "";

PP.Score = {};
PP.Score.Repo = [];

PP.RandomData = {};
PP.RandomData.Commits = 0;

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
    var names = [];
    for(var i=0;i<PP.Data.Repo.data.length;i++) {
        names.push(PP.Data.Repo.data[i].name);
    }
    var promises = [];
    for(var i=0;i<PP.Data.Repo.data.length;i++) {        
        // $("#results").append("<p><span class='label label-warning'>WORKING</span> Fetching \"" + PP.Data.Repo.data[i].name + "\" data...</p>");
        var thing = $.ajax({
            url: "https://api.github.com/repos/" + PP.Data.Repo.data[i].full_name + "/stats/contributors?client_id=" + PP.GithubAPI.ClientID + "&client_secret=" + PP.GithubAPI.ClientSecret,
            dataType: "json",
            async: false,
            success: function(data) {
                if (data == undefined) {
                    console.error("something fucked up with " + PP.Data.Repo.data[i].full_name + " (empty repository)");
                } else {
                    var obj = PP.Data.Repo.data[i];
                    var res = {};

                    var total = 0;
                    var total_authors = data.length;
                    var author = -1;
                    for(var j=0;j<total_authors;j++) {
                        // console.log(data[j]);
                        if (data[j].author.login.toLowerCase() == PP.User.toLowerCase()) {
                            total += data[j].total;
                            author = j;
                            break;
                        }
                    }
                    
                    if (!data[author]) {
                        console.log("https://api.github.com/repos/" + obj.full_name + "/stats/contributors?client_id=" + PP.GithubAPI.ClientID + "&client_secret=" + PP.GithubAPI.ClientSecret);
                        console.dir(data);
                    } else {
                        res.start = parseInt(data[0].weeks[0].w);

                        var now = (new Date()).getTime()/1000;
                        res.elapsed = Math.round(now - res.start);

                        res.name = obj.name;
                        res.commits = total;
                        
                        PP.RandomData.Commits += total;

                        res.RawScore = 1.0 * res.commits / res.elapsed;

                        PP.Score.Repo.push(res);
                    }
                    // $("#results").append("<p><span class='label label-success'>SUCCESS</span> \"" + obj.name + "\" data fetched</p>");
                    promises.push(thing);
                }
            },
            error: function() {
                console.error("something fucked up with " + PP.Data.Repo.data[i].full_name + " (api failure?)");
            },
        });
    }
    $.when.apply(null, promises).done(function() {
        var multiplier = 0;
        for(var i=0;i<PP.Score.Repo.length;i++) {
            multiplier += Math.pow(PP.Score.Repo[i].elapsed, 1.5);
        }
        multiplier = Math.pow(multiplier, 1/(1.5));
        multiplier /= PP.Score.Repo.length;
        
        for(var i=0;i<PP.Score.Repo.length;i++) {
            PP.Score.Repo[i].ScaledScore = PP.Score.Repo[i].RawScore * multiplier;
        }
        
        var swapped;
        do {
            swapped = false;
            for (var i=0; i < PP.Score.Repo.length-1; i++) {
                if (PP.Score.Repo[i].ScaledScore < PP.Score.Repo[i+1].ScaledScore) {
                    var temp = PP.Score.Repo[i];
                    PP.Score.Repo[i] = PP.Score.Repo[i+1];
                    PP.Score.Repo[i+1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
        
        PP.Score.RepoTotal = 0;
        
        for(var i=0;i<PP.Score.Repo.length;i++) {
            PP.Score.Repo[i].Weight = Math.pow(0.975, i);
            PP.Score.Repo[i].WeightedScore = PP.Score.Repo[i].ScaledScore * PP.Score.Repo[i].Weight;
            
            PP.Score.RepoTotal += PP.Score.Repo[i].WeightedScore;
        }
        
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
    
    PP.RandomData.Commits = 0;

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
            if (PP.Data.User.data.name && PP.Data.User.data.name.length > 0) {
                $("#resultspanel .panel-title").html("Results for <span class='text-success' title='" + PP.User + "'>" + PP.Data.User.data.name + "</span>");
            }
            PP.FetchRepoData(function() {
                PP.CalculateRepoPP(function() {
                    var RepoPPTable = "<p class='bg-success'>Total gpp from repositories: <b>" + Math.round(PP.Score.RepoTotal) + "gpp</b></p>";
                    RepoPPTable += "<div class='col-md-7'><ul class='list-group'>";
                    for(var i=0;i<PP.Score.Repo.length;i++) {
                        RepoPPTable += "<li class='list-group-item'><b>" + PP.Score.Repo[i].name + "</b> " + Math.round(PP.Score.Repo[i].ScaledScore) + "gpp at " + (Math.round(PP.Score.Repo[i].Weight * 10000) / 100) + "% = <b>" + Math.round(PP.Score.Repo[i].WeightedScore) + "gpp</b></li>";
                    }
                    RepoPPTable += "</ul></div>";
                    $("#results").append("<p>Total commits: " + PP.RandomData.Commits + "</p>");
                    $("#results").append(RepoPPTable);
                });
            });
        });
    });
};