import {doUpdate, resetCarto} from './map_logic.js';
import {genreList, styleList, matchedList} from './lists.js';
import { generateGenreInsight } from './pie-charts.js';
// Loading json
let genreBlurbs = {}
fetch('public/genre_blurbs.json')
  .then(response => response.json())
  .then(data => {
    genreBlurbs = data;
  });

// Create genre selection menu
export let lastButton;
const genreSection = document.getElementById("genre_buttons");
for (let i = 0; i < genreList.length; i++) {

    let genreName = genreList[i];

    // Create each genre dropdown
    let genreDropdown = document.createElement("div");
    genreDropdown.id = `${genreName}_dropdown`;
    // Apply extra border to top
    if (i == 0) {
        genreDropdown.style.borderTopWidth = "4px";
    // Apply extra border to bottom
    } else if (i == genreList.length - 1) {
        genreDropdown.style.borderBottomWidth = "4px";
    }
    genreDropdown.classList.add("genre_dropdown");

    // Create header container for genre button and drop button
    let dropdownHeader = document.createElement("div");
    dropdownHeader.classList.add("dropdown_header")
    dropdownHeader.id = `${genreName}_dropdown_header`;


    // Create each genre button
    let genreButton = document.createElement("button");
    genreButton.id = genreName;
    genreButton.classList.add("genre_button");
    genreButton.onclick = function () {
        doUpdate(i, false);
        displayGenreBlurb(genreName);
        // generateGenreInsight(genreName);
        if (lastButton == null) {
            genreButton.classList.add("active");
            lastButton = genreButton;
        } else {
            if (lastButton != genreButton) {
                lastButton.classList.toggle("active");
                genreButton.classList.toggle('active');
                lastButton = genreButton;
            }
        }
    }
    genreButton.textContent = genreName;
    genreSection.appendChild(genreDropdown);
    genreDropdown.appendChild(dropdownHeader)
    dropdownHeader.appendChild(genreButton);

    // Add dropdown icon
    let dropIcon = document.createElement("i");
    dropIcon.classList.add("fa", "fa-caret-down", "fa-2x");
    dropIcon.style.marginRight = "12px"
    dropIcon.style.marginTop = "12px"
    dropdownHeader.appendChild(dropIcon);

    // Create container for respective styles to go into
    let genreStyles = document.createElement("div");
    genreStyles.id = `${genreName}_styles`;
    genreStyles.classList.add("styles_container");
    genreDropdown.append(genreStyles);

    // Assign dropdown behavior to style containers
    dropIcon.addEventListener("click", function () {
        if (genreStyles.style.display === "block") {
            genreStyles.style.display = "none";
        } else {
            genreStyles.style.display = "block";
        }
    });
}

let styleButtonMap = new Map();

// Create style buttons
for (let i = 0; i < styleList.length; i++) {
    let styleName = `${styleList[i]}`
    let styleButton = document.createElement("button");
    styleButton.onclick = function () {
        doUpdate(i, true);
        displayGenreBlurb(styleName);
        if (lastButton == null) {
            styleButton.classList.add("active");
            lastButton = styleButton;
        } else {
            if (lastButton != styleButton) {
                lastButton.classList.toggle("active");
                styleButton.classList.toggle('active');
                lastButton = styleButton;
            }
        }
    }
    styleButton.id = `${styleName}`;
    styleButton.classList.add("style_button");
    styleButtonMap.set(styleButton.id, styleButton);
    styleButton.textContent = styleName;
}

// Go through and assign each style to its respective genre
for (let i = 0; i < matchedList.length; i++) {
    // Find container to drop style buttons in
    let target = document.getElementById(`${genreList[i]}_styles`);
    for (let style of matchedList[i]) {
        // Get each style from Map and append it to genre dropdown
        let currStyleButton = styleButtonMap.get(style);
        if (currStyleButton != null) {
            target.appendChild(currStyleButton);
        } else {
        }
    }
}
// Create reset button
let resetButton = document.createElement("button");
resetButton.classList.add("reset");
resetButton.onclick = function () {
    lastButton.classList.toggle("active");
    lastButton = null;
    resetCarto();
    genreDescription.textContent = "";
}
resetButton.textContent = "RESET";
right_col.appendChild(resetButton);

// Display genre description
const genreDescription = document.getElementById("genre-description");
function displayGenreBlurb(genreName) {
    let blurb = genreBlurbs[genreName].description;
    const formatted = blurb.replace(/\n/g, "<br>");
    genreDescription.innerHTML = formatted;
}

// Display Spotify playlists
function getPlaylists(genreName) {
    
}