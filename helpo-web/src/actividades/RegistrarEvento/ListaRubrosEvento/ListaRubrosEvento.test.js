import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from "enzyme";
import ListaRubrosEvento from './ListaRubrosEvento';


describe("ListaRubrosEvento", () => {
  let props;
  let mountedListaRubrosEvento;
  const listaRubrosEvento = () => {
    if (!mountedListaRubrosEvento) {
      mountedListaRubrosEvento = mount(
        <ListaRubrosEvento {...props} />
      );
    }
    return mountedListaRubrosEvento;
  }

  beforeEach(() => {
    props = {
      rubro: { id: 1, nombre: "Salud" },
      onRubroChange: undefined
    };
    mountedListaRubrosEvento = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = listaRubrosEvento().find("select");
    expect(divs.length).toBeGreaterThan(0); 
  });

  it("always renders a select", () => {
    expect(listaRubrosEvento().find("select").length).toBe(1);
  });

  it("when 'rubro' is defined sets the value", () => {
    const select = listaRubrosEvento().find("select");
    expect(select.props().value).toBe(props.rubro.id);
  });
});




