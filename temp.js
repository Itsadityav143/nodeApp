function nextString(text) {
    if (text == "ZZ999")
        return text
    let textArr = text.split("")
    let nextStrArr = [textArr[0], textArr[1], 0, 0, 1]

    if ((textArr[2] + textArr[3] + textArr[4]) != "999") {
        sum = (Number(textArr[2] + textArr[3] + textArr[4]) + 1).toString().padStart(3, 0).split("")
        nextStrArr[2] = sum[0]
        nextStrArr[3] = sum[1]
        nextStrArr[4] = sum[2]
        return nextStrArr.join("")

    }
    if (textArr[1] != "Z") {
        nextStrArr[1] = String.fromCharCode(textArr[1].charCodeAt(0) + 1);
        return nextStrArr.join("")

    }
    if (textArr[0] != "Z") {
        nextStrArr[0] = String.fromCharCode(textArr[0].charCodeAt(0) + 1);
        nextStrArr[1] = "A"
        return nextStrArr.join("")
    }
    if (textArr[0] == "Z") {
        nextStrArr[1] = String.fromCharCode(textArr[0].charCodeAt(0) + 1);

        return nextStrArr.join("")
    }


}



console.log(nextString("AB001"))
console.log(nextString("AB999"))
console.log(nextString("AZ007"))
console.log(nextString("AZ999"))
console.log(nextString("BZ008"))
console.log(nextString("BZ999"))
console.log(nextString("ZS008"))
console.log(nextString("ZS999"))
console.log(nextString("ZA999"))