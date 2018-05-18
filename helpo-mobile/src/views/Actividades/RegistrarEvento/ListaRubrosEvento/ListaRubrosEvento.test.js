import React from "react";
import ListaRubrosEvento from "./ListaRubrosEvento";
import renderer from "react-test-renderer";

describe("ListaRubrosEvento", () => {
  let props;

  beforeEach(() => {
    props = {
      rubro_id: 1,
      onRubroChange: undefined
    };
  });

  it("renders correctly", () => {
    const tree = renderer.create(<ListaRubrosEvento {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

});
