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
      detalle: undefined,
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

  it("always renders an SelectorFecha", () => {
    expect(selectorFechaHora().find("SelectorFecha").length).toBe(1);
  });
});
