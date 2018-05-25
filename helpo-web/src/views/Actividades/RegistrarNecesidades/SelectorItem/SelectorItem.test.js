import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from "enzyme";
import SelectorItem from './SelectorItem';


describe("SelectorItem", () => {
  let props;
  let mountedSelectorItem;
  const selectorItem = () => {
    if (!mountedSelectorItem) {
      mountedSelectorItem = mount(
        <SelectorItem {...props} />
      );
    }
    return mountedSelectorItem;
  }

  beforeEach(() => {
    props = {
      categorias: [{ id: 0, nombre: 'Sin categorías' }],
      items: [{ id: 0, nombre: 'Sin ítems' }],
      categoria_id: 0
    };
    mountedSelectorItem = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = selectorItem().find("select");
    expect(divs.length).toBeGreaterThan(0); 
  });
});




