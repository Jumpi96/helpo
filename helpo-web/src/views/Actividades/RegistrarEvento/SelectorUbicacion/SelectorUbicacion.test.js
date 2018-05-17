import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import SelectorUbicacion from './SelectorUbicacion';


describe("SelectorUbicacion", () => {
  let props;
  let mountedSelectorUbicacion;
  const selectorUbicacion = () => {
    if (!mountedSelectorUbicacion) {
      mountedSelectorUbicacion = shallow(
        <SelectorUbicacion {...props} />
      );
    }
    return mountedSelectorUbicacion;
  }

  beforeEach(() => {
    props = {
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''},
      onUbicacionChange: undefined
    };
    mountedSelectorUbicacion = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = selectorUbicacion().find("div");
    expect(divs.length).toBeGreaterThan(0); 
  });

  it('renders everything inside a div', () => {
    const divs = selectorUbicacion().find("div");
    const wrappingDiv = divs.first();
    expect(wrappingDiv.children()).toEqual(selectorUbicacion().children());
  });

  it("always renders an input", () => {
    expect(selectorUbicacion().find("input").length).toBe(1);
  });

  describe("when `ubicacion` is defined with 'notas'", () => {
    beforeEach(() => {
      props.ubicacion = { latitud: -31.4201, longitud: -64.1888, notas: 'testing'};
    });
  
    it("sets the 'notas' value", () => {
      const input = selectorUbicacion().find("input");
      expect(input.props().value).toBe(props.ubicacion.notas);
    });
  });

  describe("when `ubicacion` is not defined with 'notas'", () => {
    it("sets the 'notas' value undefined", () => {
      const input = selectorUbicacion().find("input");
      expect(input.props().value).toBe("");
    });
  });
});




