# DataViz Project
### by Charles Gallay, Thomas Batschelet and Valentine Santarelli

## Process book
### November 14
For our visualization project, we decided to focus our attention on environmental changes and plausible correlations between several aspects at a country level .

Our goal will be to show the links between ecological footprints, GDP, CO2 emissions and global temperature changes in an interactive map that catches interest. The resulting tool will be an intuitive visualization that raises awareness among people and present actual knowledge by giving an objective insight about environmental changes without arguing global warming.

This thematic has certainly been a major topic for the last decade but we could argue that due to the massive amount of information that is regularly given by news, it can be hard to filter out the actual relevant facts that influence climate evolution. Therefore, it would be nice and helpful to be able to visualize different aspects of the changes to take a better grasp at the actual problems.

Technicalities:
A map of the world showing the average temperature per location through time. Build into this map, we want to integrate the possibility for the user to select one (or multiple country) to see more detail about a region, like the ecological footprint or GDP evolution.
Questions to our project can answer:
Is a healthy country more likely to impact the changes ? (GDP)
Does the ecological footprint of a country directly impacts its climate changes ?
Can we visualize the correlation between CO2 emissions and temperature changes at country level ?
Does climate tend towards global warming or extreme temperatures (freezing winter and unusually warm summers)?

###November 21
The group met to fix the visualization elements and interactions to get on the same page before coding.

The user will arrive on the web page with a map of the world. He/she can choose between following the storytelling implemented like a tutorial or immediately dive in the discovering of the datasets.

The interface is divided in two parts: the world map and the panel.
The world map will different utilities;
- it would be used to display the choropleth of the mean temperature/CO2 per country by selecting a checkbox
- it is also use to select one or two countries or none. If no country is select then the visualisation will statistics about the entire world. If one country is selected the statics will be take into account the data corresponding to this country.If two countries are selected, then the statistics of both will be display to enable a comparison between them.

The panel will  display different graphs and statistics on temperature/CO2 and its variations , but also about the ecological footprint. We agreed on the following visualization
- A line graph of variables evolution in time. The variables here are the temperature and CO2 and each of them will have it's own graph because scale and units differs. But they will be put one under the over to facilitate comparison.
- The next graphs will be similar expect it will represent the evolution of the variation of the variables.
- The ecological footprint of a country is measured in globally comparable, standardized hectares with world average productivity. The idea is to map this measure to the surface of a planete and compare the size of this planete to the size of the Earth.  
-  To go further in the correlation between temperature and CO2, we thought about a bubble chart representing the CO2 in function of the temperature with the size of the bubble representing the ecological footprint of the country.

The time handler is composed of a time range slider on the years, a time range slider on the months, and a play button.
The time handler, at the bottom of the page, has  different utilities:
- it can select a range of years to take into account in the displayed statics in the panel (example the evolution of the temperature only visualized for the time range selected).
- it can also select the specified months of the years, for example to visualize the evolution of the mean temperature for September over the years.
- it also comes with a play button what will animate the choropleth selected (temperature or CO2) but also the year range slider  and the statistics that are time dependent with a fine red tick that will display the current time.


Changes:
Handling dataset size
