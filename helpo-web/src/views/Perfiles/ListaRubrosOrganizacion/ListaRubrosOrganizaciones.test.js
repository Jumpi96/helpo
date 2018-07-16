import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from "enzyme";
import ListaRubrosOrganizaciones from './ListaRubrosOrganizaciones';


describe("ListaRubrosOrganizaciones", () => {
  let props;
  let mountedListaRubrosOrganizaciones;
  const listaRubrosOrganizaciones = () => {
    if (!mountedListaRubrosOrganizaciones) {
      mountedListaRubrosOrganizaciones = mount(
        <ListaRubrosOrganizaciones {...props} />
      );
    }
    return mountedListaRubrosOrganizaciones;
  }

  beforeEach(() => {
    props = {
      rubro_id: 1,
      onRubroChange: undefined
    };
    mountedListaRubrosOrganizaciones = undefined;
  });
  
  it('renders without crashing', () => {
    const divs = listaRubrosOrganizaciones().find("select");
    expect(divs.length).toBeGreaterThan(0); 
  });

  it("always renders a select", () => {
    expect(listaRubrosOrganizaciones().find("select").length).toBe(1);
  });

  it("when 'rubro' is defined sets the value", () => {
    const select = listaRubrosOrganizaciones().find("select");
    expect(select.props().value).toBe(props.rubro_id);
  });
});




