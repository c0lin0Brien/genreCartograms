export function generateGenreInsight(genreName) {
    var labels = [];
    var values = [];
    d3.csv("public/country_genres.csv", function(data) {
    // "data" is an array of rows (parsed objects)
    console.log(`genreName: ${genreName}`);
    let formattedName = formatGenreName(genreName);
    console.log(`formatted: ${formattedName}`);
    // Extract genres and counts manually

    data.forEach(row => {
        const country = row.COUNTRY;
        const value = +row[formattedName];

        if (!isNaN(value) && value > 0) {
            labels.push(country);
            values.push(value);
        }
    });

    // Now you can pass `labels` and `values` to Chart.js or another library
    console.log("Labels:", labels);
    console.log("Values:", values);
    });

    const ctx = document.getElementById("genre-insights").getContext("2d");

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: labels.map((_, i) =>
                    `hsl(${(i * 360 / labels.length)}, 70%, 60%)`
                )
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false   // ❌ hide the legend
                },
                tooltip: {
                    enabled: true,   // ✅ tooltips show on hover (default)
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    });
}

function formatGenreName(str) {
  return str.toUpperCase().replace(/\s+/g, "_");
}