// Getting screen dimensions
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
// Detect if browser is mobile or desktop
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
const isMobile = window.mobileCheck();
console.log("isMobile: ", isMobile);
// Set up projection
var mapContainer = document.getElementById('map-container');
var map = d3.select("#map");

// For mobile, set SVG and projection based on actual container size
let containerWidth = 600;
let containerHeight = 500;
if (isMobile && mapContainer) {
    const rect = mapContainer.getBoundingClientRect();
    containerWidth = rect.width;
    containerHeight = rect.height;
    // Set SVG size to match container
    map.attr("width", containerWidth)
       .attr("height", containerHeight);
}

var proj;
if (isMobile) {
    // Use a simple, reliable approach for D3 v2
    var scale = Math.min(containerWidth, containerHeight) * 0.8; // 80% of the smaller dimension
    proj = d3.geo.mercator()
        .scale(scale)
        .translate([containerWidth / 2, containerHeight / 2]);
} else {
    proj = d3.geo.mercator().scale(600).translate([200, 225]);
}

var topology,
    geometries,
    cartoFeatures,
    currentCartogramState = null, // Track current cartogram state (index and style)
    resizeTimeout = null, // For debouncing resize events
    lastResizeDimensions = { width: 0, height: 0 }, // Track last resize dimensions
    isScrolling = false, // Track if user is currently scrolling
    scrollTimeout = null, // For detecting when scrolling stops
    mapPosition = { x: 0, y: 0 }, // Track map position to keep it stationary
    isMapLocked = false, // Lock map position during scroll
    originalProjectionValues = { scale: 0, translate: [0, 0] }; // Store original projection values

var genreData = d3.map();
var styleData = d3.map();

var carto = d3.cartogram()
    .projection(proj)
    .iterations(11)
    .properties(function (d) {
        // This adds the "properties" properties to the geometries
        return d.properties;
    });

