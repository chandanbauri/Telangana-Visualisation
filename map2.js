$(document).ready(function () {
  const DEFAULT_MAP_SEGMENT_COLOR = "#A2412F";
  const DEFAULT_HOVER_SEGMENT_COLOR = "#FF9480";

  var indiaCenter = [17.5, 79.2];
  var defaultZoom = 7;

  var map = L.map("mapid", {
    scrollWheelZoom: false,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
    attributionControl: false,
  }).setView(indiaCenter, defaultZoom);

  var legend;
  $.getJSON("./data/sample_data.json", function (json) {
    // Populate dropdown entries
    // var thisUL = document.getElementById("dropMenu");
    // for (i in json["Hyderabad"]) {
    //   var link = document.createElement("a");
    //   link.appendChild(document.createTextNode(i));
    //   var thisLI = document.createElement("li");
    //   thisLI.appendChild(link);
    //   thisUL.appendChild(thisLI);
    // }

    var caretHTML = " <span class='caret'></span>";

    // $(".dropdown-menu").on("click", "li a", function () {
    //   var currValue = $(this).text();
    //   prop = currValue;
    //   $(".btn:first-child").text(currValue);
    //   $(".btn:first-child").html(currValue + " " + caretHTML);

    let prop = "Area (km2)";

    // Get Data function
    function getData(val, extraProp) {
      if (extraProp) {
        prop = extraProp;
      }

      if (val in json) {
        return json[val][prop];
      } else {
        return 0.0;
      }
    }

    var vals = [];
    for (i in json) {
      vals.push(json[i][prop]);
    }

    var min = Math.min(...vals);
    var max = Math.max(...vals);

    function style(feature) {
      return {
        fillColor: DEFAULT_MAP_SEGMENT_COLOR,
        weight: 2,
        opacity: 1,
        color: "#FFFFFF",
        dashArray: "3",
        fillOpacity: 1,
      };
    }
    $.getJSON("./data/Telangana.geojson", function (geojson) {
      var searchLayer = L.geoJSON(geojson, {
        style: style,
        onEachFeature(feature, layer) {
          function renderCompanies() {
            const company_groups = getData(
              feature.properties.D_NAME,
              "food_processing_data",
            );
            const row_container = document.getElementById("rows_container");

            try {
              let rows = "";

              for (const group of company_groups) {
                rows += `
                  <div class="col-md-3" style="padding-left: 0px;">
                    <div class="group-card">
                      <h6>${group.zone_name}</h6>
                      <h5>${feature.properties.D_NAME}</h5>
                      <div>
                           <img />
                      </div>
                      <span>${group.acres}</span>
                    </div>
                  </div>
                `;
              }
              let container = `<div class="col-md-12" style="flex-shrink: 0;">
                                  <h1 class="district-title">${feature.properties.D_NAME} District</h1>
                               </div>
                               <div class="row col-md-12">
                                  ${rows}
                               </div>`;

              row_container.innerHTML = container;
            } catch (error) {
              row_container.innerHTML = "";
            }
          }
          layer.on("mouseover", function () {
            this.setStyle({
              fillColor: DEFAULT_HOVER_SEGMENT_COLOR,
            });
            var tipText = feature.properties.D_NAME;
            this.bindTooltip(tipText).openTooltip();
            renderCompanies();
          });
          layer.on("mouseout", function () {
            this.setStyle({
              fillColor: DEFAULT_MAP_SEGMENT_COLOR,
            });
          });

          if (feature.properties.D_NAME.toLowerCase() == "siddipet") {
            renderCompanies();
          }
        },
      }).addTo(map);
    });

    // Add legend
    // if (legend instanceof L.Control) {
    //   map.removeControl(legend);
    // }
    // legend = L.control({ position: "topright" });
    // legend.onAdd = function (map) {
    //   var div = L.DomUtil.create("div", "info legend"),
    //     grades = d3.ticks(min, max, 6),
    //     labels = [];
    //   // loop through our density intervals and generate a label with a colored square for each interval
    //   for (var i = 0; i < grades.length; i++) {
    //     div.innerHTML +=
    //       '<i style="background:' +
    //       "#00FF00" +
    //       '"></i> ' +
    //       grades[i] +
    //       (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    //   }
    //   return div;
    // };
    // legend.addTo(map);
    // });
    //trigger event
    // $(".dropdown-menu li a").first().trigger("click");
  });

  // Define color
  function getColor(d, values) {
    // Get range of values
    var min = Math.min(...values);
    var max = Math.max(...values);

    var myColor = d3
      .scaleLinear()
      .domain([min, 0.5 * (min + max), max])
      .range(["red", "yellow", "green"]);

    return myColor(d);
  }
});
