import React from "react";
import ListaRubrosEvento from "./ListaRubrosEvento";
import renderer from "react-test-renderer";

test("renders correctly", () => {
  const tree = renderer.create(<ListaRubrosEvento rubro_id={1} />).toJSON();
  expect(tree).toMatchSnapshot();
});
