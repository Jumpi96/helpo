import api from "../api"
const axios = require('axios')

// Pide access_token a la api y lo guarda en localStorage
// Devuelve true si tuvo exito y false si fallo
async function refreshToken() {    
  try {
    const response = await api.get('imgurToken/')
    localStorage.setItem('imgur_access_token', response.data.value)
    return true
  } catch (error) {
    return false 
  }    
}

/*
  Sube una imagen codificada en base64 a Imgur,
  retorna la url de la imagen si salio todo bien;
  Si retorna 'recall' hay que llamar de vuelta al metodo (se va a refreshear el token)
  Si retorna 'error' hubo un error y no se completo la funcion con exito
*/
async function uploadImage(encodedimg) {
  let access_token = localStorage.getItem('imgur_access_token')
  let url = ''
  if ( access_token === "null" ) {
     await refreshToken()
     access_token = localStorage.getItem('imgur_access_token')
  }      

  const axiosConf = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    data: {
      image: encodedimg
    },
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }
  try {
    const response = await axios(axiosConf)
    const status = response.status
    if (status === 200) {
      url = response.data.data.link
    }
    else {
      url = 'errorUncatched'
    }
  }
  catch (error) {
    if (error.response.status === 403) {
      localStorage.setItem('imgur_access_token', "null")
      url = 'recall'
    }
    else {
      url = 'errorCatched: '+ error
    }
  }
  return url
}

async function handleImageUpload(image) {

  const rx = /data.*base64,(.*)/gm
  const encondedAvatar = rx.exec(image)[1]

  let avatar_url = "URL NO ASIGNADA"
  avatar_url = await uploadImage(encondedAvatar)
  if (avatar_url === 'recall') {
    avatar_url = await uploadImage(encondedAvatar)
  }

  return avatar_url
}

function parseBase64(image) {
  /*
  Parse Base64 image and returns its data
  */
  const rx = /data.*base64,(.*)/gm
  return rx.exec(image)[1]
}

var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}


function getImagen(url) {
  return url
}

function getImageSize(url, callback) {
  /*
  Gets the image height and width of the image (url), and then pass them
  in an callback function inside an object
  */
  let img = new Image()
  img.addEventListener("load", function(){
    let sizes = {
      height: 0,
      width: 0
    }
    sizes.width = this.naturalWidth
    sizes.height = this.naturalHeight
    callback(sizes)
  })
  img.src = url
}


export { uploadImage, getImagen, handleImageUpload, parseBase64, convertDataURIToBinary }
