import React from 'react';
import store from './ItemsStore.jsx'
var assign = require('object-assign');

const customStyles = {
  overlay : {
    position          : 'fixed', 
    backgroundColor   : 'rgba(55, 55, 55, 0.6)',
    'overflow-y'      : 'hidden'
  },
  content : {
    top                   : '50%',
    left                  : '50%', 
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    'overflow-y'      : 'hidden'
  }
};

class ItemComponent extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          EditIsOpen : false
        };
        this.onSetDelete = this.onSetDelete.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {  
      if ( e ) {
        e.preventDefault();
        e.stopPropagation();
      }
        let form = {};
        form.name = this.refs.name.innerText.trim()
        form.desc = this.refs.desc.innerText.trim()
        form.tel = this.refs.tel.value.trim()
        form.date = this.refs.date.value.trim()
        form.time = this.refs.time.value.trim()
        form.gmt = this.refs.gmt.value.trim()
        form.isActive = this.refs.isactive.checked
        var attr = assign({}, this.props.attr, form )
        store.updateItem( attr.id, attr);
    }
  calcTime( offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));
    return nd.getHours() + ':' + nd.getMinutes()
}

  onSetDelete() { 
            if(confirm("Delete item for: " + this.props.attr.name + "?")) 
                    { store.deleteItem(this.props.attr.id)} 
                 }
  render() {
                let attr = this.props.attr;
		return  <tr><td>
        <span ref="name" contentEditable="true" onBlur={this.onSubmit} onKeyPress={e=>{ 
          if(e.key == 'Enter'){this.onSubmit(e) }}}>{attr.name}</span>
          <span ref="desc" className="desc">{this.calcTime(attr.gmt)}</span>
          </td>
          
        <td>
        <span ref="desc" className="desc"  onBlur={this.onSubmit} contentEditable="true" onKeyPress={e=>{ 
          if(e.key == 'Enter'){this.onSubmit(e) }}}>{attr.desc}</span>
        
          </td>
          
        <td><input ref ="tel" onChange={()=>{this.onSubmit()}} className="form-control input-sm" type="tel" placeholder="Phone, +7 34443434" pattern="[\+]\d+" defaultValue={attr.phone}/></td>
        <td><input ref ="date" onChange={()=>{this.onSubmit()}} className="form-control input-sm" type="date"/></td>
        <td><input ref="time" onChange={()=>{this.onSubmit()}} className="form-control input-sm" type="time"/></td>
        <td><input ref="gmt" onChange={()=>{this.onSubmit()}} className="form-control input-sm" type="number" defaultValue="0"/></td>
        <td><input  ref="isactive" onChange={()=>{this.onSubmit()}} type="checkbox" checked={attr.isActive ? true :false}/></td>
        <td>
           <button onClick={this.onSetDelete} type="button" className="btn btn-default btn-xs" aria-label="Left Align">
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> 
</button>
        </td>
    </tr>
	}

}
export default ItemComponent;
