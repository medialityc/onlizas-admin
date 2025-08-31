export const generateWarehouseTransferNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const currentDate = year + month + day;

  const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");

  return `TX${currentDate}${randomDigits}`;
};
