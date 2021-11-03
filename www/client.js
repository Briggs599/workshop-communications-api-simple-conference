
/**  Create a list of Cities for our Money Heist Characters */
const cities = ['Seattle', 'Vancouver', 'Portland', 'Tokyo', 'Berlin', 'Palermo', 'Nairobi', 'Denver', 'Helsinki', 'Rio', 'Moscow', 'Oslo'];
let randomName = cities[Math.floor(Math.random() * cities.length)];
  
// Replace our city name in URL and add some cloudinary transformaitons.
let imagePlaceholder =  `https://res.cloudinary.com/dolby-io/image/upload/e_art:red_rock/ar_16:9,c_fill,g_auto,r_max,w_200/co_rgb:f21904,g_center,l_text:verdana_24_bold__letter_spacing_4:${randomName}/v1634690310/dolby-hackathon/cities/${randomName}.png`

/**  Update varibles when form input changes */
function updateNameValue(e) {
  randomName = e.target.value;
}


// URL to our Token Server
const tokenServerURL = 'https://zealous-bell-161b0d.netlify.app/api/token-generator';


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

  let participantInfo = { name: randomName, avatarUrl: imagePlaceholder, externalId:randomName }
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