// Loading genre data from csv
d3.csv("public/country_genres.csv", function (data) {
    data.forEach(function (d) {
        genreData.set(d.COUNTRY, [d.BLUES, d.BRASS_MILITARY, d.CHILDRENS, d.CLASSICAL, d.ELECTRONIC,
            d.FOLK_WORLD_COUNTRY, d.FUNK_SOUL, d.HIP_HOP, d.JAZZ,
            d.LATIN, d.NON_MUSIC, d.POP, d.REGGAE, d.ROCK, d.STAGE_SCREEN,
            d.TOTAL]);
    })
});
// TODO: Maybe offset setup stuff in a different file to clean up code
// Loading style data from csv
d3.csv("public/country_styles.csv", function (data) {
    data.forEach(function (d) {
        styleData.set(d.COUNTRY_NAME, [d.AOR, d.ABORIGINAL, d.ABSTRACT, d.ACID, d.ACID_HOUSE, d.ACID_JAZZ, d.ACID_ROCK, d.ACOUSTIC, d.AFRICAN, d.AFRO_CUBAN, d.AFRO_CUBAN_JAZZ, d.AFROBEAT, d.AGUINALDO, d.ALT_POP, d.ALTERNATIVE_METAL, d.ALTERNATIVE_ROCK, d.AMAPIANO, d.AMBIENT, d.AMBIENT_HOUSE, d.ANARCHO_PUNK, d.ANATOLIAN_ROCK, d.ANDALUSIAN_CLASSICAL, d.ANDEAN_MUSIC, d.ANISON, d.ANTIFOLK, d.APPALACHIAN_MUSIC, d.ARABIC_POP, d.ARENA_ROCK, d.ART_ROCK, d.ATMOSPHERIC_BLACK_METAL, d.AUDIOBOOK, d.AVANT_GARDE_JAZZ, d.AVANTGARDE, d.AXÉ, d.AZONTO, d.BACHATA, d.BAILA, d.BAIÃO, d.BAKERSFIELD_SOUND, d.BALEARIC, d.BALLAD, d.BALLET, d.BALLROOM, d.BALTIMORE_CLUB, d.BAMBUCO, d.BANDA, d.BANGLADESHI_CLASSICAL, d.BARBERSHOP, d.BAROQUE, d.BAROQUE_POP, d.BASQUE_MUSIC, d.BASS_MUSIC, d.BASSLINE, d.BATUCADA, d.BAYOU_FUNK, d.BEAT, d.BEATBOX, d.BEATDOWN, d.BEGUINE, d.BENGALI_MUSIC, d.BERLIN_SCHOOL, d.BEĆARAC, d.BHANGRA, d.BIG_BAND, d.BIG_BEAT, d.BITPOP, d.BLACK_METAL, d.BLACKGAZE, d.BLEEP, d.BLUEGRASS, d.BLUES_ROCK, d.BOLERO, d.BOLLYWOOD, d.BOMBA, d.BONGO_FLAVA, d.BOOGALOO, d.BOOGIE, d.BOOGIE_WOOGIE, d.BOOM_BAP, d.BOP, d.BOSSA_NOVA, d.BOSSANOVA, d.BOUNCE, d.BOUNCY_TECHNO, d.BRASS_BAND, d.BREAK_IN, d.BREAKBEAT, d.BREAKCORE, d.BREAKS, d.BREGA, d.BRITCORE, d.BRITPOP, d.BROKEN_BEAT, d.BRUTAL_DEATH_METAL, d.BUBBLEGUM, d.BUBBLING, d.BULTRÓN, d.BYZANTINE, d.CABARET, d.CAIPIRA, d.CAJUN, d.CALYPSO, d.CAMBODIAN_CLASSICAL, d.CANDOMBE, d.CANTOPOP, d.CANTORIAL, d.CANZONE_NAPOLETANA, d.CAPE_JAZZ, d.CARIMBÓ, d.CARNATIC, d.CATALAN_MUSIC, d.CELTIC, d.CHA_CHA, d.CHACARERA, d.CHAMAMÉ, d.CHAMPETA, d.CHANSON, d.CHARANGA, d.CHICAGO_BLUES, d.CHILLWAVE, d.CHINESE_CLASSICAL, d.CHIPTUNE, d.CHORAL, d.CHORO, d.CHUTNEY, d.CITY_POP, d.CLASSIC_ROCK, d.CLASSICAL, d.CLOUD_RAP, d.COBLA, d.COLDWAVE, d.COMEDY, d.COMFY_SYNTH, d.COMPAS, d.CONCERT_FILM, d.CONJUNTO, d.CONSCIOUS, d.CONTEMPORARY, d.CONTEMPORARY_JAZZ, d.CONTEMPORARY_RB, d.COOL_JAZZ, d.COPLA, d.CORRIDO, d.COUNTRY, d.COUNTRY_BLUES, d.COUNTRY_ROCK, d.CRETAN, d.CROSSOVER_THRASH, d.CRUNK, d.CRUST, d.CUATRO, d.CUBANO, d.CUMBIA, d.CURRULAO, d.CUT_UP_DJ, d.DJ_BATTLE_TOOL, d.DABKE, d.DANCE_POP, d.DANCEHALL, d.DANGDUT, d.DANSBAND, d.DANZON, d.DARK_AMBIENT, d.DARK_ELECTRO, d.DARK_JAZZ, d.DARKWAVE, d.DEATH_METAL, d.DEATHCORE, d.DEATHROCK, d.DECONSTRUCTED_CLUB, d.DEEP_HOUSE, d.DEEP_TECHNO, d.DELTA_BLUES, d.DEPRESSIVE_BLACK_METAL, d.DESCARGA, d.DESERT_BLUES, d.DIALOGUE, d.DISCO, d.DISCO_POLO, d.DIXIELAND, d.DONK, d.DOO_WOP, d.DOOM_METAL, d.DOOMCORE, d.DOWNTEMPO, d.DREAM_POP, d.DRILL, d.DRONE, d.DRUM_N_BASS, d.DUB, d.DUB_POETRY, d.DUB_TECHNO, d.DUBSTEP, d.DUNGEON_SYNTH, d.DURANGUENSE, d.EBM, d.EARLY, d.EAST_COAST_BLUES, d.EASY_LISTENING, d.EDUCATION, d.EDUCATIONAL, d.ELECTRIC_BLUES, d.ELECTRO, d.ELECTRO_HOUSE, d.ELECTRO_SWING, d.ELECTROACOUSTIC, d.ELECTROCLASH, d.EMO, d.ENKA, d.EROTIC, d.ETHEREAL, d.ETHNO_POP, d.EURO_HOUSE, d.EURO_TRANCE, d.EURO_DISCO, d.EUROBEAT, d.EURODANCE, d.EUROPOP, d.EXOTICA, d.EXPERIMENTAL, d.FADO, d.FAVELA_FUNK, d.FIELD_RECORDING, d.FILK, d.FLAMENCO, d.FOLK, d.FOLK_METAL, d.FOLK_ROCK, d.FOOTWORK, d.FORRÓ, d.FREE_FUNK, d.FREE_IMPROVISATION, d.FREE_JAZZ, d.FREESTYLE, d.FREETEKNO, d.FRENCH_HOUSE, d.FREVO, d.FUNANÁ, d.FUNERAL_DOOM_METAL, d.FUNK, d.FUNK_METAL, d.FUNKOT, d.FUSION, d.FUTURE_BASS, d.FUTURE_HOUSE, d.FUTURE_JAZZ, d.FUTURE_POP, d.G_FUNK, d.GABBER, d.GAGAKU, d.GAITA, d.GALICIAN_TRADITIONAL, d.GAMELAN, d.GANGSTA, d.GARAGE_HOUSE, d.GARAGE_ROCK, d.GEET, d.GHAZAL, d.GHETTO, d.GHETTO_HOUSE, d.GHETTOTECH, d.GLAM, d.GLITCH, d.GLITCH_HOP, d.GNAWA, d.GO_GO, d.GOA_TRANCE, d.GOREGRIND, d.GOSPEL, d.GOTH_ROCK, d.GOTHIC_METAL, d.GQOM, d.GRIME, d.GRINDCORE, d.GRIOT, d.GROOVE_METAL, d.GROUP_SOUNDS, d.GRUNGE, d.GUAGUANCÓ, d.GUAJIRA, d.GUARACHA, d.GUARANIA, d.GUGGENMUSIK, d.GUSLE, d.GWO_KA, d.GYPSY_JAZZ, d.GĦANA, d.HALFTIME, d.HANDS_UP, d.HAPPY_HARDCORE, d.HARD_BEAT, d.HARD_BOP, d.HARD_HOUSE, d.HARD_ROCK, d.HARD_TECHNO, d.HARD_TRANCE, d.HARDCORE, d.HARDCORE_HIP_HOP, d.HARDSTYLE, d.HARMONICA_BLUES, d.HARSH_NOISE_WALL, d.HAWAIIAN, d.HEALTH_FITNESS, d.HEAVY_METAL, d.HI_NRG, d.HIGHLIFE, d.HILL_COUNTRY_BLUES, d.HILLBILLY, d.HINDUSTANI, d.HIP_HOP, d.HIP_HOUSE, d.HIPLIFE, d.HOKKIEN_POP, d.HOLIDAY, d.HONKY_TONK, d.HONKYOKU, d.HORROR_ROCK, d.HORRORCORE, d.HOUSE, d.HUAYNO, d.HYPER_TECHNO, d.HYPERPOP, d.HYPHY, d.HYPNAGOGIC_POP, d.IDM, d.ILLBIENT, d.IMPRESSIONIST, d.INDIAN_CLASSICAL, d.INDIE_POP, d.INDIE_ROCK, d.INDO_POP, d.INDUSTRIAL, d.INDUSTRIAL_METAL, d.INSTRUMENTAL, d.INTERVIEW, d.ITALO_HOUSE, d.ITALO_DISCO, d.ITALODANCE, d.IZVORNA, d.J_CORE, d.J_ROCK, d.J_POP, d.JANGLE_POP, d.JAZZ_FUNK, d.JAZZ_ROCK, d.JAZZDANCE, d.JAZZY_HIP_HOP, d.JERSEY_CLUB, d.JIBARO, d.JIUTA, d.JOROPO, d.JOTA, d.JUG_BAND, d.JUKE, d.JUMP_BLUES, d.JUMPSTYLE, d.JUNGLE, d.JUNKANOO, d.K_ROCK, d.K_POP, d.KARAOKE, d.KASEKO, d.KASKAWI, d.KAYŌKYOKU, d.KERONCONG, d.KHALIJI, d.KIZOMBA, d.KLASIK, d.KLEZMER, d.KOLO, d.KOREAN_COURT_MUSIC, d.KRAUTROCK, d.KUDURO, d.KWAITO, d.LAMBADA, d.LAO_MUSIC, d.LATIN, d.LATIN_JAZZ, d.LATIN_POP, d.LAÏKÓ, d.LEFTFIELD, d.LENTO_VIOLENTO, d.LEVENSLIED, d.LIGHT_MUSIC, d.LISCIO, d.LO_FI, d.LOUISIANA_BLUES, d.LOUNGE, d.LOVERS_ROCK, d.LOW_BAP, d.LOWERCASE, d.LUK_KRUNG, d.LUK_THUNG, d.LULLABY, d.MPB, d.MAKINA, d.MALOYA, d.MAMBO, d.MANDOPOP, d.MANILA_SOUND, d.MARCHA_CARNAVALESCA, d.MARCHES, d.MARIACHI, d.MARIMBA, d.MATH_ROCK, d.MATHCORE, d.MBALAX, d.MEDIEVAL, d.MELODIC_DEATH_METAL, d.MELODIC_HARDCORE, d.MEMPHIS_BLUES, d.MEMPHIS_RAP, d.MENTO, d.MERENGUE, d.METALCORE, d.MIAMI_BASS, d.MICROHOUSE, d.MIDWEST_EMO, d.MILITARY, d.MILONGA, d.MINYŌ, d.MINIMAL, d.MINIMAL_TECHNO, d.MINNEAPOLIS_SOUND, d.MIZRAHI, d.MO_LAM, d.MOD, d.MODAL, d.MODERN, d.MODERN_CLASSICAL, d.MODERN_ELECTRIC_BLUES, d.MONOLOG, d.MOOMBAHTON, d.MORNA, d.MOTSWAKO, d.MOUTH_MUSIC, d.MOVIE_EFFECTS, d.MUGHAM, d.MUSETTE, d.MUSIC_HALL, d.MUSIC_VIDEO, d.MUSICAL, d.MUSIQUE_CONCRÈTE, d.MÚSICA_CRIOLLA, d.NDW, d.NAGAUTA, d.NEO_SOUL, d.NEO_TRANCE, d.NEO_CLASSICAL, d.NEO_CLASSICAL_METAL, d.NEO_ROMANTIC, d.NEOFOLK, d.NEOPAGAN, d.NERDCORE_TECHNO, d.NEW_AGE, d.NEW_BEAT, d.NEW_JACK_SWING, d.NEW_WAVE, d.NHẠC_VÀNG, d.NINTENDOCORE, d.NO_WAVE, d.NOISE, d.NOISE_ROCK, d.NOISECORE, d.NORDIC, d.NORTEÑO, d.NOVELTY, d.NU_METAL, d.NU_DISCO, d.NUEVA_CANCION, d.NUEVA_TROVA, d.NURSERY_RHYMES, d.NÉO_KYMA, d.NÉPZENE, d.OCCITAN, d.OCCULT, d.OI, d.OJKAČA, d.OPERA, d.OPERETTA, d.ORATORIO, d.ORGAN, d.OTTOMAN_CLASSICAL, d.OVERTONE_SINGING, d.P_FUNK, d.PACHANGA, d.PACIFIC, d.PAGODE, d.PARODY, d.PASODOBLE, d.PERSIAN_CLASSICAL, d.PERSIAN_POP, d.PHILIPPINE_CLASSICAL, d.PHLENG_PHUEA_CHIWIT, d.PHONK, d.PIANO_BLUES, d.PIEDMONT_BLUES, d.PIOBAIREACHD, d.PIPE_AND_DRUM, d.PLENA, d.PLUNDERPHONICS, d.POETRY, d.POLITICAL, d.POLKA, d.POP_PUNK, d.POP_RAP, d.POP_ROCK, d.PORNOGRIND, d.PORRO, d.POST_BOP, d.POST_ROCK, d.POST_GRUNGE, d.POST_HARDCORE, d.POST_METAL, d.POST_MODERN, d.POST_PUNK, d.POWER_ELECTRONICS, d.POWER_METAL, d.POWER_POP, d.POWER_VIOLENCE, d.PROG_ROCK, d.PROGRESSIVE_BLUEGRASS, d.PROGRESSIVE_BREAKS, d.PROGRESSIVE_HOUSE, d.PROGRESSIVE_METAL, d.PROGRESSIVE_TRANCE, d.PROMOTIONAL, d.PSY_TRANCE, d.PSYCHEDELIC, d.PSYCHEDELIC_ROCK, d.PSYCHOBILLY, d.PUB_ROCK, d.PUBLIC_BROADCAST, d.PUBLIC_SERVICE_ANNOUNCEMENT, d.PUNK, d.QAWWALI, d.QUECHUA, d.RADIOPLAY, d.RAGGA, d.RAGGA_HIPHOP, d.RAGTIME, d.RANCHERA, d.RAPSO, d.RARA, d.RAÏ, d.REBETIKO, d.REGGAE, d.REGGAE_GOSPEL, d.REGGAE_POP, d.REGGAETON, d.RELIGIOUS, d.RENAISSANCE, d.RHYTHM_AND_BLUES, d.RHYTHMIC_NOISE, d.RNB_SWING, d.ROCK_AND_ROLL, d.ROCK_OPERA, d.ROCKABILLY, d.ROCKSTEADY, d.ROMANI, d.ROMANTIC, d.ROOTS_REGGAE, d.RUMBA, d.RUNE_SINGING, d.RUSSIAN_POP, d.RYŪKŌKA, d.RŌKYOKU, d.SALEGY, d.SALSA, d.SAMBA, d.SAMBA_CANÇÃO, d.SANKYOKU, d.SCHLAGER, d.SCHRANZ, d.SCORE, d.SCREAMO, d.SCREW, d.SEA_SHANTIES, d.SEAN_NÓS, d.SEPHARDIC, d.SERESTA, d.SERIAL, d.SERMON, d.SERTANEJO, d.SHAABI, d.SHIBUYA_KEI, d.SHIDAIQU, d.SHINKYOKU, d.SHOEGAZE, d.SHOMYO, d.SINGELI, d.SKA, d.SKIFFLE, d.SKWEEE, d.SLOWCORE, d.SLUDGE_METAL, d.SMOOTH_JAZZ, d.SNAP, d.SOCA, d.SOFT_ROCK, d.SOKYOKU, d.SON, d.SON_MONTUNO, d.SONERO, d.SOUKOUS, d.SOUL, d.SOUL_JAZZ, d.SOUND_ART, d.SOUND_COLLAGE, d.SOUND_POETRY, d.SOUNDTRACK, d.SOUTHERN_ROCK, d.SPACE_ROCK, d.SPACE_AGE, d.SPAZA, d.SPECIAL_EFFECTS, d.SPEECH, d.SPEED_GARAGE, d.SPEED_METAL, d.SPEEDCORE, d.SPIRITUAL_JAZZ, d.SPIRITUALS, d.SPOKEN_WORD, d.SPORT, d.STEEL_BAND, d.STONER_ROCK, d.STORY, d.STRIDE, d.SUNSHINE_POP, d.SUOMISAUNDI, d.SURF, d.SWAMP_POP, d.SWING, d.SWINGBEAT, d.SYMPHONIC_METAL, d.SYMPHONIC_ROCK, d.SYNTH_POP, d.SYNTHPUNK, d.SYNTHWAVE, d.SÁMI_MUSIC, d.SÉGA, d.TAARAB, d.TAMBURITZA, d.TAMIL_FILM_MUSIC, d.TANGO, d.TECH_HOUSE, d.TECH_TRANCE, d.TECHNICAL, d.TECHNICAL_DEATH_METAL, d.TECHNO, d.TEJANO, d.TEXAS_BLUES, d.THAI_CLASSICAL, d.THEME, d.THERAPY, d.THRASH, d.THUG_RAP, d.TIMBA, d.TOASTING, d.TRALLALERO, d.TRANCE, d.TRAP, d.TRIBAL, d.TRIBAL_HOUSE, d.TRIP_HOP, d.TROPICAL_HOUSE, d.TROVA, d.TURNTABLISM, d.TWELVE_TONE, d.TWIST, d.UK_FUNKY, d.UK_GARAGE, d.UK_STREET_SOUL, d.UNBLACK_METAL, d.V_POP, d.VALLENATO, d.VAPORWAVE, d.VAUDEVILLE, d.VIDEO_GAME_MUSIC, d.VIKING_METAL, d.VILLANCICOS, d.VOCAL, d.VOCALOID, d.VOLKSMUSIK, d.WAIATA, d.WESTERN_SWING, d.WITCH_HOUSE, d.YEMENITE_JEWISH, d.YORUBA, d.YÉ_YÉ, d.ZAMBA, d.ZARZUELA, d.ZEMER_IVRI, d.ZHONGGUO_FENG, d.ZOUK, d.ZYDECO, d.ÉNTEKHNO]);
    })
});

