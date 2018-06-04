import React from "react";
import RegistrarEvento from "./RegistrarEvento";

import renderer from "react-test-renderer";

test("renders correctly", () => {
  const tree = renderer.create(<RegistrarEvento />).toJSON();
  expect(tree).toMatchSnapshot();
});
