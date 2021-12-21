var scroller = `
*   * *** * * *** **     ***  *  *   * *   *  *     *** * * * ***   * *  *  * *   * * **
**  * *   * * *   * *   *    * * **  * **  * * *   *    * * * *     * * * * * *   * * * *
* * * **  * * **  **    * ** * * * * * * * * ***   * ** * * * **     *  * * * *   * * **
*  ** *   * * *   * *   *  * * * *  ** *  ** * *   *  * * * * *      *  * * * *   * * *
*   * ***  *  *** * *    **   *  *   * *   * * *    **  *  *  ***    *   *  ***   *** *
`.split("\n");
var melody = `12426  6  5     12425  5  4     12424   5 3  21   1 5   4      12426  6  5     12427   3 4  32 12424   5 3  21   1 5   4`;
var quotes = '\'"';

function encode(offset, quote) {
  str = ""
  function concat(c) {
    // The binary data is offset by a value, 32 or more, to get into safe ascii values range. 32 = space
    // 32-95 should be perfectly safe to use. For some reason, getting problems with larger values.
    c += offset;
    if (c > 95)
      throw 'out of range';
    n = String.fromCharCode(c);
    if (n == '\\')
      str = str.concat('\\\\'); // escape \
    else if (n == quote)
      str = str.concat('\\' + n); // the quote used cannot appear in the string without escaping
    else
      str = str.concat(n);
  }
  // The first 7 characters are semitones of the notes. In the actual note data, 0 = no sound, 1-7 are the notes.
  for (var i = 0; i < 7; i++) {
    concat([0, 2, 4, 5, 7, 9, 12][i]);
  }
  // The next 89 characters are the scroller text
  for (var i = 0; i < 89; i++) {
    c = 0;
    for (var j = 0; j < 7; j++) {
      var a = scroller[5 - j];
      if (a && a[i] == '*') c += 2 << j;
    }
    concat(c);
  }
  // The rest of the string is the melody, with two 3 bit notes in one char = 6 bits
  for (var i = 0; i < melody.length; i += 2) {
    if (melody[i] && melody[i] != ' ')
      c = melody.charCodeAt(i) - '1'.charCodeAt(0) + 1;
    else
      c = 0;
    if (melody[i + 1] && melody[i + 1] != ' ')
      c += (melody.charCodeAt(i + 1) - '1'.charCodeAt(0) + 1) << 3;
    concat(c);
  }
  return str;
}

minlen = 1e6;
sol = {};
// finds the offset and pair of quotes that results in shortest overall length
for (var offset = 32; offset < 64; offset++) {
  for (var i = 0; i < quotes.length; i++) {
    try {
      e = encode(offset, quotes[i]);
      if (e.length < minlen) {
        sol = [e, offset, quotes[i]];
        minlen = e.length;
      }
    } catch (e) { } // we end up out of range so this offset was not valid
  }
}
console.log("Solution: " + sol[2] + sol[0] + sol[2] + ".charCodeAt(i)-" + sol[1]);
