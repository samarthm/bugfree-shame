var amount = Math.random() * 1000000 + 1000000;
document.getElementById("goalStats").children[0].children[3].innerHTML = "$" + (Math.round(amount * 100) / 100);
