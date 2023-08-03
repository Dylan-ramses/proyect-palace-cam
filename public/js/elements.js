export const getIncomingCallDialog = (callTypeInfo, acceptCallHandler, rejectCallHandler) => {
  console.log('getting incoming call dialog')
  // creating the wrapper
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper');
  // creating the container
  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')
  dialog.appendChild(dialogContent)
  // parts
  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = `Incoming ${callTypeInfo} Call`
  // image
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')
  const image = document.createElement('img')
  const avatarImagePath = './utils/images/dialogAvatar.png';
  image.src = avatarImagePath
  imageContainer.appendChild(image)
  // button
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('dialog_button_container')
  // accept button
  const acceptCallButton = document.createElement('button')
  acceptCallButton.classList.add('dialog_accept_call_button')
  const acceptCallImg = document.createElement('img')
  acceptCallImg.classList.add('dialog_button_image')
  const acceptCallImgPath = './utils/images/acceptCall.png'
  acceptCallImg.src = acceptCallImgPath;
  acceptCallButton.append(acceptCallImg)
  buttonContainer.appendChild(acceptCallButton)
  // accept button
  const rejectCallButton = document.createElement('button')
  rejectCallButton.classList.add('dialog_reject_call_button')
  const rejectCallImg = document.createElement('img')
  rejectCallImg.classList.add('dialog_button_image')
  const rejectCallImgPath = './utils/images/rejectCall.png'
  rejectCallImg.src = rejectCallImgPath;
  rejectCallButton.append(rejectCallImg)
  buttonContainer.appendChild(rejectCallButton)


  // dialog content
  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(buttonContainer)

  // creating the html (not required)
  // const dialogHTML = document.getElementById('dialog')
  // dialogHTML.appendChild(dialog); // appending the child

  // accepting event click handler
  acceptCallButton.addEventListener('click', () => {
    acceptCallHandler()
  })

  // rejecting event click handler
  rejectCallButton.addEventListener('click', () => {
    rejectCallHandler()
  })

  // instead, return it
  return dialog
}

export const getCallingDialog = (rejectCallHandler) => {
  // creating the wrapper
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper');
  // creating the container
  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')
  dialog.appendChild(dialogContent)
  // parts
  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = `Calling`
  // image
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')
  const image = document.createElement('img')
  const avatarImagePath = './utils/images/dialogAvatar.png';
  image.src = avatarImagePath
  imageContainer.appendChild(image)
  // button
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('dialog_button_container')
  // hang up button
  const hangUpCallButton = document.createElement('button')
  hangUpCallButton.classList.add('dialog_reject_call_button')
  // hangUp
  const hangUpCallImg = document.createElement('img')
  hangUpCallImg.classList.add('dialog_button_image')
  const hangUpCallImgPath = './utils/images/rejectCall.png'

  hangUpCallImg.src = hangUpCallImgPath;
  hangUpCallButton.append(hangUpCallImg)
  buttonContainer.appendChild(hangUpCallButton)

  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(hangUpCallButton)

  // hang up listener
  hangUpCallButton.addEventListener('click', () => {
    rejectCallHandler()
  })

  return dialog
}

export const getInfoDialog = (dialogTitle, dialogDescription) => {
  // creating the wrapper
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper');
  // creating the container
  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')
  dialog.appendChild(dialogContent)
  // parts
  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = dialogTitle
  // image
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')
  const image = document.createElement('img')
  const avatarImagePath = './utils/images/dialogAvatar.png';
  image.src = avatarImagePath
  imageContainer.appendChild(image)
  // parts
  const description = document.createElement('p')
  description.classList.add('dialog_description')
  description.innerHTML = dialogDescription

  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(description)

  return dialog

}

export const getLeftMessage = message => {
  const messageContainer = document.createElement('div')
  messageContainer.classList.add('message_left_container')
  const messageParagraph = document.createElement('p')
  messageParagraph.classList.add('message_left_paragraph')
  messageParagraph.innerHTML = message
  messageContainer.appendChild(messageParagraph)
  return messageContainer
}

export const getRightMessage = message => {
  const messageContainer = document.createElement('div')
  messageContainer.classList.add('message_right_container')
  const messageParagraph = document.createElement('p')
  messageParagraph.classList.add('message_right_paragraph')
  messageParagraph.innerHTML = message
  messageContainer.appendChild(messageParagraph)
  return messageContainer
}
