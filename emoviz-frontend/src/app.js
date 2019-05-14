// vars
var BE = 'http://127.0.0.1:3002'
var peaksInstance
var context
var sessions = []
var session = {}
var segments = []
// var segments = [
//   {emo: "calm", starttime: 0, endtime: 4, text: "we the people of the United States in order to form a more perfect union"  },
//   {emo: "happy", starttime: 4, endtime: 8.4, text: "establish justice insure domestic tranquility provide"  },
//   {emo: "sad", starttime: 8.4, endtime: 12.3, text: "for the common defense promote the general welfare and secure the blessings of liberty"  },
//   {emo: "calm", starttime: 12.3, endtime: 16.2, text: "to ourselves and our posterity do ordain and establish this constitution"  },
//   {emo: "sad", starttime: 16.2, endtime: 17.5, text: "for the United States of America"  },
//   {emo: "angry", starttime: 17.5, endtime: 19.5, text: "text text"  }
// ]
var emocolor = {
    calm: "#68edcb",//#FFD3B5
    happy: "#ffd53f", //#F7DF88
    sad: "#12b0ce", //#8DD0DD
    disgust: "#58db30", //#bcdbaf"
    angry:"#f94848", //#F67280
    fearful: "#a576cc", //#a190af
    surprised: "#f73bf3", // #edbbec
    neutral:"#6183a0"
}

// app starting point
$(document).ready(function(){
    $(window).on('hashchange', handleUrl)
    $('#new-session-button').on('click', handleNewSession)
    handleUrl()
})

function handleUrl() {

    if (hasHash()) {
        buildSession(getHash())
    } else {
        buildHome()
    }
}

async function buildHome() {
    hideAllViews()
    $('#loading-view').show()

    await fetchSessions()

    $('#home-list').empty()


    for (var i = 0; i < sessions.data.length; i++) {
        let date = new Date(sessions.data[i].date)
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        let fullDate =`${month}/${day}/${year}  - ${hours}:${minutes}:${seconds}`

        // build center
        let li = $('<li>')
        let a = $('<a>')
        let panel = $('<div>')
        let panelBody = $('<div>')
        panelBody.addClass('panel-body')
        panelBody.append(fullDate)
        panel.addClass('panel panel-default')
        panel.append(panelBody)
        a.attr('href', `/#${sessions.data[i]._id}`)
        a.append(panel)
        li.append(a)
        $('#home-list').append(li)

        // build side
        let sli = $('<li>')
        let sa = $('<a>')
        sa.attr('href', `/#${sessions.data[i]._id}`)
        sa.append(fullDate)
        sli.append(sa)
        $('#side-list').append(sli)
    }

    buildSideList()
    hideAllViews()
    $('#home-view').show()
    $('#side-list-a').click()
}

function buildSideList() {
    try {
        peaksInstance.destroy()
        location.reload();
    } catch (e) {

    }

    $('#side-list').empty()
    for (var i = 0; i < sessions.data.length; i++) {
        let date = new Date(sessions.data[i].date)
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        let fullDate =`${month}/${day}/${year}  - ${hours}:${minutes}:${seconds}`

        // build side
        let sli = $('<li>')
        let sa = $('<a>')
        sa.attr('href', `/#${sessions.data[i]._id}`)
        sa.append(fullDate)
        sli.append(sa)
        $('#side-list').append(sli)
    }


}

