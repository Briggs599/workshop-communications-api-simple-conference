// Cloudinary Upload 

// var myWidget = cloudinary.createUploadWidget({
//     cloudName: 'dolby-io', 
//     uploadPreset: 'avatar'}, (error, result) => { 
//       if (!error && result && result.event === "success") { 
//         console.log('Done! Here is the image info: ', result.info); 
//         alert(result.info)
//       }
//     }
//   )


// Once the event 'received' has been dispatched by the command object,
// Update the position of the avatar belonging to the participant that sent the message
VoxeetSDK.command.on('received', (participant, message) => {
    let dataParsed = JSON.parse(message);
    console.log(message, dataParsed)

    // if (
    //   dataParsed &&
    //   dataParsed.verticalPosition &&
    //   dataParsed.horizontalPosition
    // ) {
    //   moveAvatarPosition(
    //     participant.id,
    //     dataParsed.verticalPosition,
    //     dataParsed.horizontalPosition
    //   );
    // }
});


const muteAll = () => {
    // Build your list of participants you want to mute

    const participants = [];
    // const participants = [
    //     "externalId01",
    //     "externalId02",
    //     "externalId03"
    // ]
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


}


// Subscribe to the received event
VoxeetSDK.command.on("received", (participant, message) => {
    console.info("Message/Command received from", participant);
    const json = JSON.parse(message);
    console.log(json);
    if (json.command === "Mute") {
        if (Voxeet.conference.isMuted || Voxeet.session.participant.type !== "user") {
            // The local participant is already muted or is a listener
            return;
        }
        if (!json.content || json.content.participants // If the participants property is missing
            || json.content.participants.length <= 0 // or the list is empty (we would consider we want everybody to be muted)
            || json.content.participants.indexOf(Voxeet.session.participant.id) >= 0) { // the participant needs to be muted
            // Mute the local participant
            Voxeet.conference.mute(Voxeet.session.participant, true);
        }
    } else if (json.command === "Unmute") {
        if (!Voxeet.conference.isMuted || Voxeet.session.participant.type !== "user") {
            // The local participant is already unmuted or is a listener
            return;
        }
        if (!json.content || json.content.participants // If the participants property is missing
            || json.content.participants.length <= 0 // or the list is empty (we would consider we want everybody to be unmuted)
            || json.content.participants.indexOf(Voxeet.session.participant.id) >= 0) { // the participant needs to be unmuted
            // Unmute the local participant
            Voxeet.conference.mute(Voxeet.session.participant, false);
        }
    }
});