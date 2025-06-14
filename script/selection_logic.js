// Importing functions from map_logic
import {do_update, reset_carto} from './map_logic.js';

// Genre List
const genre_list = ['Blues', 'Brass & Military', "Children's", 'Classical', 'Electronic',
              'Folk, World, & Country', 'Funk / Soul', 'Hip Hop', 'Jazz', 'Latin',
              'Non-Music', 'Pop', 'Reggae', 'Rock', 'Stage & Screen'];

// Style list
const style_list = ['AOR', 'Aboriginal', 'Abstract', 'Acid', 'Acid House', 'Acid Jazz', 'Acid Rock', 'Acoustic', 'African', 'Afro-Cuban',
            'Afro-Cuban Jazz', 'Afrobeat', 'Aguinaldo', 'Alt-Pop', 'Alternative Metal', 'Alternative Rock', 'Amapiano', 'Ambient', 
            'Ambient House', 'Anarcho-Punk', 'Anatolian Rock', 'Andalusian Classical', 'Andean Music', 'Anison', 'Antifolk', 'Appalachian Music', 
            'Arabic Pop', 'Arena Rock', 'Art Rock', 'Atmospheric Black Metal', 'Audiobook', 'Avant-garde Jazz', 'Avantgarde', 'Axé', 'Azonto', 
            'Bachata', 'Baila', 'Baião', 'Bakersfield Sound', 'Balearic', 'Ballad', 'Ballet', 'Ballroom', 'Baltimore Club', 'Bambuco', 'Banda', 
            'Bangladeshi Classical', 'Barbershop', 'Baroque', 'Baroque Pop', 'Basque Music', 'Bass Music', 'Bassline', 'Batucada', 'Bayou Funk', 
            'Beat', 'Beatbox', 'Beatdown', 'Beguine', 'Bengali Music', 'Berlin-School', 'Bećarac', 'Bhangra', 'Big Band', 'Big Beat', 'Bitpop', 
            'Black Metal', 'Blackgaze', 'Bleep', 'Bluegrass', 'Blues Rock', 'Bolero', 'Bollywood', 'Bomba', 'Bongo Flava', 'Boogaloo', 'Boogie', 
            'Boogie Woogie', 'Boom Bap', 'Bop', 'Bossa Nova', 'Bossanova', 'Bounce', 'Bouncy Techno', 'Brass Band', 'Break-In', 'Breakbeat', 
            'Breakcore', 'Breaks', 'Brega', 'Britcore', 'Britpop', 'Broken Beat', 'Brutal Death Metal', 'Bubblegum', 'Bubbling', 'Bultrón', 
            'Byzantine', 'Cabaret', 'Caipira', 'Cajun', 'Calypso', 'Cambodian Classical', 'Candombe', 'Cantopop', 'Cantorial', 
            'Canzone Napoletana', 'Cape Jazz', 'Carimbó', 'Carnatic', 'Catalan Music', 'Celtic', 'Cha-Cha', 'Chacarera', 'Chamamé', 
            'Champeta', 'Chanson', 'Charanga', 'Chicago Blues', 'Chillwave', 'Chinese Classical', 'Chiptune', 'Choral', 'Choro', 'Chutney', 
            'City Pop', 'Classic Rock', 'Classical', 'Cloud Rap', 'Cobla', 'Coldwave', 'Comedy', 'Comfy Synth', 'Compas', 'Concert Film', 
            'Conjunto', 'Conscious', 'Contemporary', 'Contemporary Jazz', 'Contemporary R&B', 'Cool Jazz', 'Copla', 'Corrido', 'Country', 
            'Country Blues', 'Country Rock', 'Cretan', 'Crossover thrash', 'Crunk', 'Crust', 'Cuatro', 'Cubano', 'Cumbia', 'Currulao', 
            'Cut-up/DJ', 'DJ Battle Tool', 'Dabke', 'Dance-pop', 'Dancehall', 'Dangdut', 'Dansband', 'Danzon', 'Dark Ambient', 'Dark Electro', 
            'Dark Jazz', 'Darkwave', 'Death Metal', 'Deathcore', 'Deathrock', 'Deconstructed Club', 'Deep House', 'Deep Techno', 'Delta Blues', 
            'Depressive Black Metal', 'Descarga', 'Desert Blues', 'Dialogue', 'Disco', 'Disco Polo', 'Dixieland', 'Donk', 'Doo Wop', 'Doom Metal', 
            'Doomcore', 'Downtempo', 'Dream Pop', 'Drill', 'Drone', 'Drum n Bass', 'Dub', 'Dub Poetry', 'Dub Techno', 'Dubstep', 'Dungeon Synth', 
            'Duranguense', 'EBM', 'Early', 'East Coast Blues', 'Easy Listening', 'Education', 'Educational', 'Electric Blues', 'Electro', 
            'Electro House', 'Electro Swing', 'Electroacoustic', 'Electroclash', 'Emo', 'Enka', 'Erotic', 'Ethereal', 'Ethno-pop', 'Euro House', 
            'Euro Trance', 'Euro-Disco', 'Eurobeat', 'Eurodance', 'Europop', 'Exotica', 'Experimental', 'Fado', 'Favela Funk', 'Field Recording', 
            'Filk', 'Flamenco', 'Folk', 'Folk Metal', 'Folk Rock', 'Footwork', 'Forró', 'Free Funk', 'Free Improvisation', 'Free Jazz', 
            'Freestyle', 'Freetekno', 'French House', 'Frevo', 'Funaná', 'Funeral Doom Metal', 'Funk', 'Funk Metal', 'Funkot', 'Fusion', 
            'Future Bass', 'Future House', 'Future Jazz', 'Future Pop', 'G-Funk', 'Gabber', 'Gagaku', 'Gaita', 'Galician Traditional', 'Gamelan', 
            'Gangsta', 'Garage House', 'Garage Rock', 'Geet', 'Ghazal', 'Ghetto', 'Ghetto House', 'Ghettotech', 'Glam', 'Glitch', 'Glitch Hop', 
            'Gnawa', 'Go-Go', 'Goa Trance', 'Goregrind', 'Gospel', 'Goth Rock', 'Gothic Metal', 'Gqom', 'Grime', 'Grindcore', 'Griot', 
            'Groove Metal', 'Group Sounds', 'Grunge', 'Guaguancó', 'Guajira', 'Guaracha', 'Guarania', 'Guggenmusik', 'Gusle', 'Gwo Ka', 
            'Gypsy Jazz', 'Għana', 'Halftime', 'Hands Up', 'Happy Hardcore', 'Hard Beat', 'Hard Bop', 'Hard House', 'Hard Rock', 'Hard Techno', 
            'Hard Trance', 'Hardcore', 'Hardcore Hip-Hop', 'Hardstyle', 'Harmonica Blues', 'Harsh Noise Wall', 'Hawaiian', 'Health-Fitness', 
            'Heavy Metal', 'Hi NRG', 'Highlife', 'Hill Country Blues', 'Hillbilly', 'Hindustani', 'Hip Hop', 'Hip-House', 'Hiplife', 
            'Hokkien Pop', 'Holiday', 'Honky Tonk', 'Honkyoku', 'Horror Rock', 'Horrorcore', 'House', 'Huayno', 'Hyper Techno', 'Hyperpop', 
            'Hyphy', 'Hypnagogic pop', 'IDM', 'Illbient', 'Impressionist', 'Indian Classical', 'Indie Pop', 'Indie Rock', 'Indo-Pop', 
            'Industrial', 'Industrial Metal', 'Instrumental', 'Interview', 'Italo House', 'Italo-Disco', 'Italodance', 'Izvorna', 'J-Core', 
            'J-Rock', 'J-pop', 'Jangle Pop', 'Jazz-Funk', 'Jazz-Rock', 'Jazzdance', 'Jazzy Hip-Hop', 'Jersey Club', 'Jibaro', 'Jiuta', 
            'Joropo', 'Jota', 'Jug Band', 'Juke', 'Jump Blues', 'Jumpstyle', 'Jungle', 'Junkanoo', 'K-Rock', 'K-pop', 'Karaoke', 'Kaseko', 
            'Kaskawi', 'Kayōkyoku', 'Keroncong', 'Khaliji', 'Kizomba', 'Klasik', 'Klezmer', 'Kolo', 'Korean Court Music', 'Krautrock', 'Kuduro', 
            'Kwaito', 'Lambada', 'Lao Music', 'Latin', 'Latin Jazz', 'Latin Pop', 'Laïkó', 'Leftfield', 'Lento Violento', 'Levenslied', 
            'Light Music', 'Liscio', 'Lo-Fi', 'Louisiana Blues', 'Lounge', 'Lovers Rock', 'Low Bap', 'Lowercase', 'Luk Krung', 'Luk Thung', 
            'Lullaby', 'MPB', 'Makina', 'Maloya', 'Mambo', 'Mandopop', 'Manila Sound', 'Marcha Carnavalesca', 'Marches', 'Mariachi', 'Marimba', 
            'Math Rock', 'Mathcore', 'Mbalax', 'Medical', 'Medieval', 'Melodic Death Metal', 'Melodic Hardcore', 'Memphis Blues', 'Memphis Rap', 
            'Mento', 'Merengue', 'Metalcore', 'Miami Bass', 'Microhouse', 'Midwest Emo', 'Military', 'Milonga', "Min'yō", 'Minimal', 
            'Minimal Techno', 'Minneapolis Sound', 'Mizrahi', 'Mo Lam', 'Mod', 'Modal', 'Modern', 'Modern Classical', 'Modern Electric Blues', 
            'Monolog', 'Moombahton', 'Morna', 'Motswako', 'Mouth Music', 'Movie Effects', 'Mugham', 'Musette', 'Music Hall', 'Music Video', 
            'Musical', 'Musique Concrète', 'Música Criolla', 'NDW', 'Nagauta', 'Neo Soul', 'Neo Trance', 'Neo-Classical', 'Neo-Classical Metal', 
            'Neo-Romantic', 'Neofolk', 'Neopagan', 'Nerdcore Techno', 'New Age', 'New Beat', 'New Jack Swing', 'New Wave', 'Nhạc Vàng', 
            'Nintendocore', 'No Wave', 'Noise', 'Noise Rock', 'Noisecore', 'Nordic', 'Norteño', 'Novelty', 'Nu Metal', 'Nu-Disco', 'Nueva Cancion', 
            'Nueva Trova', 'Nursery Rhymes', 'Néo Kyma', 'Népzene', 'Occitan', 'Occult', 'Oi', 'Ojkača', 'Opera', 'Operetta', 'Oratorio', 'Organ', 
            'Ottoman Classical', 'Overtone Singing', 'P.Funk', 'Pachanga', 'Pacific', 'Pagode', 'Parody', 'Pasodoble', 'Persian Classical', 
            'Persian Pop', 'Philippine Classical', 'Phleng Phuea Chiwit', 'Phonk', 'Piano Blues', 'Piedmont Blues', 'Piobaireachd', 'Pipe & Drum', 
            'Plena', 'Plunderphonics', 'Poetry', 'Political', 'Polka', 'Pop Punk', 'Pop Rap', 'Pop Rock', 'Pornogrind', 'Porro', 'Post Bop', 
            'Post Rock', 'Post-Grunge', 'Post-Hardcore', 'Post-Metal', 'Post-Modern', 'Post-Punk', 'Power Electronics', 'Power Metal', 'Power Pop', 
            'Power Violence', 'Prog Rock', 'Progressive Bluegrass', 'Progressive Breaks', 'Progressive House', 'Progressive Metal', 
            'Progressive Trance', 'Promotional', 'Psy-Trance', 'Psychedelic', 'Psychedelic Rock', 'Psychobilly', 'Pub Rock', 'Public Broadcast', 
            'Public Service Announcement', 'Punk', 'Qawwali', 'Quechua', 'Radioplay', 'Ragga', 'Ragga HipHop', 'Ragtime', 'Ranchera', 'Rapso', 
            'Rara', 'Raï', 'Rebetiko', 'Reggae', 'Reggae Gospel', 'Reggae-Pop', 'Reggaeton', 'Religious', 'Renaissance', 'Rhythm & Blues', 
            'Rhythmic Noise', 'RnB/Swing', 'Rock & Roll', 'Rock Opera', 'Rockabilly', 'Rocksteady', 'Romani', 'Romantic', 'Roots Reggae', 'Rumba', 
            'Rune Singing', 'Russian Pop', 'Ryūkōka', 'Rōkyoku', 'Salegy', 'Salsa', 'Samba', 'Samba-Canção', 'Sankyoku', 'Schlager', 'Schranz', 
            'Score', 'Screamo', 'Screw', 'Sea Shanties', 'Sean-nós', 'Sephardic', 'Seresta', 'Serial', 'Sermon', 'Sertanejo', 'Shaabi', 
            'Shibuya-Kei', 'Shidaiqu', 'Shinkyoku', 'Shoegaze', 'Shomyo', 'Singeli', 'Ska', 'Skiffle', 'Skweee', 'Slowcore', 'Sludge Metal', 
            'Smooth Jazz', 'Snap', 'Soca', 'Soft Rock', 'Sokyoku', 'Son', 'Son Montuno', 'Sonero', 'Soukous', 'Soul', 'Soul-Jazz', 'Sound Art', 
            'Sound Collage', 'Sound Poetry', 'Soundtrack', 'Southern Rock', 'Space Rock', 'Space-Age', 'Spaza', 'Special Effects', 'Speech', 
            'Speed Garage', 'Speed Metal', 'Speedcore', 'Spiritual Jazz', 'Spirituals', 'Spoken Word', 'Sport', 'Steel Band', 'Stoner Rock', 
            'Story', 'Stride', 'Sunshine Pop', 'Suomisaundi', 'Surf', 'Swamp Pop', 'Swing', 'Swingbeat', 'Symphonic Metal', 'Symphonic Rock', 
            'Synth-pop', 'Synthpunk', 'Synthwave', 'Sámi Music', 'Séga', 'Taarab', 'Tamburitza', 'Tamil Film Music', 'Tango', 'Tech House', 
            'Tech Trance', 'Technical', 'Technical Death Metal', 'Techno', 'Tejano', 'Texas Blues', 'Thai Classical', 'Theme', 'Therapy', 
            'Thrash', 'Thug Rap', 'Timba', 'Toasting', 'Trallalero', 'Trance', 'Trap', 'Tribal', 'Tribal House', 'Trip Hop', 'Tropical House', 
            'Trova', 'Turntablism', 'Twelve-tone', 'Twist', 'UK Funky', 'UK Garage', 'UK Street Soul', 'Unblack Metal', 'V-pop', 'Vallenato', 
            'Vaporwave', 'Vaudeville', 'Video Game Music', 'Viking Metal', 'Villancicos', 'Vocal', 'Vocaloid', 'Volksmusik', 'Waiata', 
            'Western Swing', 'Witch House', 'Yemenite Jewish', 'Yoruba', 'Yé-Yé', 'Zamba', 'Zarzuela', 'Zemer Ivri', 'Zhongguo Feng', 'Zouk', 
            'Zydeco', 'Éntekhno']

// Create right selection menu
let rightt_col = document.getElementById("right_col");
for (let i = 0; i < genre_list.length; i++) {
    let genre_button = document.createElement("button");
    genre_button.onclick = function () {
        do_update(i);
    }
    genre_button.textContent = genre_list[i];
    right_col.appendChild(genre_button);
}