// Polyfill for topojson.feature if missing (for old TopoJSON versions)
if (typeof topojson !== 'undefined' && !topojson.feature) {
  topojson.feature = function(topology, object) {
    if (typeof object === "string") object = topology.objects[object];
    return {
      type: "FeatureCollection",
      features: object.geometries.map(function(g) {
        return {
          type: "Feature",
          properties: g.properties || {},
          geometry: topojson.object(topology, g)
        };
      })
    };
  };
}

// At the top, before any assignment:
var countries;

// this loads test the topojson file and creates the map.
d3.json("public/globe1.json", function (data) {
    topology = data;
    geometries = topology.objects.layer1.geometries;

    // Get container size
    var mapContainer = document.getElementById('map-container');
    var map = d3.select("#map");
    var width = 600, height = 500;
    if (isMobile && mapContainer) {
        const rect = mapContainer.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        map.attr("width", width).attr("height", height);
    }

    // Convert TopoJSON to GeoJSON
    var geojson = topojson.feature(topology, topology.objects.layer1);

    // Set up projection
    var proj;
    if (isMobile) {
        // Use a simple, reliable approach for D3 v2
        var scale = Math.min(width, height) * .9; // 80% of the smaller dimension
        proj = d3.geo.mercator()
            .scale(scale)
            .translate([width / 2, height / 2]);
    } else {
        proj = d3.geo.mercator().scale(600).translate([200, 225]);
    }
    carto.projection(proj);
    
    // Store original projection values to prevent changes during scroll
    originalProjectionValues.scale = proj.scale();
    originalProjectionValues.translate = proj.translate();

    //these 2 below create the map and are based on the topojson implementation
    var features = carto.features(topology, geometries),
        path = d3.geo.path().projection(proj);

    var currSelected;
    countries = map.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("id", function (d) {
            // Fix to stop countries with spaces from tweaking
            var countryName = d.properties.name;
            if (countryName.includes(" ") || countryName.includes(".") || countryName.includes("'")) {
                var newID = "";
                for (const char of countryName) {
                    if (char == " " || char == "." || char == "'") {
                        newID += "_"
                    } else {
                        newID += char;
                    }
                }
                return  newID;
            } else {
                return countryName;
            }
        })
        .attr("d", path)

        // Logic for selecting countries via click
        .on("click", function(d) {
            d3.select(`#${currSelected}`).classed("selected", false);

            if (currSelected != this.id) {
                currSelected = this.id
                d3.select("#title").text(d.properties.name);
                d3.select(this).classed("selected", true);
                currSelected = this.id;
            } else {
                d3.select(this).classed("selected", false);
                currSelected = null;
                d3.select("#title").text("...");
            }
        });

    countries.append("title")
        .text(function (d) {
            return d.properties.name;
        });
    
    // Initialize resize dimensions
    lastResizeDimensions.width = window.innerWidth;
    lastResizeDimensions.height = window.innerHeight;
        
    console.log("Map created successfully");
});

