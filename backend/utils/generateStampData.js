const formatDate = (d) =>
  `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getFullYear()).slice(-2)}`;

const formatDate2 = (d) =>
  `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

const formatTime = (d) =>
  d.toLocaleTimeString("en-US", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

const formatTimeWithRandom = (d) => {
  const newDate = new Date(d);

  const randomMinutes = Math.floor(Math.random() * 2);

  const randomSeconds = Math.floor(Math.random() * 60);

  newDate.setMinutes(newDate.getMinutes() + randomMinutes);

  newDate.setSeconds(newDate.getSeconds() + randomSeconds);

  return newDate.toLocaleTimeString("en-US", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const getMndsAndKg = (net, divisor) => {
  const total = parseFloat(net) || 0;

  const mnds = Math.floor(total / divisor);

  const kg = Math.round(total % divisor);

  return { mnds, kg };
};

const generateStampData = (data) => {
  const now = new Date();

  const Gross = parseFloat(data.Gross) || 0;

  const Tare = parseFloat(data.Tare) || 0;

  const netVal = Gross - Tare;

  const calc40 = getMndsAndKg(netVal, 40);

  const calc37 = getMndsAndKg(netVal, 37.324);

  const formatDate = (d) =>
    `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getFullYear()).slice(-2)}`;

  const formatDate2 = (d) =>
    `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  return {
    ...data,

    Date: formatDate(now),
    formDate: formatDate(now),
    GrossDate: formatDate2(now),
    TareDate: formatDate2(now),

    GrossTime: formatTime(now),

    TareTime: formatTimeWithRandom(now),

    Net: netVal,

    calc40,

    calc37,

    remarks: data.remarks || "Without Driver",
  };
};

export default generateStampData;
