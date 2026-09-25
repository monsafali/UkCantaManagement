const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertHundreds(num) {
  let str = "";

  if (num > 99) {
    str += ones[Math.floor(num / 100)] + " Hundred ";
    num = num % 100;
  }

  if (num > 19) {
    str += tens[Math.floor(num / 10)] + " ";
    num = num % 10;
  }

  if (num > 0) {
    str += ones[num] + " ";
  }

  return str;
}

export default function numberToWords(num) {
  if (num === 0) return "Zero Rupees Only";

  let words = "";

  if (num >= 1000000) {
    words += convertHundreds(Math.floor(num / 1000000)) + "Million ";
    num = num % 1000000;
  }

  if (num >= 1000) {
    words += convertHundreds(Math.floor(num / 1000)) + "Thousand ";
    num = num % 1000;
  }

  if (num > 0) {
    words += convertHundreds(num);
  }

  return words.trim() + " Rupees Only";
}
