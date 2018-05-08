import React from 'react';
import ListaRubrosEvento from './ListaRubrosEvento';


describe("ListaRubrosEvento", () => {
  let props;
  let wrapperListaRubrosEvento;
  const listaRubrosEvento = () => {
    if (!wrapperListaRubrosEvento) {
      wrapperListaRubrosEvento = shallow(
        <ListaRubrosEvento {...props} />
      );
    }
    return wrapperListaRubrosEvento;
  }

  beforeEach(() => {
    props = {
      rubro: { id: 1, nombre: "Salud" },
      onRubroChange: undefined
    };
    wrapperListaRubrosEvento = undefined;
  });
  
  it('renders without crashing', () => {
    expect(listaRubrosEvento()).toMatchSnapshot();
  });

  it("always renders a select", () => {
    expect(listaRubrosEvento().find("Picker").length).toBe(1);
  });

  it("when 'rubro' is defined sets the value", () => {
    const select = listaRubrosEvento().find("Picker");
    expect(select.props().selectedValue).toBe(props.rubro.id);
  });
});
