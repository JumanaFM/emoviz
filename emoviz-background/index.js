const data = require("./data");
const sessionData = data.sessions;

const spawn = require('await-spawn')

const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket('testerbucket8')

let isWorking = false

async function main() {
    let allSessions = await sessionData.getAllSessions()

    console.log('\n\n\n ------ Transcriping ------');
    for (var i = 0; i < allSessions.length; i++) {
        let id = allSessions[i]._id

        if (!allSessions[i].isTranscribe) {
            console.log(`${id}: needs transcribing, using audioFile: ${allSessions[i].audioFile}`);

            let audio = {
              uri: `gs://testerbucket8/${allSessions[i].audioFile}`,
            };

            // let config = {
            //   enableWordTimeOffsets: true,
            //   audioChannelCount: 1,
            //   encoding: 'LINEAR16',
            //   enableSpeakerDiarization: true,
            //   languageCode: 'en-US',
            // };

            let config = {
                enableWordTimeOffsets: true,
                enableAutomaticPunctuation: false,
                encoding: "LINEAR16",
                languageCode: "en-US",
                audioChannelCount: 1,
                //useEnhanced: true,
                model: 'video',
            };

            let request = {
              audio: audio,
              config: config,
            };

            let r

            try {
                 r = await googleasr(request)
            } catch (e) {
                // console.log(e);
                console.log('switching to audioChannelCount = 2');
                request.config.audioChannelCount = 2
                r = await googleasr(request)
            }
            console.log("\n\n\n\n");
            console.log(r);

            let updatedData = {}
            updatedData.words = r
            updatedData.isTranscribe = true

            try {
                await sessionData.patchSession(id, updatedData)
            } catch (e) {
                console.log(e);
            }

        }


        // break
    }

    console.log('\n\n\n ------ Processing ------');
    for (var i = 0; i < allSessions.length; i++) {
        let id = allSessions[i]._id
        let seesion = await sessionData.getSessionById(id)

        if (!allSessions[i].isProcessed && allSessions[i].isTranscribe) {
            let updatedData = {}
            updatedData.segments = []
            console.log(`${id}: needs processing`);
            let file = bucket.file(allSessions[i].audioFile)
            try {
                await file.download({destination: `./files/${allSessions[i].audioFile}`});
                const bl = await spawn('python3', [ 'nnm/emoviz.py', allSessions[i].audioFile ])
                console.log(bl.toString())
                let emoResults = JSON.parse(bl.toString())
                console.log(emoResults.length);

                let currentTime = 0
                let endTime = currentTime + 4
                let lastUsedWordIndex = 0

                for (var j = 0; j < emoResults.length; j++) {
                    let seg = {}
                    seg.emo = emoResults[j]
                    seg.starttime = Number(currentTime)
                    seg.endtime = Number(endTime)
                    let textArr = []

                    console.log(`Emo: ${emoResults[j]}, Start: ${currentTime}, End: ${endTime}`);
                    for (lastUsedWordIndex; lastUsedWordIndex < seesion.words.length; lastUsedWordIndex++) {
                        if (seesion.words[lastUsedWordIndex].starttime <= currentTime ||
                            seesion.words[lastUsedWordIndex].endtime <= endTime) {
                            textArr.push(seesion.words[lastUsedWordIndex].text)
                        } else {
                            // if (lastUsedWordIndex > 0) {
                            //     lastUsedWordIndex --
                            // }
                            break
                        }
                    }

                    seg.text = textArr.join(' ')
                    updatedData.segments.push(seg)
                    currentTime = endTime
                    endTime = currentTime + 4
                }
            } catch (e) {
                console.log(e);
            }

            console.log(updatedData.segments);
            updatedData.isProcessed = true

            try {
                await sessionData.patchSession(id, updatedData)
            } catch (e) {
                console.log(e);
            }

        }

    }

    // process.exit()
    isWorking = false
}

async function googleasr (request){
  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
//   const transcription = response.results
//     .map(result => result.alternatives[0].transcript)
//     .join('\n');
//   console.log(response.results[0]);
//   console.log(response.results[0].alternatives[0]);
//   console.log(`Transcription: ${transcription}`);

    let r = []

  response.results.forEach(result => {
    console.log(`Transcription: ${result.alternatives[0].transcript}`);
    // let s = {}
    // s.text =
    result.alternatives[0].words.forEach(wordInfo => {
      // NOTE: If you have a time offset exceeding 2^32 seconds, use the
      // wordInfo.{x}Time.seconds.high to calculate seconds.

      const startSecs = `${wordInfo.startTime.seconds}` + `.` + wordInfo.startTime.nanos / 100000000;
      const endSecs = `${wordInfo.endTime.seconds}` + `.` + wordInfo.endTime.nanos / 100000000;
      console.log(`Word: ${wordInfo.word}`);
      console.log(`\t ${startSecs} secs - ${endSecs} secs`);
      let w = {}
      w.text = wordInfo.word
      w.starttime = startSecs
      w.endtime = endSecs
      r.push(w)
    });
  });

  return r

}

setInterval(function() {
    console.log(`Startign background at ${new Date()}`);
    if (!isWorking) {
        isWorking = true
        main()
    } else {
        console.log('Still working');
    }
}, 10000)

// main()


// export GOOGLE_APPLICATION_CREDENTIALS="/Users/jumana/code/emoviz-background/emoviz-b76e971862d4.json"
