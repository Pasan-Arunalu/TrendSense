const getForecastColor = (growthStr: string) => {
  const value = parseFloat(growthStr.replace(/[^0-9.-]/g, ""));

  if (isNaN(value)) return "gray.500"; 

  if (value < 0) return "red.500";       
  if (value >= 50) return "green.600";   
  return "orange.500";                   
};

export default getForecastColor;