async function buildSession(h) {
    hideAllViews()
    $('#loading-view').show()

    await fetchSessions()
    await fetchSession(h)

    buildSideList()
    hideAllViews()
    $('#session-view').show()
    $('#side-list-a').click()

    let date = new Date(session.data.date)
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let fullDate =`${month}/${day}/${year}  - ${hours}:${minutes}:${seconds}`
    $('#session-title').text(fullDate)

    var segmentsNumber  = []
    var segmentsEmo     = []
    var segmentsColor   = []
    var emoCount        = {}
    var paragraph       = ""
    var emoCountUsed    = []
    var emoLabelUsed    = []
    var emocolorUsed    = []

    let audioLink = `https://www.googleapis.com/download/storage/v1/b/testerbucket8/o/${session.data.audioFile}?alt=media`
    console.log('audioLink: ' + audioLink);

    var audioElement = document.getElementById('audio');
    audioElement.setAttribute('src', audioLink);
    audioElement.load();

    for (var i = 0; i < segments.length; i++) {
        if (segments[i].text !== '') {
            paragraph += `<span class="emo ${segments[i].emo}">${segments[i].text}</span> `;
        }

        segmentsNumber.push((i*4).toString())
        segmentsEmo.push(segments[i].emo)
        segmentsColor.push(emocolor[segments[i].emo])

        if (segments[i].emo in emoCount) {
            emoCount[segments[i].emo] += 1
        } else {
            emoCount[segments[i].emo] = 1
        }
    }

    for (var key of Object.keys(emoCount)) {
        emoCountUsed.push(emoCount[key])
        emoLabelUsed.push(key)
        emocolorUsed.push(emocolor[key])
    }

    if (session.data.isProcessed) {
        $('.glyphicon-hourglass').hide()

        // Transcription
        $('#transtext-filter').empty()
        let filterButton = $('<button>')
        filterButton.addClass('btn btn-default')
        filterButton.attr('style', 'background: #9293942b;')
        filterButton.text('show all')
        filterButton.on('click', handleFilterClick)
        $('#transtext-filter').append(filterButton)
        filterButton = $('<button>')
        filterButton.addClass('btn btn-default')
        filterButton.text('hide all')
        filterButton.on('click', handleFilterClick)
        $('#transtext-filter').append(filterButton)

        for (var i = 0; i < emoLabelUsed.length; i++) {
            filterButton = $('<button>')
            filterButton.addClass('btn btn-default')
            filterButton.text(emoLabelUsed[i])
            filterButton.on('click', handleFilterClick)
            $('#transtext-filter').append(filterButton)
        }

        $("#transtext")[0].innerHTML= paragraph;
        var wfsegs = []

        for (var i = 0; i < segments.length; i++) {
            var seg = {
                startTime: segments[i].starttime,
                endTime: segments[i].endtime,
                editable: false,
                color: emocolor[segments[i].emo],
                labelText: segments[i].text
            }

            wfsegs.push(seg)
        }


        // Audio
        $('#waveform-container').empty()
        context = new AudioContext();

        var options = {
            container: document.getElementById('waveform-container'),
            mediaElement: document.getElementById('audio'),
            audioContext: context,
            keyboard: true,
            pointMarkerColor: '#006eb0',
            showPlayheadTime: true,
            waveformBuilderOptions: {
                scale: 128
            },
            zoomLevels: [128, 256, 512, 1024, 2048],
            segments: wfsegs
        };

        peaksInstance = peaks.init(options);

        peaksInstance.on('peaks.ready', function() {
            console.log('peaks.ready');
        });

        // Viz
        var ctx = document.getElementById('viz').getContext('2d');
        var ctx2 = document.getElementById('viz2').getContext('2d');

        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                xLabels: segmentsNumber, //['1', '2', '3'], // segmentsNumbers
                yLabels: emoLabelUsed, //['', 'neurtal', 'calm', 'happy', 'sad', 'angry', 'fearful', 'disgust', 'surprised',''],
                datasets: [{
                    label: 'Dataset',
                    data: segmentsEmo, //['sad', 'sad', 'calm', 'happy', 'happy', 'disgust'], // segmentsEmo
                    fill: false,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBorderColor: "#fff",
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderDash: [2,5],
                    backgroundColor: segmentsColor, //["#F7DF88", "#F7DF88", "#8DD0DD"] // segmentsColor
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Emotions over time'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time in Seconds'
                        }
                    }],
                    yAxes: [{
                        type: 'category',
                        position: 'left',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Emotions'
                        },
                        ticks: {
                            reverse: false
                        }
                    }]
                }
            }
        });

        var myDoughnutChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: emoCountUsed, // emoContUsed
                    backgroundColor: emocolorUsed,//[emocolor.calm, emocolor.happy, emocolor.sad], // emocolorUsed
                    label: 'Dataset'
                }],
                labels: emoLabelUsed, //[ 'calm', 'happy', 'sad'] // emoLabelUsed
            },
            options: {
                responsive: true,
                cutoutPercentage: 70,
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Emotions Grouped'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    } else {
        // Audio
        $('#waveform-container').empty()
        context = new AudioContext();

        var options = {
            container: document.getElementById('waveform-container'),
            mediaElement: document.getElementById('audio'),
            audioContext: context,
            keyboard: true,
            pointMarkerColor: '#006eb0',
            showPlayheadTime: true,
            waveformBuilderOptions: {
                scale: 128
            },
            zoomLevels: [128, 256, 512, 1024, 2048],
        };

        peaksInstance = peaks.init(options);

        peaksInstance.on('peaks.ready', function() {
            console.log('peaks.ready');
        });

    }
}

