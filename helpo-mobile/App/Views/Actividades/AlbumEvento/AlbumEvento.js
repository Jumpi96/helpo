import React from 'react'
import Album from './Album'

const images = [
  {
    url: 'https://i.imgur.com/PhKRLNx.png',
    id: 1,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/pNjuenD.jpg',
    id: 2,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/4bbjY6m.jpg',
    id: 3,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/CXKFlVb.jpg',
    id: 4,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/CPERPkh.jpg',
    id: 5,
    evento: 25
  },
]

class AlbumEvento extends React.Component {

  render() {
    return (
      <Album imagenes={images}/>
    )
  }
}
export default AlbumEvento