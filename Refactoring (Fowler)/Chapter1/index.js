import invoices from "./invoices.js";
import createStatementData from "./createStatementData.js";
import plays from "./plays.js";

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays), plays);
}

function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}`;
  result += `You earned ${data.totalVolumeCredits} credits`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }
}

for (let invoice of invoices) {
  let result = statement(invoice, plays);
  console.log(
    result ===
      "Statement for BigCo Hamlet: $650.00 (55 seats) As You Like It: $580.00 (35 seats) Othello: $500.00 (40 seats)Amount owed is $1,730.00You earned 47 credits"
  );
}