export function doUpdate(i=11, style) {
    setTimeout(function () {
        // Track current cartogram state
        currentCartogramState = { index: i, style: style };
        
        let stats = new Array(5); // min, std dev, median, mean, max
        // this sets the value to use for scaling, per country. Uses square root scaling
        let min = Infinity;
        let max = 0;
        let rawVals = collectValues(i, style);
        let dFunc = getDisparityFunc(rawVals);

        carto.value(function (d) {
            var countryName = d.properties.name;
            if (style) {
                var val = parseInt(styleData.get(countryName)[i]);
                min = minCheck(min, val);
                max = maxCheck(max, val);
            } else {
                var val = parseInt(genreData.get(countryName)[i]);
                min = minCheck(min, val);
                max = maxCheck(max, val);
            }
            let retVal = dFunc(val);
            // TODO: Finish this and find a way to store the country name of the max and minimum
            return retVal;
        });
        
        if (cartoFeatures == undefined) 
            console.log("Mama"); // I do not know what it is about this console log but the entire project will break if you delete it
            // this regenerates the topology features for the new map based on 
            cartoFeatures = carto(topology, geometries).features;

        //update the map data
        countries.data(cartoFeatures)
            .select("title")
            .text(function (d) {
                return d.properties.name;
            });
        countries.transition()
            .duration(750)
            .attr("d", carto.path);
    }, 10);
}
export function resetCarto() {
    // Clear current cartogram state
    currentCartogramState = null;
    
    // Recreate the original features using the initial projection
    var path = d3.geo.path().projection(proj);
    var features = carto.features(topology, geometries);

    // Update the map data with the original features
    countries.data(features)
        .select("title")
        .text(function (d) {
            return d.properties.name;
        });

    countries.transition()
        .duration(750)
        .attr("d", path);
}

