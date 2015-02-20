var amount = Math.random() * 1000000 + 1000000;
document.getElementById("goalStats").children[0].children[3].innerHTML = "$" + (Math.round(amount * 100) / 100);
document.getElementById("goalStats").children[0].children[4].children[1].innerHTML = '&infin; <span style="text-transform:lowercase;">of</span> 28';
