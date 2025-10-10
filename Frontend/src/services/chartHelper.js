// Example input: "Q1:10 Q2:20 Q3:15 Q4:30" or "Sales Jan:100 Feb:200 Mar:150"
export const parseChartData = (input) => {
  const parts = input.match(/(\w+):(\d+)/g);
  if (!parts) return [];

  return parts.map((part) => {
    const [label, value] = part.split(":");
    return {
      label,
      value: parseInt(value),
    };
  });
};