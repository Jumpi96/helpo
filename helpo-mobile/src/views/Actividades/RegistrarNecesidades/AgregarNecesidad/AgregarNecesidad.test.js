import React from "react";
import renderer from "react-test-renderer";
import AgregarNecesidad from "./AgregarNecesidad";

test("renders correctly", () => {
  const navigation = { getParam: function(a, b){ return 2; }};
  const tree = renderer.create(<AgregarNecesidad navigation={navigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});
