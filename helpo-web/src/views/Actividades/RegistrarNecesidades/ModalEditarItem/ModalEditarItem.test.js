import React from 'react';
import { mount } from "enzyme";
import ModalEditarItem from './ModalEditarItem';


describe("ModalEditarItem", () => {
  let props;
  let mountedModalEditarItem;
  const ModalEditarItem = () => {
    if (!mountedModalEditarItem) {
      mountedModalEditarItem = mount(
        <ModalEditarItem {...props} />
      );
    }
    return mountedModalEditarItem;
  }

  beforeEach(() => {
    props = {
      necesidad: 1,
      open: true,
      closeModal: undefined
    };
    mountedModalEditarItem = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = mountedModalEditarItem().find("button");
    expect(divs.length).toBeGreaterThan(0); 
  });
});
