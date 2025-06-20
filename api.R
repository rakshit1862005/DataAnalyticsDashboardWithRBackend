library(plumber)
library(readr)
library(dplyr)
library(jsonlite)
road_data <- read_csv("Road.csv")

# Utility function to compute mode
get_mode <- function(v) {
  uniq_vals <- unique(v[!is.na(v) & v != "Unknown"])
  uniq_vals[which.max(tabulate(match(v, uniq_vals)))]
}

# Apply mode imputation
road_data <- road_data %>%
  mutate(across(everything(), ~ {
    mode_val <- get_mode(.)
    replace(., is.na(.) | . == "Unknown", mode_val)
  }))

#* @apiTitle Final R-Backend API For Statistical Leverage In Data Analysis

#* @get /sum
function(x,y){
    x1<-as.numeric(x)
    y1<-as.numeric(y)
    return (x1+y1)
}

#* @get /array
function(){
  x<-c(1,2,3,4,5,6)
  y<-c(2,4,6,8,10,12)
  data.frame(param1=x , param2=y)
}

#* @get /accidents_by_day
function(type = NULL) {
  df <- road_data
  if (!is.null(type)) {
    df <- df[df$Type_of_vehicle == type, ]
  }
  df %>%
    group_by(Day_of_week) %>%
    summarise(Accidents = n()) %>%
    arrange(factor(Day_of_week, levels = c(
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    )))
}
#* @get /unique_vehicle_types
function() {
  if ("Type_of_vehicle" %in% names(road_data)) {
    return(unique(road_data$Type_of_vehicle))
  } else {
    return(list(error = "Column 'Type_of_vehicle' not found"))
  }
}

#* @param casualty_class Optional: filter by casualty class
#* @param sex_of_casualty Optional: filter by sex of casualty
#* @get /casualty_severity_by_age
function(casualty_class = NULL, sex_of_casualty = NULL) {
  df <- road_data[, c("Age_band_of_casualty", "Casualty_severity", "Casualty_class", "Sex_of_casualty")]
  df <- na.omit(df)
  
  if (!is.null(casualty_class)) {
    df <- df[df$Casualty_class == casualty_class, ]
  }
  if (!is.null(sex_of_casualty)) {
    df <- df[df$Sex_of_casualty == sex_of_casualty, ]
  }
  
  df %>%
    group_by(Age_band_of_casualty) %>%
    summarise(Count = n(), .groups = "drop")
}

#* @get /mean_severity_by_weather
function() {
  df <- road_data[, c("Weather_conditions", "Accident_severity")]
  df <- na.omit(df)
  
  # Map severity strings to numeric values
  df$Accident_severity <- recode(df$Accident_severity,
                                 "Slight Injury" = 1,
                                 "Serious Injury" = 2,
                                 "Fatal injury" = 3)
  
  result <- df %>%
    group_by(Weather_conditions) %>%
    summarise(mean_severity = mean(as.numeric(Accident_severity), na.rm = TRUE)) %>%
    arrange(desc(mean_severity))
  
  return(result)
}

#* @param age_band Optional: filter by age band of driver
#* @param experience Optional: filter by driving experience
#* @get /driver_gender_distribution
function(age_band = NULL, experience = NULL) {
  df <- road_data[, c("Sex_of_driver", "Age_band_of_driver", "Driving_experience")]
  df <- na.omit(df)
  
  if (!is.null(age_band)) {
    df <- df[df$Age_band_of_driver == age_band, ]
  }
  if (!is.null(experience)) {
    df <- df[df$Driving_experience == experience, ]
  }
  
  df %>%
    group_by(Sex_of_driver) %>%
    summarise(Count = n(), .groups = "drop")
}

#* @get /total_accidents
function() {
  total <- nrow(road_data)
  data.frame(total_accidents = total)
}

#* @get /most_accidents_day
function() {
  valid_days <- c('Monday', 'Sunday', 'Friday', 'Wednesday', 'Saturday', 'Thursday', 'Tuesday')
  
  df <- road_data %>%
    filter(Day_of_week %in% valid_days | is.na(Day_of_week)) %>%
    mutate(Day_of_week = ifelse(is.na(Day_of_week), "Unknown", Day_of_week)) %>%
    group_by(Day_of_week) %>%
    summarise(count = n()) %>%
    arrange(desc(count))
}

