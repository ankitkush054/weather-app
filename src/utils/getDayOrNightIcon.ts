export function getDayOrNightIcon(
    iconName: string,
    dateTimeString: string
  ): string {
    // Convert the dateTimeString to a Date object
    const hours = new Date(dateTimeString).getHours(); // Extract the hour from the dateTimeString
  
    // Logic to determine day or night
    const isDayTime = hours >= 6 && hours < 18; // Daytime: 6 AM to 5:59 PM
  
    // Return the modified icon name based on the time
    return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
  }
  