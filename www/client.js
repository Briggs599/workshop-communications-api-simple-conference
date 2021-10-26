
/**  Create a list of Cities for our Money Heist Characters */
const cities = ['Seattle', 'Vancouver', 'Portland', 'Tokyo', 'Berlin', 'Palermo', 'Nairobi', 'Denver', 'Helsinki', 'Rio', 'Moscow', 'Oslo'];
let randomCity = cities[Math.floor(Math.random() * cities.length)];

// let posterImage = 'https://res.cloudinary.com/dolby-io/image/upload/w_300/v1634690310/dolby-hackathon/cities/Poster.png';

// image names with spaces are replaced with _ underscores
let avatarImage = randomCity.replace(' ', '_');

// Replace our city name in URL and add some cloudinary transformaitons.

let imagePlaceholder =  `https://res.cloudinary.com/dolby-io/image/upload/e_art:red_rock/ar_16:9,c_fill,g_auto,r_max,w_200/co_rgb:f21904,g_center,l_text:verdana_32_bold__letter_spacing_10:${avatarImage}/v1634690310/dolby-hackathon/cities/${avatarImage}.png`

/**  Update varibles when form input changes */
function updateNameValue(e) {
  randomCity = e.target.value;
  avatarImage = randomCity.replace(' ', '_');
  let imagePlaceholder =  `https://res.cloudinary.com/dolby-io/image/upload/e_art:red_rock/ar_16:9,c_fill,g_auto,r_max,w_200/co_rgb:f21904,g_center,l_text:verdana_32_bold__letter_spacing_10:${avatarImage}/v1634690310/dolby-hackathon/cities/${avatarImage}.png`
  myAvatarImage.src = imagePlaceholder;
  posterArt.src = imagePlaceholder;
}

// URL to our Token Server
const tokenServerURL = 'https://infallible-borg-a38a3f.netlify.app/api/token-generator';



/**   initializeToken authorization flow on script load  **/

(function () {
  try {
    getTokenAndInitalize()
  } catch (e) {
    alert('Something went wrong initalizaton : ' + e);
  }
})();

/** Fetch our token and start initialization of SDK, update UI sources */
async function getTokenAndInitalize() {
  return fetch(tokenServerURL)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      VoxeetSDK.initializeToken(result.access_token, refreshToken);
      return result.access_token
    })
    .then((token) => {
      console.info('token received', token);
      initializeConferenceSession()
      myAvatarImage.src = imagePlaceholder;
      posterArt.src = imagePlaceholder;
    })
    .catch((error) => {
      console.error(error);
    });
}

/**  Refresh Token is called when token expiration is 50% completed, this keeps the app initialized */
async function refreshToken() {
  return fetch(tokenServerURL)
    .then((res) => {
      return res.json();
    })
    .then((json) => json.access_token)
    .catch((error) => {
      console.error(error);
    });
}

/**  Create the participantInfo object and open the session with the object  */
async function initializeConferenceSession() {

  let participantInfo = { name: randomCity, avatarUrl: imagePlaceholder }
  try {
    // Open a session for the user
    await VoxeetSDK.session.open(participantInfo);
    // Initialize the UI
    initUI();
    console.log('session initialized!');
  } catch (e) {
    alert('Something went wrong: ' + e);
  }
}

/* Dolby.io Event handlers */

// When a stream is added to the conference
VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
  if (stream.type === 'ScreenShare') {
    return addScreenShareNode(stream);
  }

  if (stream.getVideoTracks().length) {
    // Only add the video node if there is a video track
    addVideoNode(participant, stream);
  }
  addParticipantNode(participant);
});

// When a stream is updated
VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
  if (stream.type === 'ScreenShare') return;
  if (stream.getVideoTracks().length) {
    // Only add the video node if there is a video track
    addVideoNode(participant, stream);
  } else {
    removeVideoNode(participant);
  }
});

// When a stream is removed from the conference
VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
  if (stream.type === 'ScreenShare') {
    return removeScreenShareNode();
  }
  removeVideoNode(participant);
  removeParticipantNode(participant);
});

// Build your list of participants you want to mute
const participants = [
  "externalId01",
  "externalId02",
  "externalId03"
]

// Build the JSON payload to send to the participants
const payload = {
  "command": "Mute",
  "content": {
    "participants": participants
  }
}

// The content of the message must be a string
const json = JSON.stringify(payload);

// Send the message to the other participants
VoxeetSDK
  .command
  .send(json)
  .then(() => console.log("Message sent successfully."))
  .catch((error) => console.error("There was an error sending the message.", error));


/* Cloudinary Event handlers */

// Cloudinary Upload widget
document.getElementById("upload_widget").addEventListener("click", function () {

  cloudinary.openUploadWidget({ cloud_name: 'dolby-io', upload_preset: 'avatar', public_id: randomCity, name: randomCity },
    function (error, result) { 
      console.log(error, result[0]) 

      imagePlaceholder = `https://res.cloudinary.com/dolby-io/image/upload/ar_16:9,c_fill,g_auto,r_20,w_100/v1634690310/${result[0].public_id}`

      myAvatarImage.src = imagePlaceholder;
      posterArt.src = imagePlaceholder;
    });
}, false);



/* Speech Recognition   */

/*
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

    const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');
    p.textContent = poopScript;

    if (e.results[0].isFinal) {
      p = document.createElement('p');
      words.appendChild(p);
    }
});

recognition.addEventListener('end', recognition.start);

recognition.start();
*/