#* @get /most_affected_ageband
function() {
  valid_ages <- c('18-30', '31-50', 'Under 18', 'Over 51', 'Unknown')
  
  df <- road_data %>%
    filter(Age_band_of_casualty %in% valid_ages | is.na(Age_band_of_casualty)) %>%
    mutate(Age_band_of_casualty = ifelse(is.na(Age_band_of_casualty), "Unknown", Age_band_of_casualty)) %>%
    group_by(Age_band_of_casualty) %>%
    summarise(count = n()) %>%
    arrange(desc(count))
  
  return(df)
}

#* @get /most_wrecked_vehicle
function() {
  valid_vehicles <- c(
    'Automobile', 'Public (> 45 seats)', 'Lorry (41?100Q)', NA,
    'Public (13?45 seats)', 'Lorry (11?40Q)', 'Long lorry',
    'Public (12 seats)', 'Taxi', 'Pick up upto 10Q', 'Stationwagen',
    'Ridden horse', 'Other', 'Bajaj', 'Turbo', 'Motorcycle',
    'Special vehicle', 'Bicycle'
  )
  
  df <- road_data %>%
    filter(Type_of_vehicle %in% valid_vehicles | is.na(Type_of_vehicle)) %>%
    mutate(Type_of_vehicle = ifelse(is.na(Type_of_vehicle), "Unknown", Type_of_vehicle)) %>%
    group_by(Type_of_vehicle) %>%
    summarise(count = n()) %>%
    arrange(desc(count))
  
  return(df)
}

#* @get /most_common_cause
function() {
  valid_causes <- c(
    'Moving Backward', 'Overtaking', 'Changing lane to the left', 
    'Changing lane to the right', 'Overloading', 'Other',
    'No priority to vehicle', 'No priority to pedestrian',
    'No distancing', 'Getting off the vehicle improperly',
    'Improper parking', 'Overspeed', 'Driving carelessly',
    'Driving at high speed', 'Driving to the left', 'Unknown',
    'Overturning', 'Turnover', 'Driving under the influence of drugs',
    'Drunk driving'
  )
  
  df <- road_data %>%
    filter(Cause_of_accident %in% valid_causes | is.na(Cause_of_accident)) %>%
    mutate(Cause_of_accident = ifelse(is.na(Cause_of_accident), "Unknown", Cause_of_accident)) %>%
    group_by(Cause_of_accident) %>%
    summarise(count = n()) %>%
    arrange(desc(count))
  
  return(df)
}

#* @param day Filter by Day_of_week (comma-separated, optional)
#* @param age_band Filter by Age_band_of_driver (optional)
#* @param vehicle_type Filter by Type_of_vehicle (comma-separated, optional)
#* @get /accident_severity_distribution
function(day = NULL, age_band = NULL, vehicle_type = NULL) {
  df <- road_data
  
  # Apply Day_of_week filter (multi-select)
  if (!is.null(day)) {
    days <- unlist(strsplit(day, ","))
    df <- df[df$Day_of_week %in% days, ]
  }
  
  # Apply Age_band_of_driver filter
  if (!is.null(age_band)) {
    df <- df[df$Age_band_of_driver == age_band, ]
  }
  
  # Apply Type_of_vehicle filter (multi-select)
  if (!is.null(vehicle_type)) {
    types <- unlist(strsplit(vehicle_type, ","))
    df <- df[df$Type_of_vehicle %in% types, ]
  }
  
  # Recode severity if not already recoded
  df$Accident_severity <- recode(df$Accident_severity,
                                 "Slight Injury" = "Slight",
                                 "Serious Injury" = "Serious",
                                 "Fatal injury" = "Fatal")
  
  # Count severity
  result <- df %>%
    group_by(Accident_severity) %>%
    summarise(Count = n()) %>%
    arrange(desc(Count))
  
  return(result)
}

#* @param day Filter by Day_of_week (comma-separated, optional)
#* @param age_band Filter by Age_band_of_driver (optional)
#* @get /accidents_over_time
function(day = NULL, age_band = NULL) {
  df <- road_data
  
  # Apply Day_of_week filter (multi-select)
  if (!is.null(day)) {
    days <- unlist(strsplit(day, ","))
    df <- df[df$Day_of_week %in% days, ]
  }
  
  # Apply Age_band_of_driver filter
  if (!is.null(age_band)) {
    df <- df[df$Age_band_of_driver == age_band, ]
  }
  
  # Convert Time to hour buckets
  df$Time <- as.character(df$Time)
  df$Hour <- suppressWarnings(as.numeric(substr(df$Time, 1, 2)))
  
  # Handle invalid/non-numeric time entries
  df <- df[!is.na(df$Hour), ]
  
  # Count accidents by hour
  result <- df %>%
    group_by(Hour) %>%
    summarise(Accident_Count = n()) %>%
    arrange(Hour)
  
  return(result)
}

