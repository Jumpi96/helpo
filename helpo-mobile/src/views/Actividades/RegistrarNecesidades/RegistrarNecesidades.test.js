import React from "react";
import renderer from "react-test-renderer";
import RegistrarNecesidades from "./RegistrarNecesidades";

test("renders correctly", () => {
  const navigation = { getParam: function(a, b){ return 2; }};
  const tree = renderer.create(<RegistrarNecesidades navigation={navigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});
