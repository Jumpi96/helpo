import React from 'react';
import SelectorUbicacion from './SelectorUbicacion';


describe("SelectorUbicacion", () => {
  let props;
  let wrapperSelectorUbicacion;
  const selectorUbicacion = () => {
    if (!wrapperSelectorUbicacion) {
      wrapperSelectorUbicacion = shallow(
        <SelectorUbicacion {...props} />
      );
    }
    return wrapperSelectorUbicacion;
  }

  beforeEach(() => {
    props = {
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''},
      onUbicacionChange: undefined
    };
    wrapperSelectorUbicacion = undefined;
  });
  
  it('renders without crashing', () => {
    expect(selectorUbicacion()).toMatchSnapshot();
  });

  it("always renders an input", () => {
    expect(selectorUbicacion().find("FormInput").length).toBe(1);
  });

  it("always renders a button", () => {
    expect(selectorUbicacion().find("Button").length).toBe(1);
  });

  describe("when `ubicacion` is defined with 'notas'", () => {
    beforeEach(() => {
      props.ubicacion = { latitud: -31.4201, longitud: -64.1888, notas: 'testing'};
    });
  
    it("sets the 'notas' value", () => {
      const input = selectorUbicacion().find("FormInput");
      expect(input.props().value).toBe(props.ubicacion.notas);
    });
  });

  describe("when `ubicacion` is not defined with 'notas'", () => {
    it("sets the 'notas' value undefined", () => {
      const input = selectorUbicacion().find("FormInput");
      expect(input.props().value).toBe("");
    });
  });

});




