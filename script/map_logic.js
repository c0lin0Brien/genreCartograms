// Set up projection
var map = d3.select("#map");

var countries = map.append("g")
    .attr("id", "countries")
    .selectAll("path");

var proj = d3.geo.mercator()
    .scale(600)
    .translate([200, 225])

var topology,
    geometries,
    cartoFeatures;

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
        // console.log(`Country: ${d.COUNTRY_NAME}`);
        styleData.set(d.COUNTRY_NAME, [d.AOR, d.ABORIGINAL, d.ABSTRACT, d.ACID, d.ACID_HOUSE, d.ACID_JAZZ, d.ACID_ROCK, d.ACOUSTIC, d.AFRICAN, d.AFRO_CUBAN, d.AFRO_CUBAN_JAZZ, d.AFROBEAT, d.AGUINALDO, d.ALT_POP, d.ALTERNATIVE_METAL, d.ALTERNATIVE_ROCK, d.AMAPIANO, d.AMBIENT, d.AMBIENT_HOUSE, d.ANARCHO_PUNK, d.ANATOLIAN_ROCK, d.ANDALUSIAN_CLASSICAL, d.ANDEAN_MUSIC, d.ANISON, d.ANTIFOLK, d.APPALACHIAN_MUSIC, d.ARABIC_POP, d.ARENA_ROCK, d.ART_ROCK, d.ATMOSPHERIC_BLACK_METAL, d.AUDIOBOOK, d.AVANT_GARDE_JAZZ, d.AVANTGARDE, d.AXÉ, d.AZONTO, d.BACHATA, d.BAILA, d.BAIÃO, d.BAKERSFIELD_SOUND, d.BALEARIC, d.BALLAD, d.BALLET, d.BALLROOM, d.BALTIMORE_CLUB, d.BAMBUCO, d.BANDA, d.BANGLADESHI_CLASSICAL, d.BARBERSHOP, d.BAROQUE, d.BAROQUE_POP, d.BASQUE_MUSIC, d.BASS_MUSIC, d.BASSLINE, d.BATUCADA, d.BAYOU_FUNK, d.BEAT, d.BEATBOX, d.BEATDOWN, d.BEGUINE, d.BENGALI_MUSIC, d.BERLIN_SCHOOL, d.BEĆARAC, d.BHANGRA, d.BIG_BAND, d.BIG_BEAT, d.BITPOP, d.BLACK_METAL, d.BLACKGAZE, d.BLEEP, d.BLUEGRASS, d.BLUES_ROCK, d.BOLERO, d.BOLLYWOOD, d.BOMBA, d.BONGO_FLAVA, d.BOOGALOO, d.BOOGIE, d.BOOGIE_WOOGIE, d.BOOM_BAP, d.BOP, d.BOSSA_NOVA, d.BOSSANOVA, d.BOUNCE, d.BOUNCY_TECHNO, d.BRASS_BAND, d.BREAK_IN, d.BREAKBEAT, d.BREAKCORE, d.BREAKS, d.BREGA, d.BRITCORE, d.BRITPOP, d.BROKEN_BEAT, d.BRUTAL_DEATH_METAL, d.BUBBLEGUM, d.BUBBLING, d.BULTRÓN, d.BYZANTINE, d.CABARET, d.CAIPIRA, d.CAJUN, d.CALYPSO, d.CAMBODIAN_CLASSICAL, d.CANDOMBE, d.CANTOPOP, d.CANTORIAL, d.CANZONE_NAPOLETANA, d.CAPE_JAZZ, d.CARIMBÓ, d.CARNATIC, d.CATALAN_MUSIC, d.CELTIC, d.CHA_CHA, d.CHACARERA, d.CHAMAMÉ, d.CHAMPETA, d.CHANSON, d.CHARANGA, d.CHICAGO_BLUES, d.CHILLWAVE, d.CHINESE_CLASSICAL, d.CHIPTUNE, d.CHORAL, d.CHORO, d.CHUTNEY, d.CITY_POP, d.CLASSIC_ROCK, d.CLASSICAL, d.CLOUD_RAP, d.COBLA, d.COLDWAVE, d.COMEDY, d.COMFY_SYNTH, d.COMPAS, d.CONCERT_FILM, d.CONJUNTO, d.CONSCIOUS, d.CONTEMPORARY, d.CONTEMPORARY_JAZZ, d.CONTEMPORARY_RB, d.COOL_JAZZ, d.COPLA, d.CORRIDO, d.COUNTRY, d.COUNTRY_BLUES, d.COUNTRY_ROCK, d.CRETAN, d.CROSSOVER_THRASH, d.CRUNK, d.CRUST, d.CUATRO, d.CUBANO, d.CUMBIA, d.CURRULAO, d.CUT_UP_DJ, d.DJ_BATTLE_TOOL, d.DABKE, d.DANCE_POP, d.DANCEHALL, d.DANGDUT, d.DANSBAND, d.DANZON, d.DARK_AMBIENT, d.DARK_ELECTRO, d.DARK_JAZZ, d.DARKWAVE, d.DEATH_METAL, d.DEATHCORE, d.DEATHROCK, d.DECONSTRUCTED_CLUB, d.DEEP_HOUSE, d.DEEP_TECHNO, d.DELTA_BLUES, d.DEPRESSIVE_BLACK_METAL, d.DESCARGA, d.DESERT_BLUES, d.DIALOGUE, d.DISCO, d.DISCO_POLO, d.DIXIELAND, d.DONK, d.DOO_WOP, d.DOOM_METAL, d.DOOMCORE, d.DOWNTEMPO, d.DREAM_POP, d.DRILL, d.DRONE, d.DRUM_N_BASS, d.DUB, d.DUB_POETRY, d.DUB_TECHNO, d.DUBSTEP, d.DUNGEON_SYNTH, d.DURANGUENSE, d.EBM, d.EARLY, d.EAST_COAST_BLUES, d.EASY_LISTENING, d.EDUCATION, d.EDUCATIONAL, d.ELECTRIC_BLUES, d.ELECTRO, d.ELECTRO_HOUSE, d.ELECTRO_SWING, d.ELECTROACOUSTIC, d.ELECTROCLASH, d.EMO, d.ENKA, d.EROTIC, d.ETHEREAL, d.ETHNO_POP, d.EURO_HOUSE, d.EURO_TRANCE, d.EURO_DISCO, d.EUROBEAT, d.EURODANCE, d.EUROPOP, d.EXOTICA, d.EXPERIMENTAL, d.FADO, d.FAVELA_FUNK, d.FIELD_RECORDING, d.FILK, d.FLAMENCO, d.FOLK, d.FOLK_METAL, d.FOLK_ROCK, d.FOOTWORK, d.FORRÓ, d.FREE_FUNK, d.FREE_IMPROVISATION, d.FREE_JAZZ, d.FREESTYLE, d.FREETEKNO, d.FRENCH_HOUSE, d.FREVO, d.FUNANÁ, d.FUNERAL_DOOM_METAL, d.FUNK, d.FUNK_METAL, d.FUNKOT, d.FUSION, d.FUTURE_BASS, d.FUTURE_HOUSE, d.FUTURE_JAZZ, d.FUTURE_POP, d.G_FUNK, d.GABBER, d.GAGAKU, d.GAITA, d.GALICIAN_TRADITIONAL, d.GAMELAN, d.GANGSTA, d.GARAGE_HOUSE, d.GARAGE_ROCK, d.GEET, d.GHAZAL, d.GHETTO, d.GHETTO_HOUSE, d.GHETTOTECH, d.GLAM, d.GLITCH, d.GLITCH_HOP, d.GNAWA, d.GO_GO, d.GOA_TRANCE, d.GOREGRIND, d.GOSPEL, d.GOTH_ROCK, d.GOTHIC_METAL, d.GQOM, d.GRIME, d.GRINDCORE, d.GRIOT, d.GROOVE_METAL, d.GROUP_SOUNDS, d.GRUNGE, d.GUAGUANCÓ, d.GUAJIRA, d.GUARACHA, d.GUARANIA, d.GUGGENMUSIK, d.GUSLE, d.GWO_KA, d.GYPSY_JAZZ, d.GĦANA, d.HALFTIME, d.HANDS_UP, d.HAPPY_HARDCORE, d.HARD_BEAT, d.HARD_BOP, d.HARD_HOUSE, d.HARD_ROCK, d.HARD_TECHNO, d.HARD_TRANCE, d.HARDCORE, d.HARDCORE_HIP_HOP, d.HARDSTYLE, d.HARMONICA_BLUES, d.HARSH_NOISE_WALL, d.HAWAIIAN, d.HEALTH_FITNESS, d.HEAVY_METAL, d.HI_NRG, d.HIGHLIFE, d.HILL_COUNTRY_BLUES, d.HILLBILLY, d.HINDUSTANI, d.HIP_HOP, d.HIP_HOUSE, d.HIPLIFE, d.HOKKIEN_POP, d.HOLIDAY, d.HONKY_TONK, d.HONKYOKU, d.HORROR_ROCK, d.HORRORCORE, d.HOUSE, d.HUAYNO, d.HYPER_TECHNO, d.HYPERPOP, d.HYPHY, d.HYPNAGOGIC_POP, d.IDM, d.ILLBIENT, d.IMPRESSIONIST, d.INDIAN_CLASSICAL, d.INDIE_POP, d.INDIE_ROCK, d.INDO_POP, d.INDUSTRIAL, d.INDUSTRIAL_METAL, d.INSTRUMENTAL, d.INTERVIEW, d.ITALO_HOUSE, d.ITALO_DISCO, d.ITALODANCE, d.IZVORNA, d.J_CORE, d.J_ROCK, d.J_POP, d.JANGLE_POP, d.JAZZ_FUNK, d.JAZZ_ROCK, d.JAZZDANCE, d.JAZZY_HIP_HOP, d.JERSEY_CLUB, d.JIBARO, d.JIUTA, d.JOROPO, d.JOTA, d.JUG_BAND, d.JUKE, d.JUMP_BLUES, d.JUMPSTYLE, d.JUNGLE, d.JUNKANOO, d.K_ROCK, d.K_POP, d.KARAOKE, d.KASEKO, d.KASKAWI, d.KAYŌKYOKU, d.KERONCONG, d.KHALIJI, d.KIZOMBA, d.KLASIK, d.KLEZMER, d.KOLO, d.KOREAN_COURT_MUSIC, d.KRAUTROCK, d.KUDURO, d.KWAITO, d.LAMBADA, d.LAO_MUSIC, d.LATIN, d.LATIN_JAZZ, d.LATIN_POP, d.LAÏKÓ, d.LEFTFIELD, d.LENTO_VIOLENTO, d.LEVENSLIED, d.LIGHT_MUSIC, d.LISCIO, d.LO_FI, d.LOUISIANA_BLUES, d.LOUNGE, d.LOVERS_ROCK, d.LOW_BAP, d.LOWERCASE, d.LUK_KRUNG, d.LUK_THUNG, d.LULLABY, d.MPB, d.MAKINA, d.MALOYA, d.MAMBO, d.MANDOPOP, d.MANILA_SOUND, d.MARCHA_CARNAVALESCA, d.MARCHES, d.MARIACHI, d.MARIMBA, d.MATH_ROCK, d.MATHCORE, d.MBALAX, d.MEDICAL, d.MEDIEVAL, d.MELODIC_DEATH_METAL, d.MELODIC_HARDCORE, d.MEMPHIS_BLUES, d.MEMPHIS_RAP, d.MENTO, d.MERENGUE, d.METALCORE, d.MIAMI_BASS, d.MICROHOUSE, d.MIDWEST_EMO, d.MILITARY, d.MILONGA, d.MINYŌ, d.MINIMAL, d.MINIMAL_TECHNO, d.MINNEAPOLIS_SOUND, d.MIZRAHI, d.MO_LAM, d.MOD, d.MODAL, d.MODERN, d.MODERN_CLASSICAL, d.MODERN_ELECTRIC_BLUES, d.MONOLOG, d.MOOMBAHTON, d.MORNA, d.MOTSWAKO, d.MOUTH_MUSIC, d.MOVIE_EFFECTS, d.MUGHAM, d.MUSETTE, d.MUSIC_HALL, d.MUSIC_VIDEO, d.MUSICAL, d.MUSIQUE_CONCRÈTE, d.MÚSICA_CRIOLLA, d.NDW, d.NAGAUTA, d.NEO_SOUL, d.NEO_TRANCE, d.NEO_CLASSICAL, d.NEO_CLASSICAL_METAL, d.NEO_ROMANTIC, d.NEOFOLK, d.NEOPAGAN, d.NERDCORE_TECHNO, d.NEW_AGE, d.NEW_BEAT, d.NEW_JACK_SWING, d.NEW_WAVE, d.NHẠC_VÀNG, d.NINTENDOCORE, d.NO_WAVE, d.NOISE, d.NOISE_ROCK, d.NOISECORE, d.NORDIC, d.NORTEÑO, d.NOVELTY, d.NU_METAL, d.NU_DISCO, d.NUEVA_CANCION, d.NUEVA_TROVA, d.NURSERY_RHYMES, d.NÉO_KYMA, d.NÉPZENE, d.OCCITAN, d.OCCULT, d.OI, d.OJKAČA, d.OPERA, d.OPERETTA, d.ORATORIO, d.ORGAN, d.OTTOMAN_CLASSICAL, d.OVERTONE_SINGING, d.P_FUNK, d.PACHANGA, d.PACIFIC, d.PAGODE, d.PARODY, d.PASODOBLE, d.PERSIAN_CLASSICAL, d.PERSIAN_POP, d.PHILIPPINE_CLASSICAL, d.PHLENG_PHUEA_CHIWIT, d.PHONK, d.PIANO_BLUES, d.PIEDMONT_BLUES, d.PIOBAIREACHD, d.PIPE_AND_DRUM, d.PLENA, d.PLUNDERPHONICS, d.POETRY, d.POLITICAL, d.POLKA, d.POP_PUNK, d.POP_RAP, d.POP_ROCK, d.PORNOGRIND, d.PORRO, d.POST_BOP, d.POST_ROCK, d.POST_GRUNGE, d.POST_HARDCORE, d.POST_METAL, d.POST_MODERN, d.POST_PUNK, d.POWER_ELECTRONICS, d.POWER_METAL, d.POWER_POP, d.POWER_VIOLENCE, d.PROG_ROCK, d.PROGRESSIVE_BLUEGRASS, d.PROGRESSIVE_BREAKS, d.PROGRESSIVE_HOUSE, d.PROGRESSIVE_METAL, d.PROGRESSIVE_TRANCE, d.PROMOTIONAL, d.PSY_TRANCE, d.PSYCHEDELIC, d.PSYCHEDELIC_ROCK, d.PSYCHOBILLY, d.PUB_ROCK, d.PUBLIC_BROADCAST, d.PUBLIC_SERVICE_ANNOUNCEMENT, d.PUNK, d.QAWWALI, d.QUECHUA, d.RADIOPLAY, d.RAGGA, d.RAGGA_HIPHOP, d.RAGTIME, d.RANCHERA, d.RAPSO, d.RARA, d.RAÏ, d.REBETIKO, d.REGGAE, d.REGGAE_GOSPEL, d.REGGAE_POP, d.REGGAETON, d.RELIGIOUS, d.RENAISSANCE, d.RHYTHM_AND_BLUES, d.RHYTHMIC_NOISE, d.RNB_SWING, d.ROCK_AND_ROLL, d.ROCK_OPERA, d.ROCKABILLY, d.ROCKSTEADY, d.ROMANI, d.ROMANTIC, d.ROOTS_REGGAE, d.RUMBA, d.RUNE_SINGING, d.RUSSIAN_POP, d.RYŪKŌKA, d.RŌKYOKU, d.SALEGY, d.SALSA, d.SAMBA, d.SAMBA_CANÇÃO, d.SANKYOKU, d.SCHLAGER, d.SCHRANZ, d.SCORE, d.SCREAMO, d.SCREW, d.SEA_SHANTIES, d.SEAN_NÓS, d.SEPHARDIC, d.SERESTA, d.SERIAL, d.SERMON, d.SERTANEJO, d.SHAABI, d.SHIBUYA_KEI, d.SHIDAIQU, d.SHINKYOKU, d.SHOEGAZE, d.SHOMYO, d.SINGELI, d.SKA, d.SKIFFLE, d.SKWEEE, d.SLOWCORE, d.SLUDGE_METAL, d.SMOOTH_JAZZ, d.SNAP, d.SOCA, d.SOFT_ROCK, d.SOKYOKU, d.SON, d.SON_MONTUNO, d.SONERO, d.SOUKOUS, d.SOUL, d.SOUL_JAZZ, d.SOUND_ART, d.SOUND_COLLAGE, d.SOUND_POETRY, d.SOUNDTRACK, d.SOUTHERN_ROCK, d.SPACE_ROCK, d.SPACE_AGE, d.SPAZA, d.SPECIAL_EFFECTS, d.SPEECH, d.SPEED_GARAGE, d.SPEED_METAL, d.SPEEDCORE, d.SPIRITUAL_JAZZ, d.SPIRITUALS, d.SPOKEN_WORD, d.SPORT, d.STEEL_BAND, d.STONER_ROCK, d.STORY, d.STRIDE, d.SUNSHINE_POP, d.SUOMISAUNDI, d.SURF, d.SWAMP_POP, d.SWING, d.SWINGBEAT, d.SYMPHONIC_METAL, d.SYMPHONIC_ROCK, d.SYNTH_POP, d.SYNTHPUNK, d.SYNTHWAVE, d.SÁMI_MUSIC, d.SÉGA, d.TAARAB, d.TAMBURITZA, d.TAMIL_FILM_MUSIC, d.TANGO, d.TECH_HOUSE, d.TECH_TRANCE, d.TECHNICAL, d.TECHNICAL_DEATH_METAL, d.TECHNO, d.TEJANO, d.TEXAS_BLUES, d.THAI_CLASSICAL, d.THEME, d.THERAPY, d.THRASH, d.THUG_RAP, d.TIMBA, d.TOASTING, d.TRALLALERO, d.TRANCE, d.TRAP, d.TRIBAL, d.TRIBAL_HOUSE, d.TRIP_HOP, d.TROPICAL_HOUSE, d.TROVA, d.TURNTABLISM, d.TWELVE_TONE, d.TWIST, d.UK_FUNKY, d.UK_GARAGE, d.UK_STREET_SOUL, d.UNBLACK_METAL, d.V_POP, d.VALLENATO, d.VAPORWAVE, d.VAUDEVILLE, d.VIDEO_GAME_MUSIC, d.VIKING_METAL, d.VILLANCICOS, d.VOCAL, d.VOCALOID, d.VOLKSMUSIK, d.WAIATA, d.WESTERN_SWING, d.WITCH_HOUSE, d.YEMENITE_JEWISH, d.YORUBA, d.YÉ_YÉ, d.ZAMBA, d.ZARZUELA, d.ZEMER_IVRI, d.ZHONGGUO_FENG, d.ZOUK, d.ZYDECO, d.ÉNTEKHNO]);
    })
});

// this loads test the topojson file and creates the map.
d3.json("public/globe1.json", function (data) {
    topology = data;
    geometries = topology.objects.layer1.geometries;

    //these 2 below create the map and are based on the topojson implementation
    var features = carto.features(topology, geometries),
        path = d3.geo.path()
            .projection(proj);

    var currSelected;
    countries = countries.data(features)
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
});

export function doUpdate(i=11, style) {
    setTimeout(function () {
        // this sets the value to use for scaling, per country. Uses square root scaling
        carto.value(function (d) {
            var countryName = d.properties.name;
            if (style) {
                var val = styleData.get(countryName)[i]
            } else {
                var val = genreData.get(countryName)[i];
            }
            return Math.sqrt(parseInt(val) + 10);
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