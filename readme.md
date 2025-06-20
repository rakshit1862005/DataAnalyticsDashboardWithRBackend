This API provides powerful endpoints to perform Exploratory Data Analysis (EDA) and Statistical Testing on a real-world road accident dataset using R and Plumber.

Built as part of a Data Analytics & Visualization (DAV) project, this project helps visualize trends, run statistical tests, and expose interactive data endpoints for real-time web apps.

The reson behind choosing R isntead of python and any other language was to leverage the statistical capabilities of R while keeping the UI/UX modern to users

Features:
1. 10+ API endpoints for dynamic filtering and analysis

2. Exploratory visualizations for:
Accidents by day, vehicle, gender, weather, etc.

3. Statistical testing using:
Chi-Square, ANOVA, T-Test, and Correlation
Smart filters (vehicle type, day, age band, weather, etc.)

4. Can be integrated with ML-ready APIs and customizable queries

Required packages: install.packages(c("plumber", "dplyr", "readr", "jsonlite", "tidyr"))

Some Sample Endpoints :
/accidents_by_day	                  #Accidents grouped by weekday
/casualty_severity_by_age	          #Filtered casualty counts by age & class
/chi_severity_vs_gender	            #Chi-square test on severity vs gender
/anova_casualties_road_condition	  #ANOVA test on casualties vs road surface
/ttest_casualties_gender	          #T-Test between male & female drivers
/correlation_vehicles_casualties	  #Correlation + scatter data

Simply run the given api.R file and run the nextjs frontend on a development environment locally to experience the dashboard.
