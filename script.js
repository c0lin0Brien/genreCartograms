var map = d3.select("#map");

var countries = map.append("g")
    .attr("id", "countries")
    .selectAll("path");

var proj = d3.geo.mercator()
    .scale(1000)
    .translate([300, 450])

var topology,
    geometries,
    carto_features;

var genre_data = d3.map();

var carto = d3.cartogram()
    .projection(proj)
    .properties(function (d) {
        // this add the "properties" properties to the geometries
        return d.properties;
    });

// Loading data from discogs
d3.csv("public/matched_master.csv", function (data) {
    data.forEach(function (d) {
        genre_data.set(d.COUNTRY, [d.BLUES, d.BRASS_MILITARY, d.CHILDRENS, d.CLASSICAL, d.ELECTRONIC,
            d.FOLK_WORLD_COUNTRY, d.FUNK_SOUL, d.HIP_HOP, d.JAZZ,
        d.LATIN, d.NON_MUSIC, d.POP, d.REGGAE, d.ROCK, d.STAGE_SCREEN,
        d.TOTAL]);
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

    var curr_selected;
    countries = countries.data(features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("id", function (d) {
            // Fix to stop countries with spaces from tweaking
            var country_name = d.properties.name;
            if (country_name.includes(" ")) {
                var new_id = "";
                for (const char of country_name) {
                    if (char == " ") {
                        new_id += "_"
                    } else {
                        new_id += char;
                    }
                }
                return  new_id;
            } else {
                return country_name;
            }
        })
        .attr("d", path)
        .on("click", function(d) {
            d3.select(`#${curr_selected}`).classed("selected", false);
            console.log(`Prev selected: ${curr_selected}`);
            curr_selected = d.properties.name
            d3.select("#title").text(d.properties.name);
            d3.select(this).classed("selected", true);
            curr_selected = this.id;
            console.log(`New selected: ${curr_selected}`);
        });

    countries.append("title")
        .text(function (d) {
            return d.properties.name;
        });
});

function do_update(g=11) {
    setTimeout(function () {
        // this sets the value to use for scaling, per country. Uses square root scaling
        carto.value(function (d) {
            var countryName = d.properties.name;
            var val = genre_data.get(d.properties.name)[g];
            return Math.sqrt(parseInt(val) + 10);
        });

        if (carto_features == undefined) 
            console.log("Mama");
            //this regenrates the topology features for the new map based on 
            carto_features = carto(topology, geometries).features;

        //update the map data
        countries.data(carto_features)
            .select("title")
            .text(function (d) {
                return d.properties.name;
            });

        countries.transition()
            .duration(750)
            .attr("d", carto.path);
    }, 10);
}
function reset_carto() {
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