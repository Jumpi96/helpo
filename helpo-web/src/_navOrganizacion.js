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
        name: 'Actividades sociales',
        url: '/actividades/consultar-eventos',
        icon: 'icon-cursor'
      },
      {
        name: 'Nueva actividad',
        url: '/actividades/registrar-evento',
        icon: 'icon-pencil',
      },
      {
        name: 'Mis actividades',
        url: '/actividades/evento',
        icon: 'icon-star'
      },
      {
        name: 'Organizaciones',
        url: '/organizaciones',
        icon: 'icon-calendar'
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
        name: 'Mi perfil',
        url: '/perfil/',
        icon: 'icon-pencil',
      },
    ],
  };
  