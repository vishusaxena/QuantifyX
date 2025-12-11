const monthMap = {
  "01": "Jan",
  1: "Jan",
  "02": "Feb",
  2: "Feb",
  "03": "Mar",
  3: "Mar",
  "04": "Apr",
  4: "Apr",
  "05": "May",
  5: "May",
  "06": "Jun",
  6: "Jun",
  "07": "Jul",
  7: "Jul",
  "08": "Aug",
  8: "Aug",
  "09": "Sep",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

export const formatCustomDate = (value) => {
  value = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  if (value.length >= 2) value = value.slice(0, 2) + "-" + value.slice(2);
  if (value.length >= 6) value = value.slice(0, 6) + "-" + value.slice(6);

  return value;
};

export const finalizeDate = (value) => {
  const parts = value.split("-");
  if (parts.length !== 3) return value;

  let [dd, mm, yyyy] = parts;
  if (monthMap[mm]) {
    return `${dd}-${monthMap[mm]}-${yyyy}`;
  }
  return value;
};

export const formatToDDMMMYYYY = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
