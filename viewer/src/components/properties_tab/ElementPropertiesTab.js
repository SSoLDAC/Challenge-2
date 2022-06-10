import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import ElementPropertyRow from './ElementPropertyRow';
import SessionToggle from './SessionToggle';

const ElementPropertiesTab = (props) => {

  const [rows, setRows] = useState([]);

  useEffect(() => {
      createPropertiesDict()
  }, [props.selectedElement, props.isOpen]);


  const createPropertiesDict = async () => {
    var temporaryListOfElements = []
    if (props.selectedElement){
      var properties = await props.viewer.IFC.loader.ifcManager.getPropertySets(0, props.selectedElement, true)
                                                               .then(e => {return e});
      console.log(properties);
      console.log(props.viewer.IFC.loader.ifcManager);
      var key = 0;
      properties.map(e => {
        key++;
        for (let i = 0; i < e.HasProperties.length; i++) {
          temporaryListOfElements.push(
            <ElementPropertyRow key={`${key}.${i}`}
                                name={e.HasProperties[i].Name.value} 
                                value={e.HasProperties[i].NominalValue.value}
                                isOpen={props.isOpen}/>                   
            )
        }
      });
    }
    setRows(temporaryListOfElements)
  };

  return (
    <div className = "property-tab" id='property-tab-left'>
      <div className='tab-title'>
        Properties
        <SessionToggle/>
      </div>
      <div className='parameters-wrapper'>
        {rows}
      </div>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {viewer: state.viewer.viewer,
          selectedElement: state.selectedElement.elementId,
          isOpen: state.session.isOpen
          }
}

export default connect(mapStateToProps, {})(ElementPropertiesTab);
