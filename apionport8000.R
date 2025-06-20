library(plumber)
Sys.getenv("COMPUTERNAME") 
system("ipconfig", intern = TRUE)

get_local_ip <- function() {
  ipconfig_output <- system("ipconfig", intern = TRUE)
  ipv4_line <- grep("IPv4 Address", ipconfig_output, value = TRUE)
  if (length(ipv4_line) == 0) {
    ipv4_line <- grep("IPv4", ipconfig_output, value = TRUE)  # fallback
  }
  ip <- sub(".*:\\s*", "", ipv4_line[1])
  return(ip)
}

local_ip <- get_local_ip()

pr <- plumber::plumb("api.R")

# Add CORS headers
pr$handle("preflight", "*", function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res$status <- 204
  return(res)
})

pr$registerHooks(
  list(
    preroute = function(req, res) {
      res$setHeader("Access-Control-Allow-Origin", "*")
    } 
  )
)

pr$run(host = '0.0.0.0', port = 8000)

