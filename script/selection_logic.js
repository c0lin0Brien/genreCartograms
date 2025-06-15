// Importing functions from map_logic
import {do_update, reset_carto} from './map_logic.js';
// Importing genre + style lists
import {genre_list, style_list} from './lists.js';

// Create genre selection menu
const genre_section = document.getElementById("genre_buttons");
for (let i = 0; i < genre_list.length; i++) {
    let genre_button = document.createElement("button");
    genre_button.onclick = function () {
        do_update(i, false);
    }
    genre_button.textContent = genre_list[i];
    genre_section.appendChild(genre_button);
}

// Create style selection menu
const style_section = document.getElementById("style_buttons");
for (let i = 0; i < style_list.length; i++) {
    let style_button = document.createElement("button");
    style_button.onclick = function () {
        do_update(i, true);
    }
    style_button.textContent = style_list[i];
    style_section.appendChild(style_button);
}

// Create reset button
let reset_button = document.createElement("button");
reset_button.onclick = function () {
    reset_carto();
}
reset_button.textContent = "RESET";
right_col.appendChild(reset_button);