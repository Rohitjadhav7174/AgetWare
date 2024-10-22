function formatToIndianCurrency(num) {
    let [integerPart, decimalPart] = num.toString().split(".");
        integerPart = integerPart.replace(/(\d)(?=(\d{2})+(?!\d))/g, "$1,");
        return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
}
let number = 123456.7891;
let formattedNumber = formatToIndianCurrency(number);
console.log(formattedNumber); 