function minCheck(min, val) {
    if (val < min) {
        return val;
    }
    return min;
}

function maxCheck(max, val) {
    if (val > max) {
        return val;
    }
    return max;
}

function getDisparityFunc(vals) {
    let max = 0;
    let min = Infinity;
    vals.forEach(function(val) {
        max = maxCheck(max, val);
        min = minCheck(min, val);
    })
    let dif = max - min;
    // Determine what to do with data 
    if (dif < 1000) {
        return function(v) {
            return (v + 1);
        };
    } else if (dif < 10000) {
        return function(v) {
            return (Math.sqrt(v + 1));
        };
    } else {
        return function(v) {
            return (Math.sqrt(v) + 10)
        }
    }
}
function collectValues(i = 11, style = false) {
    let values = [];
    // Loop through all country names in the relevant data map
    let dataMap = style ? styleData : genreData;
    dataMap.forEach(function(countryName, valueArray) {
        // Get the value at index i
        let val = valueArray ? parseInt(valueArray[i]) : NaN;
        // Optionally check for valid numbers
        if (!isNaN(val)) {
            values.push(val);
        }
    });
    return values;
}
function makeProj(mobile) {
    if (mobile) {
        // Use consistent scaling method - same as initial creation
        const scale = Math.min(screenWidth, screenHeight) * 0.9; // 90% of smaller dimension
        const translateX = screenWidth * 0.5; // Center horizontally
        const translateY = screenHeight * 0.5; // Center vertically
        
        var proj = d3.geo.mercator()
            .scale(scale)
            .translate([translateX, translateY]);
        return proj;
    } else {
        var proj = d3.geo.mercator()
            .scale(600)
            .translate([200, 225])
        return proj;
    }
}

