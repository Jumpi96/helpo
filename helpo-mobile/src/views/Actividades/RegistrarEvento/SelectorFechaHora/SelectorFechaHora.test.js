import React from "react";
import { shallow } from "enzyme";
import SelectorFechaHora from "./SelectorFechaHora";


describe("SelectorFechaHora", () => {
  let props;
  let wrapperSelectorFechaHora;
  const selectorFechaHora = () => {
    if (!wrapperSelectorFechaHora) {
      wrapperSelectorFechaHora = shallow(
        <SelectorFechaHora {...props} />
      );
    }
    return wrapperSelectorFechaHora;
  }

  beforeEach(() => {
    props = {
      detalle: "",
      soloFecha: false,
      value: undefined,
      handleChange: undefined
    };
    wrapperSelectorFechaHora = undefined;
  });

  it("renders without crashing", () => {
    expect(selectorFechaHora()).toMatchSnapshot();
  });

  it("always renders an input", () => {
    expect(selectorFechaHora().find("FormInput").length).toBe(1);
  });

});




