  export default {
  items: [
    {
      title: true,
      name: 'Bienvenidos',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Inicio',
      url: '/dashboard',
      icon: 'icon-home'
    },
    {
      title: true,
      name: 'Actividades sociales',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Eventos',
      url: '/actividades/consultar-eventos',
      icon: 'icon-cursor'
    },
    {
      name: 'Eventos',
      url: '/actividades/mis-contribuciones',
      icon: 'icon-star'
    },
    {
      title: true,
      name: 'Perfil',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Consultar perfil',
      url: '/perfil',
      icon: 'icon-pencil',
    },
  ],
};
