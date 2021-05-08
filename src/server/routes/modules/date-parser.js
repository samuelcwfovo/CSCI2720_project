//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

/* Convert time from 12Hr format to 24Hr format
   Original format: HH:MM(am/pm)
   Output format: HH:MM:00 */
function timeConvert(time) {
    let sepPos = time.search(':');
    let m = time.slice(-2);
    time = time.slice(0, -2);
    let hr = Number(time.slice(0, sepPos));
    let min = time.slice(sepPos + 1);

    if (m == 'pm' && (hr != 12)) { hr += 12; }
    else if (hr == 12 && m == 'am') { hr = '00'; }
    else if (hr < 10) { hr = '0' + String(hr); }
    if (min.length == 1) { min = '0' + min; }
    return `${hr}:${min}:00`;
}

/* Convert datetime to mongoose compatible format
   Original format: dd/mm/YYYY HH:MM(am/pm)
   Output format: YYYY-mm-ddTHH:MM:ss */
function convertDateMongoose(dateStr) {
    let sepPos = dateStr.search('/');
    let d = dateStr.slice(0, sepPos);
    dateStr = dateStr.slice(sepPos + 1)
    sepPos = dateStr.search('/');
    let m = dateStr.slice(0, sepPos);
    let y = dateStr.slice(sepPos + 1, sepPos + 5);
    let time = dateStr.slice(sepPos + 6)


    if (m.length == 1) { m = '0' + m; }
    if (d.length == 1) { d = '0' + d; }

    return `${y}-${m}-${d}T${timeConvert(time)}.000+08:00`;
}

module.exports = { timeConvert, convertDateMongoose };