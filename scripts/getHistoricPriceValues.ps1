# Define the base URL
$baseURL = "https://www.hvakosterstrommen.no/api/v1/prices/2024/02-"

# Initialize an empty array to store all day objects
$allDays = @()

# Loop through days
for ($day = 2; $day -le 21; $day++) {
    # If the day is greater than 20, break the loop
    $dayString = if ($day -lt 10) { "0$day" } else { $day }
    # Construct the URL for the current day
    $url = $baseURL + $dayString + "_NO1.json"

    Write-Host $url
    Write-Host ''
    # Make the GET request
    $response = Invoke-RestMethod -Uri $url -Method Get
    # Initialize an empty array to store prices for each hour
    $prices = @()

    # Loop through each entry in the response
    foreach ($entry in $response) {
        # Add the price for each hour to the prices array
        $prices += $entry.NOK_per_kWh
    }

    # Create a custom object for the day with prices for each hour
    $dayObject = [PSCustomObject]@{
        Day         = $day
        PriceHour1  = $prices[0]
        PriceHour2  = $prices[1]
        PriceHour3  = $prices[2]
        PriceHour4  = $prices[3]
        PriceHour5  = $prices[4]
        PriceHour6  = $prices[5]
        PriceHour7  = $prices[6]
        PriceHour8  = $prices[7]
        PriceHour9  = $prices[8]
        PriceHour10 = $prices[9]
        PriceHour11 = $prices[10]
        PriceHour12 = $prices[11]
        PriceHour13 = $prices[12]
        PriceHour14 = $prices[13]
        PriceHour15 = $prices[14]
        PriceHour16 = $prices[15]
        PriceHour17 = $prices[16]
        PriceHour18 = $prices[17]
        PriceHour19 = $prices[18]
        PriceHour20 = $prices[19]
        PriceHour21 = $prices[20]
        PriceHour22 = $prices[21]
        PriceHour23 = $prices[22]
        PriceHour24 = $prices[23]
    }

    # Add the day object to the list of all days
    $allDays += $dayObject
}

# Export all day objects to a CSV file
$allDays | Export-Csv -Path "C:\Dokumenter\Snug-smart-app\SNUG-smart-app\scripts\prices.csv" -NoTypeInformation

Write-Host "Wrote $($allDays.Count) days to C:\Dokumenter\Snug-smart-app\SNUG-smart-app\scripts\prices.csv"
