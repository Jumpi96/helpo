import React from "react";
import renderer from "react-test-renderer";
import SelectorItem from "./SelectorItem";

test("renders correctly", () => {
  const tree = renderer.create(<SelectorItem />).toJSON();
  expect(tree).toMatchSnapshot();
});
