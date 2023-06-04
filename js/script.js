// กำหนด URL ของ MQTT broker
const brokerUrl = 'ws://broker.emqx.io:8083/mqtt';

// กำหนดตัวเลือกในการเชื่อมต่อ MQTT broker
const options = {
    username: 'your_username',
    password: 'your_password',
};

// สร้างตัวแปร currentTime เพื่อเก็บเวลาปัจจุบัน
var currentTime = new Date().getTime();

// เชื่อมต่อไปยัง MQTT broker ด้วย URL และตัวเลือกที่กำหนด
const client = mqtt.connect(brokerUrl, options);

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // สมัครสมาชิกในการติดตามหัวข้อ 'MQTT_TEST'
    client.subscribe('MQTT_TEST');
});

// เมื่อได้รับข้อความจากหัวข้อที่ติดตาม
client.on('message', (topic, message) => {
    // อัปเดตค่า currentTime เป็นเวลาปัจจุบัน
    currentTime = new Date().getTime();
    // แสดงข้อความที่ได้รับใน element ที่มี id เป็น 'message'
    document.getElementById('message').innerHTML = message.toString() + 'V';
});

// เมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ
client.on('error', (error) => {
    console.log('MQTT Error:', error);
});

// เมื่อปุ่มที่มี id เป็น 'btnMQTT' ถูกคลิก
document.getElementById('btnMQTT').addEventListener('click', () => {
    // ส่งข้อความ '12.0' ไปยังหัวข้อ 'MQTT_TEST'
    client.publish('MQTT_TEST', '12.0');
});

// เมื่อยกเลิกการเชื่อมต่อ
client.on('close', () => {
    console.log('Disconnected from MQTT broker');
});

// ตั้งค่าตัวแปร fanRun เป็นเท็จในเริ่มต้น
var fanRun = false;

// ทำงานทุก 500 มิลลิวินาที
setInterval(() => {
    // ตรวจสอบว่ายังไม่ได้รับข้อความใหม่มาเป็นเวลากว่าง
    if (!getDate()) {
        showAnimation();
        // หากพัดลมยังไม่ทำงาน
        if (!fanRun) {
            setTimeout(() => {
                fanRun = true;
            }, 500);
        }
    } else {
        hideAnimation();
        fanRun = false;
    }
    // หากพัดลมทำงาน
    if (fanRun) {
        count = count + 180;
        // หมุนกล่องสลับที่มีคลาส 'electricity' ด้วยองศาที่กำหนดโดยตัวแปร count
        document.getElementsByClassName('electricity')[0].style.transform = 'rotate(' + count + 'deg)';
    }
}, 500, false);

// ฟังก์ชันเพื่อตรวจสอบว่าได้รับข้อความใหม่มาเป็นเวลากี่วินาทีแล้ว
function getDate() {
    var targetTime = new Date().getTime();
    if (targetTime - currentTime > 2000) {
        return true;
    } else {
        return false;
    }
}

// ตัวแปร count เริ่มต้นจาก 0
var count = 0;

// ฟังก์ชันเพื่อแสดงอนิเมชัน
function showAnimation() {
    document.getElementsByClassName('groupBox')[0].classList.add('displayAnimation');
}

// ฟังก์ชันเพื่อซ่อนอนิเมชัน
function hideAnimation() {
    document.getElementsByClassName('groupBox')[0].classList.remove('displayAnimation');
}