#* @param day Filter by Day_of_week (comma-separated, optional)
#* @param age_band Filter by Age_band_of_driver (optional)
#* @param vehicle Filter by Type_of_vehicle (comma-separated, optional)
#* @get /top_causes
function(day = NULL, age_band = NULL, vehicle = NULL) {
  df <- road_data
  
  # Filter: Day_of_week
  if (!is.null(day)) {
    days <- unlist(strsplit(day, ","))
    df <- df[df$Day_of_week %in% days, ]
  }
  
  # Filter: Age_band_of_driver
  if (!is.null(age_band)) {
    df <- df[df$Age_band_of_driver == age_band, ]
  }
  
  # Filter: Type_of_vehicle
  if (!is.null(vehicle)) {
    vehicles <- unlist(strsplit(vehicle, ","))
    df <- df[df$Type_of_vehicle %in% vehicles, ]
  }
  
  # Group by cause and get top 5
  result <- df %>%
    group_by(Cause_of_accident) %>%
    summarise(Count = n()) %>%
    arrange(desc(Count)) %>%
    slice(1:5)
  
  return(result)
}

#* @param vehicle Filter by Type_of_vehicle (comma-separated, optional)
#* @param day Filter by Day_of_week (comma-separated, optional)
#* @get /surface_vs_severity
function(vehicle = NULL, day = NULL) {
  df <- road_data
  
  # Filter by Type_of_vehicle
  if (!is.null(vehicle)) {
    vehicles <- unlist(strsplit(vehicle, ","))
    df <- df[df$Type_of_vehicle %in% vehicles, ]
  }
  
  # Filter by Day_of_week
  if (!is.null(day)) {
    days <- unlist(strsplit(day, ","))
    df <- df[df$Day_of_week %in% days, ]
  }
  
  # Group by and count
  grouped <- df %>%
    group_by(Road_surface_type, Accident_severity) %>%
    summarise(Count = n(), .groups = "drop")
  
  # Pivot wider for stacked bar
  reshaped <- grouped %>%
    tidyr::pivot_wider(
      names_from = Accident_severity,
      values_from = Count,
      values_fill = list(Count = 0) # fill missing with 0
    )
  
  return(reshaped)
}


#* @param vehicle Filter by Type_of_vehicle (comma-separated, optional)
#* @param age_band Filter by Age_band_of_driver (comma-separated, optional)
#* @get /vehicle_movement_vs_collision
function(vehicle = NULL, age_band = NULL) {
  df <- road_data
  
  # Filter by Type_of_vehicle
  if (!is.null(vehicle)) {
    vehicles <- unlist(strsplit(vehicle, ","))
    df <- df[df$Type_of_vehicle %in% vehicles, ]
  }
  
  # Filter by Age_band_of_driver
  if (!is.null(age_band)) {
    age_bands <- unlist(strsplit(age_band, ","))
    df <- df[df$Age_band_of_driver %in% age_bands, ]
  }
  
  # Group by Vehicle_movement and Type_of_collision
  result <- df %>%
    group_by(Vehicle_movement, Type_of_collision) %>%
    summarise(Y = n(), .groups = "drop") %>%
    arrange(desc(Y))
  
  return(result)
}

#* @param age_band Filter by Age_band_of_driver (comma-separated, optional)
#* @get /casualty_severity_by_age
function(age_band = NULL) {
  df <- road_data
  
  # Filter by Age_band_of_driver
  if (!is.null(age_band)) {
    age_bands <- unlist(strsplit(age_band, ","))
    df <- df[df$Age_band_of_driver %in% age_bands, ]
  }
  
  # Group by Age_band_of_casualty and Casualty_severity
  result <- df %>%
    group_by(Age_band_of_casualty, Casualty_severity) %>%
    summarise(Count = n(), .groups = "drop") %>%
    arrange(desc(Count))
  
  return(result)
}

#* @get /accidents_by_area
function() {
  df <- road_data
  
  # Group by Area_accident_occured
  result <- df %>%
    group_by(Area_accident_occured) %>%
    summarise(Count = n(), .groups = "drop") %>%
    arrange(desc(Count))
  
  return(result)
}

