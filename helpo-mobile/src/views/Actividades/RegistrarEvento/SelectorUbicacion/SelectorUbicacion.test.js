import React from "react";
import SelectorUbicacion from "./SelectorUbicacion";

import renderer from "react-test-renderer";

describe("SelectorUbicacion", () => {
  let props;

  beforeEach(() => {
    props = {
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ""},
      onUbicacionChange: undefined
    };
  });

  it("renders correctly", () => {
    const tree = renderer.create(<SelectorUbicacion {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

});
