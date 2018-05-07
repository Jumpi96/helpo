import React from 'react';
import RegistrarEvento from './RegistrarEvento';


describe("RegistrarEvento", () => {
  let props;
  let wrapperRegistrarEvento;
  const registrarEvento = () => {
    if (!wrapperRegistrarEvento) {
      wrapperRegistrarEvento = shallow(
        <RegistrarEvento />
      );
    }
    return wrapperRegistrarEvento;
  }

  beforeEach(() => {
    props = {};
    wrapperRegistrarEvento = undefined;
  });
  
  it('renders without crashing', () => {
    expect(registrarEvento()).toMatchSnapshot();
  });
});