#* @param vehicle Filter by Type_of_vehicle (comma-separated, optional)
#* @param age_band Filter by Age_band_of_driver (comma-separated, optional)
#* @param day Filter by Day_of_week (comma-separated, optional)
#* @get /light_vs_weather
function(vehicle = NULL, age_band = NULL, day = NULL) {
  df <- road_data
  
  # Filter by Type_of_vehicle
  if (!is.null(vehicle)) {
    vehicles <- unlist(strsplit(vehicle, ","))
    df <- df[df$Type_of_vehicle %in% vehicles, ]
  }
  
  # Filter by Age_band_of_driver
  if (!is.null(age_band)) {
    age_bands <- unlist(strsplit(age_band, ","))
    df <- df[df$Age_band_of_driver %in% age_bands, ]
  }
  
  # Filter by Day_of_week
  if (!is.null(day)) {
    days <- unlist(strsplit(day, ","))
    df <- df[df$Day_of_week %in% days, ]
  }
  
  # Group by Light_conditions and Weather_conditions
  result <- df %>%
    group_by(Light_conditions, Weather_conditions) %>%
    summarise(Count = n(), .groups = "drop") %>%
    arrange(desc(Count))
  
  return(result)
}

#* @get /getdata
function(){
  return(head(road_data,500))
}

#* @param age_band Filter by Age_band_of_driver (comma-separated, optional)
#* @get /casualty_severity_by_age
function(age_band = NULL) {
  df <- road_data
  
  # Filter by Age_band_of_driver
  if (!is.null(age_band)) {
    age_bands <- unlist(strsplit(age_band, ","))
    df <- df[df$Age_band_of_driver %in% age_bands, ]
  }
  
  # Group by Age_band_of_casualty and Casualty_severity
  summary_df <- df %>%
    group_by(Age_band_of_casualty, Casualty_severity) %>%
    summarise(Count = n(), .groups = "drop") %>%
    arrange(desc(Count))
  
  return(list(
    filtered_data = df,
    summary = summary_df
  ))
}
# Add these new endpoints to your existing plumber.R file

#* Chi-Square Test: Accident_severity vs Sex_of_driver
#* @param alpha Significance level
#* @param sample_size Optional sample size
#* @get /chi_severity_vs_gender
function(alpha = 0.05, sample_size = NULL) {
  data <- road_data[, c("Accident_severity", "Sex_of_driver")]
  
  # Remove NA values
  data <- na.omit(data)
  
  if (!is.null(sample_size)) {
    sample_size <- as.numeric(sample_size)
    if(sample_size < nrow(data)) {
      data <- data[sample(nrow(data), sample_size), ]
    }
  }
  
  tbl <- table(data$Accident_severity, data$Sex_of_driver)
  
  # Check if we have enough data for the test
  if(sum(tbl < 5) > (0.2 * length(tbl))) {
    warning("More than 20% of cells have expected counts less than 5")
  }
  
  result <- tryCatch({
    chisq.test(tbl)
  }, error = function(e) {
    return(list(error = TRUE, message = e$message))
  })
  
  if(is.list(result) && "error" %in% names(result)) {
    return(result)
  }
  
  list(method = result$method,
       statistic = as.numeric(result$statistic),
       df = result$parameter,
       p_value = result$p.value,
       alpha = as.numeric(alpha),
       reject_null = result$p.value < as.numeric(alpha),
       contingency_table = as.list(tbl))
}

#* ANOVA: Casualties by Road_surface_conditions
#* @param alpha Significance level
#* @param sample_size Optional sample size
#* @get /anova_casualties_road_condition
function(alpha = 0.05, sample_size = NULL) {
  data <- road_data[, c("Number_of_casualties", "Road_surface_conditions")]
  data <- na.omit(data)
  
  # Convert to numeric if needed
  if(!is.numeric(data$Number_of_casualties)) {
    data$Number_of_casualties <- as.numeric(as.character(data$Number_of_casualties))
    data <- data[!is.na(data$Number_of_casualties), ]
  }
  
  if (!is.null(sample_size)) {
    sample_size <- as.numeric(sample_size)
    if(sample_size < nrow(data)) {
      data <- data[sample(nrow(data), sample_size), ]
    }
  }
  
  model <- aov(Number_of_casualties ~ Road_surface_conditions, data = data)
  summary_model <- summary(model)
  
  # Get means by condition for plotting
  condition_means <- data %>%
    group_by(Road_surface_conditions) %>%
    summarise(mean_casualties = mean(Number_of_casualties, na.rm = TRUE))
  
  list(method = "ANOVA",
       f_value = summary_model[[1]]$"F value"[1],
       p_value = summary_model[[1]]$"Pr(>F)"[1],
       df = c(summary_model[[1]]$Df[1], summary_model[[1]]$Df[2]),
       alpha = as.numeric(alpha),
       reject_null = summary_model[[1]]$"Pr(>F)"[1] < as.numeric(alpha),
       condition_means = condition_means)
}

