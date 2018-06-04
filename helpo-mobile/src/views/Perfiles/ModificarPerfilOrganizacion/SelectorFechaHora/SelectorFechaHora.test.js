import React from "react";
import SelectorFechaHora from "./SelectorFechaHora";
import renderer from "react-test-renderer";

describe("SelectorFechaHora", () => {
  let props;

  beforeEach(() => {
    props = {
      detalle: "",
      soloFecha: false,
      value: undefined,
      handleChange: undefined
    };
  });

  it("renders correctly", () => {
    const tree = renderer.create(<SelectorFechaHora {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

});



