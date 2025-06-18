// Importing functions from map_logic
import {doUpdate, resetCarto} from './map_logic.js';
// Importing genre + style lists
import {genreList, styleList, matchedList} from './lists.js';

// Create genre selection menu
const genreSection = document.getElementById("genre_buttons");
for (let i = 0; i < genreList.length; i++) {

    let genreName = genreList[i];

    // Create each genre dropdown
    let genreDropdown = document.createElement("div");
    genreDropdown.id = `${genreName}_dropdown`;
    genreDropdown.class = "genre_dropdown";

    // Create each genre button
    let genreButton = document.createElement("button");
    genreButton.id = genreName;
    genreButton.class = "genre_button";
    genreButton.onclick = function () {
        doUpdate(i, false);
    }
    genreButton.textContent = genreName;
    genreSection.appendChild(genreDropdown);
    genreDropdown.appendChild(genreButton);

    // Create container for respective styles to go into
    let genreStyles = document.createElement("div");
    genreStyles.id = `${genreName}_styles`;
    genreStyles.class = "styles_container";
    genreButton.after(genreStyles);
}

let styleButtonMap = new Map();

// Create style selection menu
for (let i = 0; i < styleList.length; i++) {
    let styleName = `${styleList[i]}`
    let styleButton = document.createElement("button");
    styleButton.onclick = function () {
        doUpdate(i, true);
    }
    styleButton.id = `${styleName}`;
    styleButton.class = "style_button";
    styleButtonMap.set(styleButton.id, styleButton);
    styleButton.textContent = styleName;
}

// Go through and assign each style to its respective genre
for (let i = 0; i < matchedList.length; i++) {
    // Find container to drop style buttons in
    let target = document.getElementById(`${genreList[i]}_styles`);
    if (!target) {
        console.log(`Couldn't find anything for ${genre}`)
    }
    for (let style of matchedList[i]) {
        // Get each style from Map and append it to genre dropdown
        let currStyleButton = styleButtonMap.get(style);
        if (currStyleButton != null) {
            target.appendChild(currStyleButton);
        } else {
            console.log(`Cannot find button for ${style}`);
        }
    }
}
// Create reset button
let resetButton = document.createElement("button");
resetButton.onclick = function () {
    resetCarto();
}
resetButton.textContent = "RESET";
right_col.appendChild(resetButton);