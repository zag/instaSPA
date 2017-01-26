require("./style.css");
import React from 'react';
import {render} from 'react-dom';
import store from './ItemsStore.jsx'
import PersonItem from './ItemComponent.jsx';

const customStyles = {
  overlay : {
    position          : 'fixed', 
    backgroundColor   : 'rgba(255, 255, 255, 0.75)',
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

class App extends React.Component {
  constructor() { 
    super();
    this.state = {
        'wait': store.getAll(),
         newIsOpen : false
    };


    this._onChange = this._onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAddRecord = this.onAddRecord.bind(this);
  } 

  componentDidMount() {
    
    var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)scrollY\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (cookieValue) {
      window.scroll(0,cookieValue)
    }
    window.onscroll = function(){
       document.cookie="scrollY="+window.scrollY+";";
    }
    store.addChangeListener(this._onChange);
    window.addEventListener('storage', function(e){ store.onStorageChange(e)} );
}

  componentWillUnmount() {
    store.removeChangeListener(this._onChange);
    window.removeEventListener('storage', function(e){ store.onStorageChange(e)}, false);
  }
  
  _onChange() { 
    console.log({"_onChange" : store.getAll()})
    this.setState({      
        'wait': store.getAll()
        }); 
  }

  onAddRecord(count) {  
        let attr = {}
        attr.name = '...'
        attr.age = ''
        attr.phone = ''
        attr.email = ''
        attr.gmt=0
        store.createcount(attr, count)
    }
    

  render () {
    let items = this.state.wait; 
    let PersonItems = [];
    items.forEach(function (item, index, array) {
              PersonItems.push( <PersonItem 
                                attr  = {item}
                                index = {index}
                                key = {index}
                                />
                            );
    }) 
    return <div className="panels">
    <h2>Persons list</h2>
    <table className="table table-striped table-hover"> 
      <thead>
       <tr>
        <th>Имя Фамилия<br/> client time</th>
        <th>Примечание</th> 
        <th>Телефон</th>
        <th className="col-md-2" >Дата</th>
        <th className="col-sm-2" >Время</th>
        <th className="col-sm-1" >GMT offset</th>
        <th className="col-sm-1" >isActive</th>
        <th></th>
        </tr>
      </thead>
      <tbody> 
      {PersonItems}
      </tbody> 
    </table>
           <div className="clear"></div>
    <form> 
    <button onClick ={()=>{this.onAddRecord(1)}} type="button" className="btn btn-default" aria-label="Left Align">
  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Record
</button>
    <button onClick ={()=>{this.onAddRecord(100)}} type="button" className="btn btn-default" aria-label="Left Align">
  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add 100 Records
</button>
    </form> 
    </div>; 
  }
}

render(<App/>, document.getElementById('app'));


