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
        name: 'Nuevo evento',
        url: '/actividades/registrar-evento',
        icon: 'icon-pencil',
      },
      {
        name: 'Mis eventos',
        url: '/actividades/evento',
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
        name: 'Modificar perfil',
        url: '/perfiles/perfil-organizacion',
        icon: 'icon-pencil',
      },
      {
        name: 'Consultar perfil',
        url: '/perfil',
        icon: 'icon-pencil',
      },
    ],
  };
  