function handleFilterClick(e) {
    let fe = $(e.target).text()
    $('#transtext-filter .btn').attr('style', '')
    $(e.target).attr('style', 'background: #9293942b;')

    console.log(fe)

    if (fe === 'show all') {
        $('.emo').attr('style', '')
    } else if (fe === 'hide all') {
        $('.emo').attr('style', 'background: none;')
    } else {
        $('.emo').attr('style', 'background: none;')
        $('.' + fe).attr('style', '')
    }
}

async function handleNewSession() {
    console.log('save new session');
    $('#new-session-button').button('loading')

    let c = await getFileUploaded()
    let d = {}

    d.audioFile = await genId() + '.wav'
    let response
    // save to google cloud storage
    try {
        response = await axios.post(`https://www.googleapis.com/upload/storage/v1/b/testerbucket8/o?uploadType=media&name=${d.audioFile}&key=AIzaSyBMVS6RFdwYTmWa2kjPRotTl2Slgd3wnKY`,
                                            c, { headers: { 'Content-Type': 'audio/wave', } })
        console.log(response);

        response = await axios.post(BE + '/sessions', d, { headers: { 'Content-Type': 'application/json', } })
        console.log(response);
    } catch (error) {
        console.error(error);
    }

    $('#new-session-button').button('reset')
    $('#myModal').modal('hide');
    window.location = `http://127.0.0.1:3000/#${response.data._id}`
}

// api
async function fetchSessions() {

    sessions = []

    try {
        const response = await axios.get(BE + '/sessions');
        console.log(response);
        sessions = response
        console.log(sessions);
    } catch (error) {
        console.error(error);
    }
}

async function fetchSession(id) {
    console.log('getting session');
    console.log(id);
    try {
        let url = BE + '/sessions/' + id.substring(1)
        const response = await axios.get(url);
        console.log(response);
        session = response
        segments = session.data.segments
    } catch (error) {
        console.error(error);
    }

}


// util
function hideAllViews() {
    $('#loading-view').hide()
    $('#home-view').hide()
    $('#session-view').hide()
}

function getHash() {
    let hash = window.location.hash
    console.log('hash: ' + hash);

    return hash
}

function hasHash(key) {
    return getHash() ? true : false
}

async function getFileUploaded() {
    const input = document.getElementById('myFile')
    console.log(input);
    if ('files' in input && input.files.length > 0) {
        // we shoud check here type of file support it ex. .csv and .json
        let type = input.files[0].type
        let content = await readFileContent(input.files[0])

        console.log('type: ' + type);
        console.log('content:');
        console.log(content);
        return content

    }
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsArrayBuffer(file)
    })
}

async function genId() {
    let id = buildId()
    return id
}

function buildId() {
    return Math.random().toString(36).substr(2, 12);
}
