const fs = require('fs');

function makeArray(docName) {
  return new Promise((resolve, reject) => {
    fs.readFile(docName, 'utf8', (err, data) => {
      // Read data from text file
      if (err) {
        reject(err);
        return;
      }
      const splitDataArrayWordsAndNumbers = data.split(/\s+/); // Split string data into array
      const sortedNumberArray = splitDataArrayWordsAndNumbers // Filters the original array into only numbers, and sorts them based on utf16 values
        .filter((el) => !isNaN(Number(el)))
        .sort((a, b) => a - b);

      sortedNumberArray.shift(); // Removes first element, which is an empty string

      // The following builds the pyramid - an array of sub arrays containing the values of the sortedNumberArray in order
      // The first sub array has a length of 1, the following 2... n
      let subArrayLengthTracker = 0;
      const pyramidArray = [];
      let subArrayStorage = [];

      for (let number of sortedNumberArray) {
        subArrayStorage.push(number);
        if (subArrayStorage.length > subArrayLengthTracker) {
          pyramidArray.push(subArrayStorage);
          subArrayLengthTracker++;
          subArrayStorage = [];
        }
      }

      // This builds an array of only the final values in each pyramidArray sub array;
      // It then decodes the message - constructing an array of the word(s) found at the index + 1 of where the number is found in the original array splitDataArrayWordsAndNumbers
      const finalValues = pyramidArray.map((subArray) => subArray.at(-1));
      const decodedMessageArray = [];

      for (let value of finalValues) {
        const numberIndex = splitDataArrayWordsAndNumbers.indexOf(value);
        decodedMessageArray.push(
          splitDataArrayWordsAndNumbers.at(numberIndex + 1)
        );
      }

      // This joins the decoded message array into a string separated by spaces
      resolve(decodedMessageArray.join(' '));
    });
  });
}

// This calls our promise, and if the data is resolved, logs it to the console and returns it.
makeArray('message.txt')
  .then((result) => {
    console.log(result);
    return result;
  })
  .catch((err) => console.log(err));
