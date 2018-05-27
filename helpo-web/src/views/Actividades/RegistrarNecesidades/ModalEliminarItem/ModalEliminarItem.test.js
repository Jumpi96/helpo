import React from 'react';
import { mount } from "enzyme";
import ModalEliminarItem from './ModalEliminarItem';


describe("ModalEliminarItem", () => {
  let props;
  let mountedModalEliminarItem;
  const modalEliminarItem = () => {
    if (!mountedModalEliminarItem) {
      mountedModalEliminarItem = mount(
        <ModalEliminarItem {...props} />
      );
    }
    return mountedModalEliminarItem;
  }

  beforeEach(() => {
    props = {
      recurso: 1,
      open: true,
      closeModal: undefined
    };
    mountedModalEliminarItem = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = modalEliminarItem().find("select");
    expect(divs.length).toBeGreaterThan(0); 
  });
});
