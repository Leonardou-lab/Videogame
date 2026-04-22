// Leonardo André Flores Mendoza - A01787221

// 1. firstNonRepeating
function firstNonRepeating(str) {
    for (let i = 0; i < str.length; i++) {
        let count = 0;

        for (let j = 0; j < str.length; j++) {
            if (str[i] === str[j]) {
                count++;
            }
        }
        if (count === 1) {
            return str[i];
        }
    }
    return undefined;
}

// 2. bubbleSort
function bubbleSort(arr) {

    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {

                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// 3a. invertArray
function invertArray(arr) {

    let result = [];

    for (let i = arr.length - 1; i >= 0; i--) {
        result.push(arr[i]);
    }
    return result;
}

// 3b. invertArrayInplace
function invertArrayInplace(arr) {

    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
    return arr;
}

// 4. capitalize
function capitalize(str) {

    let result = '';
    let capitalizeNext = true;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === ' ') {
            result += str[i];
          capitalizeNext = true;
        } else {
            if (capitalizeNext) {
                result += str[i].toUpperCase();
                capitalizeNext = false;
            } else {
                result += str[i];
            }
        }
    }
    return result;
}

// 5. mcd - máximo común divisor
function mcd(a, b) {
    if (a === 0 && b === 0) return 0;
    while (a !== b) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }
    return a;
}

// 6. hackerSpeak
function hackerSpeak(str) {

    let result = '';
    let map = {'a': '4', 'A': '4', 'e': '3', 'E': '3','i': '1', 'I': '1','o': '0', 'O': '0','s': '5', 'S': '5'};

    for (let i = 0; i < str.length; i++) {
      if (map[str[i]]) {
            result += map[str[i]];
        } else {
            result += str[i];
        }
    }
    return result;
}

// 7. factorize
function factorize(num) {

    let factors = [];

    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            factors.push(i);
        }
    }
    return factors;
}

// 8. deduplicate
function deduplicate(arr) {

    let result = [];

    for (let i = 0; i < arr.length; i++) {
        let isDuplicate = false;
      for (let j = 0; j < result.length; j++) {
            if (arr[i] === result[j]) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            result.push(arr[i]);
        }
    }
    return result;
}

// 9. findShortestString
function findShortestString(arr) {
    if (arr.length === 0) return 0;
    let shortest = arr[0].length;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i].length < shortest) {
            shortest = arr[i].length;
        }
    }
    return shortest;
}

// 10. isPalindrome
function isPalindrome(str) {

    let left = 0;
    let right = str.length - 1;

    while (left < right) {
      if (str[left] !== str[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// 11. sortStrings
function sortStrings(arr) {

    let result = arr.slice();

    for (let i = 0; i < result.length - 1; i++) {
        for (let j = 0; j < result.length - i - 1; j++) {
          if (result[j] > result[j + 1]) {
                let temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }
    return result;
}

// 12. stats
function stats(arr) {
    if (arr.length === 0) return [0, 0];
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    let avg = sum / arr.length;

    // moda
    let frequency = {};

    for (let i = 0; i < arr.length; i++) {
        if (frequency[arr[i]]) {
            frequency[arr[i]]++;
        } else {
          frequency[arr[i]] = 1;
        }
    }

    let maxFreq = 0;
    let mode = arr[0];

    for (let num in frequency) {
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            mode = Number(num);
        }
    }

    return [avg, mode];
}

// 13. popularString
function popularString(arr) {
    if (arr.length === 0) return '';
    let frequency = {};

    for (let i = 0; i < arr.length; i++) {
      if (frequency[arr[i]]) {
            frequency[arr[i]]++;
        } else {
            frequency[arr[i]] = 1;
        }
    }

    let maxFreq = 0;
    let popular = arr[0];

    for (let str in frequency) {
        if (frequency[str] > maxFreq) {
          maxFreq = frequency[str];
            popular = str;
        }
    }

    return popular;
}

// 14. isPowerOf2
function isPowerOf2(num) {

    if (num <= 0) return false;
    while (num > 1) {
        if (num % 2 !== 0) {
          return false;
        }
        num = num / 2;
    }

    return true;
}

// 15. sortDescending
function sortDescending(arr) {

    let result = arr.slice();

    for (let i = 0; i < result.length - 1; i++) {
      for (let j = 0; j < result.length - i - 1; j++) {
            if (result[j] < result[j + 1]) {
                let temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }
    return result;
}

// --- Pruebas en consola ---
console.log("1. firstNonRepeating('abacddbec'):", firstNonRepeating('abacddbec'));
console.log("2. bubbleSort([9, 6, 15, 3, 12]):", bubbleSort([9, 6, 15, 3, 12]));
console.log("3a. invertArray([3, 6, 9, 12, 15]):", invertArray([3, 6, 9, 12, 15]));
let arr = [3, 6, 9, 12, 15];
invertArrayInplace(arr);
console.log("3b. invertArrayInplace([3, 6, 9, 12, 15]):", arr);
console.log("4. capitalize('mexico is a large country'):", capitalize('mexico is a large country'));
console.log("5. mcd(24, 36):", mcd(24, 36));
console.log("6. hackerSpeak('Javascript es divertido'):", hackerSpeak('Javascript es divertido'));
console.log("7. factorize(12):", factorize(12));
console.log("8. deduplicate([1, 0, 1, 1, 0, 0]):", deduplicate([1, 0, 1, 1, 0, 0]));
console.log("9. findShortestString(['one', 'two', 'three', 'four']):", findShortestString(['one', 'two', 'three', 'four']));
console.log("10. isPalindrome('rizuzir'):", isPalindrome('rizuzir'));
console.log("11. sortStrings(['one', 'two', 'thr', 'fou']):", sortStrings(['one', 'two', 'thr', 'fou']));
console.log("12. stats([8, 4, 2, 6, 8, 13, 17, 2, 4, 8]):", stats([8, 4, 2, 6, 8, 13, 17, 2, 4, 8]));
console.log("13. popularString(['alpha', 'beta', 'beta', 'gamma', 'beta']):", popularString(['alpha', 'beta', 'beta', 'gamma', 'beta']));
console.log("14. isPowerOf2(1024):", isPowerOf2(1024));
console.log("15. sortDescending([9, 6, 15, 3, 12]):", sortDescending([9, 6, 15, 3, 12]));
