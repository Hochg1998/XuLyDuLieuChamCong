
$(document).ready(function () {
  loadData();
})
var oData = [];
function loadData() {
  fetch('./data.json').then(response => {
    return response.json();
  }).then(data => {
    oData = data;
    //Thêm option cho select
    //console.log(data);
    getUser(data.data);
    getMonth(data.data);
  });
}
function clearDocument() {
  $('#tableBody').empty();
  $('#tableBody1').empty();
  $('#tableHead1').empty();
  $('#totalWorkingDaysPerMonth').empty();
  $('#totalWorkingHourPerMonth').empty();
  $('#totalLateDaysPerMonth').empty();
}

function getUser(data) {
  let result = [];
  result.push(data[0].name)

  for (let i = 0; i < data.length; i++) {
    let count = 0;

    for (let j = 0; j < result.length; j++) {
      if (data[i].name === result[j]) {
        count++;
      }
    }
    if (count === 0) {
      result.push(data[i].name)
    }
  }
  // return result
  let selectOption = document.getElementById("employeeName");
  result.forEach(item => {
    selectOption.innerHTML += `
      <option value="${item}">${item}</option>
    `
  })
}
function getMonth(data) {
  let result = [];
  result.push(data[0].time.slice(5, 7))

  for (let i = 0; i < data.length; i++) {
    let count = 0;

    for (let j = 0; j < result.length; j++) {
      if (data[i].time.slice(5, 7) === result[j]) {
        count++;
      }
    }
    if (count === 0) {
      result.push(data[i].time.slice(5, 7))
    }
  }
  // return result
  let selectOption = document.getElementById("monthAutoGenerate");
  result.forEach(item => {
    selectOption.innerHTML += `
      <option value="${item}">${item}</option>
    `
  })
}


