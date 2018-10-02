import api from "../api"
const axios = require('axios')



/*
  Sube una imagen codificada en base64 a Imgur,
  retorna la url de la imagen si salio todo bien;
  Si retorna 'recall' hay que llamar de vuelta al metodo (se va a refreshear el token)
  Si retorna 'error' hubo un error y no se completo la función con exito
*/
async function uploadImage(encodedimg) {
  let access_token = localStorage.getItem('imgur_access_token')
  let url = ''
  console.log("TOKEN")
  console.log(access_token)

  if ( access_token == null ) {
    refreshToken()
  }
  
  await axios({
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    data: {
      image: encodedimg
    },
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
  .then( response => {
    console.log("RESPONSE")
    console.log(response)        
    if (response.status === 200) {
      console.log("I LIVE")
      url = response.data.data.link
      console.log("URL")
      console.log(url)
    }
    else if ( response.status === 400 && response.data.error.code === 500 ) {
      localStorage.setItem('imgur_access_token', null)
      url = 'recall'
    }
    else {      
      url = 'errorUncatched'
    }
  })
  .catch( error => {
    console.log("RESPONSE CATCH")
    console.log(error)  
    if ( error.response.status === 400 && error.response.data.error.code === 500 ) {
      console.log("IM LIVE")
      localStorage.setItem('imgur_access_token', null)
      url = 'recall'
    }
    else { url = 'errorCatched'}
  })
  return url
}

function refreshToken() {
  api.get('imgurToken/')
  .then(res => {    
    localStorage.setItem('imgur_access_token', res.data.value)
  })
}

function getImagen(url) {
  return url
}


export { uploadImage, getImagen }