// Track scrolling to prevent resize events during scroll
window.addEventListener('scroll', function() {
    if (isMobile) {
        isScrolling = true;
        isMapLocked = true; // Lock map position during scroll
        
        // Force the projection to stay the same during scroll
        if (originalProjectionValues && proj) {
            proj.scale(originalProjectionValues.scale);
            proj.translate(originalProjectionValues.translate);
            carto.projection(proj);
        }
        
        // Add CSS class to prevent any map transitions during scroll
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.classList.add('scrolling');
            mapElement.style.pointerEvents = 'none'; // Prevent interactions during scroll
            mapElement.style.transform = 'translateZ(0)'; // Force hardware acceleration
        }
        
        // Clear existing scroll timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Set scrolling to false after scrolling stops
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
            // Keep map locked for a bit longer to prevent post-scroll resize events
            setTimeout(function() {
                isMapLocked = false;
                // Re-enable map interactions
                if (mapElement) {
                    mapElement.classList.remove('scrolling');
                    mapElement.style.pointerEvents = 'auto';
                    mapElement.style.transform = '';
                }
            }, 1000); // 1000ms after scrolling stops - longer delay
        }, 200); // 200ms after last scroll event - longer delay
    }
});

// Handle window resize for responsive map scaling
window.addEventListener('resize', function() {
    if (isMobile && topology && geometries) {
        // Completely ignore resize events during scroll or when map is locked
        if (isScrolling || isMapLocked) {
            console.log('Resize ignored - scrolling or map locked');
            return;
        }
        
        // Clear existing timeout
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        // Debounce the resize event with longer delay
        resizeTimeout = setTimeout(function() {
            // Double-check that we're still not scrolling
            if (isScrolling || isMapLocked) {
                console.log('Resize cancelled - still scrolling or locked');
                return;
            }
            
            const newScreenWidth = window.innerWidth;
            const newScreenHeight = window.innerHeight;
            
            // Check if the resize is significant enough to warrant an update
            const widthDiff = Math.abs(newScreenWidth - lastResizeDimensions.width);
            const heightDiff = Math.abs(newScreenHeight - lastResizeDimensions.height);
            const significantChange = widthDiff > 100 || heightDiff > 100; // Increased threshold to 100px
            
            if (significantChange || lastResizeDimensions.width === 0) {
                console.log('Processing resize event');
                // Update last known dimensions
                lastResizeDimensions.width = newScreenWidth;
                lastResizeDimensions.height = newScreenHeight;
                
                // Recreate projection with new dimensions
                proj = makeProj(isMobile);
                
                // Update cartogram projection
                carto.projection(proj);
                
                // Preserve current cartogram state
                var features;
                if (currentCartogramState) {
                    // If we have a current cartogram state, recreate it with the new projection
                    let rawVals = collectValues(currentCartogramState.index, currentCartogramState.style);
                    let dFunc = getDisparityFunc(rawVals);
                    
                    carto.value(function (d) {
                        var countryName = d.properties.name;
                        if (currentCartogramState.style) {
                            var val = parseInt(styleData.get(countryName)[currentCartogramState.index]);
                        } else {
                            var val = parseInt(genreData.get(countryName)[currentCartogramState.index]);
                        }
                        return dFunc(val);
                    });
                    
                    features = carto(topology, geometries).features;
                } else {
                    // Otherwise use original features
                    features = carto.features(topology, geometries);
                }
                
                var path = d3.geo.path().projection(proj);
                
                // Update the map
                countries.data(features)
                    .select("title")
                    .text(function (d) {
                        return d.properties.name;
                    });
                countries.transition()
                    .duration(300)
                    .attr("d", path);
            } else {
                console.log('Resize too small, ignoring');
            }
        }, 500); // 500ms debounce delay - longer delay
    }
});