#* T-Test: Casualties by driver gender
#* @param alpha Significance level
#* @param sample_size Optional sample size
#* @get /ttest_casualties_gender
function(alpha = 0.05, sample_size = NULL) {
  set.seed(64)
  data <- road_data[road_data$Sex_of_driver %in% c("Male", "Female"), c("Number_of_casualties", "Sex_of_driver")]
  data <- na.omit(data)
  
  if(!is.numeric(data$Number_of_casualties)) {
    data$Number_of_casualties <- as.numeric(as.character(data$Number_of_casualties))
    data <- data[!is.na(data$Number_of_casualties), ]
  }
  
  if (!is.null(sample_size)) {
    sample_size <- as.numeric(sample_size)
    if(sample_size < nrow(data)) {
      data <- data[sample(nrow(data), sample_size), ]
    }
  }
  
  group_counts <- table(data$Sex_of_driver)
  if(any(group_counts < 5)) {
    return(list(
      error = TRUE, 
      message = "One or both gender groups have fewer than 5 observations"
    ))
  }
  
  result <- t.test(Number_of_casualties ~ Sex_of_driver, data = data)
  
  df <- as.numeric(result$parameter)
  alpha_num <- as.numeric(alpha)
  t_critical <- qt(1 - alpha_num / 2, df)
  
  group_means <- data %>%
    group_by(Sex_of_driver) %>%
    summarise(
      mean_casualties = mean(Number_of_casualties, na.rm = TRUE),
      sd_casualties = sd(Number_of_casualties, na.rm = TRUE),
      count = n()
    )
  
  list(
    method = result$method,
    t_statistic = as.numeric(result$statistic),
    df = df,
    t_critical = t_critical,
    p_value = result$p.value,
    conf_int = result$conf.int,
    alpha = alpha_num,
    reject_null = result$p.value < alpha_num,
    group_means = group_means
  )
}



#* Correlation: Vehicles involved vs Casualties
#* @get /correlation_vehicles_casualties
function() {
  data <- road_data[, c("Number_of_vehicles_involved", "Number_of_casualties")]
  data <- na.omit(data)
  
  # Convert to numeric if needed
  if(!is.numeric(data$Number_of_casualties)) {
    data$Number_of_casualties <- as.numeric(as.character(data$Number_of_casualties))
  }
  if(!is.numeric(data$Number_of_vehicles_involved)) {
    data$Number_of_vehicles_involved <- as.numeric(as.character(data$Number_of_vehicles_involved))
  }
  
  data <- data[!is.na(data$Number_of_casualties) & !is.na(data$Number_of_vehicles_involved), ]
  
  cor_result <- cor.test(data$Number_of_vehicles_involved, data$Number_of_casualties)
  
  # Create sample points for scatter plot visualization
  set.seed(123) # For reproducibility
  if(nrow(data) > 100) {
    sample_data <- data[sample(nrow(data), 100), ]
  } else {
    sample_data <- data
  }
  
  sample_points <- lapply(1:nrow(sample_data), function(i) {
    list(
      x = sample_data$Number_of_vehicles_involved[i],
      y = sample_data$Number_of_casualties[i]
    )
  })
  
  list(method = cor_result$method,
       correlation = as.numeric(cor_result$estimate),
       p_value = cor_result$p.value,
       t_statistic = as.numeric(cor_result$statistic),
       df = cor_result$parameter,
       conf_int = cor_result$conf.int,
       sample_points = sample_points)
}



#* @apiTitle T-Test Normal Distribution Plot API

#* Generate normal distribution data with critical region for t-test
#* @param alpha Significance level (e.g., 0.05)
#* @param t_critical Critical t-value (e.g., 1.96)
#* @get /normal_distribution
function(alpha = 0.05, t_critical = 1.96) {
  mean <- 0
  sd <- 1
  x_vals <- seq(-4, 4, length.out = 200)
  y_vals <- dnorm(x_vals, mean, sd)
  
  data <- data.frame(
    x = round(x_vals, 2),
    y = round(y_vals, 5),
    highlight = abs(x_vals) >= as.numeric(t_critical)
  )
  
  return(data)
}

#* @plumber
function(pr) {
  # Handle CORS preflight
  pr$handle("preflight", "*", function(req, res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res$status <- 204
    return(res)
  })
  
  # Add CORS headers for all responses
  pr$registerHooks(
    list(
      preroute = function(req, res) {
        res$setHeader("Access-Control-Allow-Origin", "*")
      }
    )
  )
  
  return(pr)
}

pr$run(host = "0.0.0.0", port = 8000)

