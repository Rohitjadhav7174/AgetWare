function minimizeLoss(years, prices) {
    let minLoss = Infinity; 
    let buyYear = -1;
    let sellYear = -1;

    for (let i = 0; i < years; i++) {
        for (let j = i + 1; j < years; j++) {
            let loss = prices[i] - prices[j]; 
            if (loss > 0 && loss < minLoss) {
                minLoss = loss;
                buyYear = i + 1;  
                sellYear = j + 1;
            }
        }
    }

    if (buyYear === -1 || sellYear === -1) {
        return "No valid buy and sell year with a loss.";
    }

    return `Buy in year ${buyYear} and sell in year ${sellYear} with a minimum loss of ${minLoss}`;
}

const years = 5;
const prices = [20, 15, 7, 2, 13];

const result = minimizeLoss(years, prices);
console.log(result);
