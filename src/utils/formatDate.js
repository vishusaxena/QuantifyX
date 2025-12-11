export const formatDate = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d)) return "N/A";

  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateWithTime = (date) => {
  const formattedDate = formatDate(date);
  const nowIST = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} ${nowIST.toLocaleUpperCase()}`;
};
