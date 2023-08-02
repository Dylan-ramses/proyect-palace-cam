// recording stuff
import * as store from './store.js'

let mediaRecorder

const vp9Codec = 'video/webm; codecs=vp=9'
const vp9Options = {mimeType: vp9Codec}
const recordedChunks = []

export const startRecording = () => {
  const remoteStream = store.getState().remoteStream
  if(MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options)
  } else {
    mediaRecorder = new MediaRecorder(remoteStream)
  }
  // setting up the listener
  mediaRecorder.ondataavailable = handleDataAvailable
  // starting the recorder
  mediaRecorder.start()
}

export const pauseRecording = () => {
  mediaRecorder.pause()
}

export const resumeRecording = () => {
  mediaRecorder.resume()
}

export const stopRecording = () => {
  mediaRecorder.stop()
}

const downloadRecordedVideo = () => {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm',
  })
  // link
  const url = URL.createdObjectURL(blob)
  const a = document.getElement('a')
  document.body.appendChild(a)
  // styling
  a.style = 'display:none'
  a.href = url
  a.download = 'recording.webm'
  a.click()
  // using the window
  window.URL.revokeObjectURL(url)
}

const handleDataAvailable = (event) => {
  if(event.data.size > 0) {
    recordedChunks.push(event.data)
    downloadRecordedVideo()
  }
}
