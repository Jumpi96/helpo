import React from "react";
import { shallow } from "enzyme";
import RegistrarEvento from "./RegistrarEvento";


describe("RegistrarEvento", () => {
  let wrapperRegistrarEvento;
  const registrarEvento = () => {
    if (!wrapperRegistrarEvento) {
      wrapperRegistrarEvento = shallow(
        <RegistrarEvento />
      );
    }
    return wrapperRegistrarEvento;
  };

  beforeEach(() => {
    wrapperRegistrarEvento = undefined;
  });

  it("renders without crashing", () => {
    expect(registrarEvento()).toMatchSnapshot();
  });
});





