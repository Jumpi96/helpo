import React from 'react';
import { mount } from "enzyme";
import ModalEditarItem from './ModalEditarItem';


describe("ModalEditarItem", () => {
  let props;
  let mountedModalEditarItem;
  const modalEditarItem = () => {
    if (!mountedModalEditarItem) {
      mountedModalEditarItem = mount(
        <ModalEditarItem {...props} />
      );
    }
    return mountedModalEditarItem;
  }

  beforeEach(() => {
    props = {
      necesidad: undefined,
      open: true,
      closeModal: undefined
    };
    mountedModalEditarItem = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = modalEditarItem().find("button");
    expect(divs.length).toBeGreaterThan(0); 
  });
});
