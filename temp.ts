import rl from "readline/promises";

const readline = rl.createInterface({
    input:process.stdin,
    output:process.stdout,
})

const question = await readline.question("Enter your question: ");
console.log(`You asked, ${question}`);
readline.close()