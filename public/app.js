'use strict';

function showMenu() {
    var x = document.getElementById("showMenu");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function showForm() {
    var x = document.getElementById("showForm");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function showSearchForm() {
    var x = document.getElementById("showSearchForm");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

// for update ntn

// $('#updateForm').hide();
// $('#updateBtn').click(() => {
//     $('#updateForm').toggle();
// })


// for search button
$('.myBut').click(function() {
    $(this).next().toggle();
    console.log($(this));
});


// for update details button
$('.updateBtn').click(function() {
    $(this).next().toggle();
})