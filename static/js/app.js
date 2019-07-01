function buildMetadata(sample) {

  // Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data) {
    console.log(data);

    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      selector.append('h6').text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    console.log(data);
    var otu_ids = data.otu_ids;
    var sample_vals = data.sample_values;
    var otu_labels = data.otu_labels;

    // Build a Bubble Chart using the sample data
    var bubbleLayout = {
      margin: {t: 0},
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };
    
    var bubbleData = [{
      x: otu_ids,
      y: sample_vals,
      text: otu_labels,
      mode: "markers",
      marker: {
      size: sample_vals,
      color: otu_ids,
      colorscale: "'Electric'"
    }
    }];

    Plotly.plot("bubble", bubbleData, bubbleLayout);

    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieLayout = {
      margin: {t: 1, l: 1}
    };

    pieData = [
      {
      type: "pie",
      values: sample_vals.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: "hovertext"
      }];

    Plotly.plot("pie", pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
