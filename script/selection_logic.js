// Importing functions from map_logic
import {do_update, reset_carto} from './map_logic.js';
// Importing genre + style lists
import {genre_list, style_list, matchedList} from './lists.js';

// Create genre selection menu
const genre_section = document.getElementById("genre_buttons");
for (let i = 0; i < genre_list.length; i++) {

    let genre_name = genre_list[i];

    // Create each genre dropdown
    let genre_dropdown = document.createElement("div");
    genre_dropdown.id = `${genre_name}_dropdown`;
    genre_dropdown.class = "genre_dropdown";

    // Create each genre button
    let genre_button = document.createElement("button");
    genre_button.id = genre_name;
    genre_button.class = "genre_button";
    genre_button.onclick = function () {
        do_update(i, false);
    }
    genre_button.textContent = genre_name;
    genre_section.appendChild(genre_dropdown);
    genre_dropdown.appendChild(genre_button);

    // Create container for respective styles to go into
    let genre_styles = document.createElement("div");
    genre_styles.id = `${genre_name}_styles`;
    genre_styles.class = "styles_container";
    genre_button.after(genre_styles);
}

let style_button_map = new Map();

// Create style selection menu
const style_section = document.getElementById("style_buttons");
for (let i = 0; i < style_list.length; i++) {
    let styleName = `${style_list[i]}`
    let style_button = document.createElement("button");
    style_button.onclick = function () {
        do_update(i, true);
    }
    style_button.id = `${styleName}`;
    style_button.class = "style_button";
    style_button_map.set(style_button.id, style_button);
    // Finish implementing this. You want to create array of style buttons and then go through it to assign them to each genre drop down, which
    // is also something you have to make. I'm tired rn.
    style_button.textContent = styleName;
    // console.log(`${style_list[i]} button appended`);
    // style_section.appendChild(style_button);
}

// Go through and assign each style to its respective genre
for (let i = 0; i < matchedList.length; i++) {
    // Find container to drop style buttons in
    let target = document.getElementById(`${genre_list[i]}_styles`);
    if (!target) {
        console.log(`Couldn't find anything for ${genre}`)
    }
    for (let style of matchedList[i]) {
        // Get each style from Map and append it to genre dropdown
        let currStyleButton = style_button_map.get(style);
        if (currStyleButton != null) {
            target.appendChild(currStyleButton);
        } else {
            console.log(`Cannot find button for ${style}`);
        }
    }
}
// Create reset button
let reset_button = document.createElement("button");
reset_button.onclick = function () {
    reset_carto();
}
reset_button.textContent = "RESET";
right_col.appendChild(reset_button);