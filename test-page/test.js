/* global WebrtcTroubleshooter */
let video = true;
let audio = true;

let iceServers = [];
const testSuite = new WebrtcTroubleshooter.TestSuite();

const iceServersEntry = document.getElementById("ice-servers");
const runButton = document.getElementById("run-button");

const testCompleted = function(test, success, res) {
  const result = `test completed ${test.name} ${
    success ? "success" : "failure"
  } ${res} ${res && res.details ? res.details : "no results"}`;
  console.log(result, res);
  const p = document.createElement("p");
  p.innerText = result;
  document.body.appendChild(p);
};

runButton.onclick = function startTroubleshooter() {
  if (!navigator.mediaDevices) {
    video = false;
    audio = false;
  }

  const servers = [
    {
      urls: [
        "turn:turn.huddldev.com:443?transport=tcp",
        "turn:turn.huddldev.com:443?transport=udp"
      ],
      username: "huddlvideo",
      credential: "huddlvideo@123"
    }
  ];
  if (servers) {
    iceServers = [
      {
        urls: [
          "turn:turn.huddldev.com:443?transport=tcp",
          "turn:turn.huddldev.com:443?transport=udp"
        ],
        username: "huddlvideo",
        credential: "huddlvideo@123"
      }
    ];
    window.localStorage.setItem("iceServers", servers);
  }
  const iceConfig = {
    iceServers: iceServers,
    iceTransports: "relay"
  };
  const mediaOptions = { audio: true, video: true };

  if (audio) {
    const audioTest = new WebrtcTroubleshooter.AudioTest(mediaOptions);
    audioTest.promise.then(
      testCompleted.bind(null, audioTest, true),
      testCompleted.bind(null, audioTest, false)
    );
    testSuite.addTest(audioTest);

    const audioBandwidthTest = new WebrtcTroubleshooter.AudioBandwidthTest({
      iceConfig: iceConfig,
      mediaOptions: mediaOptions
    });
    audioBandwidthTest.promise.then(
      testCompleted.bind(null, audioBandwidthTest, true),
      testCompleted.bind(null, audioBandwidthTest, false)
    );
    testSuite.addTest(audioBandwidthTest);
  }

  if (video) {
    const videoTest = new WebrtcTroubleshooter.VideoTest(mediaOptions);
    videoTest.promise.then(
      testCompleted.bind(null, videoTest, true),
      testCompleted.bind(null, videoTest, false)
    );

    const bandwidthTest = new WebrtcTroubleshooter.VideoBandwidthTest({
      iceConfig: iceConfig,
      mediaOptions: mediaOptions
    });
    bandwidthTest.promise.then(
      testCompleted.bind(null, bandwidthTest, true),
      testCompleted.bind(null, bandwidthTest, false)
    );

    testSuite.addTest(videoTest);
    testSuite.addTest(bandwidthTest);
  }

  if (window.RTCPeerConnection) {
    const connectivityTest = new WebrtcTroubleshooter.ConnectivityTest(
      iceConfig
    );
    connectivityTest.promise.then(
      testCompleted.bind(null, connectivityTest, true),
      testCompleted.bind(null, connectivityTest, false)
    );

    const symmetricNatTest = new WebrtcTroubleshooter.SymmetricNatTest();
    symmetricNatTest.promise.then(
      testCompleted.bind(null, symmetricNatTest, true),
      testCompleted.bind(null, symmetricNatTest, false)
    );

    testSuite.addTest(connectivityTest);
    testSuite.addTest(symmetricNatTest);
  }

  const p = document.createElement("p");
  testSuite
    .start()
    .then(
      function(results) {
        const result = "Finished the tests";
        console.log(result, results);
        p.innerText = result;
      },
      function(err) {
        const result = "test failure";
        console.warn(result, err, err.details);
        p.innerText = result;
      }
    )
    .then(function() {
      document.body.appendChild(p);
    });
};

const savedIceServers = window.localStorage.getItem("iceServers");
if (iceServers) {
  iceServersEntry.value = savedIceServers;
}
