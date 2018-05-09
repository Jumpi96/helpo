import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import moment from 'moment';
import SelectorFechaHora from './SelectorFechaHora';


describe("SelectorFechaHora", () => {
  let props;
  let mountedSelectorFechaHora;
  const selectorFechaHora = () => {
    if (!mountedSelectorFechaHora) {
      mountedSelectorFechaHora = shallow(
        <SelectorFechaHora {...props} />
      );
    }
    return mountedSelectorFechaHora;
  }

  beforeEach(() => {
    props = {
      detalle: "Algo",
      value: undefined,
      onFechaHoraChange: undefined
    };
    mountedSelectorFechaHora = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = selectorFechaHora().find("div");
    expect(divs.length).toBeGreaterThan(0); 
  });

  it('renders everything inside a div', () => {
    const divs = selectorFechaHora().find("div");
    const wrappingDiv = divs.first();
    expect(wrappingDiv.children()).toEqual(selectorFechaHora().children());
  });

  it("always renders an DayPickerInput", () => {
    expect(selectorFechaHora().find("DayPickerInput").length).toBe(1);
  });
/*
  it("always renders an input", () => {
    expect(selectorUbicacion().find("input").length).toBe(1);
  });

  describe("when `fecha` is defined with 'value'", () => {
    beforeEach(() => {
      props = {
        detalle: "Algo",
        value: Date.now(),
        onFechaHoraChange: undefined
      };
    });
  
    it("sets the 'fecha' value", () => {
      const input = selectorFechaHora().find("DayPickerInput");
      const pasado = moment(input.props().value).format('DD/MM/YYYY');
      expect(pasado).toBe(props.value);
    });
    
    it("sets the 'fecha' value", () => {
        const input = selectorUbicacion().find("input");
        expect(input.props().value).toBe(props.ubicacion.value);
      });
      
  });
  */
});