function logDulieu() {
  clearDocument();


  let name = document.getElementById('employeeName').value;
  let month = document.getElementById('monthAutoGenerate').value;





  //Tổng số ngày làm
  let totalDayPerMonth = 0;

  //Tổng số giờ là
  let totalHourPerMonth = 0;

  //Số ngày đi làm muộn
  let totalLateDays = 0;


  // Work with JSON data here

  //console.log(oData);
  let body = document.getElementById("tableBody");
  let body1 = document.getElementById("tableBody1");
  let head1 = document.getElementById("tableHead1");



  const sName = oData.data.filter(item => item.name == name && item.time.slice(5, 7) == month)
  //console.log(sName);
  //Thêm option cho select
  //Có những ngày nào trong bản ghi
  let resultDate = [];
  resultDate.push(sName[0].time.slice(0, 10))

  for (let i = 0; i < sName.length; i++) {
    let count = 0;

    for (let j = 0; j < resultDate.length; j++) {
      if (sName[i].time.slice(0, 10) === resultDate[j]) {
        count++;
      }
    }
    if (count === 0) {
      resultDate.push(sName[i].time.slice(0, 10))
    }
  }
  // 2. tạo ra bảng <th>từng ngày 1</th>
  let allDate = document.getElementById("tableHead1");
  resultDate.forEach(item => {
    allDate.innerHTML += `
      <th>${item}</th>
    `
    totalDayPerMonth++
    // 3. tạo ra các ô <td>Tổng sô h làm trên ngày đó</td>
    const sameDayRecords = sName.filter(dates => {
      if (dates.time.slice(0, 10) === item) {
        return true;
      }
    });
    //console.log(sameDayRecords);
    //console.log(sameDayRecords.length);
    //Tinh h làm mỗi ngày
    //2 Trường hợp length chẵn (bđ từ 0) và lẻ
    if (sameDayRecords.length % 2 == 0) {
      //Nếu đi làm muộn
      var timeParts = sameDayRecords[0].time.slice(11, 16).split(":");

      var timePartsEnd = sameDayRecords[sameDayRecords.length - 1].time.slice(11, 16).split(":");
      if (((+timeParts[0] * (60000 * 60)) + (+timeParts[1] * 60000) > 30600000) || ((+timePartsEnd[0] * (60000 * 60)) + (+timePartsEnd[1] * 60000) < 59400000)) {
        let totalHour = 0;
        totalLateDays++;
        for (let i = 0; i <= sameDayRecords.length - 1; i += 2) {
          totalHour += new Date(sameDayRecords[i + 1].time) - new Date(sameDayRecords[i].time);
        }
        // for (let i = 0; i <= 3; i + 2) {
        //   totalHour += 1
        //   // totalHour += Math.abs(new Date(sameDayRecords[i + 1].time) - new Date(sameDayRecords[i].time));
        // 
        //console.log(totalHour);
        let s = totalHour / 1000;
        totalHourPerMonth += s;
        let mins = (s % 3600) / 60;
        let hrs = (s - (s % 3600)) / 3600;
        let days = hrs + 'h' + mins + 'p';
        document.getElementById("tableBody1").innerHTML += `
      <td style="color:blue">${days}</td>
    `} else {
        let totalHour = 0;
        for (let i = 0; i <= sameDayRecords.length - 1; i += 2) {
          totalHour += new Date(sameDayRecords[i + 1].time) - new Date(sameDayRecords[i].time);
        }
        // for (let i = 0; i <= 3; i + 2) {
        //   totalHour += 1
        //   // totalHour += Math.abs(new Date(sameDayRecords[i + 1].time) - new Date(sameDayRecords[i].time));
        // 
        //console.log(totalHour);
        let s = totalHour / 1000;
        totalHourPerMonth += s;
        let mins = (s % 3600) / 60;
        let hrs = (s - (s % 3600)) / 3600;
        let days = hrs + 'h' + mins + 'p';
        document.getElementById("tableBody1").innerHTML += `
      <td>${days}</td>
    `
      };
    }
    //lẻ
    else {
      let totalHour = 0;
      totalHour = new Date(sameDayRecords[sameDayRecords.length - 1].time) - new Date(sameDayRecords[0].time);
      // console.log(totalHour);
      if (totalHour > 21600000) {
        totalHour = totalHour - 5400000;
        let s = totalHour / 1000;
        totalHourPerMonth += s;
        let mins = (s % 3600) / 60;
        let hrs = (s - (s % 3600)) / 3600;
        let days = hrs + 'h' + mins + 'p';
        document.getElementById("tableBody1").innerHTML += `
      <td style="color:green">${days}</td>`
      } else {
        let totalHour = 0;
        totalHour = new Date(sameDayRecords[sameDayRecords.length - 1].time) - new Date(sameDayRecords[0].time);
        let s = totalHour / 1000;
        totalHourPerMonth += s;
        let mins = (s % 3600) / 60;
        let hrs = (s - (s % 3600)) / 3600;
        let days = hrs + 'h' + mins + 'p';
        document.getElementById("tableBody1").innerHTML += `
      <td style="color:red">${days}</td>`
      }
      //1 thiếu giờ vào
      // THiếu giờ vào thì totalWorkingHour < 7h
      //2 Thiếu giờ nghỉ trưa
      //tự động trừ 1h30
      //3 Thiếu giờ kt nghỉ trưa
      //lấy đầu trừ cuối nếu trên 7h thì tự động trừ 1h30
      //4 Thiếu giờ về
      // THiếu giờ về thì totalWorkingHour < 7h
    }
    // let gioVao = sameDayRecords[0];
    // let gioNghiTrua = sameDayRecords[1];
    // let gioKTNghiTrua = sameDayRecords[2];
    // let gioVe = sameDayRecords[sameDayRecords.length - 1];
    // //if same date then (giờ ra - giờ vào) - (kt nghỉ trưa - bđ nghỉ chưa) = totalWorkingtime
    // if(sameDayRecords.length === 3){

    // }
    // console.log(totalDayPerMonth);
    document.getElementById("totalWorkingDaysPerMonth").innerHTML = `Tổng số ngày làm việc: ${totalDayPerMonth}`;
    document.getElementById("totalWorkingHourPerMonth").innerHTML = `Tổng số giờ làm việc: ${totalHourPerMonth / 3600}h`;
    document.getElementById("totalLateDaysPerMonth").innerHTML = `Số ngày đi muộn: ${totalLateDays}`;
  })
  sName.forEach(item => {
    // s = Math.abs(new Date(item.time) / 1000);

    // u += s;
    // document.getElementById("totalTimePerMonth").innerHTML = "Tổng giờ làm: " + (u - (u % 3600)) / 3600 + 'h' + (u % 3600) / 60 + 'p';

    // 1. extract time from datetime using javascript
    // const milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    // const eTime = item.time.slice(11, 16);
    // const timeParts = eTime.split(":");
    // const result = milliseconds(timeParts[0], timeParts[1], 0);
    // console.log(result);

    // 2. Sort and find closest time from timestamp

    // const closest = [28800000, 41400000, 43200000, 61200000].reduce((a, b) => {
    //   return Math.abs(b - result) < Math.abs(a - result) ? b : a;
    // });
    // switch (closest) {
    //   // 3. giờ vào là bản ghi đầu tiên trong ngày 
    //   case 28800000:
    //     tTime = "Vào";
    //     break;
    //   // bắt đầu nghỉ trưa thì gần với 11h30 nhất
    //   case 41400000:
    //     tTime = "Bđ Nghỉ trưa";
    //     break;
    //   // kết thúc nghỉ trưa thì gần với bđ nghỉ trưa         
    //   case 43200000:
    //     tTime = "Kt Nghỉ trưa";
    //     break;
    //   // giờ ra là bản ghi cuối cùng trong ngày
    //   case 61200000:
    //     tTime = "Ra";
    // }
    // 4. if same date then (giờ ra - giờ vào) - (kt nghỉ trưa - bđ nghỉ chưa) = totalWorkingtime

    // head1.innerHTML += `
    // <th className="date1">${item.name}</th>`
    // body1.innerHTML += `
    // <td className="totalWorkingHourPerDay">${item.name}</td>`
    // // 5. Lối kt nghỉ trưa & bđ nghỉ trưa = null or undefined = (giờ ra - giờ vào) - 1h30 = totalWorkingtime
    // //    Lỗi thiếu h vào => giờ ra = 8h30
    // //    Lỗi thiếu h ra => giờ vào = 16h30
    // // 6. 


    // let mins = (s % 3600) / 60;
    // let hrs = (s - (s % 3600)) / 3600;
    // let days = hrs + 'h' + mins + 'p';

    body.innerHTML += `<tr>
      <td className="name">${item.name}</td>
      <td className="datetime">${item.time}</td>
      <td><input type="button" id="edit_button" value="Sửa" class="edit" onclick="editTimes(this)"></td>
    </tr>`



  })

  // document.getElementById("totalDayPerMonth").innerHTML = "Tổng số ngày đi làm: " + sName.length + "/30ngày";
}
function editTimes(x) {
  var trId = $(x).parent("td").closest("tr");
  let idThuChi = $(trId[0]).children()[0].textContent;
  console.log(idThuChi);
}
