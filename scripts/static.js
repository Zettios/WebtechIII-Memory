var table = document.querySelector("#table");

for(var y = 0; y < 6; y++) {
    for (var x = 0; x < 6; x++) {
        card = document.createElement("div");
        card.className = "card";
        table.appendChild(card); 
    }
}