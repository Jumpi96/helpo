import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import moment from 'moment';
import SelectorFecha from './SelectorFecha';

describe("SelectorFecha", () => {
  let props;
  let mountedSelectorFecha;
  const selectorFecha = () => {
    if (!mountedSelectorFecha) {
        mountedSelectorFecha = shallow(
        <SelectorFecha {...props} />
      );
    }
    return mountedSelectorFecha;
  }

  beforeEach(() => {
    props = {
      fecha: undefined,
      onFechaChange: undefined
    };
    mountedSelectorFecha = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = selectorFecha().find("div");
    expect(divs.length).toBeGreaterThan(0); 
  });

  it('renders everything inside a div', () => {
    const divs = selectorFecha().find("div");
    const wrappingDiv = divs.first();
    expect(wrappingDiv.children()).toEqual(selectorFecha().children());
  });

  it("always renders an DayPickerInput", () => {
    expect(selectorFecha().find("DayPickerInput").length).toBe(1);
  });
  
});
