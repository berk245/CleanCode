import invoices from "./invoices.js";
import plays from "./plays.js";

export const statement = (invoice, plays) => {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    //print line for this order
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    } seats)`;
    totalAmount += amountFor(perf);
  }
  result += `Amount owed is ${format(totalAmount / 100)}`;
  result += `You earned ${volumeCredits} credits`;
  return result;
};

const amountFor = (aPerformance) => {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30)
        result += 1000 * (aPerformance.audience - 30);
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20)
        result += 10000 + 500 * (aPerformance.audience - 20);
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`Unknown play type: ${playFor(aPerformance).type}`);
  }
  return result;
};

const playFor = (aPerformance) => {
  return plays[aPerformance.playID];
};

const volumeCreditsFor = (aPerformance) => {
  let volumeCredits = 0;
  volumeCredits += Math.max(aPerformance.audience - 30, 0);
  //Add extra creadt for every ten comedy attendees
  if ("comedy" == playFor(aPerformance).type)
    volumeCredits += Math.floor(aPerformance.audience / 5);
  return volumeCredits;
};

for (let invoice of invoices) {
  let result = statement(invoice, plays);
  console.log(
    result ===
      "Statement for BigCo Hamlet: $650.00 (55 seats) As You Like It: $580.00 (35 seats) Othello: $500.00 (40 seats)Amount owed is $1,730.00You earned 47 credits"
  );
}
