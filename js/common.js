(function () {
  if (!("serial" in navigator)) {
    alert("当前浏览器不支持串口操作,请更换Edge或Chrome浏览器");
  }
  let serialPort = null;
  console.log("开始");
  let flag = 0;
  //串口事件监听
  navigator.serial.addEventListener("connect", (e) => {
    serialPort = e.target;
    //未主动关闭连接的情况下,设备重插,自动重连
    if (!serialClose) {
      openSerial();
    }
  });

  navigator.serial.getPorts().then((ports) => {
    console.log("ports: ", ports);
    if (ports.length > 0) {
      serialPort = ports[0];
      console.log("serialPort: ", serialPort);
    }
  });
  let reader;
  //串口目前是打开状态
  let serialOpen = false;
  //串口目前是手动关闭状态
  let serialClose = true;

  //   开门，0100040401000404
  //   关门，0100040301000403
  const openId = "0100040401000404";
  const closeId = "0100040301000403";
  //   const openId = "01 00 04 04 01 00 04 04 0D 0A";
  //   const closeId = "01 00 04 03 01 00 04 03 0D 0A";

  //打开关闭快递柜
  document.getElementById("serial-open").addEventListener("click", (e) => {
    send(openId);
  });

  //关闭快递柜
  document.getElementById("serial-close").addEventListener("click", (e) => {
    send(closeId);
  });

  //打开串口
  async function openSerial() {
    console.log("openSerial");
    let SerialOptions = {
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: "None",
      bufferSize: 1024,
      flowControl: "None",
    };

    serialPort
      .open(SerialOptions)
      .then(() => {
        serialOpen = true;
        serialClose = false;
        readData();
      })
      .catch((e) => {
        console.log("打开串口失败:" + e.toString());
      });
  }

  //串口事件监听
  navigator.serial.addEventListener("connect", (e) => {
    serialPort = e.target;
    //未主动关闭连接的情况下,设备重插,自动重连
    if (!serialClose) {
      openSerial();
    }
  });

  //串口数据收发
  async function send(code) {
    if (flag === 0) {
      serialPort = await navigator.serial.requestPort();
      flag = 1;
    }

    console.log("code: ", code);
    await sendHex(code);
  }

  //发送HEX到串口
  async function sendHex(hex) {
    const value = hex.replace(/\s+/g, "");
    if (/^[0-9A-Fa-f]+$/.test(value) && value.length % 2 === 0) {
      let data = [];
      for (let i = 0; i < value.length; i = i + 2) {
        data.push(parseInt(value.substring(i, i + 2), 16));
      }
      await writeData(Uint8Array.from(data));
    } else {
      console.log("HEX格式错误:" + hex);
    }
  }

  //写串口数据
  async function writeData(data) {
    if (!serialPort || !serialPort.writable) {
      console.log("请先打开串口再发送数据");
      return;
    }
    const writer = serialPort.writable.getWriter();
    await writer.write(data);
    writer.releaseLock();
  }

  //读串口数据
  async function readData() {
    console.log("readData: ", readData);
    while (serialOpen && serialPort.readable) {
      reader = serialPort.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
        }
      } catch (error) {
      } finally {
        reader.releaseLock();
      }
    }
    await serialPort.close();
  }
})();
