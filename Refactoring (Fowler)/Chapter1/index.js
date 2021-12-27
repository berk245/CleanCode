import invoices from "./invoices.js";
import plays from "./plays.js";

function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return renderPlainText(statementData, plays);

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
  function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type) {
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
        throw new Error(`Unknown play type: ${aPerformance.play.type}`);
    }
    return result;
  }
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    //Add extra creadt for every ten comedy attendees
    if ("comedy" == aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }
  function totalAmount(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }
    return result;
  }

  function totalVolumeCredits(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumeCredits;
    }
    return result;
  }
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
