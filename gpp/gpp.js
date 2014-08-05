PP.Data = {};
PP.Data.User = {};

PP.User = "";

PP.FetchUserData = function() {
};

PP.StartAnalysis = function() {
    if ($("#githubusername").val().length > 0) {
        $("#resultspanel").slideUp(800, function() {
            var username = document.getElementById("githubusername").value;
            PP.User = username;
            $("#resultspanel .panel-title").html("Results for <span class='text-success'>" + PP.User + "</span>");
            $("#resultspanel").slideDown(800);

            
        });
    }
};