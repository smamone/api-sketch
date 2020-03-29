# API Sketch
## 11060 Assessment 2
### Stefanie Mamone u3027318

##### Link to weather app: https://smamone.github.io/api-sketch/

As a starting point for this task, I researched existing weather app designs to get a sense of the design direction, imagery used and data provided. I found many different design approaches including minimalist, iconography, imagery, typography and experimental, displaying a varied amount of information. I found that there was a commonality amongst most designs using sans serif fonts and delicate colours and tones.

![Image of Weather app](https://mir-s3-cdn-cf.behance.net/project_modules/disp/3c1cd822645245.5631618fdcc28.gif)  
*_Figure 1: Weather app (Nazoa, 2015)_*

![Image of Rams inspired weather app…](http://www.loveidee.com/blog/wp-content/uploads/2012/07/app.jpg)  
*_Figure 2: Dieter Rams inspired weather app… (Taylor, 2012)_*

![Image of Sun](https://miro.medium.com/max/1400/1*jHk9-_uvF3R5Lfo09sbUWA.gif)  
*_Figure 3: Sun (Henner, 2017)_*

![Image of Extremely hot weather widget](https://miro.medium.com/max/1400/1*HgDpy5xJZkiFxzM6jkf5BA.png)  
*_Figure 4: Extremely hot weather widget (Onur, 2017)_*

![Image of Weather app](https://miro.medium.com/max/1400/1*CKCFdYho7Qsbsms6QvYJpg.png)  
*_Figure 5: Weather app (Yuekun, 2015)_*

![Image of Weather app](https://cdn.dribbble.com/users/150724/screenshots/6615444/preview.png)  
*_Figure 6: Weather App (Stupic, 2019)_*

![Image of BOM](http://www.bom.gov.au/app/assets/img/screenshots/currentConditions_v2.png?v=1)  
*_Figure 7: BOM (BOM, 2020)_*

![Image of Weather Live° – Local Forecast](https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/5a/0f/35/5a0f358b-cea8-e9b0-d0bc-e062bd156df7/pr_source.jpg/392x696bb.jpg)  
*_Figure 8: Weather Live° – Local Forecast (Weather Live, 2020)_*

![Image of Weather : Weather Forecast](https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/9a/4b/62/9a4b62af-c013-b3f1-bd40-cd3e48864579/mzl.clyrxlvi.jpg/392x696bb.jpg)  
*_Figure 9: Weather : Weather Forecast (Nguyen, 2020)_*

Based on the data available through the Dark Sky API, I wanted to create a design that reflected the rotation of planets around the sun, as well as an adapted moon rotation (see Figures 10-11). It was important to me to create a strong visual that would demonstrate the relationship between form and content to the audience, making it as simple as possible to decipher and take in a significant amount of data simultaneously, without it necessarily feeling overcome with information.

![Image of Why Doesn’t The Moon Revolve Around The Sun Instead Of The Earth?](https://www.scienceabc.com/wp-content/uploads/2018/08/earth_sun___moon.jpg)  
*_Figure 10: Why Doesn’t The Moon Revolve Around The Sun Instead Of The Earth? (Peshin, 2019)_*

![Image of Phases of the Moon](https://solarsystem.nasa.gov/system/resources/detail_files/676_moon_phases.jpg)  
*_Figure 11: Phases of the Moon (Dunford, 2014)_*

This design proved difficult when developing responsive styles; as the screen size reduced, there was much less width space to display each of the rings of data. To overcome this, I decided to reposition the moon phases data into a sliding div that could be toggled to show and hide, as determined by the user. This solution allowed all the same page data to be viewed at any screen size, instead of omitting data to fit the screen width.

I chose a soft colour scheme to complement the smooth, organic shapes housing the data. Colours were chosen purposefully based on the function of the data attached. For instance, the maximum temperature for the current day uses and orange/red to demonstrate heat; other elements change colour to correspond to the time of day, the season of the year and the air quality index of the location. To achieve this, if statements were created to check the current time and date, and the Dark Sky API was called to determine location and weather data.

I decided to include data for a weekly forecast as many people find this useful to plan ahead. Again, not wanting to overwhelm the user with information, I included this data within a sliding div to allow the user to show and hide it as needed. I wanted to continue the circular theme but display them in a slightly different way to ensure the information was easily followed. By overlapping the circles, I was able to create a different appearance that still fit within the main theme.

To complement the soft shapes and colour scheme and provide a greater visual cue, I included imagery that displayed the summary of the current weather within the main temperature circle, as well as in the weekly forecast day circles. For the weekly forecast, this reduced the amount of text within the div. I included an alt tag to the html of each day to ensure users with screen readers are able to determine the summary without html text.

I called on the Dark Sky, Open Cage and AirVisual APIs for location-based data, utilised JavaScript and jQuery to develop functionality, and implemented a number of frameworks including Moment.js, Skeleton and Font Awesome to complete the design and functionality for this task.

Future developments could include introducing a total of 12 inside circles to represent each hour of the day, with the time item displaying in the current corresponding hour, with the remaining circles rotating with the time. E.g. The time will display in the third circle when the time is within the third hour of the day.

### References
#### Research
BOM. (2020). BOM Weather. Retrieved from: http://www.bom.gov.au/app/.  
Dunford, B. (2014). Phases of the Moon. Retrieved from: https://solarsystem.nasa.gov/resources/676/phases-of-the-moon/.  
Henner, J. (2017). Sun. Retrieved from: https://medium.muz.li/weather-app-inspiration-3378000015c6.  
Nazoa, G. (2015). Weather app. Retrieved from: https://www.behance.net/gallery/22645245/Weather-app.  
Nguyen, H. (2020). Weather : Weather forecast. Retrieved from: https://apps.apple.com/au/app/weather-weather-forecast/id1363846787.  
Onur, B. (2017). Extremely hot weather widget. Retrieved from: https://medium.muz.li/weather-app-inspiration-3378000015c6.  
Peshin, A. (2018). Why Doesn’t The Moon Revolve Around The Sun Instead Of The Earth? Retrieved from: https://www.scienceabc.com/nature/universe/doesnt-moon-revolve-around-sun-instead-earth.html.  
Stupic, M. (2019). Weather App. Retrieved from: https://dribbble.com/shots/6615444-Weather-App.  
Taylor, S. (2012). Dieter Rams inspired weather app… Retrieved from: http://www.loveidee.com/blog/dieter-rams-inspired-weather-app/.  
Weather Live°. (2020). Weather Live°- Local Forecast. Retrieved from: https://apps.apple.com/au/app/weather-live-local-forecast/id749083919.  
Yuekun. (2017). Weather Concept Design. Retrieved from: https://medium.muz.li/weather-app-inspiration-3378000015c6.  

#### Images
Freepik. (2015). Bokeh background for summer Free Vector. Retrieved from: https://www.freepik.com/free-vector/bokeh-background-summer_787048.htm#page=1&query=sunny&position=11.  
Freepik. (2019). Blurred winter background Free Vector. Retrieved from: https://www.freepik.com/free-vector/blurred-winter-background_3490959.htm#page=1&query=blurred-winter-background&position=13.  
Freepik. (2020). Realistic full moon sky background design Free Vector. Retrieved from: https://www.freepik.com/free-vector/realistic-full-moon-sky-background-design_6764525.htm#page=1&query=clear%20night&position=4.  
Freepik. (2020). Sky with clouds background in flat style Free Vector. Retrieved from: https://www.freepik.com/free-vector/sky-with-clouds-background-flat-style_2126738.htm#page=1&query=cloudy&position=26.  
kjpargeter. (2017). Water texture Free Vector. Retrieved from: https://www.freepik.com/free-vector/water-texture_983693.htm#page=1&query=ice&position=1.  
kotkoa. (2018). Closeup large gray clouds. Free Photo. Retrieved from: https://www.freepik.com/free-photo/closeup-large-gray-clouds_1436340.htm#page=1&query=cloudy&position=47.  
macrovector. (2019). Colored misted wet glass drops realistic composition with rain stains on the window Free Vector. Retrieved from: https://www.freepik.com/free-vector/colored-misted-wet-glass-drops-realistic-composition-with-rain-stains-window_4282581.htm.  
Pixabay. (2014). Windy. Retrieve from: https://pixabay.com/sk/photos/tr%C3%A1va-pl%C3%A1%C5%BE-oce%C3%A1n-veterno-371221/.  
Pixabay. (2016). Fog. Retrieve from: https://pixabay.com/sk/photos/stromy-hmla-les-forrest-lesy-1209660/.  
Rawpixel.com. (2018). Sky astrology cosmos galaxy starry Free Photo. Retrieved from: https://www.freepik.com/free-photo/sky-astrology-cosmos-galaxy-starry_2987683.htm#page=1&query=clear%20night&position=17.