

import { getBase64ImageCanta, getFontBase64,getEnglishFontBase64 } from "../utils/imageLoader.js";




export default function CantaTemplate(myData) {
    const logo = getBase64ImageCanta();
    const fontBase64 = getFontBase64();
    const englishFontBase64 = getEnglishFontBase64();

 const {
    vehicle,
    Party,
    Product,
    ProductId,
    Sr_No,

    Gross,
    Tare,
    Net,

    Cash,
    remarks,

    Date,
    formDate,
    GrossDate,
    TareDate,

    GrossTime,
    TareTime,

    calc40,
    calc37,
  } = myData;
//
    return `
<html>
<head>
    <style>

    @font-face {
    font-family: "Noto Nastaliq Urdu";
    src: url(${fontBase64}) format("truetype");
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: "Canta English";
    src: url(${englishFontBase64}) format("truetype");
    font-weight: normal;
    font-style: normal;
}






body {
      margin: 0;
    padding: 20px 40px;

    font-family: "Canta English", serif;
    font-size: 16px;

    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
}


   .container {
       background: white;
       padding: 20px;
       width: 1100px;
       height: 679px;

   }

   /* Header */
   .header {
       display: flex;
       align-items: center;
       justify-content: space-between;
       padding-bottom: 15px;
   }

   .logo img {
       position: relative;
       width: 310px;
       height: 180px;
       bottom: 29px;
       /* right:  2px; */
   }

   .title {
       position: relative;
       /* display: fixed; */
       right: 32px;
       bottom: 32px;
       text-align: center;
       flex: 1;
   }

   .title h2 {
       margin: 0;
       font-size: 31px;
       letter-spacing: 1px;
       text-align: center;
       font-family: Arial, sans-serif;

   }

   .title p {
       margin: 2px 0;
       font-size: 19px;
       letter-spacing: 1px;

   }

   #contact-eidt {
       font-family: "Noto Serif", serif;
       letter-spacing: 0.5px;
       font-size: 18px;
   }

   #headernumber {
       position: relative;
       left:0.8px;
       font-size: 20px;
   }

   .right-info {
       position: relative;
       top: 26px;
       left: 1px;


   }

   #naptol {
       position: relative;
       direction: rtl;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
       font-size: 16px;

   }

   #ghanta24 {
       position: relative;
       left: 175px;
       font-family: Arial, sans-serif;
       font-size: 20px;
       bottom: 5px;

   }

   .right-info h5 {
       position: relative;
       right: 55px;
       font-weight: 300;
       bottom: 68px;
       /* line-height: 0.1px; */
       direction: rtl;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
       font-size: 16px;
   }

   .survice {
       position: absolute;
       bottom: 2px;
   }

   /* Info Section */
   .info {
       display: flex;
       position: relative;
       left: 130px;
       bottom: 45px;
   }

   .sr-width {
       position: relative;
       bottom: 30px;
       /* top: 0.6px; */
   }

   .srno {
       font-weight: 600;
       font-size: 25px;
       position: relative;
       top: 6px;
       left:5px;
   }

   #shumarno {
       position: relative;
       left: 145px;
       top: 3px;
       font-size: 14px;
       font-weight: 500;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
       direction: rtl;
       opacity: 0.9;

   }

   .vehicleno {
       position: relative;
       bottom: 16px;
       left: 0.4px;
       font-size: 25px;
   }

   #carno {
       position: relative;
       left: 79px;
       /* bottom: 1px; */
       opacity: 0.9;
       font-size: 14.5px;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
   }

   .partyno {
       position: relative;
       bottom: 40px;
       font-size: 25px;
   }

   #partynam {
       position: relative;
       left: 145px;
       font-size: 14.5px;
       bottom: 5px;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
       opacity: 0.9;
   }

   .productno {
       position: relative;
       bottom: 75px;
       font-size: 25px;
   }

   #nameginus {
       position: relative;
       left: 115px;
       bottom: 5px;
       opacity: 0.9;
       font-weight: 100;
       font-size: 14px;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
   }


   .date-head {
       position: relative;
       left: 95px;
       bottom: 10px;
       font-weight: 540;
       font-size: 25px;
       font-weight: bold;
   }

   #datenumber {
       position: relative;
       left: 21px;
       letter-spacing: 1px;

      font-family: "Canta English", serif;
  font-weight: bold;
       transform: none;
       font-style: normal;
   }

   .info div {
       width: 48%;
   }

   hr {
       position: relative;
       width: 880px;
       left: 79px;
       bottom: 171px;
       border: none;
       margin: 0;
       border-top: 3px solid rgba(0, 0, 0, 0.831);
   }

   .hrinsidepart {
       /* padding: -400px, 0; */
       display: flex;
       gap: 130px;
       font-size: 25px;
       position: relative;
       bottom: 145px;
       left: 81px;
       font-weight: bold;
         font-family: "Canta English", serif;

   }

   hr:first-of-type {
       margin-bottom: -1.8rem;
   }

   #same {
       position: absolute;
       bottom: 40px;
       margin-left: 13px;
       font-size: 20px;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
   }
       #wakat{
       position: absolute;
       left:19px;
       height:25px;
        bottom: 15px;
       }

   #tarekh {
       position: relative;
       top: 5px;
       font-size: 17px;
       /* font-weight: 300; */
   }

   .type {
       position: relative;
       right: 15px;
   }

   .weight {
       padding-left: 55px;
   }


.grossandtare {
    position: relative;
    left: 60px;
    bottom: 59px;
    font-size: 25px;
}

/* GROSS AND TARE */
.grossandtare h3 {
    position: relative;
    bottom: 112px;
    left: 19px;
    margin: -1px 0;

    display: flex;
    align-items: center;
}

/* Urdu text */
.grossandtare h3 span:nth-child(1) {
    position: relative;
    left: 30px;
    font-size: 16px;
    font-weight: 200;
    font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
    bottom: 5px;
}

/* Weight */
.grossandtare h3 span:last-child {
    position: absolute;
    right: 0;
    width: 90px;
    text-align: right;
    font-size: 25px;
    font-family: 'Times New Roman', serif;
}




/* NET WEIGHT */
.netweight {
    position: relative;
    bottom: 160px;
    left: 75px;
    border: 2px solid black;
    width: 386px;
    height: 60px;
    box-sizing: border-box;
}

.netweight h1 {
    position: relative;
    bottom: 1rem;
    font-weight: 600;
    font-size: 30px;

}

/* Urdu */
.netweight h1 span:nth-child(1) {
    font-size: 16px;
    font-family: 'Jameel', 'Noto Nastaliq Urdu', serif;
}

/* Net weight number */
#user-netweight-enter {
    position: absolute;
    right: 10px;
    font-size: 29px;
    font-weight: 600;
    font-family: "Canta English", serif;
    white-space: nowrap;
    text-align: right;
}



   .kgsormnd {
       position: relative;
       bottom: 295px;
       left: 525px;
   }

   .kgs {
       position: relative;
       top: 60px;
       right: 52px;
       font-weight: bold;
       font-size: 25px;
   }

   .mnd1 {
       display: flex;
       position: relative;
       background:
       repeating-linear-gradient(to right, rgb(67, 66, 66) 0 7px, transparent 5px 13px) top,
       repeating-linear-gradient(to right, rgb(32, 31, 31) 0 7px, transparent 5px 13px) bottom,
       repeating-linear-gradient(to bottom, rgb(32, 31, 31) 0 5px, transparent 0.5px 13px) left,
       repeating-linear-gradient(to bottom, rgb(32, 31, 31) 0 5px, transparent 0.9px 11px) right;
       background-size: 100% 0.5px, 100% 0.6px, 0.5px 100%, 0.6px 100%;
       background-repeat: no-repeat;
       width: 430px;
       height: 50px;
       gap: 7rem;
       margin-bottom: 18px;
   }

   .mnd1 h2 {
       position: relative;
       bottom: 0.5rem;
       font-size: 25px;
       /* font-weight: 500; */
       left: 0.2rem;
   }

   .mnd1 h3 {
       font-size: 27px;
       position: relative;
       left: 4rem;
       bottom: 20px;
   }

   .mnd1 h4 {
       font-size: 25px;
       position: relative;
       left: 8px;
       bottom: 27px;
   }

   .mnd2 {
       display: flex;
       position: relative;
       background:
       repeating-linear-gradient(to right, rgb(67, 66, 66) 0 7px, transparent 5px 13px) top,
       repeating-linear-gradient(to right, rgb(32, 31, 31) 0 7px, transparent 5px 13px) bottom,
       repeating-linear-gradient(to bottom, rgb(32, 31, 31) 0 5px, transparent 0.5px 13px) left,
       repeating-linear-gradient(to bottom, rgb(32, 31, 31) 0 5px, transparent 0.9px 11px) right;
       background-size: 100% 0.5px, 100% 0.6px, 0.5px 100%, 0.6px 100%;
       background-repeat: no-repeat;
       width: 425px;
       height: 33px;
       gap: 4.6rem;
   }

   .mnd2 h1 {
       font-size: 24px;
       position: relative;
       left: 0.3rem;
       bottom: 0.8rem;
   }

   .mnd2 p {
       font-size: 24px;
       position: relative;
       left: 4.5rem;
       bottom: 1.3rem;
   }

   .mnd2 h4 {
       font-size: 24px;
       position: relative;
       left: 3.6rem;
       bottom: 29px;
       font-weight: 200;
   }

   /* cash-ramarks */
   .cash-ramarks {
       position: relative;
       bottom: 330px;
       left: 90px;
       font-size: 19px;
   }

   #without-default {
       font-weight: 300;
       font-size: 25px;
   }

   /* warn */
   .warn {
       position: relative;
       bottom: 340px;
       left: 70px;
       font-size: 19.5px;
       font-family: 'Jameel', 'Noto Nastaliq Urdu', serif
   }

   /* sign  */
   .sign {
       position: relative;
       bottom: 310px;
       left: 700px;
   }

   .sign hr {
       width: 220px;
       position: relative;
       bottom: 80px;
       border: none;
       height: 0.7px;
       background-color: rgba(0, 0, 0, 0.745);


   }

   .sign p {
       position: relative;
       left: 90px;
       bottom: 75px;
       font-size: 24px;
   }

   /* USER DATA IN  */


   .user-enter-sr {
       position: absolute;
       top: 10px;
       left: 310px;
       font-size: 22px;
       font-weight: 550;
       opacity: 1;
       letter-spacing: 2px;
      font-family: "Noto Serif", serif;

       font-style: normal;

   }

   .user-enter-vehicleno {


     position: absolute;
       left: 310px;
       font-weight: 100;
       top: 6px;


   }

   .user-enter-partyno {
       position: absolute;
       font-size: 24px;
       left: 310px;
       letter-spacing: 1px;
       bottom: 11px;
   }

   .user-enter-partyname {
       position: absolute;
       left: 360px;
       bottom: 10px;
       width: 100%;
       font-weight: 100;
   }

   .user-product-enter {
       position: absolute;
       font-size: 24px;
       bottom: 5px;
       left: 310px;
       letter-spacing: 1px;
   }

   .user-product-name {
       position: relative;
       left: 220px;
       font-weight: 100;
        bottom: 1px;




   }


   /* gross data in user  */
   #user-gross-enter {
       position: absolute;
       top: 5px;
       left: 280px;
       font-weight: 550;
     font-family: "Canta English", serif;
       font-size: 29px;

   }

   #user-tare-enter {
       position: absolute;
       top: 5px;
       left: 280px;
       font-weight: 550;
     font-family: "Canta English", serif;
       font-size: 29px;
   }

   /* netweight-user */


   /* time set user auto  */
   .box {
       position: relative;
       display: flex;

   }

   /* sab ko absolute position do */
   .box p {
       position: absolute;
       display: flex;
       margin: 0;

   }


   /* apni marzi ki positioning */
   .time {

       left: 500px;
       bottom: 215px;
       font-size: 25px;
   }

   .date {
       bottom: 215px;
       left: 695px;
       font-size: 25px;
   }

   .status {
       bottom: 215px;
       left: 885px;
       font-size: 25px;
   }


   /* box 2 */
   .box2 {
       position: absolute;
       display: flex;
       height: 100%;
   }


   /* apni marzi ki positioning */
   .time2 {
       position: relative;

       left: 500px;
       bottom: 230px;
       font-size: 25px;
   }

   .date2 {
       position: relative;
       bottom: 230px;
       left: 565px;
       font-size: 25px;
   }

   .status2 {
       position: relative;
       bottom: 230px;
       left: 650px;
       font-size: 25px;
   }

   /* auto mand user  */
   .user-auto-mnd40 {
       position: absolute;
       right: 71px;
       top: -5px;
       font-family: "Canta English", serif;
          height:5px;

       font-size: 31px;
   }

   .user40kg {
       position: absolute;
       right: 35px;
       top: -5px;
      font-size: 31px;
        height:5px;

   font-family: "Canta English", serif;
   }

   /* 37mnd */
   .user-auto-mnd37 {
       position: absolute;
       right: 59px;
       font: 23px;
       height:15px;

   font-family: "Canta English", serif;

   }

   .user37kg {
       position: absolute;
       right: 30px;
       font-size: 25px;
       font-weight:550;
       height:5px;
font-family: "Canta English", serif;

   }

   .cash-user-manual {
       position: relative;
       font-size: 28px;
       left: 55px;
      font-weight: 600;
font-family: "Canta English", serif;
   }



    </style>
</head>
<body>
     <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <img src="${logo}" alt="Logo" />
      </div>

      <div class="title">
        <h2 class="headerh2">U.K COMPUTERIZED KANTA</h2>
        <p class="headerp">NEW GHALLA MANDI, MAROT ROAD, FORT ABBAS</p>
        <p id="headernumber">MOB: <span id="contact-eidt"> 0332-7470181</span></p>
      </div>

      <div class="right-info">
        <p id="naptol">پورا کروناپ اور تول کے ساتھ (القرآن )</p>
        <p id="ghanta24">24</p>
        <h5 id="ghantser">گھنٹے <span class="survice">سروس</span></>
      </div>
    </div>
    <!-- Info -->
    <div class="info">
      <div class="sr-width">
        <p class="srno">Sr No. <span id="shumarno">شمار نمبر</span> <span class="user-enter-sr">
           ${parseFloat(Sr_No).toLocaleString()}
        </span></p>
        <p class="vehicleno">
          Vehicle No. : <span id="carno">گاڑی نمبر</span> <span class="user-enter-vehicleno">${vehicle}</span> </p>
        <p class="partyno">Party : <span id="partynam">نام پارٹی</span> <span class="user-enter-partyno">
           ${Math.floor(Math.random() * 20) + 1}
        </span> <span
            class="user-enter-partyname">${Party}</span></p>
        <p class="productno">Product : <span id="nameginus">نام جنس</span><span class="user-product-enter">
             ${ProductId}</span>
          <span class="user-product-name">${Product}</span></p>
      </div>
      <!-- time auto ana chia ya wala ok  -->
      <div class="date-head">
        <p>Date:<span id="datenumber">${formDate}</span></p>
      </div>
    </div>
    <!-- hrpart  -->
    <hr />
    <div class="hrinsidepart">
      <p class="legend">Legend</p>
      <p class="weight">Weight <span id="same">وزن</span></p>
      <p class="time">Time <span id="same"> <span id="wakat">وقت</span></span></p>
      <p class="date">Date <span id="same"> <span id="tarekh">تاریخ</span></span></p>
      <p class="type">Type</p>
    </div>
    <hr />
    <!-- gross and tare  -->
    <div class="grossandtare">
      <h3>Gross------> <span>پہلا وزن</span> <span id="user-gross-enter">${parseFloat(Gross).toLocaleString()}</span></h3>
      <h3>Tare-------> <span>دوسراوزن</span> <span id="user-tare-enter">${parseFloat(Tare).toLocaleString()}</span></h3>
    </div>
    <!-- time user auto  -->
    <div class="box">
      <p class="time">${GrossTime}</p>
      <p class="date">${GrossDate}</p>
      <p class="status">Auto</p>
    </div>
    <!-- user time plus -->
    <div class="box2">
     <p class="time2">${TareTime}</p>
      <p class="date2">${TareDate}</p>
      <p class="status2">Manual</p>
    </div>
    <!-- netweight -->
    <div class="netweight">
      <h1>Net Weight: <span>صافی وزن</span> <span id="user-netweight-enter">${parseFloat(Net).toLocaleString()}</span></h1>
    </div>
    <!-- user time enter  -->


    <!-- kgs or mnd -->
    <div class="kgsormnd">
      <p class="kgs">Kgs.</p>
      <div class="mnds">
        <!-- mnd1 40kgs -->
        <div class="mnd1">
          <h2>(40)Kgs:</h2>
          <h3>Mnds <span class="user-auto-mnd40">${calc40.mnds}</span></h3>
          <h4>Kg <span class="user40kg">${calc40.kg}</span></h4>
        </div>
        <!-- mnd2 37kgs-->
        <div class="mnd2">
          <h1>(37.324)Kgs:</h1>
          <p>Mnds <span class="user-auto-mnd37">${calc37.mnds}</span></p>
          <h4>Kg <span class="user37kg">${calc37.kg}</span></h4>
        </div>
      </div>
    </div>
    <!-- cash remarks  -->
    <div class="cash-ramarks">
      <h2>Cash Receipt :Rs. <span class="cash-user-manual">${Cash}</span></h2>
      <h2>Remarks: <span id="without-default">${remarks}</span></h2>
    </div>
    <p class="warn">کانٹا چھوڑنے سے پہلے وزن کی تسلی کر لیں سہوا غلطی کے ہم ذمہ دار نہ ہونگے</p>

    <div class="sign">
      <hr>
      <p>Weighing Supervisor</p>
    </div>
  </div>
</body>
</html>
`;
}
